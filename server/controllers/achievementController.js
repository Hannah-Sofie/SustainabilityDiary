const UserAchievement = require("../models/achievementSchema");
const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const CreateError = require("../utils/createError");
const achievementsConfig = require("../utils/achievementsConfig");

// Get all achievements for the authenticated user
const getAllAchievements = asyncHandler(async (req, res, next) => {
  try {
    const userAchievements = await UserAchievement.find({ userId: req.user._id });
    const userAchievementNames = userAchievements.map((a) => a.name);

    const achievements = achievementsConfig.map((achievement) => ({
      ...achievement,
      unlocked: userAchievementNames.includes(achievement.name),
    }));

    res.json(achievements);
  } catch (error) {
    console.error("Error fetching all achievements:", error);
    next(new CreateError("Error fetching all achievements", 500));
  }
});

// Create a new achievement for a user
const createAchievement = asyncHandler(async (req, res, next) => {
  const { userId, name, description, image } = req.body;

  try {
    const existingAchievement = await UserAchievement.findOne({ userId, name });
    if (existingAchievement) {
      return next(new CreateError("Achievement already exists", 409));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new CreateError("User not found", 404));
    }

    const newAchievement = await UserAchievement.create({
      userId,
      userName: user.name,
      name,
      description,
      image: image || `${process.env.BASE_URL}/uploads/achievements/default_award.jpg`,
    });
    res.status(201).json(newAchievement);
  } catch (error) {
    next(new CreateError("Error creating achievement", 500));
  }
});

// Check achievements for the authenticated user
const checkAchievements = asyncHandler(async (req, res, next) => {
  try {
    const achievements = await UserAchievement.find({ userId: req.user._id });
    res.json(achievements);
  } catch (error) {
    next(new CreateError("Error fetching achievements", 500));
  }
});

// Opt-in to the leaderboard
const optInLeaderboard = asyncHandler(async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { isInLeaderboard: true },
      { new: true }
    );
    if (!updatedUser) {
      return next(new CreateError("User not found", 404));
    }
    res.json({
      message: "Successfully opted into leaderboard",
      isInLeaderboard: updatedUser.isInLeaderboard,
    });
  } catch (error) {
    next(new CreateError("Failed to opt-in to leaderboard", 500));
  }
});

// Opt-out of the leaderboard
const optOutLeaderboard = asyncHandler(async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { isInLeaderboard: false },
      { new: true }
    );
    if (!updatedUser) {
      return next(new CreateError("User not found", 404));
    }
    res.json({
      message: "Successfully opted out of leaderboard",
      isInLeaderboard: updatedUser.isInLeaderboard,
    });
  } catch (error) {
    next(new CreateError("Failed to opt-out of leaderboard", 500));
  }
});

// Get opt-in status for the authenticated user
const getOptInStatus = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("isInLeaderboard");
    if (!user) {
      return next(new CreateError("User not found", 404));
    }
    res.json({ isInLeaderboard: user.isInLeaderboard });
  } catch (error) {
    next(new CreateError("Error fetching opt-in status", 500));
  }
});

// Get the leaderboard with users' achievements count
const getLeaderboard = asyncHandler(async (req, res, next) => {
  try {
    const leaderboard = await User.aggregate([
      { $match: { isInLeaderboard: true } },
      {
        $lookup: {
          from: "userachievements",
          localField: "_id",
          foreignField: "userId",
          as: "achievements",
        },
      },
      {
        $project: {
          username: "$name",
          achievementCount: { $size: "$achievements" },
        },
      },
      { $sort: { achievementCount: -1 } },
    ]);
    res.json(leaderboard);
  } catch (error) {
    next(new CreateError("Error fetching leaderboard", 500));
  }
});

module.exports = {
  getAllAchievements,
  createAchievement,
  checkAchievements,
  getLeaderboard,
  optInLeaderboard,
  optOutLeaderboard,
  getOptInStatus,
};
