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
      .json({ success: true, coutn: tasks.length, data: { tasks } });
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
