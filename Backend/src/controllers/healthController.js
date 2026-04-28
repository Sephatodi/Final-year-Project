const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const { HealthRecord, Livestock, User } = require('../models');

const createHealthRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify livestock ownership
    const livestock = await Livestock.findOne({
      where: {
        id: req.body.livestockId,
        userId: req.user.id
      }
    });

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found or access denied' });
    }

    const healthRecord = await HealthRecord.create({
      ...req.body,
      userId: req.user.id,
      syncStatus: 'pending'
    });

    // Update livestock health status if needed (simplified version)
    if (req.body.recordType === 'diagnosis' && req.body.diagnosis) {
      // Get existing medical history or initialize as empty array
      const medicalHistory = livestock.medicalHistory || [];
      medicalHistory.push({
        date: new Date(),
        recordId: healthRecord.id,
        diagnosis: req.body.diagnosis
      });

      await livestock.update({
        healthStatus: 'sick',
        medicalHistory
      });
    }

    res.status(201).json({
      success: true,
      data: healthRecord
    });
  } catch (error) {
    console.error('Create health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHealthRecords = async (req, res) => {
  try {
    const {
      livestockId,
      recordType,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const where = { userId: req.user.id };

    if (livestockId) where.livestockId = livestockId;
    if (recordType) where.recordType = recordType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const records = await HealthRecord.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['date', 'DESC']],
      include: [
        {
          model: Livestock,
          as: 'Livestock',
          attributes: ['id', 'tagNumber', 'name', 'species']
        }
      ]
    });

    res.json({
      success: true,
      data: records.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: records.count,
        pages: Math.ceil(records.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHealthRecordById = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Livestock,
          as: 'Livestock',
          attributes: ['id', 'tagNumber', 'name', 'species', 'breed']
        },
        {
          model: User,
          as: 'Veterinarian',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({ success: true, data: healthRecord });
  } catch (error) {
    console.error('Get health record by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateHealthRecord = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    const allowedUpdates = [
      'symptoms', 'diagnosis', 'treatment', 'medications',
      'notes', 'outcome', 'followUpDate', 'images'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.syncStatus = 'pending';

    await healthRecord.update(updates);

    res.json({ success: true, data: healthRecord });
  } catch (error) {
    console.error('Update health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteHealthRecord = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    await healthRecord.destroy();

    res.json({ success: true, message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHealthRecordsByLivestock = async (req, res) => {
  try {
    const { livestockId } = req.params;
    const { limit = 50 } = req.query;

    // Verify ownership
    const livestock = await Livestock.findOne({
      where: {
        id: livestockId,
        userId: req.user.id
      }
    });

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    const records = await HealthRecord.findAll({
      where: { livestockId },
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Get health records by livestock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVaccinationSchedule = async (req, res) => {
  try {
    const livestock = await Livestock.findAll({
      where: {
        userId: req.user.id,
        status: 'active'
      },
      attributes: ['id', 'tagNumber', 'name', 'species', 'vaccinationStatus']
    });

    const schedule = livestock.map(animal => {
      const vaccinationStatus = animal.vaccinationStatus || {};
      const nextDue = vaccinationStatus.nextDue;
      const lastVaccination = vaccinationStatus.lastVaccination;

      let status = 'unknown';
      if (nextDue) {
        status = new Date(nextDue) < new Date() ? 'overdue' : 'upcoming';
      }

      return {
        livestockId: animal.id,
        tagNumber: animal.tagNumber,
        name: animal.name,
        species: animal.species,
        lastVaccination,
        nextDue,
        status
      };
    }).filter(item => item.nextDue);

    res.json({ success: true, data: schedule });
  } catch (error) {
    console.error('Get vaccination schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const recordTreatment = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    await healthRecord.update({
      treatment: req.body.treatment,
      medications: req.body.medications || [],
      recordType: 'treatment',
      syncStatus: 'pending'
    });

    res.json({ success: true, data: healthRecord });
  } catch (error) {
    console.error('Record treatment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHealthStats = async (req, res) => {
  try {
    // Get counts by record type
    const byType = await HealthRecord.findAll({
      where: { userId: req.user.id },
      attributes: [
        'recordType',
        [Sequelize.fn('COUNT', Sequelize.col('recordType')), 'count']
      ],
      group: ['recordType']
    });

    // Get common diagnoses
    const commonDiagnoses = await HealthRecord.findAll({
      where: {
        userId: req.user.id,
        diagnosis: { [Op.ne]: null }
      },
      attributes: [
        'diagnosis',
        [Sequelize.fn('COUNT', Sequelize.col('diagnosis')), 'count']
      ],
      group: ['diagnosis'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('diagnosis')), 'DESC']],
      limit: 10
    });

    // Get monthly trends (alternative to DATE_TRUNC for cross-database compatibility)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRecords = await HealthRecord.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: sixMonthsAgo
        }
      },
      attributes: ['id', 'date', 'recordType']
    });

    // Group by month manually
    const monthlyTrends = {};
    monthlyRecords.forEach(record => {
      const month = record.date.toISOString().substring(0, 7); // YYYY-MM format
      if (!monthlyTrends[month]) {
        monthlyTrends[month] = { month, count: 0 };
      }
      monthlyTrends[month].count++;
    });

    res.json({
      success: true,
      data: {
        byType,
        commonDiagnoses,
        monthlyTrends: Object.values(monthlyTrends).sort((a, b) => a.month.localeCompare(b.month))
      }
    });
  } catch (error) {
    console.error('Get health stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthRecordsByLivestock,
  getVaccinationSchedule,
  recordTreatment,
  getHealthStats
};