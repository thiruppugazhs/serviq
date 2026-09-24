const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.use(protect);
router.use(authorize('admin', 'fleet_manager'));

router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
