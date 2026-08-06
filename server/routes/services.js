// const express = require("express");
// const router = express.Router();
// const pool = require("../db");

// router.get("/", async (req, res) => {
//     try {
//         const result = await pool.query(
//             "SELECT * FROM services"
//         );

//         res.json(result.rows);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: "Database error"
//         });
//     }
// });

// module.exports = router;