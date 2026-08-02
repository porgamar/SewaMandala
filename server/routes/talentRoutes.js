const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getTalents,
  createTalent,
} = require("../controllers/talentController");

router.get("/", getTalents);

router.post("/", upload.single("image"), createTalent);

module.exports = router;