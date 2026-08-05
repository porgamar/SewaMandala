const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/", auth, getProfile);
router.get("/me", auth, getProfile);
router.patch("/me", auth, updateProfile);
router.patch("/", auth, updateProfile);

module.exports = router;
