const express = require("express");
const app = express.Router();
const tagCntl = require("../controller/tagController");
const auth = require("../middleware/auth");
app.get("/", auth, tagCntl.getTag);
app.post("/", auth, tagCntl.createTag);
module.exports = app;
