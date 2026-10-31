const mongoose = require("mongoose");
const Task = require("../model/Task");
const Team = require("../model/Team");
const Project = require("../model/Project");
const User = require("../model/Signup");

const normalizeStatus = (status) => {
  if (!status) return "";
  if (status === "InProgress" || status.toLowerCase() === "inprogress") {
    return "In Progress";
  }
  if (status === "ToDo" || status.toLowerCase() === "todo") {
    return "To Do";
  }
  return status;
};

const buildTaskFilterQuery = async (queryParams) => {
  const { owners, owner, team, status, tags, project, projectId } = queryParams;
  const query = {};

  const projParam = project || projectId;
  if (projParam) {
    if (mongoose.Types.ObjectId.isValid(projParam)) {
      query.project = projParam;
    } else {
      const projDoc = await Project.findOne({
        name: { $regex: projParam, $options: "i" },
      });
      query.project = projDoc ? projDoc._id : new mongoose.Types.ObjectId();
    }
  }

  if (status) {
    query.status = normalizeStatus(status);
  }

  if (tags) {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagList.length > 0) {
      query.tags = {
        $in: tagList.map((t) => new RegExp(`^${t}$`, "i")),
      };
    }
  }

  const ownerParam = owners || owner;
  if (ownerParam) {
    if (mongoose.Types.ObjectId.isValid(ownerParam)) {
      query.owners = ownerParam;
    } else {
      const ownerDoc = await User.findOne({
        name: { $regex: ownerParam, $options: "i" },
      });
      query.owners = ownerDoc ? ownerDoc._id : new mongoose.Types.ObjectId();
    }
  }

  if (team) {
    if (mongoose.Types.ObjectId.isValid(team)) {
      query.team = team;
    } else {
      const teamDoc = await Team.findOne({
        name: { $regex: team, $options: "i" },
      });
      query.team = teamDoc ? teamDoc._id : new mongoose.Types.ObjectId();
    }
  }

  return query;
};

const applyTaskSorting = (tasks, sort) => {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  if (sort === "priority" || sort === "priority_desc") {
    return [...tasks].sort(
      (a, b) =>
        (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
    );
  }
  if (sort === "priority_asc") {
    return [...tasks].sort(
      (a, b) =>
        (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2),
    );
  }
  return tasks;
};

exports.obtainedTask = async (req, res) => {
  try {
    const { sort } = req.query;
    const query = await buildTaskFilterQuery(req.query);

    let sortQuery = { createdAt: -1 };
    if (sort === "newest" || sort === "-createdAt") sortQuery = { createdAt: -1 };
    else if (sort === "oldest") sortQuery = { createdAt: 1 };
    else if (sort === "name") sortQuery = { name: 1 };
    else if (sort === "-name") sortQuery = { name: -1 };
    else if (sort === "status") sortQuery = { status: 1 };
    else if (sort === "due_asc") sortQuery = { timeToComplete: 1, dueDate: 1 };
    else if (sort === "due_desc") sortQuery = { timeToComplete: -1, dueDate: -1 };

    let tasks = await Task.find(query)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .sort(sortQuery)
      .lean();

    tasks = applyTaskSorting(tasks, sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

exports.getFilterTask = async (req, res) => {
  try {
    const { sort } = req.query;
    const filter = await buildTaskFilterQuery(req.query);

    let sortOption = { createdAt: -1 };
    if (sort === "due_asc") sortOption = { dueDate: 1, timeToComplete: 1 };
    else if (sort === "due_desc") sortOption = { dueDate: -1, timeToComplete: -1 };
    else if (sort === "name") sortOption = { name: 1 };
    else if (sort === "-name") sortOption = { name: -1 };
    else if (sort === "status") sortOption = { status: 1 };

    let tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .sort(sortOption);

    tasks = applyTaskSorting(tasks, sort);

    res.json({ success: true, count: tasks.length, data: { tasks } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to filter tasks" });
  }
};

exports.createTask = async (req, res) => {
  try {
    let newTask = await Task.create(req.body);
    newTask = await Task.findById(newTask._id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");
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
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");
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
    const { sort, status, owner } = req.query;
    const filter = { team: req.params.id };
    if (status) {
      filter.status = normalizeStatus(status);
    }
    if (owner && mongoose.Types.ObjectId.isValid(owner)) {
      filter.owners = owner;
    }

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
    const tasks = await Task.find(filter)
      .populate("project", "name")
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
      { status, updatedAt: Date.now() },
      { new: true },
    )
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");
    res.json({ success: true, data: { task } });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update task status" });
  }
};
