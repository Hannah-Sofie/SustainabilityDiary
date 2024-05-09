const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  reflectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reflection',
    required: true
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);