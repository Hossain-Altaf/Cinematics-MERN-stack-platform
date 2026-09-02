const News = require('../models/News');

// @desc Create a news post (admin only)
// @route POST /api/news
const createNews = async (req, res) => {
  try {
    const { title, content, category, coverImage, relatedItem } = req.body;
    const news = await News.create({
      title,
      content,
      category,
      coverImage,
      relatedItem,
      postedBy: req.user._id
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update a news post (admin only)
// @route PUT /api/news/:id
const updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!news) return res.status(404).json({ message: 'News post not found' });
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete a news post (admin only)
// @route DELETE /api/news/:id
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'News post not found' });
    res.json({ message: 'News post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all news (public, filter by category, pagination)
// @route GET /api/news
const getNews = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const query = {};
    if (category) query.category = category;

    const news = await News.find(query)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single news post by ID (public)
// @route GET /api/news/:id
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('postedBy', 'name');
    if (!news) return res.status(404).json({ message: 'News post not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get news related to a specific movie/series
// @route GET /api/news/item/:itemId
const getNewsForItem = async (req, res) => {
  try {
    const news = await News.find({ 'relatedItem.itemId': req.params.itemId })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNews, updateNews, deleteNews, getNews, getNewsById, getNewsForItem };