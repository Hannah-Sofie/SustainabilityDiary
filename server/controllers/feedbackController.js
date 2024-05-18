const Feedback = require("../models/feedbackSchema");
const ReflectionEntry = require("../models/reflectionEntrySchema");
const CreateError = require("../utils/createError");
const asyncHandler = require("express-async-handler");

const getFeedbackByReflectionId = asyncHandler(async (req, res, next) => {
  try {
    const feedback = await Feedback.find({
      reflectionId: req.params.reflectionId,
    });
    if (!feedback) {
      return next(new CreateError("Feedback not found", 404));
    }
    res.status(200).json(feedback);
  } catch (err) {
    next(new CreateError(err.message, 500));
  }
});

const giveFeedback = asyncHandler(async (req, res, next) => {
  const { reflectionId, content } = req.body;
  const userId = req.user._id;
  const userName = req.user.name;

  if (!reflectionId || !content) {
    return next(new CreateError("Reflection ID and content are required", 400));
  }

  try {
    const reflection = await ReflectionEntry.findById(reflectionId);

    if (!reflection) {
      return next(new CreateError("Reflection not found", 404));
    }

    const feedback = new Feedback({
      reflectionId,
      writer: userId,
      writerName: userName,
      content,
      studentId: reflection.userId,
    });

    await feedback.save();

    reflection.feedbackGiven = true; // Update feedbackGiven field
    await reflection.save();

    res.status(201).json({ feedback });
  } catch (error) {
    console.error("Failed to give feedback:", error);
    next(new CreateError("Failed to give feedback", 500));
  }
});

const getAllRequestedFeedbackEntries = asyncHandler(async (req, res, next) => {
  try {
    const entries = await ReflectionEntry.find({ requestFeedback: true })
      .populate("userId", "name")
      .select("title body photo feedbackGiven userId");
    res.json(entries);
  } catch (error) {
    next(new CreateError("Failed to fetch entries requesting feedback", 500));
  }
});

const getStudentRequestedFeedbackReflections = asyncHandler(
  async (req, res, next) => {
    try {
      const reflections = await ReflectionEntry.find({
        userId: req.user._id,
        requestFeedback: true,
      })
        .populate("userId", "name")
        .select("title body photo feedbackGiven userId");
      res.json(reflections);
    } catch (error) {
      next(new CreateError("Failed to fetch reflections", 500));
    }
  }
);

module.exports = {
  getAllRequestedFeedbackEntries,
  getFeedbackByReflectionId,
  giveFeedback,
  getStudentRequestedFeedbackReflections,
};
