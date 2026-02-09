const Task = require("../model/Task");

exports.getReportsLastWeek = async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const tasks = await Task.find({
      status: "Completed",
      updatedAt: { $gte: date },
    });
    res
      .status(200)
      .json({ success: true, count: tasks.length, data: { tasks } });
  } catch (error) {
    console.error("last week report error", error.message);
    res.status(500).json({ success: false, message: "Server last-week-erro" });
  }
};
/* 
DRY_RUN:
TODAY: FEB 7, 2026
const d = new Date();
d.setData(d.getDate()-7);
d.getDate() --> 7;
7-7 = 0;
JS CONVERT: JAN 31, 2026 (07 - 7 => 31)
We filter tasks whose updatedAt is within the last 7 days
$gte: somePastDate
means from that date until now
*/
exports.getReportIfPending = async (req, res, next) => {
  try {
    const tasks = await Task.find({ status: { $ne: "Completed" } });
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
    const tasks = await Task.find({ status: "Completed" }).populate(
      "team project",
    );
    const byTeam = {};
    tasks.forEach(
      (task) => (byTeam[task.team.name] = (byTeam[task.team.name] || 0) + 1),
    );
    res.json(byTeam);
  } catch (error) {
    return next(error);
  }
};
