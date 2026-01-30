const express = require("express");
const app = express.Router();
const projectCtrl = require("../controller/projectControlller");
const auth = require("../middleware/auth");

app.get("/", auth, projectCtrl.obtainedProjects);
app.post("/", auth, projectCtrl.createProject);
module.exports = app;
