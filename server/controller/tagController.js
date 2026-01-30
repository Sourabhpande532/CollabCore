const Tag = require("../model/Tag");

exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.find();
    res.status(201).json({ success: true, data: { tag } });
  } catch (error) {
    console.error(error.message);
  }
};

exports.createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ success: true, data: { tag } });
  } catch (error) {
    console.error("Error occuring tag", error.message);
  }
};
