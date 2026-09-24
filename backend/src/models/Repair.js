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
      enum: ['Engine', 'Brakes', 'Transmission', 'Electrical', 'Tire', 'Body', 'Suspension', 'Air Conditioning', 'Oil / Fluids', 'Other'],
      required: [true, 'Issue type is required'],
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
      enum: ['reported', 'in_progress', 'completed', 'rejected'],
      default: 'reported',
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
