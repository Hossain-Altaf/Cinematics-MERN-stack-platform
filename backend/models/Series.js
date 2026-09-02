const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  title: { type: String },
  description: { type: String },
  airDate: { type: Date }
}, { _id: false });

const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  episodes: [episodeSchema]
}, { _id: false });

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: [{ type: String }],
  firstAirDate: { type: Date, required: true },
  status: { type: String, enum: ['ongoing', 'ended', 'upcoming'], default: 'ongoing' },
  creator: { type: String },
  cast: [{ type: String }],
  language: { type: String },
  poster: { type: String, required: true },
  banner: { type: String },
  trailerUrl: { type: String },
  seasons: [seasonSchema],
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Series', seriesSchema);