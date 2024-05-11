const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/verifyToken');
const { createAchievement, checkAchievements } = require('../controllers/achievementController');

router.post('/', verifyToken, createAchievement);  // POST /api/achievements
router.get('/', verifyToken, checkAchievements);   // GET /api/achievements

module.exports = router;