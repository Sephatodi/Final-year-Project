// src/controllers/marketController.js
const { Op } = require('sequelize');
const Sequelize = require('sequelize'); // For Sequelize.fn and other methods
const { MarketPrice, User } = require('../models');
const logger = require('../utils/logger');

// @desc    Get current market prices with optional filters
// @route   GET /api/market/prices
exports.getPrices = async (req, res, next) => {
    try {
        const { livestockType, location, limit = 20, offset = 0 } = req.query;

        const where = {};
        if (livestockType) where.livestockType = livestockType;
        if (location) where.location = location;

        const prices = await MarketPrice.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['id', 'name']
            }]
        });

        res.json({
            success: true,
            data: prices.rows,
            pagination: {
                total: prices.count,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(prices.count / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single price entry by ID
// @route   GET /api/market/prices/:id
exports.getPriceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const price = await MarketPrice.findByPk(id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!price) {
            return res.status(404).json({ error: 'Price entry not found' });
        }

        res.json({
            success: true,
            data: price
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get market price trends
// @route   GET /api/market/trends
exports.getPriceTrends = async (req, res, next) => {
    try {
        const { period = 'month', livestockType } = req.query;

        // Calculate date range based on period
        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case 'day':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 12);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 5);
                break;
        }

        const where = {
            createdAt: {
                [Op.between]: [startDate, endDate]
            }
        };

        if (livestockType) where.livestockType = livestockType;

        const prices = await MarketPrice.findAll({
            where,
            order: [['createdAt', 'ASC']]
        });

        // Group by time period and calculate averages
        const trends = {};

        prices.forEach(price => {
            let key;
            const date = new Date(price.createdAt);

            switch (period) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const week = getWeekNumber(date);
                    key = `${date.getFullYear()}-W${week}`;
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = date.getFullYear().toString();
                    break;
            }

            if (!trends[key]) {
                trends[key] = {
                    period: key,
                    prices: [],
                    avgPrice: 0,
                    minPrice: Infinity,
                    maxPrice: -Infinity,
                    count: 0
                };
            }

            trends[key].prices.push(price.price);
            trends[key].minPrice = Math.min(trends[key].minPrice, price.price);
            trends[key].maxPrice = Math.max(trends[key].maxPrice, price.price);
            trends[key].count++;
        });

        // Calculate averages
        Object.keys(trends).forEach(key => {
            const sum = trends[key].prices.reduce((a, b) => a + b, 0);
            trends[key].avgPrice = sum / trends[key].prices.length;
            delete trends[key].prices; // Remove raw prices array
        });

        res.json({
            success: true,
            data: {
                period,
                livestockType: livestockType || 'all',
                trends: Object.values(trends),
                summary: {
                    overallAvg: prices.reduce((sum, p) => sum + p.price, 0) / prices.length,
                    totalEntries: prices.length,
                    dateRange: { startDate, endDate }
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all available market locations
// @route   GET /api/market/locations
exports.getLocations = async (req, res, next) => {
    try {
        const locations = await MarketPrice.findAll({
            attributes: ['location'],
            group: ['location'],
            order: [['location', 'ASC']]
        });

        // Get price stats for each location
        const locationStats = await Promise.all(
            locations.map(async (loc) => {
                const stats = await MarketPrice.findAll({
                    where: { location: loc.location },
                    attributes: [
                        'location',
                        [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice'],
                        [Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice'],
                        [Sequelize.fn('MAX', Sequelize.col('price')), 'maxPrice'],
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalReports']
                    ],
                    raw: true
                });
                return stats[0];
            })
        );

        res.json({
            success: true,
            data: locationStats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all livestock types with average prices
// @route   GET /api/market/livestock-types
exports.getLivestockTypes = async (req, res, next) => {
    try {
        const types = await MarketPrice.findAll({
            attributes: [
                'livestockType',
                [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice'],
                [Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice'],
                [Sequelize.fn('MAX', Sequelize.col('price')), 'maxPrice'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalReports']
            ],
            group: ['livestockType', 'breed'],
            order: [['livestockType', 'ASC']]
        });

        // Group by main type
        const grouped = {};
        types.forEach(type => {
            if (!grouped[type.livestockType]) {
                grouped[type.livestockType] = {
                    type: type.livestockType,
                    breeds: [],
                    stats: {
                        avgPrice: 0,
                        minPrice: Infinity,
                        maxPrice: -Infinity,
                        totalReports: 0
                    }
                };
            }

            grouped[type.livestockType].breeds.push({
                breed: type.breed || 'Unknown',
                avgPrice: parseFloat(type.avgPrice),
                minPrice: parseFloat(type.minPrice),
                maxPrice: parseFloat(type.maxPrice),
                reports: parseInt(type.totalReports)
            });

            // Update overall stats
            grouped[type.livestockType].stats.minPrice = Math.min(
                grouped[type.livestockType].stats.minPrice,
                parseFloat(type.minPrice)
            );
            grouped[type.livestockType].stats.maxPrice = Math.max(
                grouped[type.livestockType].stats.maxPrice,
                parseFloat(type.maxPrice)
            );
            grouped[type.livestockType].stats.totalReports += parseInt(type.totalReports);
        });

        // Calculate overall averages
        Object.keys(grouped).forEach(key => {
            const sum = grouped[key].breeds.reduce((acc, b) => acc + (b.avgPrice * b.reports), 0);
            grouped[key].stats.avgPrice = sum / grouped[key].stats.totalReports;
        });

        res.json({
            success: true,
            data: Object.values(grouped)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Compare prices across different locations
// @route   GET /api/market/compare
exports.comparePrices = async (req, res, next) => {
    try {
        const { livestockType, locations } = req.query;
        const locationList = locations.split(',');

        const prices = await MarketPrice.findAll({
            where: {
                livestockType,
                location: { [Op.in]: locationList }
            },
            order: [['createdAt', 'DESC']]
        });

        // Group by location
        const comparison = {};
        locationList.forEach(loc => {
            comparison[loc] = {
                location: loc,
                latestPrice: null,
                averagePrice: 0,
                minPrice: Infinity,
                maxPrice: -Infinity,
                priceHistory: [],
                totalReports: 0
            };
        });

        prices.forEach(price => {
            const loc = price.location;
            if (comparison[loc]) {
                if (!comparison[loc].latestPrice) {
                    comparison[loc].latestPrice = price.price;
                }

                comparison[loc].priceHistory.push({
                    price: price.price,
                    date: price.createdAt,
                    reportedBy: price.userId
                });

                comparison[loc].minPrice = Math.min(comparison[loc].minPrice, price.price);
                comparison[loc].maxPrice = Math.max(comparison[loc].maxPrice, price.price);
                comparison[loc].totalReports++;
            }
        });

        // Calculate averages
        Object.keys(comparison).forEach(loc => {
            if (comparison[loc].priceHistory.length > 0) {
                const sum = comparison[loc].priceHistory.reduce((acc, p) => acc + p.price, 0);
                comparison[loc].averagePrice = sum / comparison[loc].priceHistory.length;
            }
        });

        // Find best price
        let bestPrice = { location: null, price: Infinity };
        let worstPrice = { location: null, price: -Infinity };

        Object.values(comparison).forEach(loc => {
            if (loc.latestPrice && loc.latestPrice < bestPrice.price) {
                bestPrice = { location: loc.location, price: loc.latestPrice };
            }
            if (loc.latestPrice && loc.latestPrice > worstPrice.price) {
                worstPrice = { location: loc.location, price: loc.latestPrice };
            }
        });

        res.json({
            success: true,
            data: {
                livestockType,
                comparison: Object.values(comparison),
                recommendations: {
                    bestPrice,
                    worstPrice,
                    savings: bestPrice.price ? worstPrice.price - bestPrice.price : 0,
                    savingsPercentage: bestPrice.price ?
                        ((worstPrice.price - bestPrice.price) / worstPrice.price * 100).toFixed(2) : 0
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Report new market price
// @route   POST /api/market/prices
exports.reportPrice = async (req, res, next) => {
    try {
        const { livestockType, breed, price, currency, location, marketName, notes } = req.body;

        const priceEntry = await MarketPrice.create({
            livestockType,
            breed,
            price,
            currency: currency || 'USD',
            location,
            marketName,
            notes,
            userId: req.user.id,
            reportedAt: new Date()
        });

        logger.info(`New market price reported by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            data: priceEntry,
            message: 'Price reported successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a price entry
// @route   PUT /api/market/prices/:id
exports.updatePrice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const priceEntry = await MarketPrice.findByPk(id);

        if (!priceEntry) {
            return res.status(404).json({ error: 'Price entry not found' });
        }

        // Check if user is admin or the original reporter
        if (req.user.role !== 'admin' && priceEntry.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this entry' });
        }

        await priceEntry.update(updates);

        logger.info(`Market price ${id} updated by user ${req.user.id}`);

        res.json({
            success: true,
            data: priceEntry,
            message: 'Price updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a price entry
// @route   DELETE /api/market/prices/:id
exports.deletePrice = async (req, res, next) => {
    try {
        const { id } = req.params;

        const priceEntry = await MarketPrice.findByPk(id);

        if (!priceEntry) {
            return res.status(404).json({ error: 'Price entry not found' });
        }

        await priceEntry.destroy();

        logger.info(`Market price ${id} deleted by user ${req.user.id}`);

        res.json({
            success: true,
            message: 'Price entry deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk import market prices
// @route   POST /api/market/prices/bulk
exports.bulkImportPrices = async (req, res, next) => {
    try {
        const { prices } = req.body;

        const results = {
            successful: [],
            failed: []
        };

        for (const priceData of prices) {
            try {
                const priceEntry = await MarketPrice.create({
                    ...priceData,
                    userId: req.user.id,
                    reportedAt: new Date()
                });
                results.successful.push(priceEntry.id);
            } catch (error) {
                results.failed.push({
                    data: priceData,
                    error: error.message
                });
            }
        }

        logger.info(`Bulk import completed by user ${req.user.id}: ${results.successful.length} successful, ${results.failed.length} failed`);

        res.json({
            success: true,
            data: results,
            message: `Imported ${results.successful.length} prices successfully`
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user's price reports
// @route   GET /api/market/my-reports
exports.getMyReports = async (req, res, next) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const reports = await MarketPrice.findAndCountAll({
            where: { userId: req.user.id },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: reports.rows,
            pagination: {
                total: reports.count,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(reports.count / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get market statistics
// @route   GET /api/market/stats
exports.getMarketStats = async (req, res, next) => {
    try {
        const { from, to } = req.query;

        const where = {};
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt[Op.gte] = new Date(from);
            if (to) where.createdAt[Op.lte] = new Date(to);
        }

        const stats = await MarketPrice.findAll({
            where,
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalReports'],
                [Sequelize.fn('AVG', Sequelize.col('price')), 'averagePrice'],
                [Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice'],
                [Sequelize.fn('MAX', Sequelize.col('price')), 'maxPrice'],
                [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('location'))), 'uniqueLocations'],
                [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('livestockType'))), 'uniqueTypes']
            ],
            raw: true
        });

        // Get top reporters
        const topReporters = await MarketPrice.findAll({
            where,
            attributes: [
                'userId',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'reportCount']
            ],
            group: ['userId'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });

        // Get price distribution by type
        const typeDistribution = await MarketPrice.findAll({
            where,
            attributes: [
                'livestockType',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']
            ],
            group: ['livestockType'],
            order: [['livestockType', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                summary: stats[0],
                topReporters,
                typeDistribution,
                period: {
                    from: from || 'all time',
                    to: to || 'now'
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}