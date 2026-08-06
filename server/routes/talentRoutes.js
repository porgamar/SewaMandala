const express = require("express");
const router = express.Router();
const { getTalents, createTalent } = require("../controllers/talentController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getTalents);
router.post("/", auth, upload.single("image"), createTalent);

module.exports = router;