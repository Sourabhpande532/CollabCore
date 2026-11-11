const SignupUser = require("../model/Signup");
const bcrypt = require("bcryptjs");
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
        .json({ success: false, message: `${exists.email} already exists.` });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await SignupUser.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hash,
    });
    const userObj = user.toObject();
    delete userObj.password;
    res
      .status(201)
      .json({ success: true, message: "Signup Successful", user: userObj });
  } catch (error) {
    console.error("Error occurred registration", error.message);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user =
      (await SignupUser.findOne({ email: normalizedEmail })) ||
      (await SignupUser.findOne({ email: email.trim() }));
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const token = jwt.sign(
      { userId: user._id, role: "admin", email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ success: true, token, user: userObj });
  } catch (error) {
    console.error(error.message, "Login server error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.users = async (req, res) => {
  try {
    const user = await SignupUser.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Protected User", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user profile" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const users = await SignupUser.find().select("-password").limit(limit);
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};
