const express = require("express");
const router = express.Router();
const FactResponse = require("../models/factResponseSchema");

// Post a response to a fact
router.post("/stats", async (req, res) => {
  const { factIndex, didKnow } = req.body;
  try {
    const update = didKnow
      ? { $inc: { knew: 1 } }
      : { $inc: { didNotKnow: 1 } };
    const factResponse = await FactResponse.findOneAndUpdate(
      { factIndex },
      update,
      { new: true, upsert: true }
    );
    res.json(factResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating fact response", error: error.message });
  }
});

// Get statistics for all facts
router.get("/stats", async (req, res) => {
  try {
    const allStats = await FactResponse.find({});
    res.json(allStats);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving fact statistics",
        error: error.message,
      });
  }
});

module.exports = router;
