const Series = require('../models/Series');

// @desc Create a series (admin only)
// @route POST /api/series
const createSeries = async (req, res) => {
  try {
    const series = await Series.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(series);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update a series (admin only)
// @route PUT /api/series/:id
const updateSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!series) return res.status(404).json({ message: 'Series not found' });
    res.json(series);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete a series (admin only)
// @route DELETE /api/series/:id
const deleteSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series) return res.status(404).json({ message: 'Series not found' });
    res.json({ message: 'Series deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all series (public, with search/filter/pagination)
// @route GET /api/series
const getAllSeries = async (req, res) => {
  try {
    const { search, genre, status, sort, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (genre) query.genre = genre;
    if (status) query.status = status;

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { avgRating: -1 };
    if (sort === 'newest') sortOption = { firstAirDate: -1 };
    if (sort === 'oldest') sortOption = { firstAirDate: 1 };

    const series = await Series.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Series.countDocuments(query);

    res.json({
      series,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single series by ID (public)
// @route GET /api/series/:id
const getSeriesById = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ message: 'Series not found' });
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSeries, updateSeries, deleteSeries, getAllSeries, getSeriesById };