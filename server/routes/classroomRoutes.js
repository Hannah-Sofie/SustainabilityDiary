const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken");
const { isTeacher } = require("../utils/isTeacher");
const multer = require("multer");
const {
  createClassroom,
  joinClassroom,
  getClassrooms,
  getClassroomById,
  removeStudent,
} = require("../controllers/classroomController");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/classrooms/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/create", upload.single("photo"), verifyToken, createClassroom);
router.post("/join", verifyToken, joinClassroom);
router.get("/", verifyToken, getClassrooms);
router.get("/:id", verifyToken, getClassroomById);
router.delete(
  "/:classroomId/students/:studentId",
  verifyToken,
  isTeacher,
  removeStudent
);

module.exports = router;
