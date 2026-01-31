const Task = require("../model/Task");
const Team = require("../model/Team");
const User = require("../model/Signup");
exports.obtainedTask = async (req, res) => {
  try {
    const { owners, team, status, tags } = req.query;
    const query = {};
    if (owners) {
      const ownersDoc = await User.findOne({ name: owners });
      if (ownersDoc) {
        query.owners = ownersDoc._id;
      }
    }
    if (status) query.status = status;
    if (tags) query.tags = tags;
    if (team) {
      const teamDoc = await Team.findOne({ name: team });
      if (teamDoc) {
        query.team = teamDoc._id;
      }
    }
    // OR
    // const query = {};
    // Object.keys(req.query).forEach((keys) => (query[keys] = req.query[keys]));
    const tasks = await Task.find(query).populate("project team owners tags");
    res
      .status(200)
      .json({ success: true, count: tasks.length, data: { tasks } });
  } catch (error) {
    console.error("error getting task:", error.message);
    res.status(500).json({ success: 500, message: "Error getting task" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    newTask
      .save()
      .then((task) => console.log(task))
      .catch((err) => console.log(err));
    res.status(201).json({ success: true, data: { task: newTask } });
  } catch (error) {
    console.error(error.message, "creating task");
    res
      .status(500)
      .json({ success: false, message: "Internal creating task error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: { task } });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Internal server update task error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Server delete task error" });
  }
};
