const express = require("express");
const app = express.Router();
const taskCtrl = require("../controller/taskController");
const auth = require("../middleware/auth");

app.get("/", auth, taskCtrl.obtainedTask);
app.post("/", auth, taskCtrl.createTask);
app.post("/:id", auth, taskCtrl.updateTask);
app.delete("/:id", auth, taskCtrl.deleteTask);
module.exports = app;
