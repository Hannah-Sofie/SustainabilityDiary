const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const CreateError = require("../utils/createError");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new CreateError("Access Denied / Unauthorized request", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new CreateError("User not found", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new CreateError("Invalid Token", 400));
  }
};

module.exports = { verifyToken };
