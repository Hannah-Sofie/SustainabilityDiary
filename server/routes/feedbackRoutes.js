const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken");

const {
    getAllRequestedFeedbackEntries,
  getFeedbackByReflectionId,
  giveFeedback,
  getStudentRequestedFeedbackReflections,
} = require("../controllers/feedbackController");

router.get("/requested-feedback", verifyToken, getAllRequestedFeedbackEntries);
router.get("/reflection/:reflectionId", verifyToken, getFeedbackByReflectionId);
router.post("/give-feedback", verifyToken, giveFeedback);
router.get(
  "/student-requested-feedback",
  verifyToken,
  getStudentRequestedFeedbackReflections
);

module.exports = router;
