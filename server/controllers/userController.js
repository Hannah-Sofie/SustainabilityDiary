const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const createError = require("../utils/appError");
const { hashPassword, comparePassword } = require("../utils/password");
const validator = require("validator");
// const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");

// Register user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const isNtnuEmail =
      email.endsWith("@stud.ntnu.no") || email.endsWith("@ntnu.no");
    if (!validator.isEmail(email) || !isNtnuEmail) {
      return res
        .status(400)
        .json({ error: "Please use a valid NTNU email address." });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        error:
          "Password must be stronger. At least 6 characters, including a number, a symbol, and mixed case letters.",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return next(new createError("Email already exists", 400));
    }

    // Determine role based on email domain
    const role = email.endsWith("@stud.ntnu.no") ? "student" : "teacher";

    const hashedPassword = await hashPassword(password);

    // Include role in the newUser creation
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // Set the role here
    });

    // Don't send password hash back
    const userForResponse = { ...newUser._doc };
    delete userForResponse.password;

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: userForResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email) || !password) {
      return next(new createError("Invalid email or password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await comparePassword(password, user.password))) {
      return next(new createError("Invalid email or password", 401));
    }

    // Assign JWT token and set as HTTP-only cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
      sameSite: "Strict", // CSRF protection
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 24 * 60 * 60 * 1000
      ),
    });

    // Prepare user object for response, excluding password
    const userForResponse = { ...user.toObject() };
    delete userForResponse.password;

    // Note: The token is not sent back in the body of the response
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user: userForResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logoutUser = (req, res) => {
  // Clear the HTTP-only cookie by setting its expiry to the past
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", // match the settings from set
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// const forgotPassword = async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   // Generate a 4-digit code
//   const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

//   // Optionally hash the reset code for storage
//   const hashedResetCode = crypto
//     .createHash("sha256")
//     .update(resetCode)
//     .digest("hex");

//   user.passwordResetCode = hashedResetCode;
//   user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//   await user.save();

//   const message = `Your password reset code is: ${resetCode}\nThis code is valid for 10 minutes.`;

//   try {
//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset Code",
//       text: message,
//     });

//     res.json({ message: "Password reset code sent to your email." });
//   } catch (error) {
//     console.error(error);
//     user.passwordResetCode = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();

//     res.status(500).json({ error: "Error sending password reset code" });
//   }
// };

// const resetPassword = async (req, res, next) => {
//   const { email, code, newPassword } = req.body;
//   const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

//   const user = await User.findOne({
//     email,
//     passwordResetCode: hashedCode,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     return res.status(400).json({ error: "Invalid or expired reset code" });
//   }

//   user.password = await bcrypt.hash(newPassword, 12); // or use your hashPassword function
//   user.passwordResetCode = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   res.json({ message: "Password has been reset successfully." });
// };

const fetchStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  fetchStudents,
  // forgotPassword,
  // resetPassword,
};
