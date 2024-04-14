const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  fetchStudents,
  updateUser,
} = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyToken");
const { status } = require("../utils/status");
const router = express.Router();

// Define your routes
router.post("/register", (req, res, next) => {
  console.log("register called");
  registerUser(req, res, next);
});
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/status", verifyToken, status);
router.get("/students", verifyToken, fetchStudents);
router.put("/update", verifyToken, updateUser);

module.exports = router;
