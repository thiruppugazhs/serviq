const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    driverId: {
      type: String,
      required: [true, 'Driver ID is required'],
      trim: true,
      uppercase: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    drivingLicenceNumber: {
      type: String,
      required: [true, 'Driving licence number is required'],
      trim: true,
      uppercase: true,
    },
    licenceExpiry: {
      type: Date,
      required: [true, 'Licence expiry date is required'],
    },
    dateOfBirth: {
      type: Date,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    employmentStatus: {
      type: String,
      enum: ['full_time', 'contract', 'probation', 'part_time'],
      default: 'full_time',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    documents: [
      {
        title: String,
        documentType: String,
        fileUrl: String,
        expiryDate: Date,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_duty', 'off_duty'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Driver', driverSchema);
