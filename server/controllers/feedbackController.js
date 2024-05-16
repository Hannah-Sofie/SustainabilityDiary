const Feedback = require('../models/feedbackSchema');

exports.getFeedbackByReflectionId = async (req, res) => {
  try {
    const feedback = await Feedback.find({ reflectionId: req.params.reflectionId });
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeedbackByWriterId = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ writer: req.params.writerId });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeedbackByStudentId = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.params.studentId });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFeedback = async (req, res) => {
  const feedback = new Feedback({
    reflectionId: req.body.reflectionId,
    writer: req.body.writer,
    writerName: req.body.writerName,
    content: req.body.content,
    studentId: req.body.studentId  
  });

  try {
    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const result = await Feedback.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'No feedback with this id found' });
    } else {
      res.status(200).json({ message: 'Feedback deleted' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};