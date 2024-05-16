const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');

// Get feedback based on reflection id
router.get('/:reflectionId', FeedbackController.getFeedbackByReflectionId);

// Get feedback based on writer id
router.get('/writer/:writerId', FeedbackController.getFeedbackByWriterId);

// Get feedback based on student id
router.get('/student/:studentId', FeedbackController.getFeedbackByStudentId);

// Post new feedback
router.post('/', FeedbackController.createFeedback);

// Delete feedback
router.delete('/:id', FeedbackController.deleteFeedback);

module.exports = router;