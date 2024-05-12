const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken");
const multer = require("multer");
const path = require("path");
const {
  createClassroom,
  joinClassroom,
  favouriteClassroom,
  getClassrooms,
  getClassroomById,
  removeStudent,
  updateClassroom,
} = require("../controllers/classroomController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/classrooms'));
  },
  filename: function (req, file, cb) {
    // Use a unique identifier for the file name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/create", verifyToken, upload.single("photo"), createClassroom);
router.post("/join", verifyToken, joinClassroom);
router.post("/fave", verifyToken, favouriteClassroom);
router.get("/", verifyToken, getClassrooms);
router.get("/:id", verifyToken, getClassroomById);
router.delete("/:classroomId/students/:studentId", verifyToken, removeStudent);
router.put("/:id", verifyToken, upload.single("photo"), updateClassroom);

module.exports = router;
