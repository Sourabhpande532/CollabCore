const SignupUser = require("../model/Signup");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }
    const exists = await SignupUser.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: `${exists.email} already exits.` });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await SignupUser.create({ name, email, password: hash });
    res.status(201).json({ success: true, message: "Signup Successful", user });
  } catch (error) {
    console.error("Error occured registration", error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SignupUser.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const token = await jwt.sign(
      { userId: user._id, role: "admin", email },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error.message, "Login server error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.users = async (req, res) => {
  try {
    const user = await SignupUser.findById(req.user.userId).select("-password");
    res.json({ success: true, message: "Protected User", user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal error", error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await SignupUser.find();
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    console.error(error.message);
  }
};
