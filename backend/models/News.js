const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['movie', 'series', 'actor', 'director', 'industry'], required: true },
  coverImage: { type: String, required: true },
  relatedItem: {
    itemType: { type: String, enum: ['Movie', 'Series'] },
    itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedItem.itemType' }
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);