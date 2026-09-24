const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    category: {
      type: String,
      enum: ['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Fine', 'Parking', 'Other'],
      default: 'Fuel',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    odometer: {
      type: Number,
    },
    fuelLiters: {
      type: Number,
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
    },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
