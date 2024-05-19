const UserAchievement = require("../models/achievementSchema");
const User = require("../models/userSchema");
const achievementsConfig = require("./achievementsConfig");

const handleAchievementCreation = async (userId, count) => {
  (`Checking achievements for user ${userId} with count ${count}`);

  for (const achievement of achievementsConfig) {
    if (count === achievement.count) {
      const existingAchievement = await UserAchievement.findOne({
        userId,
        name: achievement.name,
      });

      if (!existingAchievement) {
        (
          `Creating "${achievement.name}" achievement for user ${userId}`
        );
        const user = await User.findById(userId);
        const newAchievement = new UserAchievement({
          userId,
          userName: user.name,
          name: achievement.name,
          description: achievement.description,
          unlockCriteria: achievement.unlockCriteria,
          image: achievement.image,
        });
        await newAchievement.save();
        (
          `"${achievement.name}" achievement created for user ${userId}`
        );
      } else {
        (
          `User ${userId} already has the "${achievement.name}" achievement.`
        );
      }
    }
  }

  // Check if the user has unlocked all the above achievements
  const requiredAchievements = achievementsConfig.map((a) => a.name);
  const userAchievements = await UserAchievement.find({ userId });
  const userAchievementNames = userAchievements.map((a) => a.name);

  const hasAllAchievements = requiredAchievements.every((name) =>
    userAchievementNames.includes(name)
  );
  const existingAllAchievements = await UserAchievement.findOne({
    userId,
    name: "Achievement Master",
  });

  if (hasAllAchievements && !existingAllAchievements) {
    const user = await User.findById(userId);
    const masterAchievement = new UserAchievement({
      userId,
      userName: user.name,
      name: "Achievement Master",
      description: "Congratulations on unlocking all achievements!",
      unlockCriteria: "Unlock all other achievements.",
      image: `${process.env.BASE_URL}/uploads/achievements/achievement_master_award.jpg`,
    });
    await masterAchievement.save();
    (`"Achievement Master" achievement created for user ${userId}`);
  } else if (hasAllAchievements) {
    (
      `User ${userId} already has the "Achievement Master" achievement.`
    );
  } else {
    (`User ${userId} does not have all achievements yet.`);
  }
};

module.exports = handleAchievementCreation;
