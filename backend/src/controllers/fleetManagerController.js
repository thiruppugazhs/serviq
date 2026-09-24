const User = require('../models/User');

// @desc    Create a new Fleet Manager
// @route   POST /api/fleet-managers
// @access  Private (Admin only)
exports.createFleetManager = async (req, res, next) => {
  try {
    const { name, email, phone, employeeId, address, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required for creating a Fleet Manager',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const fleetManager = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'fleet_manager',
      organization: req.organizationId,
      phone: phone || '',
      employeeId: employeeId || '',
      address: address || '',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Fleet Manager created successfully',
      fleetManager: {
        id: fleetManager._id,
        name: fleetManager.name,
        email: fleetManager.email,
        phone: fleetManager.phone,
        employeeId: fleetManager.employeeId,
        address: fleetManager.address,
        status: fleetManager.status,
        createdAt: fleetManager.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Fleet Managers for the organization
// @route   GET /api/fleet-managers
// @access  Private (Admin only)
exports.getFleetManagers = async (req, res, next) => {
  try {
    const fleetManagers = await User.find({
      organization: req.organizationId,
      role: 'fleet_manager',
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fleetManagers.length,
      fleetManagers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Fleet Manager by ID
// @route   GET /api/fleet-managers/:id
// @access  Private (Admin only)
exports.getFleetManagerById = async (req, res, next) => {
  try {
    const manager = await User.findOne({
      _id: req.params.id,
      organization: req.organizationId,
      role: 'fleet_manager',
    }).select('-password');

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Fleet Manager not found',
      });
    }

    res.status(200).json({
      success: true,
      fleetManager: manager,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Fleet Manager
// @route   PUT /api/fleet-managers/:id
// @access  Private (Admin only)
exports.updateFleetManager = async (req, res, next) => {
  try {
    const { name, phone, employeeId, address, status, password } = req.body;

    const manager = await User.findOne({
      _id: req.params.id,
      organization: req.organizationId,
      role: 'fleet_manager',
    });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Fleet Manager not found',
      });
    }

    if (name) manager.name = name.trim();
    if (phone !== undefined) manager.phone = phone;
    if (employeeId !== undefined) manager.employeeId = employeeId;
    if (address !== undefined) manager.address = address;
    if (status && ['active', 'inactive'].includes(status)) manager.status = status;
    if (password) manager.password = password; // pre-save hook will hash it

    await manager.save();

    res.status(200).json({
      success: true,
      message: 'Fleet Manager updated successfully',
      fleetManager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        employeeId: manager.employeeId,
        address: manager.address,
        status: manager.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Fleet Manager status (Active / Inactive)
// @route   PATCH /api/fleet-managers/:id/toggle-status
// @access  Private (Admin only)
exports.toggleFleetManagerStatus = async (req, res, next) => {
  try {
    const manager = await User.findOne({
      _id: req.params.id,
      organization: req.organizationId,
      role: 'fleet_manager',
    });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Fleet Manager not found',
      });
    }

    manager.status = manager.status === 'active' ? 'inactive' : 'active';
    await manager.save();

    res.status(200).json({
      success: true,
      message: `Fleet Manager status updated to ${manager.status}`,
      status: manager.status,
    });
  } catch (error) {
    next(error);
  }
};
