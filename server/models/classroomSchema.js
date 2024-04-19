const mongoose = require("mongoose");
const { Schema } = mongoose;

const classroomSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    learningGoals: { type: String, required: true },
    classCode: { type: String, required: true, unique: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classroom", classroomSchema);
