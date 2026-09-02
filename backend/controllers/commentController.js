const Comment = require('../models/Comment');

// @desc Add a comment (or reply) to a discussion
// @route POST /api/comments
const createComment = async (req, res) => {
  try {
    const { discussion, text, parentComment } = req.body;
    const comment = await Comment.create({
      discussion,
      user: req.user._id,
      text,
      parentComment: parentComment || null
    });
    const populated = await comment.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all comments for a discussion
// @route GET /api/comments/discussion/:discussionId
const getCommentsForDiscussion = async (req, res) => {
  try {
    const comments = await Comment.find({ discussion: req.params.discussionId })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete own comment (or admin)
// @route DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getCommentsForDiscussion, deleteComment };