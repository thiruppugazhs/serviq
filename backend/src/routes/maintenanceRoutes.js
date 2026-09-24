const express = require('express');
const router = express.Router();
const {
  createMaintenance,
  getMaintenance,
  completeMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.use(protect);

router.route('/')
  .post(authorize('admin', 'fleet_manager'), createMaintenance)
  .get(getMaintenance);

router.patch('/:id/complete', authorize('admin', 'fleet_manager'), completeMaintenance);

module.exports = router;
