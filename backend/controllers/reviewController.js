const Review = require('../models/Review');
const Movie = require('../models/Movie');
const Series = require('../models/Series');
const mongoose = require('mongoose');

const Models = { Movie, Series };

// Recalculate and update avgRating + reviewCount on the target item
const recalculateRating = async (itemType, itemId) => {
  const stats = await Review.aggregate([
    { $match: { itemId: new mongoose.Types.ObjectId(itemId) } },
    { $group: { _id: '$itemId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const Model = Models[itemType];
  if (stats.length > 0) {
    await Model.findByIdAndUpdate(itemId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  } else {
    await Model.findByIdAndUpdate(itemId, { avgRating: 0, reviewCount: 0 });
  }
};

// @desc Create a review
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { itemType, itemId, rating, text, containsSpoilers } = req.body;

    const review = await Review.create({
      user: req.user._id,
      itemType,
      itemId,
      rating,
      text,
      containsSpoilers
    });

    await recalculateRating(itemType, itemId);

    const populated = await review.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this item' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc Update own review
// @route PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    const { rating, text, containsSpoilers } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    if (containsSpoilers !== undefined) review.containsSpoilers = containsSpoilers;

    await review.save();
    await recalculateRating(review.itemType, review.itemId);

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete own review (or admin can delete any)
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const { itemType, itemId } = review;
    await review.deleteOne();
    await recalculateRating(itemType, itemId);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all reviews for an item
// @route GET /api/reviews/item/:itemId
const getReviewsForItem = async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle like on a review
// @route PUT /api/reviews/:id/like
const toggleLikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const userId = req.user._id.toString();
    const alreadyLiked = review.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      review.likes = review.likes.filter((id) => id.toString() !== userId);
    } else {
      review.likes.push(req.user._id);
    }

    await review.save();
    res.json({ likesCount: review.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, updateReview, deleteReview, getReviewsForItem, toggleLikeReview };