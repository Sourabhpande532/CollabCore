const express = require("express");
const auth = require("../middleware/auth");
const app = express.Router();
const teamCtrl = require("../controller/teamController");
app.post("/", auth, teamCtrl.createTeam);
app.get("/", teamCtrl.obtainedTeam);
app.get("/:id", teamCtrl.getTeamDetails);
app.post("/:id/members", auth, teamCtrl.addMemberToTeam);

module.exports = app;
