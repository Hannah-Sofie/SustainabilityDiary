const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/verifyToken');
const {
    createAchievement,
    checkAchievements,
    getLeaderboard,
    optInLeaderboard,
    optOutLeaderboard,
    getOptInStatus
} = require('../controllers/achievementController');

router.post('/', verifyToken, createAchievement);
router.get('/', verifyToken, checkAchievements);
router.get('/leaderboard', verifyToken, getLeaderboard);
router.post('/opt-in', verifyToken, optInLeaderboard);
router.post('/opt-out', verifyToken, optOutLeaderboard);
router.post('/opt-in-status', verifyToken, getOptInStatus);

module.exports = router;