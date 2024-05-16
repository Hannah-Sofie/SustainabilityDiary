const mongoose = require("mongoose");

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    unlockCriteria: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: `${process.env.BASE_URL}/uploads/achievements/default_award.png`,
    },
    achievedAt: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      default: "reflection",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

userAchievementSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("UserAchievement", userAchievementSchema);
