const express = require("express");
const router = express.Router();

const pool = require("../db");
const auth = require("../middleware/auth");

/*
    Returns user details for multiple IDs.
*/
router.post("/by-ids", auth, async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.json([]);
        }

        const result = await pool.query(
            `
            SELECT
                users.id,
                users.email,
                users.user_type,
                profiles.full_name
            FROM users
            LEFT JOIN profiles
                ON users.id = profiles.user_id
            WHERE users.id = ANY($1)
            `,
            [ids]
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