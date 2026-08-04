const pool = require("../db");

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const profileResult = await pool.query(
      `
      SELECT
        p.full_name,
        p.title,
        p.bio,
        p.experience,
        p.location,
        p.image,
        p.rating,
        p.profile_views,
        p.projects_posted,
        p.hires_made,
        p.applications_sent,
        t.availability,
        t.hourly_rate
      FROM profiles p
      LEFT JOIN talent t
        ON p.user_id = t.user_id
      WHERE p.user_id = $1
      `,
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        error: "Profile not found.",
      });
    }

    const skillsResult = await pool.query(
      `
      SELECT s.name
      FROM user_skills us
      JOIN skills s
        ON us.skill_id = s.id
      WHERE us.user_id = $1
      `,
      [userId]
    );

    const profile = profileResult.rows[0];

    profile.skills = skillsResult.rows.map((skill) => skill.name);

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error.",
    });
  }
};

module.exports = {
  getProfile,
};