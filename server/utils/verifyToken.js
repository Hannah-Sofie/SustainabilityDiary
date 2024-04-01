const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    return res
      .status(403)
      .json({ isAuthenticated: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Unauthorized!" });
  }
};

module.exports = {
  verifyToken,
};
