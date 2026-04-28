// src/services/marketService.js
const { MarketPrice, User, Sequelize } = require('../models');
const Sequelize = require('sequelize');
const { MarketPrice, User } = require('../models');
const Op = Sequelize.Op;
const logger = require('../utils/logger');

class MarketService {
    /**
     * Calculate price statistics for a region
     */
    async getRegionalStats(livestockType, region, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const stats = await MarketPrice.findAll({
                where: {
                    livestockType,
                    location: { [Op.iLike]: `%${region}%` },
                    reportedAt: { [Op.gte]: startDate },
                    verificationStatus: 'verified'
                },
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('price')), 'average'],
                    [Sequelize.fn('STDDEV', Sequelize.col('price')), 'stdDev'],
                    [Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice'],
                    [Sequelize.fn('MAX', Sequelize.col('price')), 'maxPrice'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ]
            });

            return stats[0]?.dataValues || null;
        } catch (error) {
            logger.error('Regional stats error:', error);
            throw error;
        }
    }

    /**
     * Detect price anomalies
     */
    async detectAnomalies(livestockType, location, price) {
        try {
            const stats = await this.getRegionalStats(livestockType, location);

            if (!stats || stats.count < 5) {
                return { isAnomaly: false, reason: 'Insufficient data' };
            }

            const mean = parseFloat(stats.average);
            const stdDev = parseFloat(stats.stdDev);
            const zScore = Math.abs((price - mean) / stdDev);

            return {
                isAnomaly: zScore > 3,
                zScore,
                mean,
                stdDev,
                confidence: Math.min(1, stats.count / 100)
            };
        } catch (error) {
            logger.error('Anomaly detection error:', error);
            throw error;
        }
    }

    /**
     * Generate price alerts
     */
    async generateAlerts() {
        try {
            const alerts = [];

            // Get all unique livestock types and locations
            const combinations = await MarketPrice.findAll({
                attributes: [
                    'livestockType',
                    'location'
                ],
                group: ['livestockType', 'location'],
                where: {
                    verificationStatus: 'verified'
                }
            });

            for (const combo of combinations) {
                const { livestockType, location } = combo;

                // Get recent prices
                const recentPrices = await MarketPrice.findAll({
                    where: {
                        livestockType,
                        location,
                        reportedAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                        verificationStatus: 'verified'
                    },
                    order: [['reportedAt', 'DESC']],
                    limit: 10
                });

                if (recentPrices.length >= 3) {
                    const prices = recentPrices.map(p => parseFloat(p.price));
                    const trend = this.calculateTrend(prices);

                    if (Math.abs(trend.percentChange) > 20) {
                        alerts.push({
                            livestockType,
                            location,
                            trend: trend.percentChange > 0 ? 'increasing' : 'decreasing',
                            percentChange: trend.percentChange,
                            currentPrice: prices[0],
                            previousPrice: prices[prices.length - 1],
                            message: `${livestockType} prices in ${location} are ${trend.percentChange > 0 ? 'rising' : 'falling'} rapidly`
                        });
                    }
                }
            }

            return alerts;
        } catch (error) {
            logger.error('Generate alerts error:', error);
            throw error;
        }
    }

    /**
     * Calculate price trend
     */
    calculateTrend(prices) {
        if (prices.length < 2) {
            return { percentChange: 0 };
        }

        const first = prices[prices.length - 1];
        const last = prices[0];
        const percentChange = ((last - first) / first) * 100;

        return {
            percentChange,
            direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable'
        };
    }

    /**
     * Export market data
     */
    async exportData(format = 'json', filters = {}) {
        try {
            const where = {};

            if (filters.livestockType) where.livestockType = filters.livestockType;
            if (filters.location) where.location = { [Op.iLike]: `%${filters.location}%` };
            if (filters.from) where.reportedAt = { [Op.gte]: new Date(filters.from) };
            if (filters.to) where.reportedAt = { ...where.reportedAt, [Op.lte]: new Date(filters.to) };

            const data = await MarketPrice.findAll({
                where,
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email']
                }],
                order: [['reportedAt', 'DESC']]
            });

            if (format === 'csv') {
                return this.convertToCSV(data);
            }

            return data;
        } catch (error) {
            logger.error('Export data error:', error);
            throw error;
        }
    }

    /**
     * Convert to CSV
     */
    convertToCSV(data) {
        const headers = ['ID', 'Livestock Type', 'Breed', 'Price', 'Currency', 'Location', 'Market', 'Reported At', 'Reporter'];
        const rows = data.map(item => [
            item.id,
            item.livestockType,
            item.breed || '',
            item.price,
            item.currency,
            item.location,
            item.marketName || '',
            item.reportedAt,
            item.User?.name || 'Anonymous'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

module.exports = new MarketService();