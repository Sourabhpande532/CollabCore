const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  owners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkasanaSignupUser",
      required: true,
    },
  ],
  tags: [{ type: String }],
  timeToComplete: { type: Number, required: true }, //Num of days to complete task
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed", "Blocked"],
    default: "To Do",
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto Update the updatedAt fields
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Task", taskSchema);
