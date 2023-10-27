const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide a title for the task"],
    },
    description: {
      type: String,
      required: [true, "please provide a description for the task"],
    },
    status: {
      type: String,
      enum: ["todo", "progress", "completed"],
      default: "todo",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
