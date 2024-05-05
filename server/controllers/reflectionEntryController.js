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

const getLatestReflection = async (req, res, next) => {
  try {
    const latestReflection = await ReflectionEntry.findOne({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    if (!latestReflection) {
      return res.status(404).json({ message: "No reflections found" });
    }
    res.json(latestReflection);
  } catch (error) {
    next(new CreateError("Failed to fetch the latest reflection", 500));
  }
};

const createReflectionEntry = async (req, res, next) => {
  const { title, body, isPublic, classroomId } = req.body; // Changed to classroomId
  const photo = req.file ? req.file.filename : null;

  if (title.length === 0 || body.length === 0 || !title || !body) {
    return next(new CreateError("Title and body are required", 400));
  }

  if (title.length > 20) {
    return next(new CreateError("Title is too long", 400));
  }

  if (body.length > 200) {
    return next(new CreateError("Body is too long", 400));
  }

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
  if (title.length === 0 || body.length === 0 || !title || !body) {
    return next(new CreateError("Title and body are required", 400));
  }
  if (title.length > 20) {
    return next(new CreateError("Title is too long", 400));
  }
  if (body.length > 200) {
    return next(new CreateError("Body is too long", 400));
  }
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

const likeReflectionEntry = async (req, res) => {
  try {
    const reflection = await ReflectionEntry.findById(req.params.id);
    if (!reflection) {
      return res.status(404).json({ message: "Reflection not found" });
    }

    const index = reflection.likedBy.indexOf(req.user._id);
    if (index === -1) {
      // Like the reflection
      reflection.likes += 1;
      reflection.likedBy.push(req.user._id);
    } else {
      // Unlike the reflection
      reflection.likes -= 1;
      reflection.likedBy.splice(index, 1);
    }
    await reflection.save();

    res.json({ likes: reflection.likes, likedBy: reflection.likedBy });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update likes", error: error.message });
  }
};

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
