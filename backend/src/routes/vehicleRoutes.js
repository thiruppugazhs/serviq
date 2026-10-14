const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  updateOdometer,
  bulkImportVehicles,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.use(protect);

router.post('/bulk-import', authorize('admin', 'fleet_manager'), bulkImportVehicles);

router.route('/')
  .post(authorize('admin', 'fleet_manager'), createVehicle)
  .get(getVehicles);

router.route('/:id')
  .get(getVehicleById)
  .put(authorize('admin', 'fleet_manager'), updateVehicle);

router.patch('/:id/odometer', updateOdometer);

module.exports = router;
