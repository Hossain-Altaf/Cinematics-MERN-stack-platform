const Movie = require('../models/Movie');

// @desc Create a movie (admin only)
// @route POST /api/movies
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update a movie (admin only)
// @route PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete a movie (admin only)
// @route DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all movies (public, with search/filter/pagination)
// @route GET /api/movies
const getMovies = async (req, res) => {
  try {
    const { search, genre, sort, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre) {
      query.genre = genre;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { avgRating: -1 };
    if (sort === 'newest') sortOption = { releaseDate: -1 };
    if (sort === 'oldest') sortOption = { releaseDate: 1 };

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single movie by ID (public)
// @route GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMovie, updateMovie, deleteMovie, getMovies, getMovieById };