const Tag = require("../model/Tag");

exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.find();
    res.status(200).json({ success: true, data: { tag } });
  } catch (error) {
    console.error("Error fetching tags:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch tags" });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Tag name is required" });
    }
    const trimmed = name.trim();
    const existing = await Tag.findOne({
      name: { $regex: `^${trimmed}$`, $options: "i" },
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Tag already exists", data: { tag: existing } });
    }
    const tag = await Tag.create({ name: trimmed });
    res.status(201).json({ success: true, data: { tag } });
  } catch (error) {
    console.error("Error creating tag:", error.message);
    res.status(500).json({ success: false, message: "Failed to create tag" });
  }
};
