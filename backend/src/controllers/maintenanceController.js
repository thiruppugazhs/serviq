const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// @desc    Create a preventive maintenance schedule
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

    let status = 'good';
    if (vehicle.odometer >= nextDueOdo || (nextDueDate && new Date() >= nextDueDate)) {
      status = 'overdue';
    } else if (
      vehicle.odometer >= nextDueOdo - 500 ||
      (nextDueDate && (nextDueDate.getTime() - Date.now()) / (1000 * 3600 * 24) <= 15)
    ) {
      status = 'due_soon';
    }

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
    });

    const populated = await Maintenance.findById(maintenance._id).populate(
      'vehicle',
      'vehicleNumber vehicleType model manufacturer odometer'
    );

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
// @access  Private (Admin, Fleet Manager, Driver view assigned)
exports.getMaintenance = async (req, res, next) => {
  try {
    let query = { organization: req.organizationId };

    if (req.query.vehicleId) {
      query.vehicle = req.query.vehicleId;
    }

    const records = await Maintenance.find(query)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer status')
      .sort({ nextDueDate: 1 });

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
// @access  Private (Admin & Fleet Manager)
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
    const serviceOdo = completedOdometer ? Number(completedOdometer) : (vehicle ? vehicle.odometer : record.lastServiceOdometer);

    record.lastServiceDate = new Date();
    record.lastServiceOdometer = serviceOdo;
    record.cost = cost ? Number(cost) : record.cost;
    if (serviceCenter) record.serviceCenter = serviceCenter;
    if (notes) record.notes = notes;

    // Advance to next cycle
    record.nextDueOdometer = serviceOdo + record.intervalKm;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + record.intervalMonths);
    record.nextDueDate = nextDate;
    record.status = 'good';

    await record.save();

    const populated = await Maintenance.findById(record._id).populate(
      'vehicle',
      'vehicleNumber vehicleType model manufacturer odometer'
    );

    res.status(200).json({
      success: true,
      message: 'Service marked completed and next cycle scheduled',
      maintenance: populated,
    });
  } catch (error) {
    next(error);
  }
};
