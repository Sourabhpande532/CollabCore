const express = require("express");
const app = express.Router();
const {
  obtainedTask,
  createTask,
  updateTask,
  getTaskByTeam,
  getTaskById,
  deleteTask,
  updateTaskStatus,
  getFilterTask,
} = require("../controller/taskController");
const auth = require("../middleware/auth");

app.get("/", obtainedTask);
app.post("/", auth, createTask);
app.post("/:id", auth, updateTask);
app.get("/team/:id", getTaskByTeam);
app.get("/filter", getFilterTask);
app.get("/:id", getTaskById);
app.put("/:id/status", auth, updateTaskStatus);
app.delete("/:id", auth, deleteTask);

module.exports = app;
