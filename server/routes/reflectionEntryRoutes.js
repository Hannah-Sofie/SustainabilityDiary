const express = require("express");
const router = express.Router();
const multer = require("multer");

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Ensure this directory exists and is writable
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, "-");
    cb(null, date + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit
  },
  fileFilter: fileFilter,
});

const {
  getAllReflectionEntries,
  getAllPublicReflectionEntries,
  getReflectionEntry,
  createReflectionEntry,
  updateReflectionEntry,
  deleteReflectionEntry,
} = require("../controllers/reflectionEntryController");
const { verifyToken } = require("../utils/verifyToken");

// Routes setup
router.get("/", verifyToken, getAllReflectionEntries);
router.get("/public", getAllPublicReflectionEntries);
router.get("/:id", verifyToken, getReflectionEntry);
router.post(
  "/create",
  verifyToken,
  upload.single("photo"),
  createReflectionEntry
);
router.put("/:id", verifyToken, updateReflectionEntry);
router.delete("/:id", verifyToken, deleteReflectionEntry);

module.exports = router;
