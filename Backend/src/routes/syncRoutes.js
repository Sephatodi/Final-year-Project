const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  pushChanges,
  pullChanges,
  getSyncStatus,
  resolveConflicts,
  getSyncHistory,
  getPendingChanges,
  markSynced,
  getSyncStats
} = require('../controllers/syncController');

router.use(protect);

router.post('/push', pushChanges);
router.get('/pull', pullChanges);
router.get('/status', getSyncStatus);
router.get('/pending', getPendingChanges);
router.get('/history', getSyncHistory);
router.get('/stats', getSyncStats);
router.post('/resolve-conflicts', resolveConflicts);
router.post('/mark-synced', markSynced);

module.exports = router;