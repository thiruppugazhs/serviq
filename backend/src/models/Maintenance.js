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
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    currentOdometer: {
      type: Number,
      default: 0,
    },
    runningKmInterval: {
      type: Number,
      default: 0,
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
    scheduledStartDate: {
      type: Date,
    },
    scheduledEndDate: {
      type: Date,
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
      enum: ['pending_approval', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'good', 'due_soon', 'overdue'],
      default: 'pending_approval',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    approvalNotes: {
      type: String,
      trim: true,
      default: '',
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
