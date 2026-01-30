const Team = require("../model/Team");

exports.obtainedTeam = async (req, res) => {
  try {
    const team = await Team.find();
    res.json({ success: true, data: { team } });
  } catch (error) {
    console.error("Error getting team", error.message);
  }
};

exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ success: true, data: { team } });
  } catch (error) {
    console.error("Error occuring team:", error.message);
  }
};
