const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .post(upload.single('receipt'), createExpense)
  .get(getExpenses);

router.delete('/:id', authorize('admin', 'fleet_manager'), deleteExpense);

module.exports = router;
