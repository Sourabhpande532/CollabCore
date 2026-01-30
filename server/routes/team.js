const express = require("express");
const auth = require("../middleware/auth");
const app = express.Router();
const teamCtrl = require("../controller/teamController");
app.post("/", auth, teamCtrl.createTeam);
app.get("/", auth, teamCtrl.obtainedTeam);
module.exports = app;
