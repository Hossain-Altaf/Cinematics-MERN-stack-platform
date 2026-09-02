const express = require('express');
const router = express.Router();
const {
  createNews,
  updateNews,
  deleteNews,
  getNews,
  getNewsById,
  getNewsForItem
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getNews);
router.get('/item/:itemId', getNewsForItem);
router.get('/:id', getNewsById);
router.post('/', protect, admin, createNews);
router.put('/:id', protect, admin, updateNews);
router.delete('/:id', protect, admin, deleteNews);

module.exports = router;