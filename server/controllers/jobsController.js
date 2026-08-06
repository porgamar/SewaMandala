const pool = require("../db");

const createJob = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      title,
      job_type,
      budget,
      description,
      location,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const result = await pool.query(
      `
      INSERT INTO jobs
      (
        client_id,
        title,
        job_type,
        budget,
        description,
        location,
        image
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        userId,
        title,
        job_type,
        budget,
        description,
        location,
        image,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create job."
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        j.id,
        j.title,
        j.job_type,
        j.budget,
        j.description,
        j.location,
        j.image,
        j.status,
        p.full_name

      FROM jobs j

      JOIN profiles p
        ON p.user_id = j.client_id

      WHERE j.status='open'

      ORDER BY j.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch jobs."
    });
  }
};

const acceptJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const talentId = req.userId;

    // Check that the job exists and is still open
    const job = await pool.query(
      `SELECT * FROM jobs
       WHERE id = $1
       AND status = 'open'`,
      [jobId]
    );

    if (job.rows.length === 0) {
      return res.status(404).json({
        error: "Job is no longer available."
      });
    }

    // Create the application
    await pool.query(
      `INSERT INTO job_applications
      (job_id, talent_id)
      VALUES ($1, $2)`,
      [jobId, talentId]
    );

    // Mark the job as accepted
    await pool.query(
      `UPDATE jobs
       SET status = 'accepted'
       WHERE id = $1`,
      [jobId]
    );

    res.json({
      message: "Work accepted successfully."
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error."
    });
  }
};

const getCurrentJobs = async (req, res) => {
  try {
    const userId = req.userId;

    const userResult = await pool.query(
      `SELECT user_type FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const userType = userResult.rows[0].user_type;

    let result;

    if (userType === "talent") {
      result = await pool.query(
        `
        SELECT
          j.id,
          j.title,
          j.job_type,
          j.budget,
          j.description,
          j.location,
          j.image,
          j.status,
          p.full_name AS client_name,
          EXISTS (
          SELECT 1
          FROM ratings r
        WHERE r.job_id = j.id
        ) AS already_rated
        FROM jobs j

        JOIN job_applications ja
          ON ja.job_id = j.id

        LEFT JOIN profiles p
          ON p.user_id = j.client_id

        WHERE ja.talent_id = $1
        AND (j.status = 'accepted'
          OR(j.status = 'completed'
          AND NOT EXISTS(
            SELECT 1
            FROM ratings r
            WHERE r.job_id = j.id
          )
          ))
        

        ORDER BY j.created_at DESC
        `,
        [userId]
      );
    } else {
      result = await pool.query(
        `
        SELECT
          j.id,
          j.title,
          j.job_type,
          j.budget,
          j.description,
          j.location,
          j.image,
          j.status,
          p.full_name AS talent_name,
          EXISTS (
          SELECT 1
          FROM ratings r
          WHERE r.job_id = j.id
         ) AS already_rated
          
        FROM jobs j

        JOIN job_applications ja
          ON ja.job_id = j.id

        LEFT JOIN profiles p
          ON p.user_id = ja.talent_id

        WHERE j.client_id = $1
        AND  (j.status = 'accepted'
          OR(j.status='completed'
            AND NOT EXISTS(
                SELECT 1
                FROM ratings r
                WHERE r.job_id = j.id
            )
            ))

        ORDER BY j.created_at DESC
        `,
        [userId]
      );
    }

    res.json(result.rows);

  } catch (err) {
    console.error("Current work error:", err);

    res.status(500).json({
      error: "Failed to fetch current work.",
    });
  }
};

const completeJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const result = await pool.query(
      `
      UPDATE jobs
      SET status='completed'
      WHERE id=$1
      RETURNING *
      `,
      [jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    res.json({
      message: "Job marked as completed.",
      job: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to complete job.",
    });
  }
};

const rateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { stars, review } = req.body;

    const userId = req.userId;

    // Get completed job
    const jobResult = await pool.query(
      `
      SELECT
        j.*,
        ja.talent_id
      FROM jobs j
      JOIN job_applications ja
        ON ja.job_id = j.id
      WHERE j.id = $1
        AND j.client_id = $2
        AND j.status = 'completed'
      `,
      [id, userId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        error: "Completed job not found."
      });
    }

    const job = jobResult.rows[0];

    // Prevent duplicate ratings
    const alreadyRated = await pool.query(
      `
      SELECT id
      FROM ratings
      WHERE job_id = $1
      `,
      [job.id]
    );

    if (alreadyRated.rows.length > 0) {
      return res.status(400).json({
        error: "This job has already been rated."
      });
    }

    // Save rating
    await pool.query(
      `
      INSERT INTO ratings
      (job_id, client_id, talent_id, stars, review)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        job.id,
        userId,
        job.talent_id,
        stars,
        review,
      ]
    );

    // Calculate new average
    const average = await pool.query(
      `
      SELECT AVG(stars)::numeric(3,2) AS rating
      FROM ratings
      WHERE talent_id = $1
      `,
      [job.talent_id]
    );

    // Update profile rating
    await pool.query(
      `
      UPDATE profiles
      SET rating = $1
      WHERE user_id = $2
      `,
      [
        average.rows[0].rating,
        job.talent_id,
      ]
    );

    res.json({
  message: "Rating submitted successfully."
});

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to submit rating."
    });
  }
};


const getTalentReviews = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.stars,
        r.review,
        r.created_at,
        p.full_name AS client_name,
        j.title AS job_title
      FROM ratings r

      JOIN profiles p
        ON p.user_id = r.client_id

      JOIN jobs j
        ON j.id = r.job_id

      WHERE r.talent_id = $1

      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch reviews."
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  acceptJob,
  getCurrentJobs,
  completeJob,
  rateJob,
  getTalentReviews,
};