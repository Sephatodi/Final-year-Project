const { Op,Sequelize, QueryTypes } = require('sequelize');
const { Livestock, HealthRecord, sequelize } = require('../models');
const { validationResult } = require('express-validator');

const createLivestock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const livestockData = {
      ...req.body,
      userId: req.user.id,
      syncStatus: 'pending',
      healthStatus: 'healthy',
      // Let database defaults handle status 
    };

    console.log('Creating livestock with data:', JSON.stringify(livestockData, null, 2));
    console.log('User ID:', req.user.id);
    
    const livestock = await Livestock.create(livestockData);

    res.status(201).json({
      success: true,
      data: livestock
    });
  } catch (error) {
    console.error('Create livestock error:', error.message);
    console.error('Error name:', error.name);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.errors : undefined
    });
  }
};

const getMyLivestock = async (req, res) => {
  try {
    const {
      species,
      status,
      healthStatus,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = { userId: req.user.id };

    if (species) where.species = species;
    if (status) where.status = status;
    if (healthStatus) where.healthStatus = healthStatus;

    // Get livestock with pagination
    const livestock = await Livestock.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, order]]
    });

    // Get health records separately for each livestock (avoiding separate: true)
    const livestockWithRecords = await Promise.all(
      livestock.rows.map(async (animal) => {
        const healthRecords = await HealthRecord.findAll({
          where: { livestockId: animal.id },
          limit: 5,
          order: [['createdAt', 'DESC']]
        });
        return {
          ...animal.toJSON(),
          healthRecords
        };
      })
    );

    res.json({
      success: true,
      data: livestockWithRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: livestock.count,
        pages: Math.ceil(livestock.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get livestock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLivestockById = async (req, res) => {
  try {
    const livestock = await Livestock.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    // Get health records separately
    const healthRecords = await HealthRecord.findAll({
      where: { livestockId: livestock.id },
      order: [['date', 'DESC']]
    });

    const livestockData = livestock.toJSON();
    livestockData.healthRecords = healthRecords;

    res.json({ success: true, data: livestockData });
  } catch (error) {
    console.error('Get livestock by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    const allowedUpdates = [
      'name', 'weight', 'healthStatus', 'location',
      'notes', 'images', 'vaccinationStatus', 'breedingHistory'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.syncStatus = 'pending';
    updates.lastModified = new Date();

    await livestock.update(updates);

    res.json({ success: true, data: livestock });
  } catch (error) {
    console.error('Update livestock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    // Soft delete - just update status
    await livestock.update({
      status: 'deceased',
      syncStatus: 'pending'
    });

    res.json({ success: true, message: 'Livestock status updated to deceased' });
  } catch (error) {
    console.error('Delete livestock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLivestockStats = async (req, res) => {
  try {
    // Get stats by species with counts using raw SQL
    const bySpecies = await sequelize.query(`
      SELECT 
        "species",
        COUNT("species") AS "count",
        SUM(CASE WHEN "healthStatus" = 'healthy' THEN 1 ELSE 0 END) AS "healthy",
        SUM(CASE WHEN "healthStatus" != 'healthy' THEN 1 ELSE 0 END) AS "Unhealthy"
      FROM "livestock"
      WHERE "userId" = :userId
      GROUP BY "species"
    `, {
      replacements: { userId: req.user.id },
      type: QueryTypes.SELECT
    });

    // Get stats by health status
    const byHealth = await sequelize.query(`
      SELECT 
        "healthStatus",
        COUNT("healthStatus") AS "count"
      FROM "livestock"
      WHERE "userId" = :userId
      GROUP BY "healthStatus"
    `, {
      replacements: { userId: req.user.id },
      type: QueryTypes.SELECT
    });

    // Get total counts
    const total = await Livestock.count({
      where: { userId: req.user.id }
    });

    // Get recent additions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAdditions = await Livestock.count({
      where: {
        userId: req.user.id,
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    res.json({
      success: true,
      data: {
        total,
        recentAdditions,
        bySpecies,
        byHealth
      }
    });
  } catch (error) {
    console.error('Get livestock stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createLivestock,
  getMyLivestock,
  getLivestockById,
  updateLivestock,
  deleteLivestock,
  getLivestockStats
};