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
  try {
    const { classCode } = req.body;
    const classroom = await Classroom.findOne({ classCode }).populate(
      "students"
    );
    if (!classroom) {
      return next(new CreateError("Classroom not found", 404));
    }
    classroom.students.push(req.user._id);
    await classroom.save();
    res.status(200).json(classroom);
  } catch (error) {
    next(new CreateError("Failed to join classroom", 500));
  }
};

const getClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.user._id });
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

module.exports = {
  createClassroom,
  joinClassroom,
  getClassrooms,
  getClassroomById,
};
