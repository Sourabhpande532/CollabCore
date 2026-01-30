const Project = require("../model/Project");

exports.obtainedProjects = async (req, res) => {
  try {
    const project = await Project.find();
    res
      .status(201)
      .json({ message: "Fetch projects", success: true, data: { project } });
  } catch (error) {
    console.error(error.message);
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).json({ message: "missing required fields" });
    const create = new Project(req.body);
    const project = await create.save();
    res
      .status(201)
      .json({ success: true, message: "Added it", data: { project } });
  } catch (error) {
    console.error(error.message);
  }
};
