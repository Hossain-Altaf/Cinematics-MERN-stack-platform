const express = require('express');
const router = express.Router();
const {
  createSeries,
  updateSeries,
  deleteSeries,
  getAllSeries,
  getSeriesById
} = require('../controllers/seriesController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllSeries);
router.get('/:id', getSeriesById);
router.post('/', protect, admin, createSeries);
router.put('/:id', protect, admin, updateSeries);
router.delete('/:id', protect, admin, deleteSeries);

module.exports = router;