const Team = require("../model/Team");

exports.obtainedTeam = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const team = await Team.find()
      .populate("members", "name email")
      .limit(limit)
      .lean();
    res.json({ success: true, data: { team } });
  } catch (error) {
    console.error("Error getting team", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch teams" });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Team name is required" });
    }
    const trimmedName = name.trim();
    const existing = await Team.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Team '${trimmedName}' already exists.`,
      });
    }
    const team = await Team.create({
      name: trimmedName,
      description: description ? description.trim() : "",
      members: members || [],
    });
    res.status(201).json({ success: true, data: { team } });
  } catch (error) {
    console.error("Error creating team:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to create team" });
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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch team details" });
  }
};

exports.addMemberToTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true },
    ).populate("members", "name email");

    res.json({ success: true, data: { team } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to add team member" });
  }
};
