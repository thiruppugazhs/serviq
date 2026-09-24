const express = require('express');
const router = express.Router();
const { createExpense, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .post(authorize('admin', 'fleet_manager'), upload.single('receipt'), createExpense)
  .get(authorize('admin', 'fleet_manager'), getExpenses);

module.exports = router;
