const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createLivestock,
  getMyLivestock,
  getLivestockById,
  updateLivestock,
  deleteLivestock,
  getLivestockStats
} = require('../controllers/livestockController');

router.use(protect); // All livestock routes require authentication

router.route('/')
  .post([
    body('tagId').notEmpty().withMessage('Tag ID is required'),
    body('species').isIn(['cattle', 'goat', 'sheep', 'chicken', 'pig']).withMessage('Invalid species'),
    body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female')
  ], createLivestock)
  .get(getMyLivestock);

router.get('/stats', getLivestockStats);

router.route('/:id')
  .get(getLivestockById)
  .put(updateLivestock)
  .delete(deleteLivestock);

module.exports = router;