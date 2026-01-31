const express = require("express");
const app = express.Router();
const reportCtrl = require("../controller/reportController");
const auth = require("../middleware/auth");

app.get("/last-week", auth, reportCtrl.getReportsLastWeek);

module.exports = app;
