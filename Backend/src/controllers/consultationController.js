const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const { Consultation, User, Livestock, HealthRecord } = require('../models');
const notificationService = require('../services/notificationService');
const aiDiagnosticService = require('../services/aiDiagnosticService');

const createConsultation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Run AI diagnosis if symptoms provided
    let aiDiagnosis = null;
    if (req.body.symptoms && req.body.symptoms.length > 0) {
      aiDiagnosis = await aiDiagnosticService.analyzeSymptoms(req.body.symptoms);
    }

    const consultation = await Consultation.create({
      ...req.body,
      farmerId: req.user.id,
      aiDiagnosis,
      status: 'pending',
      syncStatus: 'pending'
    });

    // Notify available veterinarians
    await notificationService.notifyVetsNewConsultation(consultation);

    // If emergency, notify immediately
    if (req.body.priority === 'emergency') {
      await notificationService.sendEmergencyAlert(consultation);
    }

    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getConsultations = async (req, res) => {
  try {
    const {
      status,
      priority,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    let where = {};

    // Filter based on user role
    if (req.user.role === 'farmer') {
      where.farmerId = req.user.id;
    } else if (req.user.role === 'veterinarian') {
      where.veterinarianId = req.user.id;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const consultations = await Consultation.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'Farmer',
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber']
        },
        {
          model: User,
          as: 'Veterinarian',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Livestock,
          as: 'Livestock',
          attributes: ['id', 'tagNumber', 'name', 'species']
        }
      ]
    });

    res.json({
      success: true,
      data: consultations.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: consultations.count,
        pages: Math.ceil(consultations.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'Farmer',
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email']
        },
        {
          model: User,
          as: 'Veterinarian',
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber']
        },
        {
          model: Livestock,
          as: 'Livestock',
          include: [
            {
              model: HealthRecord,
              as: 'healthRecords',
              limit: 10,
              order: [['date', 'DESC']]
            }
          ]
        }
      ]
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.farmerId !== req.user.id && 
        consultation.veterinarianId !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, data: consultation });
  } catch (error) {
    console.error('Get consultation by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const allowedUpdates = ['subject', 'description', 'symptoms', 'priority'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.syncStatus = 'pending';

    await consultation.update(updates);

    res.json({ success: true, data: consultation });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const assignVeterinarian = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    const vet = await User.findOne({
      where: {
        id: req.body.veterinarianId,
        role: 'veterinarian'
      }
    });

    if (!vet) {
      return res.status(404).json({ message: 'Veterinarian not found' });
    }

    await consultation.update({
      veterinarianId: vet.id,
      status: 'assigned',
      syncStatus: 'pending'
    });

    // Notify farmer and vet
    await notificationService.notifyAssignment(consultation);

    res.json({ success: true, data: consultation });
  } catch (error) {
    console.error('Assign veterinarian error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.farmerId !== req.user.id && 
        consultation.veterinarianId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = {
      id: Date.now().toString(),
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      content: req.body.content,
      type: req.body.type || 'text',
      timestamp: new Date(),
      read: false
    };

    const messages = consultation.messages || [];
    messages.push(message);

    await consultation.update({
      messages,
      syncStatus: 'pending'
    });

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.to(`consultation-${consultation.id}`).emit('new-message', message);

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addImages = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the farmer can add images' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    const currentImages = consultation.images || [];
    const updatedImages = [...currentImages, ...imageUrls];

    await consultation.update({
      images: updatedImages,
      syncStatus: 'pending'
    });

    // Run AI diagnosis on new images
    if (imageUrls.length > 0) {
      const aiDiagnosis = await aiDiagnosticService.analyzeImages(imageUrls);
      if (aiDiagnosis) {
        await consultation.update({
          aiDiagnosis: {
            ...consultation.aiDiagnosis,
            imageAnalysis: aiDiagnosis
          }
        });
      }
    }

    res.json({ success: true, data: updatedImages });
  } catch (error) {
    console.error('Add images error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const completeConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.veterinarianId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the assigned vet can complete consultations' });
    }

    await consultation.update({
      status: 'completed',
      recommendations: req.body.recommendations,
      prescription: req.body.prescription,
      endTime: new Date(),
      syncStatus: 'pending'
    });

    // Create health record if diagnosis provided
    if (consultation.livestockId && consultation.aiDiagnosis) {
      await HealthRecord.create({
        livestockId: consultation.livestockId,
        userId: consultation.farmerId,
        veterinarianId: req.user.id,
        recordType: 'diagnosis',
        diagnosis: consultation.aiDiagnosis.primaryDiagnosis,
        symptoms: consultation.symptoms,
        treatment: req.body.recommendations,
        notes: `From consultation #${consultation.id}`
      });
    }

    // Notify farmer
    await notificationService.notifyConsultationComplete(consultation);

    res.json({ success: true, data: consultation });
  } catch (error) {
    console.error('Complete consultation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const rateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the farmer can rate consultations' });
    }

    await consultation.update({
      rating: req.body.rating,
      feedback: req.body.feedback
    });

    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate consultation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    if (consultation.farmerId !== req.user.id && consultation.veterinarianId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await consultation.update({
      status: 'cancelled',
      syncStatus: 'pending'
    });

    // Notify other party
    await notificationService.notifyCancellation(consultation, req.user.id);

    res.json({ success: true, message: 'Consultation cancelled' });
  } catch (error) {
    console.error('Cancel consultation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getConsultationStats = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === 'farmer') {
      where.farmerId = req.user.id;
    } else if (req.user.role === 'veterinarian') {
      where.veterinarianId = req.user.id;
    }

    const total = await Consultation.count({ where });

    const byStatus = await Consultation.findAll({
      where,
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const byPriority = await Consultation.findAll({
      where,
      attributes: [
        'priority',
        [Sequelize.fn('COUNT', Sequelize.col('priority')), 'count']
      ],
      group: ['priority']
    });

    const avgResponseTime = await Consultation.findAll({
      where: {
        ...where,
        status: 'completed',
        startTime: { [Op.ne]: null }
      },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.literal('EXTRACT(EPOCH FROM ("startTime" - "createdAt"))/3600')), 'avgHours']
      ],
      raw: true
    });

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        byPriority,
        avgResponseTime: avgResponseTime[0]?.avgHours || 0
      }
    });
  } catch (error) {
    console.error('Get consultation stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  assignVeterinarian,
  addMessage,
  addImages,
  completeConsultation,
  rateConsultation,
  cancelConsultation,
  getConsultationStats
};