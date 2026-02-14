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

exports.getFilterTask = async (req, res) => {
  try {
    const { team, owner, project, status, tags, sort } = req.query;
    let filter = {};
    if (team) {
      filter.team = team;
    }
    if (owner) {
      filter.owners = owner;
    }
    if (project) {
      filter.project = project;
    }
    if (status) {
      filter.status = status;
    }
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }
    let sortOption = { createdAt: -1 }; // default newest first

    if (sort === "due_asc") sortOption = { dueDate: 1 };
    if (sort === "due_desc") sortOption = { dueDate: -1 };
    if (sort === "priority") sortOption = { priority: -1 };

    let tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name")
      .sort(sortOption);

    res.json({ success: true, count: tasks.length, data: { tasks } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = Task.create(req.body);
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
    const { sort } = req.query;
    let sortOption = {};
    if (sort === "due_asc") {
      sortOption.timeToComplete = 1;
    }
    if (sort === "due_desc") {
      sortOption.timeToComplete = -1;
    }
    if (sort === "status") {
      sortOption.status = 1;
    }
    const tasks = await Task.find({ team: req.params.id })
      .populate("owners", "name email")
      .populate("team", "name")
      .sort(sortOption);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ success: true, data: { task } });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({ success: true, data: { task } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
