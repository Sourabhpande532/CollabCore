const Comment = require("../model/Comment");

exports.addComment = async (req, res) => {
  try {
    const { text, projectId } = req.body;
    if (!text || !projectId) {
      return res.status(400).json({ success: false, message: "Text and Project ID are required" });
    }
    
    // req.user is set by auth middleware, req.user.userId contains the user ID
    const comment = await Comment.create({
      text,
      project: projectId,
      author: req.user.userId
    });

    const populatedComment = await Comment.findById(comment._id).populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { comment: populatedComment }
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await Comment.find({ project: projectId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
