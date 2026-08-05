const pool = require("../db");

const getTalents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.user_id,
        t.availability,
        t.hourly_rate,
        t.category,
        t.delivery_time,
        p.full_name,
        p.title,
        p.bio,
        p.experience,
        p.location,
        p.image,
        p.rating,
        COALESCE(array_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
      FROM talent t
      JOIN profiles p ON p.user_id = t.user_id
      LEFT JOIN user_skills us ON us.user_id = t.user_id
      LEFT JOIN skills s ON s.id = us.skill_id
      GROUP BY t.id, t.user_id, t.availability, t.hourly_rate, t.category, t.delivery_time,
               p.full_name, p.title, p.bio, p.experience, p.location, p.image, p.rating
      ORDER BY t.created_at DESC
    `);

    const listings = result.rows.map((row) => {
      const rating = Number(row.rating) || 0;
      let talentLevel = "newTalent";
      if (rating >= 4.5) talentLevel = "topTalent";
      else if (rating >= 3) talentLevel = "midRated";

      return {
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        title: row.title,
        bio: row.bio,
        experience: row.experience,
        location: row.location,
        image: row.image ? `http://localhost:5000/uploads/${row.image}` : null,
        rating,
        hourlyRate: Number(row.hourly_rate) || 0,
        availability: row.availability,
        category: row.category,
        deliveryTime: row.delivery_time,
        skills: row.skills || [],
        talentLevel,
      };
    });

    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch talent listings." });
  }
};

const createTalent = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.userId;

    const {
      full_name,
      title,
      bio,
      experience,
      location,
      availability,
      hourly_rate,
      category,
      delivery_time,
      skills,
    } = req.body;

    let parsedSkills = [];
    try {
      parsedSkills = JSON.parse(skills);
    } catch {
      return res.status(400).json({ error: "Invalid skills format." });
    }

    const image = req.file ? req.file.filename : null;

    if (!full_name?.trim()) return res.status(400).json({ error: "Full name is required." });
    if (!title?.trim()) return res.status(400).json({ error: "Title is required." });
    if (!availability?.trim()) return res.status(400).json({ error: "Availability is required." });
    if (hourly_rate === undefined || hourly_rate === "" || isNaN(Number(hourly_rate))) {
      return res.status(400).json({ error: "Hourly rate must be a valid number." });
    }
    if (parsedSkills.length === 0) {
      return res.status(400).json({ error: "At least one skill is required." });
    }

    await client.query("BEGIN");

    await client.query(
      `UPDATE profiles
       SET full_name=$1, title=$2, bio=$3, experience=$4, location=$5, image=COALESCE($6, image)
       WHERE user_id=$7`,
      [full_name, title, bio, experience, location, image, userId]
    );

    await client.query(
      `INSERT INTO talent (user_id, availability, hourly_rate, category, delivery_time)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id) DO UPDATE
       SET availability = EXCLUDED.availability,
           hourly_rate = EXCLUDED.hourly_rate,
           category = EXCLUDED.category,
           delivery_time = EXCLUDED.delivery_time,
           updated_at = CURRENT_TIMESTAMP`,
      [userId, availability, hourly_rate, category, delivery_time]
    );

    await client.query(`DELETE FROM user_skills WHERE user_id = $1`, [userId]);

    for (const skill of parsedSkills) {
      const skillResult = await client.query(
        `INSERT INTO skills(name) VALUES($1)
         ON CONFLICT(name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [skill]
      );
      await client.query(
        `INSERT INTO user_skills(user_id, skill_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
        [userId, skillResult.rows[0].id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Talent profile saved successfully." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to save talent profile." });
  } finally {
    client.release();
  }
};

module.exports = { getTalents, createTalent };