const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthRecordsByLivestock,
  getVaccinationSchedule,
  recordTreatment,
  getHealthStats
} = require('../controllers/healthController');

router.use(protect); // All health routes require authentication

router.route('/')
  .post([
    body('livestockId').notEmpty().withMessage('Livestock ID is required'),
    body('recordType').isIn(['vaccination', 'treatment', 'examination', 'symptom', 'diagnosis']),
    body('symptoms').optional().isArray(),
    body('date').optional().isISO8601()
  ], createHealthRecord)
  .get(getHealthRecords);

router.get('/stats', getHealthStats);
router.get('/vaccination-schedule', getVaccinationSchedule);

router.get('/livestock/:livestockId', getHealthRecordsByLivestock);

router.route('/:id')
  .get(getHealthRecordById)
  .put(updateHealthRecord)
  .delete(deleteHealthRecord);

router.post('/:id/treatment', [
  body('treatment').notEmpty(),
  body('medications').optional().isArray()
], recordTreatment);

module.exports = router;