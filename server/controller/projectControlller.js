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

    const maxLimit = limit ? parseInt(limit, 10) : 50;
    const project = await Project.find(filter)
      .sort(sortOption)
      .limit(maxLimit)
      .lean();

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
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    }

    const trimmedName = name.trim();
    const existingProject = await Project.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: `Project name '${trimmedName}' already exists. Please choose a different name.`,
      });
    }

    const project = await Project.create({
      name: trimmedName,
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Error creating project:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Project name already exists. Please choose a different name.",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to create project" });
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
