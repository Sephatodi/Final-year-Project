/**
 * userRoutes.js - User management routes
 * Handles all farmer and veterinarian management endpoints
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Farmer endpoints
router.get('/farmers', userController.getFarmers);
router.post('/farmers', userController.addFarmer);
router.get('/farmers/:id', userController.getFarmerById);
router.put('/farmers/:id', userController.updateFarmer);
router.delete('/farmers/:id', userController.deleteFarmer);
router.patch('/farmers/:id/status', userController.updateFarmerStatus);

// Veterinarian endpoints
router.get('/veterinarians', userController.getVeterinarians);
router.post('/veterinarians', userController.addVeterinarian);
router.get('/veterinarians/:id', userController.getVeterinarianById);
router.put('/veterinarians/:id', userController.updateVeterinarian);
router.delete('/veterinarians/:id', userController.deleteVeterinarian);
router.patch('/veterinarians/:id/status', userController.updateVeterinarianStatus);

module.exports = router;
