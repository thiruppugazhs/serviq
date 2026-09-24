const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

// @desc    Log a new expense
// @route   POST /api/expenses
// @access  Private (Admin & Fleet Manager)
exports.createExpense = async (req, res, next) => {
  try {
    const { vehicleId, category, amount, date, odometer, fuelLiters, notes } = req.body;

    if (!vehicleId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle and amount are required',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const expense = await Expense.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      category: category || 'Fuel',
      amount: Number(amount),
      date: date || new Date(),
      odometer: odometer ? Number(odometer) : vehicle.odometer,
      fuelLiters: fuelLiters ? Number(fuelLiters) : undefined,
      receiptUrl: req.file ? `/uploads/${req.file.filename}` : '',
      notes: notes || '',
      loggedBy: req.user._id,
    });

    // If expense odometer is higher, update vehicle odometer
    if (odometer && Number(odometer) > vehicle.odometer) {
      vehicle.odometer = Number(odometer);
      await vehicle.save();
    }

    const populated = await Expense.findById(expense._id)
      .populate('vehicle', 'vehicleNumber model manufacturer')
      .populate('loggedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Expense recorded successfully',
      expense: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expenses with filtering & summary totals
// @route   GET /api/expenses
// @access  Private (Admin & Fleet Manager)
exports.getExpenses = async (req, res, next) => {
  try {
    const query = { organization: req.organizationId };
    if (req.query.vehicleId) query.vehicle = req.query.vehicleId;
    if (req.query.category) query.category = req.query.category;

    const expenses = await Expense.find(query)
      .populate('vehicle', 'vehicleNumber model manufacturer')
      .populate('loggedBy', 'name')
      .sort({ date: -1 });

    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};
