const baseUrl = "http://localhost:8093";

const achievementsConfig = [
  {
    name: "First Reflection",
    description: "Congratulations on creating your first reflection!",
    unlockCriteria: "Write your first reflection.",
    image: `${baseUrl}/uploads/achievements/first_reflection_award.png`,
    count: 1,
  },
  {
    name: "Reflection Enthusiast",
    description: "Congratulations on creating three reflections!",
    unlockCriteria: "Write three reflections.",
    image: `${baseUrl}/uploads/achievements/reflection_enthusiast_award.jpg`,
    count: 3,
  },
  {
    name: "Reflection Aficionado",
    description: "Congratulations on creating five reflections!",
    unlockCriteria: "Write five reflections.",
    image: `${baseUrl}/uploads/achievements/reflection_aficionado_award.png`,
    count: 5,
  },
  {
    name: "Reflection Expert",
    description: "Congratulations on creating eight reflections!",
    unlockCriteria: "Write eight reflections.",
    image: `${baseUrl}/uploads/achievements/reflection_expert_award.png`,
    count: 8,
  },
  {
    name: "Reflection Master",
    description: "Congratulations on creating ten reflections!",
    unlockCriteria: "Write ten reflections.",
    image: `${baseUrl}/uploads/achievements/reflection_master_award.png`,
    count: 10,
  },
  {
    name: "Achievement Master",
    description: "Congratulations on unlocking all achievements!",
    unlockCriteria: "Unlock all other achievements.",
    image: `${baseUrl}/uploads/achievements/achievement_master_award.png`,
  },
];

module.exports = achievementsConfig;
