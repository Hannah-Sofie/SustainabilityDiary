const express = require("express");
const router = express.Router();
const User = require('../models/userSchema'); 

const {
  registerUser,
  loginUser,
  logoutUser,
  fetchStudents,
  updateUser,
} = require("../controllers/userController");

const { verifyToken } = require("../utils/verifyToken");
const { status } = require("../utils/status");

// Define your routes
router.post("/register", (req, res, next) => {
  console.log("register called");
  registerUser(User, req, res, next); 
});

router.post("/login", (req, res, next) => loginUser(User, req, res, next));  
router.post("/logout", logoutUser);
router.get("/status", verifyToken, status);
router.get("/students", verifyToken, (req, res) => fetchStudents(User, req, res));  
router.put("/update", verifyToken, (req, res) => updateUser(User, req, res));  

module.exports = router;
