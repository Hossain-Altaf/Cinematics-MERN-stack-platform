const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, enum: ['Movie', 'Series'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'itemType', required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  text: { type: String, required: true, trim: true },
  containsSpoilers: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// prevent a user from reviewing the same item twice
reviewSchema.index({ user: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);