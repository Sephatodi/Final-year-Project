/**
 * userController.js - User management for admin
 * Handles CRUD operations for farmers and veterinarians
 */

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const logger = require('../utils/logger');

// Get all farmers
exports.getFarmers = async (req, res) => {
  try {
    const { status, location, search } = req.query;
    const where = { role: 'farmer' };
    
    if (status) {
      where.isActive = status === 'active';
    }
    
    if (location) {
      where.farmLocation = location;
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const farmers = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: farmers.map(f => ({
        id: f.id,
        name: f.name,
        email: f.email,
        phone: f.phone,
        farmName: f.farmName,
        location: f.farmLocation,
        status: f.isActive ? 'active' : 'inactive',
        registeredDate: f.createdAt
      }))
    });
  } catch (error) {
    logger.error('Error fetching farmers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch farmers',
      error: error.message 
    });
  }
};

// Get all veterinarians
exports.getVeterinarians = async (req, res) => {
  try {
    const { status, specialization, search } = req.query;
    const where = { role: 'veterinarian' };
    
    if (status) {
      where.isActive = status === 'active';
    }
    
    if (specialization) {
      where.specialization = specialization;
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const vets = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: vets.map(v => ({
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        license: v.license || 'N/A',
        specialization: v.specialization || 'General Practice',
        status: v.isActive ? 'active' : 'inactive',
        registeredDate: v.createdAt
      }))
    });
  } catch (error) {
    logger.error('Error fetching veterinarians:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch veterinarians',
      error: error.message 
    });
  }
};

// Get single farmer
exports.getFarmerById = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await User.findOne({
      where: { id, role: 'farmer' },
      attributes: { exclude: ['password'] }
    });

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    res.json({
      success: true,
      data: {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        farmName: farmer.farmName,
        location: farmer.farmLocation,
        status: farmer.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error fetching farmer:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch farmer' });
  }
};

// Get single veterinarian
exports.getVeterinarianById = async (req, res) => {
  try {
    const { id } = req.params;
    const vet = await User.findOne({
      where: { id, role: 'veterinarian' },
      attributes: { exclude: ['password'] }
    });

    if (!vet) {
      return res.status(404).json({ success: false, message: 'Veterinarian not found' });
    }

    res.json({
      success: true,
      data: {
        id: vet.id,
        name: vet.name,
        email: vet.email,
        phone: vet.phone,
        license: vet.license,
        specialization: vet.specialization,
        status: vet.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error fetching veterinarian:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch veterinarian' });
  }
};

// Add new farmer
exports.addFarmer = async (req, res) => {
  try {
    const { name, email, phone, farmName, location, status } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !farmName || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const farmer = await User.create({
      name,
      email,
      phone,
      farmName,
      farmLocation: location,
      password: hashedPassword,
      role: 'farmer',
      isActive: status === 'active' || status === true,
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Farmer added successfully',
      data: {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        farmName: farmer.farmName,
        location: farmer.farmLocation,
        status: farmer.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error adding farmer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add farmer',
      error: error.message 
    });
  }
};

// Add new veterinarian
exports.addVeterinarian = async (req, res) => {
  try {
    const { name, email, phone, license, specialization, status } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !license || !specialization) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const vet = await User.create({
      name,
      email,
      phone,
      license,
      specialization,
      password: hashedPassword,
      role: 'veterinarian',
      isActive: status === 'active' || status === true,
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Veterinarian added successfully',
      data: {
        id: vet.id,
        name: vet.name,
        email: vet.email,
        phone: vet.phone,
        license: vet.license,
        specialization: vet.specialization,
        status: vet.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error adding veterinarian:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add veterinarian',
      error: error.message 
    });
  }
};

// Update farmer
exports.updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, farmName, location, status } = req.body;

    const farmer = await User.findOne({
      where: { id, role: 'farmer' }
    });

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    // Check if new email is unique
    if (email && email !== farmer.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
    }

    const updated = await farmer.update({
      name: name || farmer.name,
      email: email || farmer.email,
      phone: phone || farmer.phone,
      farmName: farmName || farmer.farmName,
      farmLocation: location || farmer.farmLocation,
      isActive: status !== undefined ? (status === 'active' || status === true) : farmer.isActive
    });

    res.json({
      success: true,
      message: 'Farmer updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        farmName: updated.farmName,
        location: updated.farmLocation,
        status: updated.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error updating farmer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update farmer',
      error: error.message 
    });
  }
};

// Update veterinarian
exports.updateVeterinarian = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, license, specialization, status } = req.body;

    const vet = await User.findOne({
      where: { id, role: 'veterinarian' }
    });

    if (!vet) {
      return res.status(404).json({ success: false, message: 'Veterinarian not found' });
    }

    // Check if new email is unique
    if (email && email !== vet.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
    }

    const updated = await vet.update({
      name: name || vet.name,
      email: email || vet.email,
      phone: phone || vet.phone,
      license: license || vet.license,
      specialization: specialization || vet.specialization,
      isActive: status !== undefined ? (status === 'active' || status === true) : vet.isActive
    });

    res.json({
      success: true,
      message: 'Veterinarian updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        license: updated.license,
        specialization: updated.specialization,
        status: updated.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error updating veterinarian:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update veterinarian',
      error: error.message 
    });
  }
};

// Delete farmer
exports.deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;

    const farmer = await User.findOne({
      where: { id, role: 'farmer' }
    });

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    await farmer.destroy();

    res.json({
      success: true,
      message: 'Farmer deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting farmer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete farmer',
      error: error.message 
    });
  }
};

// Delete veterinarian
exports.deleteVeterinarian = async (req, res) => {
  try {
    const { id } = req.params;

    const vet = await User.findOne({
      where: { id, role: 'veterinarian' }
    });

    if (!vet) {
      return res.status(404).json({ success: false, message: 'Veterinarian not found' });
    }

    await vet.destroy();

    res.json({
      success: true,
      message: 'Veterinarian deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting veterinarian:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete veterinarian',
      error: error.message 
    });
  }
};

// Update farmer status
exports.updateFarmerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const farmer = await User.findOne({
      where: { id, role: 'farmer' }
    });

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    const updated = await farmer.update({
      isActive: status === 'active'
    });

    res.json({
      success: true,
      message: 'Farmer status updated successfully',
      data: {
        id: updated.id,
        status: updated.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error updating farmer status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update farmer status',
      error: error.message 
    });
  }
};

// Update veterinarian status
exports.updateVeterinarianStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const vet = await User.findOne({
      where: { id, role: 'veterinarian' }
    });

    if (!vet) {
      return res.status(404).json({ success: false, message: 'Veterinarian not found' });
    }

    const updated = await vet.update({
      isActive: status === 'active'
    });

    res.json({
      success: true,
      message: 'Veterinarian status updated successfully',
      data: {
        id: updated.id,
        status: updated.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error) {
    logger.error('Error updating veterinarian status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update veterinarian status',
      error: error.message 
    });
  }
};
