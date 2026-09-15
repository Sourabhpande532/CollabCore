const Team = require("../model/Team");

exports.obtainedTeam = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 7;
    const team = await Team.find().populate("members", "name email").limit(limit);
    res.json({ success: true, data: { team } });
  } catch (error) {
    console.error("Error getting team", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const team = await Team.create({
      name,
      description,
      members: members || [],
    });
    res.status(201).json({ success: true, data: { team } });
  } catch (error) {
    console.error("Error occuring team:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTeamDetails = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "name email",
    );
    res.json({ success: true, data: { team } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addMemberToTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true },
    ).populate("members", "name email");

    res.json({ success: true, data: { team } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
