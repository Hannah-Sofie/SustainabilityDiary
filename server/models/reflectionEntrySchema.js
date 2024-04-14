const mongoose = require("mongoose");
const { Schema } = mongoose;

const reflectionEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isPublic: {
      type: Boolean,
      default: false,
    },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReflectionEntry", reflectionEntrySchema);
