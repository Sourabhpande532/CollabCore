const Task = require("../model/Task");
const Team = require("../model/Team");
const User = require("../model/Signup");

exports.obtainedTask = async (req, res) => {
  try {
    const { owners, team, status, tags, projectId, sort } = req.query;
    const query = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (tags) query.tags = tags;
    if (owners) {
      const ownerDoc = await User.findOne({ name: owners });
      if (ownerDoc) query.owners = ownerDoc._id;
    }
    if (team) {
      const teamDoc = await Team.findOne({ name: team });
      if (teamDoc) query.team = teamDoc._id;
    }
    let sortQuery = {};
    if (sort === "priority_desc") sortQuery.priority = -1;
    if (sort === "priority_asc") sortQuery.priority = 1;
    if (sort === "newest") sortQuery.createdAt = -1;
    if (sort === "oldest") sortQuery.createdAt = 1;

    const tasks = await Task.find(query)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .sort(sortQuery);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
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

exports.getTaskByTeam = async (req, res, next) => {
  try {
    const tasks = await Task.find({ team: req.params.id })
      .populate("owners", "name email")
      .populate("team", "name");
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};
