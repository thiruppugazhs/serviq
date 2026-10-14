const express = require('express');
const router = express.Router();
const {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  toggleDriverStatus,
  deleteDriver,
  bulkImportDrivers,
} = require('../controllers/driverController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/bulk-import', authorize('admin', 'fleet_manager'), bulkImportDrivers);

router.route('/')
  .post(authorize('admin', 'fleet_manager'), upload.single('profilePhoto'), createDriver)
  .get(authorize('admin', 'fleet_manager'), getDrivers);

router.route('/:id')
  .get(authorize('admin', 'fleet_manager', 'driver'), getDriverById)
  .put(authorize('admin', 'fleet_manager'), updateDriver)
  .delete(authorize('admin', 'fleet_manager'), deleteDriver);

router.patch('/:id/toggle-status', authorize('admin', 'fleet_manager'), toggleDriverStatus);

module.exports = router;
