// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const requireAuth = require('../middleware/auth');

// Only this exact account can manage users.
const ADMIN_EMAIL = 'admin@sewamandala.com';

async function isAdmin(userId) {
  const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
  return result.rows.length > 0 && result.rows[0].email === ADMIN_EMAIL;
}

// List every account except the admin's own.
router.get('/users', requireAuth, async (req, res) => {
  try {
    if (!(await isAdmin(req.userId))) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await pool.query(
      `SELECT id, email, user_type, created_at
       FROM users
       WHERE email != $1
       ORDER BY created_at DESC`,
      [ADMIN_EMAIL]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new client or talent account.
router.post('/users', requireAuth, async (req, res) => {
  try {
    if (!(await isAdmin(req.userId))) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ error: 'Email, password, and user type are required' });
    }

    if (!['client', 'talent'].includes(userType)) {
      return res.status(400).json({ error: 'User type must be client or talent' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, user_type)
       VALUES ($1, $2, $3)
       RETURNING id, email, user_type, created_at`,
      [email.toLowerCase().trim(), hashedPassword, userType]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Add user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a user account. The admin account itself can never be removed
// this way, even if its id is somehow passed in.
router.delete('/users/:id', requireAuth, async (req, res) => {
  try {
    if (!(await isAdmin(req.userId))) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const target = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
    if (target.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (target.rows[0].email === ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Cannot remove the admin account' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;