// routes/reflectionRoutes.js
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
    cb(null, path.join(__dirname, "../uploads/reflections"));
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, "-");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${date}-${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", verifyToken, getAllReflectionEntries);
router.get("/public", getAllPublicReflectionEntries);
router.get(
  "/classroom/:classroomId/public",
  verifyToken,
  getReflectionsByClassroom
);
router.get("/latest", verifyToken, getLatestReflection);
router.get("/:id", verifyToken, getReflectionById);
router.post(
  "/create",
  verifyToken,
  upload.single("photo"),
  validateReflection,
  createReflectionEntry
);
router.put("/:id", verifyToken, validateReflection, updateReflectionEntry);
router.delete("/:id", verifyToken, deleteReflectionEntry);
router.post("/:id/like", verifyToken, likeReflectionEntry);

module.exports = router;
