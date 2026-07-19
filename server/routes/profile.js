const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.email,
         u.user_type,
         u.created_at,
         p.full_name,
         p.bio,
         p.projects_posted,
         p.hires_made,
         p.profile_views,
         p.applications_sent,
         p.rating,
         p.skills
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const { bio, skills } = req.body;

    // allow client to skip skills update by sending undefined
    const hasBio = typeof bio !== 'undefined';
    const hasSkills = typeof skills !== 'undefined';


    const validSkills = Array.isArray(skills)
      ? skills.map(String)
      : null;

    // skills column is TEXT[] in schema; ensure we always pass a TEXT[] (or null).
    // If client sends null/undefined, keep existing skills.
    const result = await pool.query(
      `UPDATE profiles
       SET bio = COALESCE($1, bio),
           skills = COALESCE($2::text[], skills)
       WHERE user_id = $3
       RETURNING bio, skills`,
      [bio, validSkills, req.userId]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updated = result.rows[0];

    const userResult = await pool.query(
      `SELECT
         u.id,
         u.email,
         u.user_type,
         u.created_at,
         p.full_name,
         p.bio,
         p.projects_posted,
         p.hires_made,
         p.profile_views,
         p.applications_sent,
         p.rating,
         p.skills
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.userId]
    );

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
