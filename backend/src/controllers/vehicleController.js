const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Maintenance = require('../models/Maintenance');
const Repair = require('../models/Repair');

// @desc    Create a new Vehicle
// @route   POST /api/vehicles
// @access  Private (Admin & Fleet Manager)
exports.createVehicle = async (req, res, next) => {
  try {
    const {
      vehicleNumber,
      vehicleType,
      manufacturer,
      model,
      year,
      fuelType,
      odometer,
      assignedDriverId,
      status,
      vin,
      rcNumber,
      insuranceExpiry,
      fitnessExpiry,
      pucExpiry,
    } = req.body;

    if (!vehicleNumber || !manufacturer || !model || !year) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle number, manufacturer, model, and year are required',
      });
    }

    const normalizedPlate = vehicleNumber.trim().toUpperCase();
    const existing = await Vehicle.findOne({
      organization: req.organizationId,
      vehicleNumber: normalizedPlate,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A vehicle with this license plate number already exists in your organization',
      });
    }

    const vehicle = await Vehicle.create({
      organization: req.organizationId,
      vehicleNumber: normalizedPlate,
      vehicleType: vehicleType || 'Truck',
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      year: Number(year),
      fuelType: fuelType || 'Diesel',
      odometer: Number(odometer) || 0,
      assignedDriver: assignedDriverId || null,
      status: status || 'available',
      vin: vin ? vin.trim().toUpperCase() : '',
      rcNumber: rcNumber ? rcNumber.trim() : '',
      insuranceExpiry: insuranceExpiry || null,
      fitnessExpiry: fitnessExpiry || null,
      pucExpiry: pucExpiry || null,
    });

    // If assignedDriverId provided, update driver record
    if (assignedDriverId) {
      await Driver.findByIdAndUpdate(assignedDriverId, {
        assignedVehicle: vehicle._id,
      });
    }

    const populated = await Vehicle.findById(vehicle._id).populate({
      path: 'assignedDriver',
      populate: { path: 'user', select: 'name email phone' },
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicles for organization
// @route   GET /api/vehicles
// @access  Private (Admin & Fleet Manager, or Driver viewing assigned)
exports.getVehicles = async (req, res, next) => {
  try {
    let query = { organization: req.organizationId };

    // If driver, only show their assigned vehicle
    if (req.user.role === 'driver') {
      const driver = await Driver.findOne({ user: req.user._id });
      if (!driver || !driver.assignedVehicle) {
        return res.status(200).json({ success: true, count: 0, vehicles: [] });
      }
      query._id = driver.assignedVehicle;
    }

    const vehicles = await Vehicle.find(query)
      .populate({
        path: 'assignedDriver',
        populate: { path: 'user', select: 'name email phone' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    }).populate({
      path: 'assignedDriver',
      populate: { path: 'user', select: 'name email phone status' },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Also fetch recent maintenance and active repairs
    const maintenance = await Maintenance.find({ vehicle: vehicle._id }).sort({ nextDueDate: 1 }).limit(5);
    const activeRepairs = await Repair.find({
      vehicle: vehicle._id,
      status: { $in: ['reported', 'in_progress'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      vehicle,
      maintenance,
      activeRepairs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin & Fleet Manager)
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const {
      vehicleType,
      manufacturer,
      model,
      year,
      fuelType,
      odometer,
      status,
      assignedDriverId,
      rcNumber,
      insuranceExpiry,
      fitnessExpiry,
      pucExpiry,
    } = req.body;

    if (vehicleType) vehicle.vehicleType = vehicleType;
    if (manufacturer) vehicle.manufacturer = manufacturer.trim();
    if (model) vehicle.model = model.trim();
    if (year) vehicle.year = Number(year);
    if (fuelType) vehicle.fuelType = fuelType;
    if (odometer !== undefined && Number(odometer) >= vehicle.odometer) {
      vehicle.odometer = Number(odometer);
    }
    if (status) vehicle.status = status;
    if (rcNumber !== undefined) vehicle.rcNumber = rcNumber;
    if (insuranceExpiry !== undefined) vehicle.insuranceExpiry = insuranceExpiry;
    if (fitnessExpiry !== undefined) vehicle.fitnessExpiry = fitnessExpiry;
    if (pucExpiry !== undefined) vehicle.pucExpiry = pucExpiry;

    // Handle driver reassignment
    if (assignedDriverId !== undefined) {
      const oldDriverId = vehicle.assignedDriver;

      if (oldDriverId && oldDriverId.toString() !== assignedDriverId) {
        await Driver.findByIdAndUpdate(oldDriverId, { assignedVehicle: null });
      }

      if (assignedDriverId) {
        await Driver.findByIdAndUpdate(assignedDriverId, { assignedVehicle: vehicle._id });
        vehicle.assignedDriver = assignedDriverId;
      } else {
        vehicle.assignedDriver = null;
      }
    }

    await vehicle.save();

    const populated = await Vehicle.findById(vehicle._id).populate({
      path: 'assignedDriver',
      populate: { path: 'user', select: 'name email phone' },
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle odometer (Accessible by Driver for assigned vehicle, or Admin/FM)
// @route   PATCH /api/vehicles/:id/odometer
// @access  Private (Admin, Fleet Manager, Driver)
exports.updateOdometer = async (req, res, next) => {
  try {
    const { newOdometer } = req.body;

    if (newOdometer === undefined || isNaN(newOdometer)) {
      return res.status(400).json({
        success: false,
        message: 'Valid new odometer reading is required',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // If driver, check that vehicle is assigned to them
    if (req.user.role === 'driver') {
      const driver = await Driver.findOne({ user: req.user._id });
      if (!driver || !driver.assignedVehicle || driver.assignedVehicle.toString() !== vehicle._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update the odometer for your assigned vehicle',
        });
      }
    }

    if (Number(newOdometer) < vehicle.odometer) {
      return res.status(400).json({
        success: false,
        message: `New reading (${newOdometer} km) cannot be less than current odometer (${vehicle.odometer} km)`,
      });
    }

    vehicle.odometer = Number(newOdometer);
    await vehicle.save();

    // Check preventive maintenance status triggers
    await Maintenance.updateMany(
      {
        vehicle: vehicle._id,
        nextDueOdometer: { $lte: vehicle.odometer },
        status: { $ne: 'completed' },
      },
      { status: 'overdue' }
    );

    res.status(200).json({
      success: true,
      message: `Odometer updated to ${vehicle.odometer.toLocaleString()} km`,
      odometer: vehicle.odometer,
    });
  } catch (error) {
    next(error);
  }
};
