const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issueType: {
      type: String,
      default: 'General Repair',
    },
    repairWhat: {
      type: String,
      trim: true,
      default: '',
    },
    reasonWhy: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    photos: [
      {
        type: String,
      },
    ],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending_approval', 'reported', 'approved', 'in_progress', 'completed', 'rejected'],
      default: 'pending_approval',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvalNotes: {
      type: String,
      trim: true,
      default: '',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    odometerAtIncident: {
      type: Number,
      default: 0,
    },
    assignedWorkshop: {
      type: String,
      trim: true,
      default: '',
    },
    cost: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Repair', repairSchema);
