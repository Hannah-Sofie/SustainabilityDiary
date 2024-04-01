const express = require("express");
const router = express.Router();
const {
  getAllReflectionEntries,
  createReflectionEntry,
  updateReflectionEntry,
  deleteReflectionEntry,
} = require("../controllers/reflectionEntryController");
const { verifyToken } = require("../utils/verifyToken");

router.get("/", verifyToken, getAllReflectionEntries);
router.post("/create", verifyToken, createReflectionEntry);
router.put("/:id", verifyToken, updateReflectionEntry);
router.delete("/:id", verifyToken, deleteReflectionEntry);

module.exports = router;
