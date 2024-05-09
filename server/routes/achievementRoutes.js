const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken");
const { checkAchievements, createAchievement } = require("../controllers/achievementController");

// Ensure you are using middleware for authentication
router.post("/", verifyToken, createAchievement);
router.get("/", verifyToken, checkAchievements);

module.exports = router;