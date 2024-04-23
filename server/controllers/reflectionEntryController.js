const ReflectionEntry = require("../models/reflectionEntrySchema");
const CreateError = require("../utils/createError");

const getAllReflectionEntries = async (req, res, next) => {
  try {
    const entries = await ReflectionEntry.find({ userId: req.user._id });
    res.json(entries);
  } catch (error) {
    next(new CreateError("Failed to fetch entries", 500));
  }
};

const getAllPublicReflectionEntries = async (req, res, next) => {
  try {
    const entries = await ReflectionEntry.find({ isPublic: true }).populate(
      "userId",
      "name"
    );
    res.json(entries);
  } catch (error) {
    next(new CreateError("Failed to fetch public entries", 500));
  }
};

const getReflectionById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the reflection ID from URL parameters
    const reflection = await ReflectionEntry.findById(id).populate(
      "userId",
      "name email"
    ); // Optionally populate user details

    if (!reflection) {
      return next(new CreateError("Reflection not found", 404)); // No reflection found with the given ID
    }

    // Check if the reflection is public or belongs to the user making the request
    if (
      !reflection.isPublic &&
      reflection.userId._id.toString() !== req.user._id.toString()
    ) {
      return next(new CreateError("Access denied", 403)); // User not authorized to access this reflection
    }

    res.json(reflection); // Send back the found reflection
  } catch (error) {
    console.error("Error fetching reflection:", error);
    next(new CreateError("Failed to fetch reflection", 500)); // Server error
  }
};

const getReflectionsByClassroom = async (req, res) => {
  const classroomId = req.params.classroomId;
  try {
    const reflections = await ReflectionEntry.find({
      isPublic: true,
      classrooms: { $in: [classroomId] },
    }).populate("userId", "name");

    res.json(reflections);
  } catch (error) {
    console.error("Error fetching reflections:", error);
    res.status(500).send({
      message: "Failed to fetch reflections for the classroom",
      error: error.message,
    });
  }
};

const createReflectionEntry = async (req, res, next) => {
  const { title, body, isPublic, classroomId } = req.body; // Changed to classroomId
  const photo = req.file ? req.file.filename : null;
  console.log("Received data:", req.body);

  try {
    const newEntry = await ReflectionEntry.create({
      userId: req.user._id,
      title,
      body,
      isPublic,
      photo,
      classrooms: isPublic && classroomId ? [classroomId] : [], // Now adding the classroomId to an array if isPublic is true
    });

    console.log("New Entry:", newEntry); // Log created entry
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error creating entry:", error);
    next(error);
  }
};

const updateReflectionEntry = async (req, res, next) => {
  const { title, body, isPublic } = req.body;
  try {
    const entry = await ReflectionEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, body, isPublic },
      { new: true }
    );
    if (!entry) {
      return next(new CreateError("Entry not found or permission denied", 404));
    }
    res.json(entry);
  } catch (error) {
    next(new CreateError("Failed to update entry", 500));
  }
};

const deleteReflectionEntry = async (req, res, next) => {
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
};

module.exports = {
  getAllReflectionEntries,
  getAllPublicReflectionEntries,
  getReflectionsByClassroom,
  getReflectionById,
  createReflectionEntry,
  updateReflectionEntry,
  deleteReflectionEntry,
};
