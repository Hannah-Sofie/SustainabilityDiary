const CreateError = require("../utils/createError");
const Classroom = require("../models/classroomSchema");

const createClassroom = async (req, res, next) => {
  try {
    const { title, description, learningGoals } = req.body;
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const photoUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/classrooms${
          req.file.filename
        }`
      : undefined;

    const classroom = await Classroom.create({
      title,
      description,
      learningGoals,
      classCode,
      photoUrl,
      teacher: req.user._id,
    });

    res.status(201).json(classroom);
  } catch (error) {
    next(error);
  }
};

const joinClassroom = async (req, res, next) => {
  const { classCode } = req.body;
  const userId = req.user._id; // Assuming user's ID is attached to the request via middleware

  try {
    const classroom = await Classroom.findOneAndUpdate(
      { classCode },
      { $addToSet: { students: userId } }, // Use $addToSet to avoid duplicates
      { new: true }
    ).populate("students");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json(classroom);
  } catch (error) {
    next(error);
  }
};

const getClassrooms = async (req, res, next) => {
  try {
    // Fetch classrooms where the current user is either the teacher or listed as a student
    const classrooms = await Classroom.find({
      $or: [{ teacher: req.user._id }, { students: req.user._id }],
    }).populate("students");
    res.json(classrooms);
  } catch (error) {
    next(new CreateError("Failed to get classrooms", 500));
  }
};

const getClassroomById = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate(
      "students"
    );
    if (!classroom) {
      return next(new CreateError("Classroom not found", 404));
    }
    res.json(classroom);
  } catch (error) {
    next(new CreateError("Failed to get classroom details", 500));
  }
};

const removeStudent = async (req, res) => {
  const { classroomId, studentId } = req.params; // Make sure these match the route parameters

  try {
    const classroom = await Classroom.findByIdAndUpdate(
      classroomId,
      { $pull: { students: studentId } },
      { new: true }
    ).populate("students");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json(classroom);
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Failed to remove student" });
  }
};

module.exports = {
  createClassroom,
  joinClassroom,
  getClassrooms,
  getClassroomById,
  removeStudent,
};
