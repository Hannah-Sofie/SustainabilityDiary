const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { hashPassword, comparePassword } = require("../utils/password");
const validator = require("validator");
const bcrypt = require("bcrypt");

// Register user
const registerUser = async (User, req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return next(new createError("All fields are required", 400));
    }

    // Check if the email is a valid NTNU email address
    const isNtnuEmail = email.endsWith("@stud.ntnu.no") || email.endsWith("@ntnu.no");
    if (!validator.isEmail(email) || !isNtnuEmail) {
      return next(new createError("Please use a valid NTNU email address.", 400));
    }

    // Check if the password meets the strength requirements
    if (!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
      return next(new createError(
        "Password must be stronger. At least 6 characters, including a number, a symbol, and mixed case letters.",
        400
      ));
    }

    // Check if the email already exists in the database
    const exist = await User.findOne({ email });
    if (exist) {
      return next(new createError("Email already exists", 400));
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: email.endsWith("@stud.ntnu.no") ? "student" : "teacher"
    });

    // Send a success response with the created user data
    res.status(201).json(newUser);
  } catch (error) {
    // Handle any errors that occur during the registration process
    next(error);
  }
};


// Login user
const loginUser = async (User, req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new createError("Invalid email or password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await comparePassword(password, user.password))) {
      return next(new createError("Invalid email or password", 401));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(
        Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 24 * 60 * 60 * 1000
      ),
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Logout user
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Update user
const updateUser = async (User, req, res) => {
  try {
    const { userId, body: { name, password } } = req;
    const updateData = { name };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ status: "success", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update user.", error: error.message });
  }
};

const fetchStudents = async (User, req, res) => {
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
  updateUser,
};
