const express = require("express");
const app = express.Router();
const reportCtrl = require("../controller/reportController");
const auth = require("../middleware/auth");

app.get("/last-week", reportCtrl.getReportsLastWeek);
app.get("/pending", reportCtrl.getReportIfPending);
app.get("/closed-tasks", reportCtrl.getReportIfClosedTask);

module.exports = app;
