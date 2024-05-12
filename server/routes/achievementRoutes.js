const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/verifyToken');
const {
    createAchievement,
    checkAchievements,
    getLeaderboard,
    optInLeaderboard
} = require('../controllers/achievementController');

router.post('/', verifyToken, createAchievement);
router.get('/', verifyToken, checkAchievements);
router.get('/leaderboard', verifyToken, getLeaderboard);
router.post('/opt-in', verifyToken, optInLeaderboard);

module.exports = router;