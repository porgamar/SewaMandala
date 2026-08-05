// routes/contact.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireAuth = require('../middleware/auth');

// Only a logged-in user (valid JWT) can trigger a send — gated by the
// existing auth middleware, unchanged.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const result = await pool.query(
      `INSERT INTO contact_messages (user_id, name, email, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [req.userId, name, email, message]
    );

    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;