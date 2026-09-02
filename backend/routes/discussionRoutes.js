const express = require('express');
const router = express.Router();
const {
  createDiscussion,
  getDiscussionsForItem,
  getDiscussionById,
  deleteDiscussion,
  toggleUpvote
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/item/:itemId', getDiscussionsForItem);
router.get('/:id', getDiscussionById);
router.post('/', protect, createDiscussion);
router.delete('/:id', protect, deleteDiscussion);
router.put('/:id/upvote', protect, toggleUpvote);

module.exports = router;