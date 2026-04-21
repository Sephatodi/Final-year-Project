const express = require('express');
const router = express.Router();
const { query, body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getKnowledgeBase,
  getKnowledgeEntryById,
  searchKnowledgeBase,
  getKnowledgeByCategory,
  getKnowledgeBySpecies,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  getOfflinePackage,
  incrementViews
} = require('../controllers/knowledgeController');

// Public routes (accessible even without full auth for offline cache)
router.get('/offline-package', protect, getOfflinePackage);

// Protected routes
router.use(protect);

router.route('/')
  .get(getKnowledgeBase)
  .post(
    authorize('veterinarian', 'admin'),
    [
      body('title').notEmpty(),
      body('category').isIn(['disease', 'pest', 'treatment', 'vaccination', 'husbandry', 'nutrition']),
      body('species').isArray(),
      body('symptoms').optional().isArray()
    ],
    createKnowledgeEntry
  );

router.get('/search', [
  query('q').notEmpty(),
  query('language').optional().isIn(['en', 'tn'])
], searchKnowledgeBase);

router.get('/category/:category', getKnowledgeByCategory);
router.get('/species/:species', getKnowledgeBySpecies);

router.route('/:id')
  .get(getKnowledgeEntryById)
  .put(
    authorize('veterinarian', 'admin'),
    updateKnowledgeEntry
  )
  .delete(
    authorize('admin'),
    deleteKnowledgeEntry
  );

router.post('/:id/view', incrementViews);

module.exports = router;