const express = require("express");
const app = express.Router();
const commentCtrl = require("../controller/commentController");
const auth = require("../middleware/auth");

app.post("/", auth, commentCtrl.addComment);
app.get("/project/:projectId", auth, commentCtrl.getProjectComments);

module.exports = app;
