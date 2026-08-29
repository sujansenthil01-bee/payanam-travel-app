const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

router.use(auth);

// Receipt photo storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET /api/expenses/trip/:tripId  -> all expenses + splits for a trip
router.get('/trip/:tripId', async (req, res) => {
  const expenses = await pool.query(
    `SELECT e.*, u.name AS paid_by_name FROM expenses e
     JOIN users u ON u.id = e.paid_by
     WHERE e.trip_id=$1 ORDER BY e.created_at DESC`,
    [req.params.tripId]
  );
  const withSplits = await Promise.all(
    expenses.rows.map(async (exp) => {
      const splits = await pool.query(
        `SELECT s.*, u.name FROM expense_splits s JOIN users u ON u.id = s.user_id WHERE s.expense_id=$1`,
        [exp.id]
      );
      return { ...exp, splits: splits.rows };
    })
  );
  res.json(withSplits);
});

// POST /api/expenses  -> add expense, supports equal OR custom/percentage splits
// body: { trip_id, title, category, amount, paid_by, split_type, splits: [{user_id, share_amount}] }
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const body = req.body;
    const trip_id = body.trip_id;
    const amount = parseFloat(body.amount);
    const split_type = body.split_type || 'equal';
    const receipt_photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const memberCheck = await pool.query('SELECT user_id FROM trip_members WHERE trip_id=$1 AND user_id=$2', [trip_id, req.user.id]);
    if (!memberCheck.rows.length) return res.status(403).json({ error: 'You are not a member of this trip' });
    const paidBy = body.paid_by || req.user.id;
    let splits = [];
    if (split_type !== 'equal') {
      splits = JSON.parse(body.splits || '[]');
      if (split_type === 'percentage') {
        splits = splits.map((s) => ({ user_id: s.user_id, share_amount: +((s.percent / 100) * amount).toFixed(2) }));
      }
      const splitTotal = splits.reduce((sum, split) => sum + Number(split.share_amount || 0), 0);
      if (!splits.length || Math.abs(splitTotal - amount) > 0.01) {
        return res.status(400).json({ error: 'Custom split amounts must add up to the expense total' });
      }
    }
    const expRes = await pool.query(
      `INSERT INTO expenses (trip_id, paid_by, title, category, amount, split_type, receipt_photo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [trip_id, paidBy, body.title, body.category || 'general', amount, split_type, receipt_photo_url]
    );
    const expense = expRes.rows[0];

    if (split_type === 'equal') {
      const members = await pool.query('SELECT user_id FROM trip_members WHERE trip_id=$1', [trip_id]);
      const share = +(amount / members.rows.length).toFixed(2);
      splits = members.rows.map((m) => ({ user_id: m.user_id, share_amount: share }));
    } else {
      // Custom and percentage splits were parsed and verified before the expense is created.
    }

    for (const s of splits) {
      await pool.query(
        `INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES ($1,$2,$3)`,
        [expense.id, s.user_id, s.share_amount]
      );
    }

    res.json({ ...expense, splits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add expense' });
  }
});

// PATCH /api/expenses/split/:splitId/settle -> mark a person's share as paid
router.patch('/split/:splitId/settle', async (req, res) => {
  const result = await pool.query(
    `UPDATE expense_splits SET is_settled=TRUE, settled_at=now() WHERE id=$1 RETURNING *`,
    [req.params.splitId]
  );
  res.json(result.rows[0]);
});

// GET /api/expenses/trip/:tripId/balances -> who owes whom (settle-up view)
router.get('/trip/:tripId/balances', async (req, res) => {
  const result = await pool.query(
    `SELECT u.id, u.name,
       COALESCE((SELECT SUM(e.amount) FROM expenses e WHERE e.paid_by = u.id AND e.trip_id=$1),0) AS paid,
       COALESCE((SELECT SUM(s.share_amount) FROM expense_splits s JOIN expenses e ON e.id=s.expense_id
                 WHERE s.user_id = u.id AND e.trip_id=$1 AND s.is_settled=FALSE),0) AS owes
     FROM users u
     JOIN trip_members tm ON tm.user_id = u.id
     WHERE tm.trip_id=$1`,
    [req.params.tripId]
  );
  const balances = result.rows.map((r) => ({
    ...r,
    net: +(parseFloat(r.paid) - parseFloat(r.owes)).toFixed(2),
  }));
  res.json(balances);
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM expenses WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
