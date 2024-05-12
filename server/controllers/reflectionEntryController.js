const ReflectionEntry = require("../models/reflectionEntrySchema");
const UserAchievement = require("../models/achievementSchema");
const CreateError = require("../utils/createError");
const asyncHandler = require("express-async-handler");
const User = require('../models/userSchema');

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
            user = await User.findById(userId);
            await UserAchievement.create({
                userId,
                userName: user.name,
                name: "Reflection Enthusiast",
                description: "Congratulations on creating multiple reflections!"
            });
            console.log(`Achievement created for user ${userId}`);
        } else {
            console.log(`User ${userId} already has the achievement.`);
        }
    } else {
        console.log(`Count not divisible by 3, no achievement.`);
    }
};

const getAllReflectionEntries = asyncHandler(async (req, res) => {
    try {
        const entries = await ReflectionEntry.find({ userId: req.user._id });
        res.json(entries);
    } catch (error) {
        next(new CreateError("Failed to fetch entries", 500));
    }
});

const getAllPublicReflectionEntries = asyncHandler(async (req, res) => {
    try {
        const entries = await ReflectionEntry.find({ isPublic: true }).populate("userId", "name");
        res.json(entries);
    } catch (error) {
        next(new CreateError("Failed to fetch public entries", 500));
    }
});

const getReflectionById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const reflection = await ReflectionEntry.findById(id).populate("userId", "name email");

        if (!reflection) {
            return next(new CreateError("Reflection not found", 404));
        }
        res.json(reflection);
    } catch (error) {
        next(new CreateError("Failed to fetch reflection", 500));
    }
});

const getReflectionsByClassroom = asyncHandler(async (req, res) => {
    const { classroomId } = req.params;
    try {
        const reflections = await ReflectionEntry.find({
            isPublic: true,
            classrooms: { $in: [classroomId] },
        }).populate("userId", "name");
        res.json(reflections);
    } catch (error) {
        res.status(500).send({
            message: "Failed to fetch reflections for the classroom",
            error: error.message,
        });
    }
});

const getLatestReflection = asyncHandler(async (req, res) => {
    try {
        const latestReflection = await ReflectionEntry.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!latestReflection) {
            return res.status(404).json({ message: "No reflections found" });
        }
        res.json(latestReflection);
    } catch (error) {
        next(new CreateError("Failed to fetch the latest reflection", 500));
    }
});

const createReflectionEntry = asyncHandler(async (req, res) => {
  const { title, body, isPublic, classroomId } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
  }

  try {
    console.log(typeof req.user._id);
      const newEntry = new ReflectionEntry({
    
          userId: req.user._id.toString(),
          title,
          body,
          isPublic,
          photo,
          classrooms: isPublic && classroomId ? [classroomId] : []
      });
      await newEntry.save();

      const reflectionsCount = await ReflectionEntry.countDocuments({ userId: req.user._id });
      const achievementCreated = await handleAchievementCreation(req.user._id, reflectionsCount);

      // Send response including whether a new achievement was unlocked
      res.status(201).json({ entry: newEntry, achievementCreated });
  } catch (error) {
      console.error("Error creating entry:", error);
      res.status(500).json({ message: "Error creating entry", error: error.toString() });
  }
});

const updateReflectionEntry = asyncHandler(async (req, res) => {
    const { title, body, isPublic, classroomId } = req.body;
    const photo = req.file ? req.file.filename : null;

    const updateFields = {
        title,
        body,
        isPublic,
        classrooms: isPublic && classroomId ? [classroomId] : []
    };

    if (photo) {
        updateFields.photo = photo;
    }

    try {
        const updatedEntry = await ReflectionEntry.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updateFields,
            { new: true }
        );

        if (!updatedEntry) {
            return next(new CreateError("Entry not found or permission denied", 404));
        }

        res.json(updatedEntry);
    } catch (error) {
        next(new CreateError("Failed to update entry", 500));
    }
});

const deleteReflectionEntry = asyncHandler(async (req, res) => {
    try {
        const entry = await ReflectionEntry.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!entry) {
            return next(new CreateError("Entry not found or permission denied", 404));
        }

        res.json({ message: "Entry deleted successfully" });
    } catch (error) {
        next(new CreateError("Failed to delete entry", 500));
    }
});

const likeReflectionEntry = asyncHandler(async (req, res) => {
    try {
        const reflection = await ReflectionEntry.findById(req.params.id);

        if (!reflection) {
            return res.status(404).json({ message: "Reflection not found" });
        }

        const index = reflection.likedBy.indexOf(req.user._id);
        if (index === -1) {
            reflection.likes += 1;
            reflection.likedBy.push(req.user._id);
        } else {
            reflection.likes -= 1;
            reflection.likedBy.splice(index, 1);
        }

        await reflection.save();
        res.json({ likes: reflection.likes, likedBy: reflection.likedBy });
    } catch (error) {
        res.status(500).json({ message: "Failed to update likes", error: error.message });
    }
});

module.exports = {
    getAllReflectionEntries,
    getAllPublicReflectionEntries,
    getReflectionsByClassroom,
    getReflectionById,
    getLatestReflection,
    createReflectionEntry,
    updateReflectionEntry,
    deleteReflectionEntry,
    likeReflectionEntry,
};
