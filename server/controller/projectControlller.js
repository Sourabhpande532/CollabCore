const Project = require("../model/Project");

exports.obtainedProjects = async (req, res) => {
  try {
    const { search, sort, limit } = req.query;
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    let sortOption = { createdAt: -1 };

    if (sort === "name_asc") {
      sortOption = { name: 1 };
    } else if (sort === "name_desc") {
      sortOption = { name: -1 };
    }

    const maxLimit = limit ? parseInt(limit) : 7;
    const project = await Project.find(filter).sort(sortOption).limit(maxLimit);
    
    res.status(200).json({
      message: "Fetch projects",
      result: project.length,
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
