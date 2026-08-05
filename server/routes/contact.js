// routes/contact.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireAuth = require('../middleware/auth');

// Only this exact account can view or remove messages.
const ADMIN_EMAIL = 'admin@sewamandala.com';

async function isAdmin(userId) {
  const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
  return result.rows.length > 0 && result.rows[0].email === ADMIN_EMAIL;
}

// View all submitted messages.
router.get('/', requireAuth, async (req, res) => {
  try {
    if (!(await isAdmin(req.userId))) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await pool.query(
      `SELECT id, user_id, name, email, message, created_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a message.
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (!(await isAdmin(req.userId))) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM contact_messages WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

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