const Repair = require('../models/Repair');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socketHandler');

// @desc    Report a new vehicle issue / breakdown
// @route   POST /api/repairs
// @access  Private (Driver, Fleet Manager, Admin)
exports.reportIssue = async (req, res, next) => {
  try {
    const { vehicleId, issueType, description, priority, odometerAtIncident } = req.body;

    if (!vehicleId || !issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle, issue type, and description are required',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Process uploaded photos if any
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => photos.push(`/uploads/${file.filename}`));
    } else if (req.file) {
      photos.push(`/uploads/${req.file.filename}`);
    }

    const repair = await Repair.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      reportedBy: req.user._id,
      issueType,
      description: description.trim(),
      photos,
      priority: priority || 'medium',
      status: 'reported',
      odometerAtIncident: Number(odometerAtIncident) || vehicle.odometer,
    });

    // Update vehicle status to in_shop if critical
    if (priority === 'critical') {
      vehicle.status = 'in_shop';
      await vehicle.save();
    }

    // Create Notification in DB
    const notification = await Notification.create({
      organization: req.organizationId,
      targetRole: 'all',
      title: `New Issue Reported: ${vehicle.vehicleNumber}`,
      message: `${req.user.name} reported [${issueType}]: "${description.slice(0, 80)}"`,
      type: 'repair',
      link: `/repairs/${repair._id}`,
    });

    const populatedRepair = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email role phone');

    // Real-time broadcast via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('new_issue_reported', {
          repair: populatedRepair,
          notification,
        });
      }
    } catch (err) {
      console.warn('Socket broadcast warning:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully and sent to Fleet Manager',
      repair: populatedRepair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all repair tickets
// @route   GET /api/repairs
// @access  Private (Admin & Fleet Manager, or Driver viewing own/assigned)
exports.getRepairs = async (req, res, next) => {
  try {
    let query = { organization: req.organizationId };

    if (req.user.role === 'driver') {
      // Driver sees reports they reported or for their assigned vehicle
      query.$or = [{ reportedBy: req.user._id }];
    }

    const repairs = await Repair.find(query)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email role phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: repairs.length,
      repairs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single repair ticket by ID
// @route   GET /api/repairs/:id
// @access  Private
exports.getRepairById = async (req, res, next) => {
  try {
    const repair = await Repair.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    })
      .populate('vehicle')
      .populate('reportedBy', 'name email role phone');

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update repair status / ticket resolution
// @route   PATCH /api/repairs/:id/status
// @access  Private (Admin & Fleet Manager)
exports.updateRepairStatus = async (req, res, next) => {
  try {
    const { status, assignedWorkshop, cost, notes } = req.body;

    const repair = await Repair.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair ticket not found',
      });
    }

    if (status) repair.status = status;
    if (assignedWorkshop !== undefined) repair.assignedWorkshop = assignedWorkshop.trim();
    if (cost !== undefined) repair.cost = Number(cost);
    if (notes !== undefined) repair.notes = notes.trim();

    if (status === 'completed') {
      repair.completedAt = Date.now();
      // If vehicle was in_shop, set back to available
      await Vehicle.findByIdAndUpdate(repair.vehicle, { status: 'available' });
    }

    await repair.save();

    const populated = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber model manufacturer')
      .populate('reportedBy', 'name email');

    // Real-time broadcast status change
    try {
      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('repair_status_updated', {
          repair: populated,
        });
      }
    } catch (err) {
      console.warn('Socket broadcast warning:', err.message);
    }

    res.status(200).json({
      success: true,
      message: `Repair status updated to ${repair.status}`,
      repair: populated,
    });
  } catch (error) {
    next(error);
  }
};
