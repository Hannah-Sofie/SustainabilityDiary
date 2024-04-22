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

const getReflectionsByClassroom = async (req, res) => {
  try {
    const reflections = await ReflectionEntry.find({
      isPublic: true,
      classrooms: { $in: [req.params.classroomId] },
    }).populate("userId", "name");

    res.json(reflections);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch reflections for the classroom",
      error: error.message,
    });
  }
};

const createReflectionEntry = async (req, res, next) => {
  const { title, body, isPublic, classroomIds } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const newEntry = await ReflectionEntry.create({
      userId: req.user._id,
      title,
      body,
      isPublic,
      photo,
      classrooms: isPublic ? classroomIds : [],
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error creating entry:", error);
    next(new CreateError("Error creating entry", 500));
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
  createReflectionEntry,
  updateReflectionEntry,
  deleteReflectionEntry,
};
