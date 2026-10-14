const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socketHandler');

// @desc    Apply / Request maintenance (Driver or Manager)
// @route   POST /api/maintenance/request
// @access  Private (Driver, Fleet Manager, Admin)
exports.requestMaintenance = async (req, res, next) => {
  try {
    const {
      vehicleId,
      serviceType,
      currentOdometer,
      runningKmInterval,
      serviceCenter,
      notes,
    } = req.body;

    if (!vehicleId || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle and service type are required',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const odo = currentOdometer !== undefined && currentOdometer !== '' ? Number(currentOdometer) : vehicle.odometer;
    const interval = runningKmInterval !== undefined && runningKmInterval !== '' ? Number(runningKmInterval) : 10000;

    const maintenance = await Maintenance.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      serviceType: serviceType.trim(),
      requestedBy: req.user._id,
      currentOdometer: odo,
      runningKmInterval: interval,
      serviceCenter: serviceCenter ? serviceCenter.trim() : '',
      notes: notes ? notes.trim() : '',
      status: 'pending_approval',
    });

    // Create Notification for admin and fleet managers
    try {
      const notification = await Notification.create({
        organization: req.organizationId,
        targetRole: 'fleet_manager',
        title: `Maintenance Requested: ${vehicle.vehicleNumber}`,
        message: `${req.user.name} submitted a maintenance request for ${vehicle.vehicleNumber} (${serviceType})`,
        type: 'maintenance',
        link: `/maintenance`,
      });

      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('new_maintenance_request', {
          maintenance,
          notification,
        });
      }
    } catch (notifErr) {
      console.warn('Notification/Socket warning:', notifErr.message);
    }

    const populated = await Maintenance.findById(maintenance._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('requestedBy', 'name email role phone');

    res.status(201).json({
      success: true,
      message: 'Maintenance request submitted for Fleet Manager / Admin approval',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule maintenance (Fleet Manager or Admin)
// @route   POST /api/maintenance/schedule
// @access  Private (Admin & Fleet Manager)
exports.scheduleMaintenance = async (req, res, next) => {
  try {
    const {
      vehicleId,
      serviceType,
      scheduledStartDate,
      scheduledEndDate,
      serviceCenter,
      notes,
    } = req.body;

    if (!vehicleId || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle and service type are required',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const maintenance = await Maintenance.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      serviceType: serviceType.trim(),
      scheduledStartDate: scheduledStartDate ? new Date(scheduledStartDate) : new Date(),
      scheduledEndDate: scheduledEndDate ? new Date(scheduledEndDate) : null,
      serviceCenter: serviceCenter ? serviceCenter.trim() : '',
      notes: notes ? notes.trim() : '',
      status: 'scheduled',
      approvedBy: req.user._id,
    });

    const populated = await Maintenance.findById(maintenance._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('approvedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Maintenance scheduled successfully',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve maintenance request
// @route   PATCH /api/maintenance/:id/approve
// @access  Private (Admin & Fleet Manager)
exports.approveMaintenance = async (req, res, next) => {
  try {
    const { approvalNotes } = req.body;

    const maintenance = await Maintenance.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    maintenance.status = 'approved';
    maintenance.approvedBy = req.user._id;
    if (approvalNotes) maintenance.approvalNotes = approvalNotes.trim();

    await maintenance.save();

    const populated = await Maintenance.findById(maintenance._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email role');

    // Notify Driver
    try {
      if (maintenance.requestedBy) {
        await Notification.create({
          organization: req.organizationId,
          targetRole: 'driver',
          title: `Maintenance Request Approved`,
          message: `Your maintenance request for vehicle has been approved by ${req.user.name}. You may proceed.`,
          type: 'maintenance',
          link: `/maintenance`,
        });
      }
      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('maintenance_status_updated', {
          maintenance: populated,
        });
      }
    } catch (notifErr) {
      console.warn('Socket/Notif warning:', notifErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance request approved successfully',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject maintenance request
// @route   PATCH /api/maintenance/:id/reject
// @access  Private (Admin & Fleet Manager)
exports.rejectMaintenance = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    const maintenance = await Maintenance.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    maintenance.status = 'rejected';
    maintenance.approvedBy = req.user._id;
    maintenance.rejectionReason = rejectionReason ? rejectionReason.trim() : 'Maintenance request rejected';

    await maintenance.save();

    const populated = await Maintenance.findById(maintenance._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Maintenance request rejected',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a preventive maintenance schedule (legacy or direct creation)
// @route   POST /api/maintenance
// @access  Private (Admin & Fleet Manager)
exports.createMaintenance = async (req, res, next) => {
  try {
    const {
      vehicleId,
      serviceType,
      intervalMonths,
      intervalKm,
      lastServiceDate,
      lastServiceOdometer,
      serviceCenter,
      notes,
    } = req.body;

    if (!vehicleId || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle and service type are required',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const lastOdo = lastServiceOdometer ? Number(lastServiceOdometer) : vehicle.odometer;
    const kmInterval = intervalKm ? Number(intervalKm) : 10000;
    const nextDueOdo = lastOdo + kmInterval;

    let nextDueDate = null;
    const months = intervalMonths ? Number(intervalMonths) : 6;
    const baseDate = lastServiceDate ? new Date(lastServiceDate) : new Date();
    nextDueDate = new Date(baseDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + months);

    let status = 'approved';

    const maintenance = await Maintenance.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      serviceType: serviceType.trim(),
      intervalMonths: months,
      intervalKm: kmInterval,
      lastServiceDate: lastServiceDate || new Date(),
      lastServiceOdometer: lastOdo,
      nextDueDate,
      nextDueOdometer: nextDueOdo,
      status,
      serviceCenter: serviceCenter || '',
      notes: notes || '',
      approvedBy: req.user._id,
    });

    const populated = await Maintenance.findById(maintenance._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('approvedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Maintenance schedule created successfully',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all maintenance schedules/records
// @route   GET /api/maintenance
// @access  Private (Admin, Fleet Manager, Driver view)
exports.getMaintenance = async (req, res, next) => {
  try {
    let query = { organization: req.organizationId };

    if (req.query.vehicleId) {
      query.vehicle = req.query.vehicleId;
    }

    if (req.user.role === 'driver') {
      // Driver sees maintenance for their assigned vehicle or what they requested
      const Driver = require('../models/Driver');
      const driverRecord = await Driver.findOne({ user: req.user._id, organization: req.organizationId });
      const vehicleFilter = driverRecord?.assignedVehicle ? [driverRecord.assignedVehicle] : [];
      query.$or = [{ requestedBy: req.user._id }, { vehicle: { $in: vehicleFilter } }];
    }

    const records = await Maintenance.find(query)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer status')
      .populate('requestedBy', 'name email role phone')
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      maintenance: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log completed service and calculate next schedule
// @route   PATCH /api/maintenance/:id/complete
// @access  Private (Admin, Fleet Manager, Driver)
exports.completeMaintenance = async (req, res, next) => {
  try {
    const { completedOdometer, cost, serviceCenter, notes } = req.body;

    const record = await Maintenance.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    const vehicle = await Vehicle.findById(record.vehicle);
    const serviceOdo = completedOdometer ? Number(completedOdometer) : (vehicle ? vehicle.odometer : (record.currentOdometer || 0));

    record.lastServiceDate = new Date();
    record.lastServiceOdometer = serviceOdo;
    record.cost = cost ? Number(cost) : record.cost;
    if (serviceCenter) record.serviceCenter = serviceCenter;
    if (notes) record.notes = notes;

    // Advance to next cycle
    record.nextDueOdometer = serviceOdo + (record.runningKmInterval || record.intervalKm || 10000);
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + (record.intervalMonths || 6));
    record.nextDueDate = nextDate;
    record.status = 'completed';

    if (vehicle && serviceOdo > vehicle.odometer) {
      vehicle.odometer = serviceOdo;
      await vehicle.save();
    }

    await record.save();

    const populated = await Maintenance.findById(record._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Service marked completed',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin & Fleet Manager)
exports.deleteMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findOneAndDelete({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

