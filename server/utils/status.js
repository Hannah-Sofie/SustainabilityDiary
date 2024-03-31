const User = require("../models/userSchema");

// status endpoint to check user's authentication status
const status = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password from the result
    if (!user) {
      return res
        .status(404)
        .json({ isAuthenticated: false, message: "User not found." });
    }

    // Respond with the user's authentication status and optionally, user information
    res.json({ isAuthenticated: true, user });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: "There was a problem checking the user's authentication status.",
    });
  }
};

module.exports = {
  status,
};
