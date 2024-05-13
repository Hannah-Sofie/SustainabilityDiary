const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();
const {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

router.post("/", verifyToken, createResource);
router.get("/", verifyToken, getAllResources);
router.put("/:id", verifyToken, updateResource);
router.delete("/:id", verifyToken, deleteResource);

module.exports = router;
