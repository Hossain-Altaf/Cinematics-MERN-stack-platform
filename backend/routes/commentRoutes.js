const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsForDiscussion,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/discussion/:discussionId', getCommentsForDiscussion);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;