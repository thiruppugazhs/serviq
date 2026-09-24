const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
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
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
    },
    intervalMonths: {
      type: Number,
      default: 6,
    },
    intervalKm: {
      type: Number,
      default: 10000,
    },
    lastServiceDate: {
      type: Date,
    },
    lastServiceOdometer: {
      type: Number,
      default: 0,
    },
    nextDueDate: {
      type: Date,
    },
    nextDueOdometer: {
      type: Number,
    },
    cost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['good', 'due_soon', 'overdue', 'completed'],
      default: 'good',
    },
    serviceCenter: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
