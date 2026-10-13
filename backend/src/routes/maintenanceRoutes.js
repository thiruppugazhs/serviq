const express = require('express');
const router = express.Router();
const {
  requestMaintenance,
  scheduleMaintenance,
  approveMaintenance,
  rejectMaintenance,
  createMaintenance,
  getMaintenance,
  completeMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.use(protect);

router.post('/request', requestMaintenance); // Drivers, managers, admin
router.post('/schedule', authorize('admin', 'fleet_manager'), scheduleMaintenance);
router.patch('/:id/approve', authorize('admin', 'fleet_manager'), approveMaintenance);
router.patch('/:id/reject', authorize('admin', 'fleet_manager'), rejectMaintenance);
router.patch('/:id/complete', completeMaintenance);

router.route('/')
  .post(authorize('admin', 'fleet_manager'), createMaintenance)
  .get(getMaintenance);

module.exports = router;
