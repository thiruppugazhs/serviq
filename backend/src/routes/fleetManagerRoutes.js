const express = require('express');
const router = express.Router();
const {
  createFleetManager,
  getFleetManagers,
  getFleetManagerById,
  updateFleetManager,
  toggleFleetManagerStatus,
} = require('../controllers/fleetManagerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

// All fleet manager management routes require Admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .post(createFleetManager)
  .get(getFleetManagers);

router.route('/:id')
  .get(getFleetManagerById)
  .put(updateFleetManager);

router.patch('/:id/toggle-status', toggleFleetManagerStatus);

module.exports = router;
