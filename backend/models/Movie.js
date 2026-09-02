const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: [{ type: String }],
  releaseDate: { type: Date, required: true },
  runtime: { type: Number }, // in minutes
  director: { type: String },
  cast: [{ type: String }],
  language: { type: String },
  poster: { type: String, required: true }, // Cloudinary URL
  banner: { type: String },
  trailerUrl: { type: String },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);