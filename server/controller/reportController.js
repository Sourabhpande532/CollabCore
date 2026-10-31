const Task = require("../model/Task");
require("../model/Team");
require("../model/Project");

exports.getReportsLastWeek = async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const tasks = await Task.find({
      status: "Completed",
      updatedAt: { $gte: date },
    }).lean();
    res
      .status(200)
      .json({ success: true, count: tasks.length, data: { tasks } });
  } catch (error) {
    console.error("last week report error", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch last week report" });
  }
};

exports.getReportIfPending = async (req, res, next) => {
  try {
    const tasks = await Task.find({ status: { $ne: "Completed" } })
      .select("timeToComplete")
      .lean();
    const total = tasks.reduce(
      (acc, curr) => acc + (curr.timeToComplete || 0),
      0,
    );
    res.json({ success: true, totalDays: total });
  } catch (error) {
    return next(error);
  }
};

exports.getReportIfClosedTask = async (req, res, next) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("team project")
      .lean();
    const byTeam = {};
    tasks.forEach((task) => {
      const teamName = task.team ? task.team.name : "Unassigned";
      byTeam[teamName] = (byTeam[teamName] || 0) + 1;
    });
    res.json(byTeam);
  } catch (error) {
    return next(error);
  }
};
