const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    achievedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
