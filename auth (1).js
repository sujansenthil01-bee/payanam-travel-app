const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../config/db');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// POST /api/auth/signup  (email + password)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password required' });
    }
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,avatar_url`,
      [name, email, hash]
    );
    const user = result.rows[0];
    res.json({ token: makeToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/login  (email + password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account uses Google sign-in' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    delete user.password_hash;
    res.json({ token: makeToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/google   { idToken }  -- sent from Expo Google sign-in
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let result = await pool.query('SELECT * FROM users WHERE google_id=$1 OR email=$2', [googleId, email]);
    let user;
    if (result.rows.length) {
      user = result.rows[0];
      if (!user.google_id) {
        await pool.query('UPDATE users SET google_id=$1, avatar_url=$2 WHERE id=$3', [googleId, picture, user.id]);
      }
    } else {
      const insert = await pool.query(
        `INSERT INTO users (name, email, google_id, avatar_url) VALUES ($1,$2,$3,$4) RETURNING id,name,email,avatar_url`,
        [name, email, googleId, picture]
      );
      user = insert.rows[0];
    }
    delete user.password_hash;
    res.json({ token: makeToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Google sign-in failed' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  const result = await pool.query('SELECT id,name,email,avatar_url,created_at FROM users WHERE id=$1', [req.user.id]);
  res.json(result.rows[0]);
});

module.exports = router;
