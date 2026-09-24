const User = require('../models/User');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

// @desc    Create a new Driver (Creates User + Driver profile)
// @route   POST /api/drivers
// @access  Private (Admin & Fleet Manager)
exports.createDriver = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      driverId,
      drivingLicenceNumber,
      licenceExpiry,
      dateOfBirth,
      emergencyContact,
      employmentStatus,
      assignedVehicleId,
      joiningDate,
    } = req.body;

    if (!name || !email || !password || !driverId || !drivingLicenceNumber || !licenceExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, Driver ID, licence number, and expiry date are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const existingDriverId = await Driver.findOne({
      organization: req.organizationId,
      driverId: driverId.trim().toUpperCase(),
    });
    if (existingDriverId) {
      return res.status(400).json({
        success: false,
        message: 'A driver with this Driver ID already exists in your organization',
      });
    }

    // Create User record
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'driver',
      organization: req.organizationId,
      phone: phone || '',
      address: address || '',
      status: 'active',
    });

    // Create Driver profile
    const driver = await Driver.create({
      user: user._id,
      organization: req.organizationId,
      driverId: driverId.trim().toUpperCase(),
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : '',
      drivingLicenceNumber: drivingLicenceNumber.trim().toUpperCase(),
      licenceExpiry,
      dateOfBirth: dateOfBirth || null,
      emergencyContact: emergencyContact || {},
      employmentStatus: employmentStatus || 'full_time',
      joiningDate: joiningDate || Date.now(),
      assignedVehicle: assignedVehicleId || null,
      status: 'active',
    });

    // If a vehicle was assigned, link the vehicle to this driver
    if (assignedVehicleId) {
      await Vehicle.findByIdAndUpdate(assignedVehicleId, {
        assignedDriver: driver._id,
      });
    }

    const populatedDriver = await Driver.findById(driver._id)
      .populate('user', 'name email phone address status')
      .populate('assignedVehicle', 'vehicleNumber vehicleType model manufacturer odometer status');

    res.status(201).json({
      success: true,
      message: 'Driver profile created successfully',
      driver: populatedDriver,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Drivers for the organization
// @route   GET /api/drivers
// @access  Private (Admin & Fleet Manager)
exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find({ organization: req.organizationId })
      .populate('user', 'name email phone address status')
      .populate('assignedVehicle', 'vehicleNumber vehicleType model manufacturer status odometer')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Driver by ID
// @route   GET /api/drivers/:id
// @access  Private (Admin, Fleet Manager, or Own Driver)
exports.getDriverById = async (req, res, next) => {
  try {
    let query = { _id: req.params.id, organization: req.organizationId };

    // If driver is calling, ensure they can only view their own profile
    if (req.user.role === 'driver') {
      const myDriver = await Driver.findOne({ user: req.user._id });
      if (!myDriver || myDriver._id.toString() !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own driver profile',
        });
      }
    }

    const driver = await Driver.findOne(query)
      .populate('user', 'name email phone address status')
      .populate('assignedVehicle');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    res.status(200).json({
      success: true,
      driver,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Driver profile & vehicle assignment
// @route   PUT /api/drivers/:id
// @access  Private (Admin & Fleet Manager)
exports.updateDriver = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      drivingLicenceNumber,
      licenceExpiry,
      emergencyContact,
      employmentStatus,
      status,
      assignedVehicleId,
    } = req.body;

    const driver = await Driver.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    // Update User info
    const userUpdates = {};
    if (name) userUpdates.name = name.trim();
    if (phone !== undefined) userUpdates.phone = phone;
    if (address !== undefined) userUpdates.address = address;
    if (status) userUpdates.status = status === 'inactive' ? 'inactive' : 'active';

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(driver.user, userUpdates);
    }

    // Update Driver fields
    if (drivingLicenceNumber) driver.drivingLicenceNumber = drivingLicenceNumber.trim().toUpperCase();
    if (licenceExpiry) driver.licenceExpiry = licenceExpiry;
    if (emergencyContact) driver.emergencyContact = emergencyContact;
    if (employmentStatus) driver.employmentStatus = employmentStatus;
    if (status) driver.status = status;

    // Handle vehicle assignment changes
    if (assignedVehicleId !== undefined) {
      const oldVehicleId = driver.assignedVehicle;

      // If reassigning to a different vehicle or removing
      if (oldVehicleId && oldVehicleId.toString() !== assignedVehicleId) {
        await Vehicle.findByIdAndUpdate(oldVehicleId, { assignedDriver: null });
      }

      if (assignedVehicleId) {
        await Vehicle.findByIdAndUpdate(assignedVehicleId, { assignedDriver: driver._id });
        driver.assignedVehicle = assignedVehicleId;
      } else {
        driver.assignedVehicle = null;
      }
    }

    await driver.save();

    const updatedDriver = await Driver.findById(driver._id)
      .populate('user', 'name email phone address status')
      .populate('assignedVehicle');

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      driver: updatedDriver,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Driver status (active / inactive / on_duty)
// @route   PATCH /api/drivers/:id/toggle-status
// @access  Private (Admin & Fleet Manager)
exports.toggleDriverStatus = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const newStatus = driver.status === 'active' ? 'inactive' : 'active';
    driver.status = newStatus;
    await driver.save();

    // Also update linked user
    await User.findByIdAndUpdate(driver.user, { status: newStatus });

    res.status(200).json({
      success: true,
      message: `Driver status changed to ${newStatus}`,
      status: newStatus,
    });
  } catch (error) {
    next(error);
  }
};
