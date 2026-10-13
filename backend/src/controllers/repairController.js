const Repair = require('../models/Repair');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socketHandler');

// @desc    Report a new vehicle repair / issue (Driver submits proof and details)
// @route   POST /api/repairs
// @access  Private (Driver, Fleet Manager, Admin)
exports.reportIssue = async (req, res, next) => {
  try {
    const {
      vehicleId,
      issueType,
      repairWhat,
      reasonWhy,
      description,
      priority,
      odometerAtIncident,
    } = req.body;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is required',
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

    // Process uploaded photos
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => photos.push(`/uploads/${file.filename}`));
    } else if (req.file) {
      photos.push(`/uploads/${req.file.filename}`);
    }

    const detailText = description || repairWhat || reasonWhy || 'Repair request submitted';

    const repair = await Repair.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      reportedBy: req.user._id,
      issueType: issueType || 'General Repair',
      repairWhat: repairWhat ? repairWhat.trim() : '',
      reasonWhy: reasonWhy ? reasonWhy.trim() : '',
      description: detailText.trim(),
      photos,
      priority: priority || 'medium',
      status: 'pending_approval',
      odometerAtIncident: Number(odometerAtIncident) || vehicle.odometer,
    });

    // Create Notification in DB
    try {
      const notification = await Notification.create({
        organization: req.organizationId,
        targetRole: 'fleet_manager',
        title: `Repair Request: ${vehicle.vehicleNumber}`,
        message: `${req.user.name} requested repair for ${vehicle.vehicleNumber}: ${repairWhat || issueType || 'Breakdown'}`,
        type: 'repair',
        link: `/repairs`,
      });

      const populatedRepair = await Repair.findById(repair._id)
        .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
        .populate('reportedBy', 'name email role phone');

      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('new_issue_reported', {
          repair: populatedRepair,
          notification,
        });
      }
    } catch (err) {
      console.warn('Socket/Notif warning:', err.message);
    }

    const finalRepair = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email role phone');

    res.status(201).json({
      success: true,
      message: 'Repair request submitted for Fleet Manager / Admin approval',
      repair: finalRepair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve repair request (Admin & Fleet Manager)
// @route   PATCH /api/repairs/:id/approve
// @access  Private (Admin & Fleet Manager)
exports.approveRepair = async (req, res, next) => {
  try {
    const { approvalNotes, assignedWorkshop } = req.body;

    const repair = await Repair.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    repair.status = 'approved';
    repair.approvedBy = req.user._id;
    if (approvalNotes) repair.approvalNotes = approvalNotes.trim();
    if (assignedWorkshop) repair.assignedWorkshop = assignedWorkshop.trim();

    await repair.save();

    const populated = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email role phone')
      .populate('approvedBy', 'name email role');

    try {
      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('repair_status_updated', { repair: populated });
      }
    } catch (err) {
      console.warn('Socket broadcast warning:', err.message);
    }

    res.status(200).json({
      success: true,
      message: 'Repair request approved. Driver may proceed with repair.',
      repair: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject repair request (Admin & Fleet Manager)
// @route   PATCH /api/repairs/:id/reject
// @access  Private (Admin & Fleet Manager)
exports.rejectRepair = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    const repair = await Repair.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    repair.status = 'rejected';
    repair.approvedBy = req.user._id;
    repair.rejectionReason = rejectionReason ? rejectionReason.trim() : 'Repair request rejected';

    await repair.save();

    const populated = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email role phone')
      .populate('approvedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Repair request rejected',
      repair: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all repair tickets
// @route   GET /api/repairs
// @access  Private (Admin, Fleet Manager, Driver)
exports.getRepairs = async (req, res, next) => {
  try {
    let query = { organization: req.organizationId };

    if (req.query.vehicleId) {
      query.vehicle = req.query.vehicleId;
    }

    if (req.user.role === 'driver') {
      query.$or = [{ reportedBy: req.user._id }];
    }

    const repairs = await Repair.find(query)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email role phone')
      .populate('approvedBy', 'name email role')
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
      .populate('reportedBy', 'name email role phone')
      .populate('approvedBy', 'name email role');

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
// @access  Private
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
      await Vehicle.findByIdAndUpdate(repair.vehicle, { status: 'available' });
    }

    await repair.save();

    const populated = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber model manufacturer')
      .populate('reportedBy', 'name email')
      .populate('approvedBy', 'name email');

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
