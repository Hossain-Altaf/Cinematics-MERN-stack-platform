const User = require('../models/User');

// @desc Add item to watchlist
// @route POST /api/users/watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyIn = user.watchlist.some(
      (entry) => entry.itemId.toString() === itemId
    );
    if (alreadyIn) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }

    user.watchlist.push({ itemType, itemId });
    await user.save();
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Remove item from watchlist
// @route DELETE /api/users/watchlist/:itemId
const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter(
      (entry) => entry.itemId.toString() !== req.params.itemId
    );
    await user.save();
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user's watchlist (populated with movie/series data)
// @route GET /api/users/watchlist
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist.itemId');
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark item as watched (also removes from watchlist if present)
// @route POST /api/users/watched
const addToWatched = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyWatched = user.watched.some(
      (entry) => entry.itemId.toString() === itemId
    );
    if (alreadyWatched) {
      return res.status(400).json({ message: 'Already marked as watched' });
    }

    user.watched.push({ itemType, itemId });
    // remove from watchlist since it's now watched
    user.watchlist = user.watchlist.filter(
      (entry) => entry.itemId.toString() !== itemId
    );

    await user.save();
    res.status(201).json({ message: 'Marked as watched' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Remove item from watched list
// @route DELETE /api/users/watched/:itemId
const removeFromWatched = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watched = user.watched.filter(
      (entry) => entry.itemId.toString() !== req.params.itemId
    );
    await user.save();
    res.json({ message: 'Removed from watched list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user's watched list (populated)
// @route GET /api/users/watched
const getWatched = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watched.itemId');
    res.json(user.watched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  addToWatched,
  removeFromWatched,
  getWatched
};