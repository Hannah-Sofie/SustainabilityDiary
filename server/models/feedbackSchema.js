const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  reflectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reflection",
    required: true,
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  writerName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
