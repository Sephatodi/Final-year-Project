const { body, param, query, validationResult } = require('express-validator');
const { LIVESTOCK_SPECIES, RECORD_TYPES, CONSULTATION_PRIORITY } = require('../utils/constants');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

// Auth validations
const authValidations = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phoneNumber').matches(/^[0-9]{8}$/).withMessage('Valid Botswana phone number is required'),
    body('role').optional().isIn(['farmer', 'veterinarian', 'extension_officer'])
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

// Livestock validations
const livestockValidations = {
  create: [
    body('tagNumber').notEmpty().withMessage('Tag number is required'),
    body('species').isIn(Object.values(LIVESTOCK_SPECIES)).withMessage('Valid species is required'),
    body('gender').isIn(['male', 'female']).withMessage('Valid gender is required'),
    body('acquisitionDate').optional().isISO8601().toDate(),
    body('birthDate').optional().isISO8601().toDate()
  ],
  update: [
    body('name').optional().trim(),
    body('weight').optional().isFloat({ min: 0 }),
    body('healthStatus').optional().isIn(['healthy', 'sick', 'recovering', 'quarantine']),
    body('location').optional().trim()
  ]
};

// Health record validations
const healthValidations = {
  create: [
    body('livestockId').isUUID().withMessage('Valid livestock ID is required'),
    body('recordType').isIn(Object.values(RECORD_TYPES)).withMessage('Valid record type is required'),
    body('symptoms').optional().isArray(),
    body('date').optional().isISO8601().toDate()
  ]
};

// Consultation validations
const consultationValidations = {
  create: [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('priority').optional().isIn(Object.values(CONSULTATION_PRIORITY)),
    body('livestockId').optional().isUUID(),
    body('symptoms').optional().isArray()
  ],
  message: [
    body('content').notEmpty().withMessage('Message content is required'),
    body('type').optional().isIn(['text', 'image', 'system'])
  ]
};

// ID param validation
const idValidation = [
  param('id').isUUID().withMessage('Valid ID is required')
];

// Pagination validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
];

module.exports = {
  validate,
  authValidations,
  livestockValidations,
  healthValidations,
  consultationValidations,
  idValidation,
  paginationValidation
};