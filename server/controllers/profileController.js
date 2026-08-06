const pool = require("../db");

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const profileResult = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.email,
        u.user_type,
        u.created_at,
        p.full_name,
        p.image,
        p.bio,
        p.rating,
        p.profile_views,
        p.projects_posted,
        p.hires_made,
        p.applications_sent,
        p.skills
      FROM profiles p
      JOIN users u
        ON u.id = p.user_id
      WHERE p.user_id = $1
      `,
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        error: "Profile not found.",
      });
    }

    const profile = profileResult.rows[0];

    // skills is stored as an array on the profiles table
    profile.skills = Array.isArray(profile.skills) ? profile.skills : [];

    // Derive a username handle from full_name or email if not present
    profile.username =
      profile.full_name?.toLowerCase().replace(/\s+/g, "") ||
      profile.email?.split("@")[0] ||
      "profile";

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio, skills } = req.body;

    // Update the bio
    const profileUpdate = await pool.query(
      `
      UPDATE profiles
      SET bio = COALESCE($2, bio)
      WHERE user_id = $1
      RETURNING id
      `,
      [userId, bio ?? null]
    );

    if (profileUpdate.rows.length === 0) {
      return res.status(404).json({
        error: "Profile not found.",
      });
    }

    // Replace skills if provided
    if (Array.isArray(skills)) {
      const cleaned = skills
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean);

      await pool.query(
        `UPDATE profiles SET skills = $2 WHERE user_id = $1`,
        [userId, JSON.stringify(cleaned)]
      );
    }

    // Return the updated profile
    const updated = await getProfileByUserId(userId);
    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error.",
    });
  }
};

// Helper to fetch a full profile with skills (used after updates)
async function getProfileByUserId(userId) {
  const profileResult = await pool.query(
    `
    SELECT
      u.id AS user_id,
      u.email,
      u.user_type,
      u.created_at,
      p.full_name,
      p.image,
      p.bio,
      p.rating,
      p.profile_views,
      p.projects_posted,
      p.hires_made,
      p.applications_sent,
      p.skills
    FROM profiles p
    JOIN users u
      ON u.id = p.user_id
    WHERE p.user_id = $1
    `,
    [userId]
  );

  const profile = profileResult.rows[0];
  profile.skills = Array.isArray(profile.skills) ? profile.skills : [];
  profile.username =
    profile.full_name?.toLowerCase().replace(/\s+/g, "") ||
    profile.email?.split("@")[0] ||
    "profile";

  return profile;
}

module.exports = {
  getProfile,
  updateProfile,
};
