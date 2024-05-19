const UserAchievement = require("../models/achievementSchema");
const User = require("../models/userSchema");
const achievementsConfig = require("./achievementsConfig");

const handleAchievementCreation = async (userId, count) => {
  console.log(`Checking achievements for user ${userId} with count ${count}`);

  try {
    for (const achievement of achievementsConfig) {
      if (count === achievement.count) {
        const existingAchievement = await UserAchievement.findOne({
          userId,
          name: achievement.name,
        });

        if (!existingAchievement) {
          console.log(
            `Creating "${achievement.name}" achievement for user ${userId}`
          );
          const user = await User.findById(userId);
          if (!user) {
            console.error(`User ${userId} not found.`);
            continue;
          }
          const newAchievement = new UserAchievement({
            userId,
            userName: user.name,
            name: achievement.name,
            description: achievement.description,
            unlockCriteria: achievement.unlockCriteria,
            image: achievement.image,
          });
          await newAchievement.save();
          console.log(
            `"${achievement.name}" achievement created for user ${userId}`
          );
        } else {
          console.log(
            `User ${userId} already has the "${achievement.name}" achievement.`
          );
        }
      }
    }

    // Check if the user has unlocked all the above achievements
    const requiredAchievements = achievementsConfig
      .filter((achievement) => achievement.name !== "Achievement Master")
      .map((a) => a.name);
    const userAchievements = await UserAchievement.find({ userId });
    const userAchievementNames = userAchievements.map((a) => a.name);

    console.log(
      `User ${userId} has the following achievements: ${userAchievementNames.join(
        ", "
      )}`
    );
    console.log(
      `Required achievements to unlock "Achievement Master": ${requiredAchievements.join(
        ", "
      )}`
    );

    const hasAllAchievements = requiredAchievements.every((name) =>
      userAchievementNames.includes(name)
    );
    const existingAllAchievements = await UserAchievement.findOne({
      userId,
      name: "Achievement Master",
    });

    if (hasAllAchievements && !existingAllAchievements) {
      const user = await User.findById(userId);
      if (!user) {
        console.error(`User ${userId} not found.`);
        return;
      }
      const masterAchievement = new UserAchievement({
        userId,
        userName: user.name,
        name: "Achievement Master",
        description: "Congratulations on unlocking all achievements!",
        unlockCriteria: "Unlock all other achievements.",
        image: `${process.env.BASE_URL}/uploads/achievements/achievement_master_award.jpg`,
      });
      await masterAchievement.save();
      console.log(
        `"Achievement Master" achievement created for user ${userId}`
      );
    } else if (hasAllAchievements) {
      console.log(
        `User ${userId} already has the "Achievement Master" achievement.`
      );
    } else {
      console.log(`User ${userId} does not have all achievements yet.`);
    }
  } catch (error) {
    console.error(`Error processing achievements for user ${userId}:`, error);
  }
};

module.exports = handleAchievementCreation;
