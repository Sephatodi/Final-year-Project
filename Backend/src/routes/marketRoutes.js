// src/routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const marketController = require('../controllers/marketController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const priceValidation = [
    body('livestockType').notEmpty().withMessage('Livestock type is required'),
    body('breed').optional(),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('currency').default('USD').isLength({ min: 3, max: 3 }),
    body('location').notEmpty().withMessage('Location is required'),
    body('marketName').optional()
];

const trendValidation = [
    query('period').optional().isIn(['day', 'week', 'month', 'year']).withMessage('Invalid period'),
    query('livestockType').optional()
];

// ===========================================
// Public Routes (no authentication required)
// ===========================================

/**
 * @route   GET /api/market/prices
 * @desc    Get current market prices with optional filters
 * @access  Public
 */
router.get('/prices', [
    query('livestockType').optional(),
    query('location').optional(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt().toInt(),
    validate
], marketController.getPrices);

/**
 * @route   GET /api/market/prices/:id
 * @desc    Get single price entry by ID
 * @access  Public
 */
router.get('/prices/:id', [
    param('id').isUUID().withMessage('Invalid price ID'),
    validate
], marketController.getPriceById);

/**
 * @route   GET /api/market/trends
 * @desc    Get market price trends
 * @access  Public
 */
router.get('/trends', trendValidation, validate, marketController.getPriceTrends);

/**
 * @route   GET /api/market/locations
 * @desc    Get all available market locations
 * @access  Public
 */
router.get('/locations', marketController.getLocations);

/**
 * @route   GET /api/market/livestock-types
 * @desc    Get all livestock types with average prices
 * @access  Public
 */
router.get('/livestock-types', marketController.getLivestockTypes);

/**
 * @route   GET /api/market/compare
 * @desc    Compare prices across different locations
 * @access  Public
 */
router.get('/compare', [
    query('livestockType').notEmpty().withMessage('Livestock type is required'),
    query('locations').notEmpty().withMessage('At least one location required'),
    validate
], marketController.comparePrices);

// ===========================================
// Protected Routes (authentication required)
// ===========================================

/**
 * @route   POST /api/market/prices
 * @desc    Report new market price
 * @access  Private (Farmers, Veterinarians, Admin)
 */
router.post('/prices', 
    authenticate, 
    authorize('farmer', 'veterinarian', 'admin'),
    priceValidation, 
    validate, 
    marketController.reportPrice
);

/**
 * @route   PUT /api/market/prices/:id
 * @desc    Update a price entry
 * @access  Private (Admin only or price reporter)
 */
router.put('/prices/:id', 
    authenticate,
    [
        param('id').isUUID().withMessage('Invalid price ID'),
        ...priceValidation
    ],
    validate,
    marketController.updatePrice
);

/**
 * @route   DELETE /api/market/prices/:id
 * @desc    Delete a price entry
 * @access  Private (Admin only)
 */
router.delete('/prices/:id',
    authenticate,
    authorize('admin'),
    [
        param('id').isUUID().withMessage('Invalid price ID')
    ],
    validate,
    marketController.deletePrice
);

/**
 * @route   POST /api/market/prices/bulk
 * @desc    Bulk import market prices
 * @access  Private (Admin only)
 */
router.post('/prices/bulk',
    authenticate,
    authorize('admin'),
    [
        body('prices').isArray().withMessage('Prices must be an array'),
        body('prices.*.livestockType').notEmpty(),
        body('prices.*.price').isNumeric(),
        body('prices.*.location').notEmpty()
    ],
    validate,
    marketController.bulkImportPrices
);

/**
 * @route   GET /api/market/my-reports
 * @desc    Get current user's price reports
 * @access  Private
 */
router.get('/my-reports',
    authenticate,
    [
        query('limit').optional().isInt().toInt(),
        query('offset').optional().isInt().toInt()
    ],
    validate,
    marketController.getMyReports
);

/**
 * @route   GET /api/market/stats
 * @desc    Get market statistics
 * @access  Private (Admin only)
 */
router.get('/stats',
    authenticate,
    authorize('admin'),
    [
        query('from').optional().isISO8601(),
        query('to').optional().isISO8601()
    ],
    validate,
    marketController.getMarketStats
);

module.exports = router;