const express = require("express");
const router = express.Router();

const pool = require("../db");
const auth = require("../middleware/auth");

// GET /api/users
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        users.id,
        users.email,
        users.user_type,
        profiles.full_name
      FROM users
      JOIN profiles
        ON profiles.user_id = users.id
      WHERE users.id != $1
      ORDER BY profiles.full_name ASC
      `,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;