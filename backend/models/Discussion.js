const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, enum: ['Movie', 'Series'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'itemType', required: true },
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  containsSpoilers: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);