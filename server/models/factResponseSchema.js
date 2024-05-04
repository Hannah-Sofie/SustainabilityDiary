const mongoose = require("mongoose");

const FactResponseSchema = new mongoose.Schema({
  factIndex: { type: Number, required: true },
  knew: { type: Number, default: 0 },
  didNotKnow: { type: Number, default: 0 },
});

module.exports = mongoose.model("FactResponse", FactResponseSchema);
