const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  registerUser,
  loginUser,
  logoutUser,
  fetchStudents,
  updateUser,
  updateStudentDetails,
  requestResetCode,
  verifyPasswordResetToken,
  resetPassword
} = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyToken");
const { status } = require("../utils/status");
const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/profilepics"));
  },
  filename: (req, file, cb) => {
    // Store just the timestamp and filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filtering function (e.g., accept only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image file!"), false);
  }
};

// Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter,
});

// Define your routes
router.post("/register", (req, res, next) => {
  console.log("register called");
  registerUser(req, res, next);
});
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/status", verifyToken, status);
router.get("/students", verifyToken, fetchStudents);
router.put("/students/:id", verifyToken, updateStudentDetails);
router.put("/update", verifyToken, upload.single("photo"), updateUser);
router.post('/request-reset-code', requestResetCode);
router.post('/reset-password', resetPassword);
router.get('/verify-token/:token', verifyPasswordResetToken);

module.exports = router;
