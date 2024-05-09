const asyncHandler = require("express-async-handler");
const UserAchievement = require("../models/achievementSchema");
const CreateError = require("../utils/createError");

const createAchievement = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            throw new CreateError("Missing required fields", 400);
        }

        const newAchievement = await UserAchievement.create({
            userId: req.user._id,  // Assuming this is set from the auth middleware
            name,
            description
        });

        res.status(201).json(newAchievement);
    } catch (error) {
        console.error("Failed to create achievement:", error);
        res.status(500).json({ message: "Failed to create achievement.", error: error.message });
    }
});

const checkAchievements = asyncHandler(async (req, res) => {
    try {
        const achievements = await UserAchievement.find({ userId: req.user._id });
        res.json(achievements);
    } catch (error) {
        console.error("Failed to fetch achievements:", error);
        res.status(500).json({ message: "Failed to fetch achievements.", error: error.message });
    }
});

module.exports = router;
