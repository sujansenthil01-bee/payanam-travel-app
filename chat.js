const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const OpenAI = require('openai');

router.use(auth);

// The app remains demo-ready without a paid AI key.  When a key is supplied it
// uses OpenAI; otherwise this small local intent handler covers the core travel
// and expense actions instead of failing the entire chat experience.
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// "Travel Buddy" — AI assistant that understands trip context and can log
// expenses / answer budget questions / suggest itinerary via a tool-call style flow.

const SYSTEM_PROMPT = `You are "Travel Buddy", the friendly AI assistant inside the Payanam travel app.
You help a group of friends plan trips and track shared expenses in Indian Rupees (₹).
You can:
1. Log an expense when the user describes one in natural language (e.g. "add 800 for lunch paid by Ravi").
2. Answer questions about the trip budget, per-person cost, and who owes whom.
3. Suggest itinerary ideas for Indian destinations.
Whenever the user is describing an expense to log, respond ONLY with a JSON object like:
{"action":"add_expense","title":"...","amount":123,"category":"food|stay|transport|activity|shopping|general","paid_by_name":"..."}
Otherwise, reply normally in plain, warm, concise text (2-4 sentences).`;

function localBuddyReply(message, trip, spent) {
  const clean = message.trim();
  const expenseMatch = clean.match(/(?:add|spent|pay(?:ed)?|log)\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)/i)
    || clean.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (expenseMatch) {
    const amount = Number(expenseMatch[1].replace(/,/g, ''));
    const afterAmount = clean.slice(clean.indexOf(expenseMatch[0]) + expenseMatch[0].length)
      .replace(/\bfor\b/i, '').replace(/\bpaid by\b.*$/i, '').trim();
    const lower = clean.toLowerCase();
    const category = /(taxi|auto|cab|bus|train|fuel)/.test(lower) ? 'transport'
      : /(hotel|stay|room|hostel)/.test(lower) ? 'stay'
        : /(ticket|museum|entry|activity)/.test(lower) ? 'activity'
          : /(food|lunch|dinner|breakfast|tea|coffee|meal)/.test(lower) ? 'food' : 'general';
    const payer = clean.match(/paid by\s+([\p{L}][\p{L}\s'-]*)/iu)?.[1]?.trim();
    return JSON.stringify({ action: 'add_expense', title: afterAmount || 'Trip expense', amount, category, paid_by_name: payer || '' });
  }
  if (/(budget|left|remaining|spend)/i.test(clean)) {
    const remaining = Math.max(0, Number(trip.budget || 0) - Number(spent || 0));
    return `You have spent ₹${Number(spent || 0).toLocaleString('en-IN')} of your ₹${Number(trip.budget || 0).toLocaleString('en-IN')} budget. ₹${remaining.toLocaleString('en-IN')} is still available for the trip.`;
  }
  if (/(itinerary|day plan|suggest|visit|places?)/i.test(clean)) {
    return `For ${trip.name}, try a relaxed plan: start with a local breakfast, keep one landmark or activity before lunch, leave the afternoon for a scenic stop, and plan dinner near your stay. Add your city or interests and I’ll make it more specific.`;
  }
  return `I can log an expense (try “Add ₹500 for auto”), check your budget, split costs, or suggest a day plan for ${trip.name}. What would you like to do?`;
}

// POST /api/chat/:tripId  { message }
router.post('/:tripId', async (req, res) => {
  try {
    const { message } = req.body;
    const tripId = req.params.tripId;

    // Save user's message
    await pool.query(
      `INSERT INTO chat_messages (trip_id, user_id, role, content) VALUES ($1,$2,'user',$3)`,
      [tripId, req.user.id, message]
    );

    // Give the model current trip context so it can answer budget questions accurately
    const tripRes = await pool.query('SELECT * FROM trips WHERE id=$1', [tripId]);
    const spendRes = await pool.query('SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE trip_id=$1', [tripId]);
    const trip = tripRes.rows[0];
    const contextMsg = trip
      ? `Trip: ${trip.name}, Budget: ₹${trip.budget}, Spent so far: ₹${spendRes.rows[0].total}, Travellers: ${trip.travellers_count}, Dates: ${trip.start_date} to ${trip.end_date}.`
      : '';

    const reply = openai
      ? (await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: contextMsg },
          { role: 'user', content: message },
        ],
        temperature: 0.4,
      })).choices[0].message.content
      : localBuddyReply(message, trip, spendRes.rows[0].total);
    let actionTaken = null;
    let responseText = reply;
    let addedExpense = null;

    // Try to detect a structured expense-logging action from the model
    try {
      const parsed = JSON.parse(reply);
      if (parsed.action === 'add_expense') {
        // Find the "paid_by" user among trip members by name (fallback to requester)
        const memberRes = await pool.query(
          `SELECT u.id, u.name FROM trip_members tm JOIN users u ON u.id = tm.user_id WHERE tm.trip_id=$1`,
          [tripId]
        );
        const payer = memberRes.rows.find(
          (m) => parsed.paid_by_name && m.name.toLowerCase().includes(parsed.paid_by_name.toLowerCase())
        ) || { id: req.user.id, name: req.user.name };

        const expRes = await pool.query(
          `INSERT INTO expenses (trip_id, paid_by, title, category, amount, split_type)
           VALUES ($1,$2,$3,$4,$5,'equal') RETURNING *`,
          [tripId, payer.id, parsed.title, parsed.category || 'general', parsed.amount]
        );
        const expense = expRes.rows[0];
        const share = +(parsed.amount / memberRes.rows.length).toFixed(2);
        for (const m of memberRes.rows) {
          await pool.query(
            `INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES ($1,$2,$3)`,
            [expense.id, m.id, share]
          );
        }
        actionTaken = 'expense_added';
        addedExpense = expense;
        responseText = `Got it! Added ₹${parsed.amount} for "${parsed.title}" (paid by ${payer.name}), split equally between ${memberRes.rows.length} travellers — ₹${share} each. 🎒`;
      }
    } catch {
      // not JSON -> plain conversational reply, keep as-is
    }

    await pool.query(
      `INSERT INTO chat_messages (trip_id, user_id, role, content, action_taken) VALUES ($1,$2,'assistant',$3,$4)`,
      [tripId, req.user.id, responseText, actionTaken]
    );

    res.json({ reply: responseText, action: actionTaken, expense: addedExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Travel Buddy is offline. Try again in a moment.' });
  }
});

// GET /api/chat/:tripId/history
router.get('/:tripId/history', async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM chat_messages WHERE trip_id=$1 ORDER BY created_at ASC LIMIT 200`,
    [req.params.tripId]
  );
  res.json(result.rows);
});

module.exports = router;
