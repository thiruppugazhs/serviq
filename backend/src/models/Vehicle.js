const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ['Bus', 'Truck', 'Van', 'Sedan', 'Hauler', 'EV', 'SUV', 'Other'],
      default: 'Truck',
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
    },
    fuelType: {
      type: String,
      enum: ['Diesel', 'Petrol', 'CNG', 'Electric', 'Hybrid'],
      default: 'Diesel',
    },
    odometer: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    status: {
      type: String,
      enum: ['available', 'on_trip', 'in_shop', 'out_of_service'],
      default: 'available',
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    rcNumber: {
      type: String,
      trim: true,
    },
    insuranceExpiry: {
      type: Date,
    },
    fitnessExpiry: {
      type: Date,
    },
    pucExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
