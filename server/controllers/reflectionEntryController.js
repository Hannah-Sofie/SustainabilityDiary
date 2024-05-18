const ReflectionEntry = require("../models/reflectionEntrySchema");
const asyncHandler = require("express-async-handler");
const CreateError = require("../utils/createError");
const handleAchievementCreation = require("../utils/handleAchievementCreation");
const fs = require("fs");
const path = require("path");

const getAllReflectionEntries = asyncHandler(async (req, res, next) => {
  try {
    const entries = await ReflectionEntry.find({ userId: req.user._id });
    res.json(entries);
  } catch (error) {
    next(new CreateError("Failed to fetch entries", 500));
  }
});

const getAllPublicReflectionEntries = asyncHandler(async (req, res, next) => {
  try {
    const entries = await ReflectionEntry.find({ isPublic: true }).populate(
      "userId",
      "name"
    );
    res.json(entries);
  } catch (error) {
    next(new CreateError("Failed to fetch public entries", 500));
  }
});

const createReflectionEntry = asyncHandler(async (req, res, next) => {
  const { title, body, isPublic, classroomId, isAnonymous, requestFeedback } =
    req.body;
  const photo = req.file ? req.file.filename : null;

  if (!title || !body) {
    return next(new CreateError("Title and body are required", 400));
  }

  try {
    const newEntry = new ReflectionEntry({
      userId: req.user._id,
      userName: req.user.name,
      title,
      body,
      isPublic,
      photo,
      isAnonymous,
      requestFeedback,
      classrooms: isPublic && classroomId ? [classroomId] : [],
    });

    await newEntry.save();

    const reflectionsCount = await ReflectionEntry.countDocuments({
      userId: req.user._id,
    });

    await handleAchievementCreation(req.user._id, reflectionsCount);

    res.status(201).json({ entry: newEntry });
  } catch (error) {
    console.error("Error creating entry:", error);
    next(new CreateError("Error creating entry", 500));
  }
});

const getReflectionById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const reflection = await ReflectionEntry.findById(id).populate(
      "userId",
      "name email"
    );

    if (!reflection) {
      return next(new CreateError("Reflection not found", 404));
    }
    res.json(reflection);
  } catch (error) {
    next(new CreateError("Failed to fetch reflection", 500));
  }
});

const getReflectionsByClassroom = asyncHandler(async (req, res, next) => {
  const { classroomId } = req.params;
  try {
    const reflections = await ReflectionEntry.find({
      isPublic: true,
      classrooms: { $in: [classroomId] },
    }).populate("userId", "name");
    res.json(reflections);
  } catch (error) {
    next(new CreateError("Failed to fetch reflections for the classroom", 500));
  }
});

const getLatestReflection = asyncHandler(async (req, res, next) => {
  try {
    const latestReflection = await ReflectionEntry.findOne({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    if (!latestReflection) {
      return next(new CreateError("No reflections found", 404));
    }
    res.json(latestReflection);
  } catch (error) {
    next(new CreateError("Failed to fetch the latest reflection", 500));
  }
});

const updateReflectionEntry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    body,
    isPublic,
    classroomId,
    removePhoto,
    isAnonymous,
    requestFeedback,
  } = req.body;
  const newPhoto = req.file ? req.file.filename : null;

  if (!id) {
    console.error("ID parameter is missing");
    return next(new CreateError("ID parameter is required", 400));
  }

  if (!title || !body) {
    return next(new CreateError("Title and body are required", 400));
  }

  try {
    const existingEntry = await ReflectionEntry.findById(id);
    if (!existingEntry) {
      console.error("Entry not found:", id);
      return next(new CreateError("Entry not found or permission denied", 404));
    }

    if (existingEntry.userId.toString() !== req.user._id.toString()) {
      console.error("Permission denied for user:", req.user._id);
      return next(new CreateError("Entry not found or permission denied", 404));
    }

    const updateFields = {
      title,
      body,
      isPublic,
      isAnonymous,
      requestFeedback,
      ...(isPublic && classroomId && { classrooms: [classroomId] }),
      photo: newPhoto || existingEntry.photo,
    };

    if (removePhoto === "true") {
      updateFields.photo = null;
      const oldPhotoPath = path.join(
        __dirname,
        "../uploads/reflections/",
        existingEntry.photo
      );
      fs.unlink(oldPhotoPath, (err) => {
        if (err) console.error("Error deleting old photo", err);
      });
    }

    const updatedEntry = await ReflectionEntry.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateFields,
      { new: true }
    );
    if (!updatedEntry) {
      return next(new CreateError("Failed to update entry", 404));
    }

    res.json(updatedEntry);
  } catch (error) {
    console.error("Error updating entry:", error);
    next(new CreateError("Error updating entry", 500));
  }
});

const deleteReflectionEntry = asyncHandler(async (req, res, next) => {
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

const likeReflectionEntry = asyncHandler(async (req, res, next) => {
  try {
    const reflection = await ReflectionEntry.findById(req.params.id);

    if (!reflection) {
      return next(new CreateError("Reflection not found", 404));
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
    next(new CreateError("Failed to update likes", 500));
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
