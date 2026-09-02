const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewsForItem,
  toggleLikeReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/item/:itemId', getReviewsForItem);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/like', protect, toggleLikeReview);

module.exports = router;