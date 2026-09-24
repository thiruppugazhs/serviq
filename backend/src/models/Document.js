const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    entityType: {
      type: String,
      enum: ['vehicle', 'driver', 'company'],
      default: 'vehicle',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    documentType: {
      type: String,
      enum: [
        'Insurance',
        'PUC Certificate',
        'Registration (RC)',
        'Road Fitness',
        'Commercial Permit',
        'Driving Licence',
        'Tax Receipt',
        'Other',
      ],
      required: true,
    },
    documentNumber: {
      type: String,
      trim: true,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['valid', 'expiring_soon', 'expired'],
      default: 'valid',
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

module.exports = mongoose.model('Document', documentSchema);
