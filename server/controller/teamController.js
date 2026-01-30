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
  const { name, description } = req.body;
  try {
    const newTeam = new Team({
      name,
      description,
    });
    newTeam
      .save()
      .then((team) => console.log(team))
      .catch((err) => console.log(err));
    res.status(201).json({ success: true, data: { team: newTeam } });
  } catch (error) {
    console.error("Error occuring team:", error.message);
  }
};
