const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.use(auth);

// Generate a short shareable invite code like "PYN-4F7K"
function genInviteCode() {
  return 'PYN-' + uuidv4().split('-')[0].slice(0, 4).toUpperCase();
}

// GET /api/trips  -> all trips the logged-in user owns or is a member of
router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT t.*, 
       (SELECT COUNT(*) FROM trip_members m WHERE m.trip_id = t.id) AS member_count,
       (SELECT COALESCE(SUM(amount),0) FROM expenses e WHERE e.trip_id = t.id) AS spent_total
     FROM trips t
     LEFT JOIN trip_members tm ON tm.trip_id = t.id
     WHERE t.owner_id = $1 OR tm.user_id = $1
     GROUP BY t.id
     ORDER BY t.start_date ASC`,
    [req.user.id]
  );
  res.json(result.rows);
});

// POST /api/trips  -> create trip ("Save trip details" screen)
router.post('/', async (req, res) => {
  try {
    const { name, start_date, end_date, travellers_count, budget, cover_emoji } = req.body;
    const invite_code = genInviteCode();
    const result = await pool.query(
      `INSERT INTO trips (owner_id, name, start_date, end_date, travellers_count, budget, invite_code, cover_emoji)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, name, start_date, end_date, travellers_count || 1, budget || 0, invite_code, cover_emoji || '🚋']
    );
    const trip = result.rows[0];
    await pool.query(
      `INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1,$2,'owner')`,
      [trip.id, req.user.id]
    );
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create trip' });
  }
});

// PATCH /api/trips/:id -> edit dates/budget/name (dates are changeable per requirement)
router.patch('/:id', async (req, res) => {
  const { name, start_date, end_date, travellers_count, budget } = req.body;
  const result = await pool.query(
    `UPDATE trips SET
       name = COALESCE($1, name),
       start_date = COALESCE($2, start_date),
       end_date = COALESCE($3, end_date),
       travellers_count = COALESCE($4, travellers_count),
       budget = COALESCE($5, budget)
     WHERE id = $6 RETURNING *`,
    [name, start_date, end_date, travellers_count, budget, req.params.id]
  );
  res.json(result.rows[0]);
});

// GET /api/trips/:id -> full trip detail incl. summary (matches "estimated total / per person / trip length" card)
router.get('/:id', async (req, res) => {
  const tripRes = await pool.query('SELECT * FROM trips WHERE id=$1', [req.params.id]);
  if (!tripRes.rows.length) return res.status(404).json({ error: 'Trip not found' });
  const trip = tripRes.rows[0];

  const spendRes = await pool.query('SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE trip_id=$1', [trip.id]);
  const placesRes = await pool.query('SELECT * FROM trip_places WHERE trip_id=$1 ORDER BY day_number, order_index', [trip.id]);
  const membersRes = await pool.query(
    `SELECT u.id, u.name, u.avatar_url, tm.role FROM trip_members tm
     JOIN users u ON u.id = tm.user_id WHERE tm.trip_id=$1`, [trip.id]
  );

  const total = parseFloat(spendRes.rows[0].total);
  const tripLengthDays = Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1;

  res.json({
    ...trip,
    estimated_total: total,
    budget_percent_used: trip.budget > 0 ? Math.round((total / trip.budget) * 100) : 0,
    per_person: trip.travellers_count > 0 ? +(total / trip.travellers_count).toFixed(2) : total,
    trip_length_days: tripLengthDays,
    places: placesRes.rows,
    members: membersRes.rows,
  });
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM trips WHERE id=$1 AND owner_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// ---- CREW INVITES ----

// POST /api/trips/:id/join  { invite_code }  -> friend joins via share link
router.post('/:id/join', async (req, res) => {
  const { invite_code } = req.body;
  const tripRes = await pool.query('SELECT * FROM trips WHERE id=$1 AND invite_code=$2', [req.params.id, invite_code]);
  if (!tripRes.rows.length) return res.status(404).json({ error: 'Invalid invite link' });

  await pool.query(
    `INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1,$2,'member') ON CONFLICT DO NOTHING`,
    [req.params.id, req.user.id]
  );
  res.json({ success: true, trip: tripRes.rows[0] });
});

// GET /api/trips/:id/invite-link -> returns shareable deep link
router.get('/:id/invite-link', async (req, res) => {
  const result = await pool.query('SELECT invite_code FROM trips WHERE id=$1', [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'Trip not found' });
  res.json({ link: `payanam://join/${req.params.id}?code=${result.rows[0].invite_code}` });
});

// ---- PLACES (map pins) ----

router.post('/:id/places', async (req, res) => {
  const { name, lat, lng, day_number, notes, order_index } = req.body;
  const result = await pool.query(
    `INSERT INTO trip_places (trip_id, name, lat, lng, day_number, notes, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.params.id, name, lat, lng, day_number, notes, order_index || 0]
  );
  res.json(result.rows[0]);
});

router.get('/:id/places', async (req, res) => {
  const result = await pool.query('SELECT * FROM trip_places WHERE trip_id=$1 ORDER BY day_number, order_index', [req.params.id]);
  res.json(result.rows);
});

// ---- TRIP RECAP ----

router.post('/:id/recap', async (req, res) => {
  const { best_moments } = req.body;
  const spendRes = await pool.query('SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE trip_id=$1', [req.params.id]);
  const slug = uuidv4().split('-')[0];
  const result = await pool.query(
    `INSERT INTO trip_recaps (trip_id, total_spend, best_moments, share_slug)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (trip_id) DO UPDATE SET total_spend=$2, best_moments=$3
     RETURNING *`,
    [req.params.id, spendRes.rows[0].total, best_moments || [], slug]
  );
  res.json(result.rows[0]);
});

router.get('/:id/recap', async (req, res) => {
  const result = await pool.query('SELECT * FROM trip_recaps WHERE trip_id=$1', [req.params.id]);
  res.json(result.rows[0] || null);
});

module.exports = router;
