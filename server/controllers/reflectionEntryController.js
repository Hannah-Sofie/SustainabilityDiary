const ReflectionEntry = require("../models/reflectionEntrySchema");
const createError = require("../utils/appError");

// Get all reflection entries from one ID
const getAllReflectionEntries = async (req, res, next) => {
  try {
    const entries = await ReflectionEntry.find({ userId: req.userId });
    res.json(entries);
  } catch (error) {
    next(createError("Failed to fetch entries", 500));
  }
};

// Create a new reflection entry
const createReflectionEntry = async (req, res, next) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return next(createError("Title and body are required", 400));
  }

  try {
    const newEntry = await ReflectionEntry.create({
      userId: req.userId,
      title,
      body,
    });
    res.status(201).json(newEntry);
  } catch (error) {
    next(createError("Failed to create entry", 500));
  }
};

// Update a reflection entry
const updateReflectionEntry = async (req, res, next) => {
  try {
    const entry = await ReflectionEntry.findOneAndUpdate({
      _id: req.params.id,
      userId: req.userId,
    }, req.body, { new: true });

    if (!entry) {
      return next(createError("Entry not found or permission denied", 404));
    }

    res.json(entry);
  } catch (error) {
    next(createError("Failed to update entry", 500));
  }
};

// Delete a reflection entry
const deleteReflectionEntry = async (req, res, next) => {
  try {
    const entry = await ReflectionEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!entry) {
      return next(createError("Entry not found or permission denied", 404));
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    next(createError("Failed to delete entry", 500));
  }
};

module.exports = {
  getAllReflectionEntries,
  createReflectionEntry,
  updateReflectionEntry,
  deleteReflectionEntry,
};
