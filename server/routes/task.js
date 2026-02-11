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
} = require("../controller/taskController");
const auth = require("../middleware/auth");

app.get("/", auth, obtainedTask);
app.post("/", auth, createTask);
app.post("/:id", auth, updateTask);
app.get("/team/:id", auth, getTaskByTeam);
app.get("/:id", auth, getTaskById);
app.put("/:id/status", auth, updateTaskStatus);
app.delete("/:id", auth, deleteTask);

module.exports = app;
