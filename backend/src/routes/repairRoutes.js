const express = require('express');
const router = express.Router();
const {
  reportIssue,
  getRepairs,
  getRepairById,
  updateRepairStatus,
  approveRepair,
  rejectRepair,
} = require('../controllers/repairController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .post(upload.array('photos', 5), reportIssue)
  .get(getRepairs);

router.patch('/:id/approve', authorize('admin', 'fleet_manager'), approveRepair);
router.patch('/:id/reject', authorize('admin', 'fleet_manager'), rejectRepair);

router.route('/:id')
  .get(getRepairById);

router.patch('/:id/status', updateRepairStatus);

module.exports = router;
