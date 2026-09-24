const express = require('express');
const router = express.Router();
const {
  reportIssue,
  getRepairs,
  getRepairById,
  updateRepairStatus,
} = require('../controllers/repairController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .post(upload.array('photos', 5), reportIssue)
  .get(getRepairs);

router.route('/:id')
  .get(getRepairById);

router.patch('/:id/status', authorize('admin', 'fleet_manager'), updateRepairStatus);

module.exports = router;
