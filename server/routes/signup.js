const express = require("express");
const app = express.Router();
const signupCntr = require("../controller/signupController");
const auth = require("../middleware/auth");

app.post("/signup", signupCntr.registerUser);
app.post("/login", signupCntr.loginUser);
app.get("/me", auth, signupCntr.users);
app.get("/users", signupCntr.getAllUser);

module.exports = app;
