const mongoose = require('mongoose');

const baseURL = process.env.BASE_URL || 'http://localhost:8001';
const defaultImagePath = `${baseURL}/uploads/achievements/default_award.jpg`;

const userAchievementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: 'http://localhost:8001/uploads/achievements/reflection_award.jpg' },
    achievedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
