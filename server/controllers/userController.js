const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const createError = require("../utils/createError");
const { hashPassword, comparePassword } = require("../utils/password");
const validator = require("validator");
const bcrypt = require("bcrypt");

// Register user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (name.length > 50) {
      return res
        .status(400)
        .json({ error: "Name cannot exceed 50 characters" });
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

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
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
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Update user
const updateUser = async (req, res) => {
  // Assuming userId is correctly attached to req object via middleware
  const userId = req.user._id;
  const { name, password } = req.body;

  // Initialize the update object with any new data provided
  const updateData = { name }; // Directly set the name if it's part of the request

  try {
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash new password if provided
      updateData.password = hashedPassword; // Add hashed password to update data
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: "-password" } // Ensure new data is returned without the password
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." }); // User not found
    }

    res.json({ status: "success", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Failed to update user.", error: error.message });
  }
};

const fetchStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "name email photo"
    );
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

// Update student details
const updateStudentDetails = async (req, res) => {
  const { id } = req.params; // Assume you pass the student ID as URL parameter
  const { name, email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (name && name.length > 50) {
    return res.status(400).json({ error: "Name cannot exceed 50 characters." });
  }

  try {
    // Check if the email is taken by another user
    const emailExists = await User.findOne({ _id: { $ne: id }, email: email });
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "Email already in use by another account." });
    }

    const updatedStudent = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, select: "-password" } // Do not return the password field
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json({ status: "success", user: updatedStudent });
  } catch (error) {
    console.error("Failed to update student:", error);
    res.status(500).json({ error: "Failed to update student details." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  fetchStudents,
  updateUser,
  updateStudentDetails,
};
