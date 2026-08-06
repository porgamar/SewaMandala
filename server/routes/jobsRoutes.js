const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createJob,
  getJobs,
  acceptJob,
  getCurrentJobs,
  completeJob,
  rateJob,
  getTalentReviews,
} = require("../controllers/jobsController");

// Create a new job
router.post("/", auth, upload.single("image"), createJob);

// Get all available jobs
router.get("/", getJobs);

router.patch("/:id/accept", auth, acceptJob);
router.patch("/:id/complete", auth, completeJob);
router.post("/:id/rate", auth, rateJob);
router.get("/current", auth, getCurrentJobs);
router.get("/reviews", auth, getTalentReviews);

module.exports = router;