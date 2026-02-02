const express = require("express");
const app = express.Router();
const reportCtrl = require("../controller/reportController");
const auth = require("../middleware/auth");

app.get("/last-week", auth, reportCtrl.getReportsLastWeek);
app.get("/pending", auth, reportCtrl.getReportIfPending);
app.get("/closed-tasks", auth, reportCtrl.getReportIfClosedTask);

module.exports = app;
