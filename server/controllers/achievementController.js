const ReflectionEntry = require("../models/reflectionEntrySchema");
const UserAchievement = require("../models/achievementSchema");
const CreateError = require("../utils/createError");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

// Utility function to handle achievement creation
const handleAchievementCreation = async (userId, count) => {
    console.log(`Checking achievements for user ${userId} with count ${count}`);
    if (count % 3 === 0) {
        const existingAchievement = await UserAchievement.findOne({
            userId,
            name: "Reflection Enthusiast"
        });

        if (!existingAchievement) {
            console.log(`Creating new achievement for user ${userId}`);
            await UserAchievement.create({
                userId,
                name: "Reflection Enthusiast",
                description: "Congratulations on creating multiple reflections!"
            });
            console.log(`Achievement created for user ${userId}`);
            return true; // Indicates that a new achievement was created
        } else {
            console.log(`User ${userId} already has the achievement.`);
        }
    } else {
        console.log(`Count not divisible by 3, no achievement.`);
    }
    return false; // Indicates no achievement was created
};

// Endpoint to create a reflection entry and potentially trigger an achievement
const createReflectionEntry = asyncHandler(async (req, res) => {
    const { title, body, isPublic, classroomId } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!title || !body) {
        return res.status(400).json({ message: "Title and body are required" });
    }

    try {
        const newEntry = new ReflectionEntry({
            userId: req.user._id,
            title,
            body,
            isPublic,
            photo,
            classrooms: isPublic && classroomId ? [classroomId] : []
        });

        await newEntry.save();

        // Check and possibly award achievements after saving new entry
        const reflectionsCount = await ReflectionEntry.countDocuments({ userId: req.user._id });
        const achievementCreated = await handleAchievementCreation(req.user._id, reflectionsCount);

        // Include achievement creation status in the response
        res.status(201).json({ entry: newEntry, achievementCreated });
    } catch (error) {
        console.error("Error creating entry:", error);
        res.status(500).json({ message: "Error creating entry", error: error.toString() });
    }
});

// Function to create an achievement manually
const createAchievement = asyncHandler(async (req, res) => {
    const { userId, name, description } = req.body;

    try {
        const existingAchievement = await UserAchievement.findOne({ userId, name });
        if (existingAchievement) {
            return res.status(409).json({ message: "Achievement already exists" });
        }

        const newAchievement = await UserAchievement.create({
            userId,
            name,
            description
        });
        res.status(201).json(newAchievement);
    } catch (error) {
        console.error("Error creating achievement:", error);
        res.status(500).json({ message: "Error creating achievement", error: error.message });
    }
});

// Function to fetch all achievements for a user
const checkAchievements = asyncHandler(async (req, res) => {
    const { userId } = req.user; // Make sure this userId is what you expect
    console.log("Fetching achievements for user:", userId);

    try {
        const objectIdUserId = new mongoose.Types.ObjectId(req.user._id); 
        const achievements = await UserAchievement.find({ userId: objectIdUserId });
        console.log(typeof userId);
        console.log("Achievements found:", achievements); 

        res.json(achievements);
    } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ message: "Error fetching achievements", error: error.message });
    }
});


module.exports = {
    createReflectionEntry,
    createAchievement,
    checkAchievements
};
