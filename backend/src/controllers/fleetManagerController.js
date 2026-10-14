const User = require('../models/User');

// @desc    Create a new Fleet Manager
// @route   POST /api/fleet-managers
// @access  Private (Admin only)
exports.createFleetManager = async (req, res, next) => {
  try {
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      address,
      stationAddress,
      password: customPassword,
    } = req.body;

    const fullName = (firstName && lastName)
      ? `${firstName} ${lastName}`.trim()
      : (firstName || name || '').trim();

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name (or first/last name) and email are required for creating a Fleet Manager',
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required for creating a Fleet Manager',
      });
    }

    // Default initial password to Mobile / Phone number if not provided
    const contactPhone = (phone || '').trim();
    const password = (customPassword && customPassword.trim().length >= 6)
      ? customPassword.trim()
      : (contactPhone || employeeId.trim());

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const resolvedStation = stationAddress || address || '';

    const fleetManager = await User.create({
      name: fullName,
      firstName: firstName ? firstName.trim() : '',
      lastName: lastName ? lastName.trim() : '',
      email: email.toLowerCase().trim(),
      password,
      role: 'fleet_manager',
      organization: req.organizationId,
      phone: phone ? phone.trim() : '',
      employeeId: employeeId ? employeeId.trim() : '',
      address: resolvedStation,
      stationAddress: resolvedStation,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Fleet Manager created successfully',
      fleetManager: {
        id: fleetManager._id,
        _id: fleetManager._id,
        name: fleetManager.name,
        firstName: fleetManager.firstName,
        lastName: fleetManager.lastName,
        email: fleetManager.email,
        phone: fleetManager.phone,
        employeeId: fleetManager.employeeId,
        address: fleetManager.address,
        stationAddress: fleetManager.stationAddress,
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

// @desc    Delete a Fleet Manager
// @route   DELETE /api/fleet-managers/:id
// @access  Private (Admin only)
exports.deleteFleetManager = async (req, res, next) => {
  try {
    const manager = await User.findOneAndDelete({
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

    res.status(200).json({
      success: true,
      message: 'Fleet Manager deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Import Fleet Managers
// @route   POST /api/fleet-managers/bulk-import
// @access  Private (Admin only)
exports.bulkImportFleetManagers = async (req, res, next) => {
  try {
    const { managers } = req.body;
    if (!managers || !Array.isArray(managers) || managers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fleet manager records provided for bulk import',
      });
    }

    const createdManagers = [];
    const skippedManagers = [];

    for (let i = 0; i < managers.length; i++) {
      const item = managers[i];
      const fullName = (item.fullName || item.name || `${item.firstName || ''} ${item.lastName || ''}`).trim();
      const rawEmail = (item.email || '').trim().toLowerCase();
      const phone = (item.phone || item.mobile || '').trim();
      const employeeId = (item.employeeId || item.empId || `MGR-${Date.now().toString().slice(-4)}${i + 1}`).trim();
      const address = (item.stationAddress || item.address || '').trim();

      if (!fullName || !rawEmail) {
        skippedManagers.push({ item, reason: 'Name and email are required' });
        continue;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: rawEmail });
      if (existingUser) {
        skippedManagers.push({ item, reason: `User email ${rawEmail} already registered` });
        continue;
      }

      const password = phone || employeeId;

      const newManager = await User.create({
        name: fullName,
        firstName: item.firstName ? item.firstName.trim() : fullName.split(' ')[0],
        lastName: item.lastName ? item.lastName.trim() : (fullName.split(' ').slice(1).join(' ') || ''),
        email: rawEmail,
        password,
        role: 'fleet_manager',
        organization: req.organizationId,
        phone,
        employeeId,
        address,
        stationAddress: address,
        status: 'active',
      });

      createdManagers.push({
        id: newManager._id,
        name: newManager.name,
        email: newManager.email,
        phone: newManager.phone,
        employeeId: newManager.employeeId,
        address: newManager.address,
        status: newManager.status,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully imported ${createdManagers.length} fleet manager(s). ${skippedManagers.length} skipped.`,
      importedCount: createdManagers.length,
      skippedCount: skippedManagers.length,
      managers: createdManagers,
      skipped: skippedManagers,
    });
  } catch (error) {
    next(error);
  }
};


