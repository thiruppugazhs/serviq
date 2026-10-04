const express = require('express');
const router = express.Router();
const {
  getDriverProfile,
  updateDriverProfile,
  getAssignedVehicle,
  getVehicleHealth,
  getVehicleMaintenance,
  getVehicleServiceHistory,
  getVehicleDocuments,
  getOdometerHistory,
  updateOdometer,
  getIssues,
  reportIssue,
  getRepairs,
  getRepairById,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require('../controllers/driverPortalController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

// Enforce authentication and DRIVER role for all driver portal routes
router.use(protect);
router.use(authorize('driver'));

// Driver Profile
router.route('/profile')
  .get(getDriverProfile)
  .patch(upload.single('profilePhoto'), updateDriverProfile);

// Assigned Vehicle & Diagnostics
router.get('/vehicle', getAssignedVehicle);
router.get('/vehicle/health', getVehicleHealth);
router.get('/vehicle/maintenance', getVehicleMaintenance);
router.get('/vehicle/service-history', getVehicleServiceHistory);
router.get('/vehicle/documents', getVehicleDocuments);

// Odometer
router.route('/odometer')
  .get(getOdometerHistory)
  .post(updateOdometer);

// Issues & Breakdown reporting
router.route('/issues')
  .get(getIssues)
  .post(upload.array('photos', 5), reportIssue);

// Repairs Tracking
router.get('/repairs', getRepairs);
router.get('/repairs/:id', getRepairById);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);

module.exports = router;
