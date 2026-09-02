const express = require('express');
const router = express.Router();
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  addToWatched,
  removeFromWatched,
  getWatched
} = require('../controllers/userListController');
const { protect } = require('../middleware/authMiddleware');

router.get('/watchlist', protect, getWatchlist);
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:itemId', protect, removeFromWatchlist);

router.get('/watched', protect, getWatched);
router.post('/watched', protect, addToWatched);
router.delete('/watched/:itemId', protect, removeFromWatched);

module.exports = router;