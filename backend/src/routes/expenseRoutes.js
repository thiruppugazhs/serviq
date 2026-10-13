const express = require('express');
const router = express.Router();
const { createExpense, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .post(upload.single('receipt'), createExpense)
  .get(getExpenses);

module.exports = router;
