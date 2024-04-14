const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your full name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    lowercase: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  role: {
    type: String,
    required: true,
  },
  passwordResetCode: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", function (next) {
  this.role = this.email.endsWith("@stud.ntnu.no") ? "student" : "teacher";
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
