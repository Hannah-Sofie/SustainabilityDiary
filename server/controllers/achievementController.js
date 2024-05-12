const ReflectionEntry = require("../models/reflectionEntrySchema");
const UserAchievement = require("../models/achievementSchema");
const CreateError = require("../utils/createError");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const User = require('../models/userSchema');


// Utility function to handle achievement creation
const handleAchievementCreation = async (userId, count) => {
    if (count % 3 === 0) {
        let user;
        try {
            user = await User.findById(userId);
            console.log(user);
            if (!user) {
                console.error(`User not found with ID: ${userId}`);
                return false; // User not found
            }
        } catch (error) {
            console.error(`Failed to fetch user with ID: ${userId}`, error);
            return false; // Error fetching user
        }

        const existingAchievement = await UserAchievement.findOne({
            userId,
            name: "Reflection Enthusiast"
        });
        console.log(`Attempting to create achievement with userName: ${user.name}`);
        if (!existingAchievement) {
            console.log(`User found: ${user.name}`); // Confirm user's name is logging correctly
            try {
                console.log(`Attempting to create achievement with userName: ${user.name}`);
                user = await User.findById(userId);
                const newAchievement = await UserAchievement.create({
                    userId: req.user._id,
                    userName: user.name,
                    name: "Reflection Enthusiast",
                    description: "Congratulations on creating multiple reflections!",
                    image: `http://localhost:8001/uploads/achievements/reflection_award.jpg`
                });
                console.log(`Achievement created for ${user.name} with image: ${newAchievement.image}`);
                return true;
            } catch (error) {
                console.error("Error creating achievement:", error);
                console.error("Detailed Error: ", error.errors); // More detailed error logging
                return false;
            }
        } else {
            console.log("Existing achievement found, not creating a new one.");
        }
    } else {
        console.log("Count not divisible by 3, no achievement.");
    }
    return false;
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
            userName: user.name,
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
    const { userId, name, description, image } = req.body; 

    try {
        const existingAchievement = await UserAchievement.findOne({ userId, name });
        if (existingAchievement) {
            return res.status(409).json({ message: "Achievement already exists" });
        }

        const newAchievement = await UserAchievement.create({
            userId,
            name,
            userName,
            description,
            image: image || 'default_award.jpg'
        });
        res.status(201).json(newAchievement);
    } catch (error) {
        console.error("Error creating achievement:", error);
        res.status(500).json({ message: "Error creating achievement", error: error.message });
    }
});


// Function to fetch all achievements for a user
const checkAchievements = asyncHandler(async (req, res) => {
    const { userId } = req.user._id; // Make sure this userId is what you expect
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

const optInLeaderboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;  // Assuming user ID is correctly extracted from JWT
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { isInLeaderboard: true }, 
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Successfully opted into leaderboard", isInLeaderboard: updatedUser.isInLeaderboard });
    } catch (error) {
        console.error("Error opting into leaderboard:", error);
        res.status(500).json({ message: "Failed to opt-in to leaderboard", error: error.toString() });
    }
});

const optOutLeaderboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;  // Assuming user ID is correctly extracted from JWT
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { isInLeaderboard: false },  // Set isInLeaderboard to false
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Successfully opted out of leaderboard", isInLeaderboard: updatedUser.isInLeaderboard });
    } catch (error) {
        console.error("Error opting out of leaderboard:", error);
        res.status(500).json({ message: "Failed to opt-out of leaderboard", error: error.toString() });
    }
});

const getLeaderboard = asyncHandler(async (req, res) => {
    try {
        const leaderboard = await User.aggregate([
            { $match: { isInLeaderboard: true } }, // Only consider users who opted in
            { $lookup: {
                from: "userachievements",
                localField: "_id",
                foreignField: "userId",
                as: "achievements"
            }},
            { $project: {
                username: "$name",
                achievementCount: { $size: "$achievements" }
            }},
            { $sort: { achievementCount: -1 } } // Sorting in descending order
        ]);
        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Error fetching leaderboard", error: error.toString() });
    }
});

module.exports = {
    createReflectionEntry,
    createAchievement,
    checkAchievements,
    getLeaderboard,
    optInLeaderboard,
    optOutLeaderboard
};