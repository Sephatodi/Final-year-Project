// backend/src/routes/consultationRoutes.js
const express = require('express');
const { Consultation, Message, User, Livestock, DiseaseReport } = require('../models');
const { protect } = require('../middleware/auth');
const aiDiagnosticService = require('../services/aiDiagnosticService');

const router = express.Router();

// @route   POST /api/consultations
// @desc    Create a new consultation (single consultation for multiple animals)
router.post('/', protect, async (req, res) => {
  try {
    const { livestockIds, subject, description, symptoms, priority } = req.body;
    
    console.log('Creating consultation with payload:', { livestockIds, subject, description, symptoms, priority });
    console.log('User ID:', req.user.id);
    
    // Validate required fields
    if (!livestockIds || livestockIds.length === 0) {
      return res.status(400).json({ error: 'At least one livestock ID is required' });
    }
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Run AI diagnosis if symptoms provided
    let aiAnalysis = null;
    if (symptoms && symptoms.length > 0) {
      try {
        aiAnalysis = await aiDiagnosticService.analyzeSymptoms(symptoms);
        console.log('AI diagnosis completed:', aiAnalysis);
      } catch (diagError) {
        console.warn('AI diagnosis failed, continuing without it:', diagError);
        aiAnalysis = null;
      }
    }

    // Create SINGLE consultation with multiple livestock IDs
    const consultation = await Consultation.create({
      farmerId: req.user.id,
      title: subject,
      livestockId: livestockIds[0], // Primary animal
      subject,
      description,
      symptoms: symptoms || [],
      aiDiagnosis: aiAnalysis,
      priority: priority || 'normal',
      status: 'pending',
      metadata: {
        relatedLivestockIds: livestockIds // Store all related animals
      }
    });

    console.log('Consultation created:', consultation.id);

    // Create notifications for all available veterinarians
    const { Notification } = require('../models');
    const vets = await User.findAll({
      where: { role: 'veterinarian', isActive: true }
    });

    for (const vet of vets) {
      await Notification.create({
        userId: vet.id,
        type: 'new_consultation',
        title: 'New Consultation Request',
        message: `Farmer ${req.user.name} requested consultation for ${livestockIds.length} animal(s): ${subject}`,
        severity: priority === 'emergency' ? 'critical' : 'high',
        consultationId: consultation.id,
        relatedUserId: req.user.id
      });
    }

    res.status(201).json({
      message: 'Consultation created successfully',
      consultation,
      consultationId: consultation.id
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
});

// @route   GET /api/consultations
// @desc    Get consultations for current user
router.get('/', protect, async (req, res) => {
  try {
    let where = {};
    const { Op } = require('sequelize');
    
    if (req.user.role === 'farmer') {
      where.farmerId = req.user.id;
    } else if (req.user.role === 'veterinarian' || req.user.role === 'vet') {
      // Vets get: (1) pending consultations with no vet assigned, (2) active consultations they accepted
      where[Op.or] = [
        { status: 'pending', veterinarianId: null },
        { veterinarianId: req.user.id }
      ];
    }
    
    const consultations = await Consultation.findAll({
      where,
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name', 'email', 'phone', 'farmName'] },
        { model: User, as: 'veterinarian', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Livestock, attributes: ['id', 'name', 'tagId', 'species'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ consultations });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/consultations/pending
// @desc    Get pending consultations for vets
router.get('/pending', protect, async (req, res) => {
  try {
    if (req.user.role !== 'veterinarian' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const consultations = await Consultation.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name', 'email', 'phone', 'farmName', 'farmLocation'] },
        { model: Livestock, attributes: ['id', 'name', 'tagId', 'species'] }
      ],
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'ASC']
      ]
    });
    
    res.json({ consultations });
  } catch (error) {
    console.error('Get pending consultations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/consultations/:id/accept
// @desc    Accept a consultation (vet)
router.put('/:id/accept', protect, async (req, res) => {
  try {
    if (req.user.role !== 'veterinarian' && req.user.role !== 'vet') {
      return res.status(403).json({ error: 'Only veterinarians can accept consultations' });
    }
    
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (consultation.status !== 'pending') {
      return res.status(400).json({ error: 'Consultation is not pending' });
    }
    
    // Update consultation with vet details
    await consultation.update({
      veterinarianId: req.user.id,
      status: 'active',
      acceptedAt: new Date()
    });

    // Get updated consultation with relationships
    const updatedConsultation = await Consultation.findByPk(req.params.id, {
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name', 'email', 'phone', 'farmName'] },
        { model: User, as: 'veterinarian', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Livestock, attributes: ['id', 'name', 'tagId', 'species', 'healthStatus'] }
      ]
    });
    
    // Create notification for farmer that vet accepted
    const { Notification } = require('../models');
    await Notification.create({
      userId: consultation.farmerId,
      type: 'consultation_update',
      title: `Dr. ${req.user.name} accepted your consultation`,
      message: `Your consultation request has been accepted. Start the conversation with the veterinarian.`,
      severity: 'normal',
      consultationId: consultation.id,
      relatedUserId: req.user.id
    });
    
    console.log('Consultation accepted:', consultation.id, 'by vet:', req.user.id);
    
    res.json({
      message: 'Consultation accepted successfully',
      consultation: updatedConsultation
    });
  } catch (error) {
    console.error('Accept consultation error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// @route   GET /api/consultations/:id/messages
// @desc    Get messages for a consultation
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    
    // Check authorization
    if (consultation.farmerId !== req.user.id && consultation.veterinarianId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const messages = await Message.findAll({
      where: { consultationId: req.params.id },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'role', 'avatar'] }
      ],
      order: [['createdAt', 'ASC']]
    });
    
    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/consultations/:id/messages
// @desc    Send a message
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { content, type, attachments } = req.body;
    const consultation = await Consultation.findByPk(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    
    // Check authorization
    if (consultation.farmerId !== req.user.id && consultation.veterinarianId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const message = await Message.create({
      consultationId: req.params.id,
      senderId: req.user.id,
      content,
      type: type || 'text',
      attachments: attachments || []
    });
    
    const messageWithSender = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role', 'avatar'] }]
    });
    
    // In production, broadcast via WebSocket
    
    res.status(201).json({
      message: 'Message sent',
      data: messageWithSender
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/consultations/:id/diagnosis
// @desc    Submit final diagnosis
router.post('/:id/diagnosis', protect, async (req, res) => {
  try {
    const { diagnosis, treatment, isNotifiable } = req.body;
    const consultation = await Consultation.findByPk(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    
    // Only vet who accepted can submit diagnosis
    if (consultation.veterinarianId !== req.user.id) {
      return res.status(403).json({ error: 'Only assigned veterinarian can submit diagnosis' });
    }
    
    await consultation.update({
      finalDiagnosis: diagnosis,
      treatment,
      isNotifiable: isNotifiable || false,
      status: 'resolved',
      completedAt: new Date()
    });
    
    // If notifiable disease, create disease report
    if (isNotifiable) {
      const farmer = await User.findByPk(consultation.farmerId);
      await DiseaseReport.create({
        consultationId: consultation.id,
        reporterId: req.user.id,
        disease: diagnosis,
        location: farmer?.farmLocation,
        severity: 'high',
        status: 'reported'
      });
    }
    
    res.json({
      message: 'Diagnosis submitted successfully',
      consultation
    });
  } catch (error) {
    console.error('Submit diagnosis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;