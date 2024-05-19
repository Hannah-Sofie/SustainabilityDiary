const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const CreateError = require("../utils/createError");

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    if (!token) {
      // If no token, send an unauthorized error
      return next(new CreateError("Access Denied / Unauthorized request", 401));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded token ID
    const user = await User.findById(decoded.id);
    if (!user) {
      // If user not found, send a not found error
      return next(new CreateError("User not found", 404));
    }

    // Attach user to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      return next(new CreateError("Token expired", 401));
    }
    return next(new CreateError("Invalid Token", 400));
  }
};

module.exports = { verifyToken };
