const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/verifyToken');
const { createAchievement, checkAchievements } = require('../controllers/achievementController');

router.post('/', verifyToken, createAchievement);
router.get('/', verifyToken, checkAchievements);

module.exports = router;
