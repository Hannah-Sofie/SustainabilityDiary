const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');

// Get feedback based on reflection id
router.get('/:reflectionId', FeedbackController.getFeedbackByReflectionId);

// Post new feedback
router.post('/', FeedbackController.createFeedback);

// Delete feedback
router.delete('/:id', FeedbackController.deleteFeedback);

module.exports = router;