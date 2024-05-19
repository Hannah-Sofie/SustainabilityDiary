const CreateError = require("../utils/createError");
const Classroom = require("../models/classroomSchema");
const asyncHandler = require("express-async-handler");

const defaultHeaderUrl = `/uploads/default/default-header.jpeg`;

// Create a new classroom
const createClassroom = asyncHandler(async (req, res) => {
  const { title, description, learningGoals } = req.body;
  if (!title || !description || !learningGoals) {
    throw new CreateError("Missing required fields", 400);
  }

  // Get the uploaded photo URL for the classroom icon
  const uploadedPhotoUrl = req.file ? `/uploads/classrooms/${req.file.filename}` : undefined;

  // Create the classroom with provided and default values
  const classroom = await Classroom.create({
    title,
    description,
    learningGoals,
    classCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    iconPhotoUrl: uploadedPhotoUrl,
    headerPhotoUrl: defaultHeaderUrl,
    teacher: req.user._id,
  });

  res.status(201).json(classroom);
});

// Join an existing classroom using class code
const joinClassroom = asyncHandler(async (req, res) => {
  const { classCode } = req.body;
  const classroom = await Classroom.findOneAndUpdate(
    { classCode },
    { $addToSet: { students: req.user._id } },
    { new: true }
  ).populate("students", "name email");
  if (!classroom) {
    throw new CreateError("Classroom not found", 404);
  }
  res.status(200).json(classroom);
});

// Add a classroom to user's favourites
const favouriteClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const classroom = await Classroom.findByIdAndUpdate(
    classroomId,
    { $addToSet: { favourites: req.user._id } },
    { new: true }
  ).populate("students", "name email");
  if (!classroom) {
    throw new CreateError("Classroom not found", 404);
  }
  res.status(200).json(classroom);
});

// Remove a classroom from user's favourites
const unFavouriteClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const classroom = await Classroom.findByIdAndUpdate(
    classroomId,
    { $pull: { favourites: req.user._id } },
    { new: true }
  ).populate("students", "name email");
  if (!classroom) {
    throw new CreateError("Classroom not found", 404);
  }
  res.status(200).json(classroom);
});

// Get all favourite classrooms of the authenticated user
const getFavouriteClassrooms = asyncHandler(async (req, res) => {
  const classrooms = await Classroom.find({ favourites: req.user._id }).populate("students", "name email");
  res.json(classrooms);
});

// Get all classrooms associated with the authenticated user (as teacher or student)
const getClassrooms = asyncHandler(async (req, res) => {
  const classrooms = await Classroom.find({
    $or: [{ teacher: req.user._id }, { students: req.user._id }],
  }).populate("students", "name email");
  res.json(classrooms);
});

// Get classroom details by ID
const getClassroomById = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id).populate({
    path: "students",
    select: "name email role",
  });
  if (!classroom) {
    throw new CreateError("Classroom not found", 404);
  }
  res.json(classroom);
});

// Remove a student from a classroom
const removeStudent = asyncHandler(async (req, res) => {
  const { classroomId, studentId } = req.params;
  const classroom = await Classroom.findByIdAndUpdate(
    classroomId,
    { $pull: { students: studentId } },
    { new: true }
  ).populate("students", "name email");
  if (!classroom) {
    throw new CreateError("Classroom not found", 404);
  }
  res.status(200).json(classroom);
});

// Update classroom details
const updateClassroom = asyncHandler(async (req, res) => {
  const { title, description, learningGoals, classStatus } = req.body;
  const { id } = req.params;

  const classroom = await Classroom.findById(id);
  if (!classroom) {
    throw new CreateError("Classroom not found", 404);
  }

  const activeStatus = classStatus === "true" || classStatus === true;

  const updatedFields = {
    title: title || classroom.title,
    description: description || classroom.description,
    learningGoals: learningGoals || classroom.learningGoals,
    classStatus: activeStatus,
    headerPhotoUrl: req.file ? `/uploads/classrooms/${req.file.filename}` : classroom.headerPhotoUrl,
  };

  const updatedClassroom = await Classroom.findByIdAndUpdate(id, updatedFields, { new: true });
  res.json(updatedClassroom);
});

module.exports = {
  createClassroom,
  joinClassroom,
  favouriteClassroom,
  unFavouriteClassroom,
  getFavouriteClassrooms,
  getClassrooms,
  getClassroomById,
  removeStudent,
  updateClassroom,
};
