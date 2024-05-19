const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const validateReflection = require("../middlewares/validateReflection");
const {
  getAllReflectionEntries,
  getAllPublicReflectionEntries,
  getReflectionsByClassroom,
  getReflectionById,
  getLatestReflection,
  createReflectionEntry,
  updateReflectionEntry,
  deleteReflectionEntry,
  likeReflectionEntry,
} = require("../controllers/reflectionEntryController");
const { verifyToken } = require("../utils/verifyToken");

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination for uploaded files
    cb(null, path.join(__dirname, "../uploads/reflections"));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const date = new Date().toISOString().replace(/:/g, "-");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${date}-${uniqueSuffix}-${file.originalname}`);
  },
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: fileFilter,
});

// Routes
router.get("/", verifyToken, getAllReflectionEntries); // Get all reflection entries for the authenticated user
router.get("/public", getAllPublicReflectionEntries); // Get all public reflection entries
router.get(
  "/classroom/:classroomId/public",
  verifyToken,
  getReflectionsByClassroom
); // Get public reflections for a specific classroom
router.get("/latest", verifyToken, getLatestReflection); // Get the latest reflection for the authenticated user
router.get("/:id", verifyToken, getReflectionById); // Get a specific reflection by ID

// Create a new reflection entry with optional photo upload and validation
router.post(
  "/create",
  verifyToken,
  upload.single("photo"),
  validateReflection,
  createReflectionEntry
);

// Update an existing reflection entry with optional photo upload and validation
router.put(
  "/:id",
  verifyToken,
  upload.single("photo"),
  validateReflection,
  updateReflectionEntry
);

router.delete("/:id", verifyToken, deleteReflectionEntry); // Delete a reflection entry by ID
router.post("/:id/like", verifyToken, likeReflectionEntry); // Like or unlike a reflection entry

module.exports = router;
