const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();
const {
  createResource,
  getAllResources,
} = require("../controllers/resourceController");

router.post("/", verifyToken, createResource);
router.get("/", verifyToken, getAllResources);

module.exports = router;
