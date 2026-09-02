const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');

// @desc Create a discussion thread
// @route POST /api/discussions
const createDiscussion = async (req, res) => {
  try {
    const { itemType, itemId, title, body, containsSpoilers } = req.body;
    const discussion = await Discussion.create({
      user: req.user._id,
      itemType,
      itemId,
      title,
      body,
      containsSpoilers
    });
    const populated = await discussion.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get discussions for an item
// @route GET /api/discussions/item/:itemId
const getDiscussionsForItem = async (req, res) => {
  try {
    const discussions = await Discussion.find({ itemId: req.params.itemId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single discussion (with detail)
// @route GET /api/discussions/:id
const getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id).populate('user', 'name avatar');
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete own discussion (or admin)
// @route DELETE /api/discussions/:id
const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    if (discussion.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await discussion.deleteOne();
    await Comment.deleteMany({ discussion: req.params.id });
    res.json({ message: 'Discussion deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle upvote on a discussion
// @route PUT /api/discussions/:id/upvote
const toggleUpvote = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    const userId = req.user._id.toString();
    const alreadyUpvoted = discussion.upvotes.some((id) => id.toString() === userId);

    if (alreadyUpvoted) {
      discussion.upvotes = discussion.upvotes.filter((id) => id.toString() !== userId);
    } else {
      discussion.upvotes.push(req.user._id);
    }

    await discussion.save();
    res.json({ upvoteCount: discussion.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDiscussion,
  getDiscussionsForItem,
  getDiscussionById,
  deleteDiscussion,
  toggleUpvote
};