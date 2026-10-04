const User = require('../models/User');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Repair = require('../models/Repair');
const Maintenance = require('../models/Maintenance');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const OdometerLog = require('../models/OdometerLog');
const { getIO } = require('../sockets/socketHandler');

/**
 * Helper to get the Driver profile for the current authenticated user
 */
const getDriverForUser = async (userId, organizationId) => {
  return await Driver.findOne({ user: userId, organization: organizationId })
    .populate('user', 'name firstName lastName email phone address status')
    .populate('assignedVehicle');
};

// @desc    Get Driver Profile
// @route   GET /api/driver/profile
// @access  Private (Driver only)
exports.getDriverProfile = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.organizationId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found for this account',
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

// @desc    Update Driver Profile (Allowed fields only: phone, address, emergencyContact, profilePhoto)
// @route   PATCH /api/driver/profile
// @access  Private (Driver only)
exports.updateDriverProfile = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    const { phone, address, emergencyContact } = req.body;

    // Update User record for phone and address
    const userUpdates = {};
    if (phone !== undefined) userUpdates.phone = phone.trim();
    if (address !== undefined) userUpdates.address = address.trim();

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    // Update Driver record
    if (emergencyContact) {
      let parsedEmergency = emergencyContact;
      if (typeof emergencyContact === 'string') {
        try {
          parsedEmergency = JSON.parse(emergencyContact);
        } catch (e) {
          parsedEmergency = { name: emergencyContact };
        }
      }
      driver.emergencyContact = {
        name: parsedEmergency.name || driver.emergencyContact?.name || '',
        phone: parsedEmergency.phone || driver.emergencyContact?.phone || '',
        relationship: parsedEmergency.relationship || driver.emergencyContact?.relationship || '',
      };
    }

    if (req.file) {
      driver.profilePhoto = `/uploads/${req.file.filename}`;
    }

    await driver.save();

    const updatedDriver = await getDriverForUser(req.user._id, req.organizationId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      driver: updatedDriver,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Driver's Assigned Vehicle
// @route   GET /api/driver/vehicle
// @access  Private (Driver only)
exports.getAssignedVehicle = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(200).json({
        success: true,
        assigned: false,
        message: 'No vehicle is currently assigned to your account',
        vehicle: null,
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: driver.assignedVehicle,
      organization: req.organizationId,
    }).populate('assignedDriver', 'driverId profilePhoto drivingLicenceNumber');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Assigned vehicle record not found',
      });
    }

    // Include quick summary metrics
    const upcomingMaintenance = await Maintenance.findOne({
      vehicle: vehicle._id,
      status: { $in: ['good', 'due_soon', 'overdue'] },
    }).sort({ nextDueDate: 1 });

    const activeRepair = await Repair.findOne({
      vehicle: vehicle._id,
      status: { $in: ['reported', 'in_progress'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      assigned: true,
      vehicle,
      nextMaintenance: upcomingMaintenance || null,
      activeRepair: activeRepair || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Detailed Vehicle Health Status
// @route   GET /api/driver/vehicle/health
// @access  Private (Driver only)
exports.getVehicleHealth = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(404).json({
        success: false,
        message: 'No vehicle assigned to calculate health metrics',
      });
    }

    const vehicleId = driver.assignedVehicle;
    const vehicle = await Vehicle.findById(vehicleId);

    // 1. Check open/active repairs grouped by issue type
    const activeRepairs = await Repair.find({
      vehicle: vehicleId,
      status: { $in: ['reported', 'in_progress'] },
    });

    const hasRepairForType = (types) => {
      const match = activeRepairs.find((r) => types.includes(r.issueType));
      if (!match) return { status: 'Normal', flag: 'good', detail: 'Operating normally' };
      if (match.priority === 'critical') return { status: 'Critical', flag: 'critical', detail: match.description };
      return { status: 'Attention', flag: 'warning', detail: `${match.status.replace('_', ' ')}: ${match.description}` };
    };

    const engineHealth = hasRepairForType(['Engine', 'Oil / Fluids']);
    const brakesHealth = hasRepairForType(['Brakes']);
    const tyresHealth = hasRepairForType(['Tire']);
    const batteryHealth = hasRepairForType(['Electrical']);
    const suspensionHealth = hasRepairForType(['Suspension']);
    const transmissionHealth = hasRepairForType(['Transmission']);
    const acHealth = hasRepairForType(['Air Conditioning']);

    // 2. Check Service / Maintenance schedule status
    const overdueMaintenance = await Maintenance.findOne({
      vehicle: vehicleId,
      status: 'overdue',
    });

    const dueSoonMaintenance = await Maintenance.findOne({
      vehicle: vehicleId,
      status: 'due_soon',
    });

    let serviceHealth = { status: 'Up to Date', flag: 'good', detail: 'All scheduled services on time' };
    if (overdueMaintenance) {
      serviceHealth = { status: 'Overdue', flag: 'critical', detail: `${overdueMaintenance.serviceType} is overdue` };
    } else if (dueSoonMaintenance) {
      serviceHealth = { status: 'Due Soon', flag: 'warning', detail: `${dueSoonMaintenance.serviceType} due soon` };
    }

    // 3. Check Documents validity
    const documents = await Document.find({ vehicle: vehicleId });
    const expiredDoc = documents.find((d) => d.status === 'expired');
    const expiringDoc = documents.find((d) => d.status === 'expiring_soon');

    let documentsHealth = { status: 'Valid', flag: 'good', detail: 'All documents valid' };
    if (expiredDoc) {
      documentsHealth = { status: 'Expired', flag: 'critical', detail: `${expiredDoc.documentType} has expired` };
    } else if (expiringDoc) {
      documentsHealth = { status: 'Expiring Soon', flag: 'warning', detail: `${expiringDoc.documentType} expires soon` };
    }

    // Determine overall vehicle health
    let overallHealth = 'Good';
    let overallFlag = 'good';

    const allComponents = [
      { name: 'Engine', ...engineHealth },
      { name: 'Brakes', ...brakesHealth },
      { name: 'Tyres', ...tyresHealth },
      { name: 'Battery', ...batteryHealth },
      { name: 'Suspension', ...suspensionHealth },
      { name: 'Transmission', ...transmissionHealth },
      { name: 'AC', ...acHealth },
      { name: 'Service', ...serviceHealth },
      { name: 'Documents', ...documentsHealth },
    ];

    if (allComponents.some((c) => c.flag === 'critical') || vehicle.status === 'in_shop' || vehicle.status === 'out_of_service') {
      overallHealth = 'Needs Critical Service';
      overallFlag = 'critical';
    } else if (allComponents.some((c) => c.flag === 'warning')) {
      overallHealth = 'Attention Needed';
      overallFlag = 'warning';
    }

    res.status(200).json({
      success: true,
      vehicleNumber: vehicle.vehicleNumber,
      overallHealth,
      overallFlag,
      components: allComponents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Maintenance Schedules for Assigned Vehicle
// @route   GET /api/driver/vehicle/maintenance
// @access  Private (Driver only)
exports.getVehicleMaintenance = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(200).json({ success: true, count: 0, maintenance: [] });
    }

    const records = await Maintenance.find({
      vehicle: driver.assignedVehicle,
      organization: req.organizationId,
    })
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .sort({ nextDueDate: 1 });

    const upcoming = records.filter((r) => r.status !== 'completed');
    const completed = records.filter((r) => r.status === 'completed');

    res.status(200).json({
      success: true,
      count: records.length,
      upcoming,
      completed,
      all: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Service & Repair History
// @route   GET /api/driver/vehicle/service-history
// @access  Private (Driver only)
exports.getVehicleServiceHistory = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(200).json({ success: true, count: 0, history: [] });
    }

    const vehicleId = driver.assignedVehicle;

    // Completed maintenance records
    const maintenanceRecords = await Maintenance.find({
      vehicle: vehicleId,
      organization: req.organizationId,
    })
      .sort({ lastServiceDate: -1 })
      .lean();

    // Completed repair records
    const completedRepairs = await Repair.find({
      vehicle: vehicleId,
      organization: req.organizationId,
      status: 'completed',
    })
      .populate('reportedBy', 'name')
      .sort({ completedAt: -1, createdAt: -1 })
      .lean();

    // Map unified history items
    const history = [];

    maintenanceRecords.forEach((m) => {
      if (m.lastServiceDate) {
        history.push({
          id: `m_${m._id}`,
          type: 'Maintenance',
          title: m.serviceType,
          date: m.lastServiceDate,
          odometer: m.lastServiceOdometer || 0,
          serviceCenter: m.serviceCenter || 'Authorized Service Partner',
          cost: m.cost || 0,
          description: m.notes || `Routine preventive maintenance interval (${m.intervalKm} km / ${m.intervalMonths} mo)`,
          status: 'Completed',
        });
      }
    });

    completedRepairs.forEach((r) => {
      history.push({
        id: `r_${r._id}`,
        type: 'Repair',
        title: `${r.issueType} Repair`,
        date: r.completedAt || r.updatedAt,
        odometer: r.odometerAtIncident || 0,
        serviceCenter: r.assignedWorkshop || 'Fleet Repair Center',
        cost: r.cost || 0,
        description: r.notes || r.description,
        status: 'Completed',
      });
    });

    // Sort by date descending
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Documents for Assigned Vehicle + Driver Licence
// @route   GET /api/driver/vehicle/documents
// @access  Private (Driver only)
exports.getVehicleDocuments = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(200).json({ success: true, count: 0, documents: [] });
    }

    const vehicle = await Vehicle.findById(driver.assignedVehicle);

    // Fetch documents linked to vehicle
    const vehicleDocs = await Document.find({
      vehicle: driver.assignedVehicle,
      organization: req.organizationId,
    }).sort({ expiryDate: 1 });

    // Format list and include built-in vehicle compliance dates if explicit Document record is absent
    const docs = [...vehicleDocs];

    // Check if RC document is already present
    const hasRC = docs.some((d) => d.documentType === 'Registration (RC)');
    if (!hasRC && vehicle.rcNumber) {
      docs.unshift({
        _id: 'virtual_rc',
        documentType: 'Registration (RC)',
        documentNumber: vehicle.rcNumber,
        status: 'valid',
        notes: 'Vehicle Registration Certificate',
        expiryDate: null,
      });
    }

    // Check if Insurance is in Document model, else check Vehicle model
    const hasInsurance = docs.some((d) => d.documentType === 'Insurance');
    if (!hasInsurance && vehicle.insuranceExpiry) {
      const exp = new Date(vehicle.insuranceExpiry);
      const days = (exp.getTime() - Date.now()) / (1000 * 3600 * 24);
      docs.push({
        _id: 'virtual_insurance',
        documentType: 'Insurance',
        documentNumber: 'POL-' + vehicle.vehicleNumber.replace(/\s+/g, ''),
        status: days < 0 ? 'expired' : days <= 30 ? 'expiring_soon' : 'valid',
        expiryDate: exp,
      });
    }

    // Also include Driver's License status
    if (driver.drivingLicenceNumber) {
      const exp = new Date(driver.licenceExpiry);
      const days = (exp.getTime() - Date.now()) / (1000 * 3600 * 24);
      docs.push({
        _id: 'virtual_dl',
        documentType: 'Driving Licence',
        documentNumber: driver.drivingLicenceNumber,
        status: days < 0 ? 'expired' : days <= 30 ? 'expiring_soon' : 'valid',
        expiryDate: exp,
      });
    }

    res.status(200).json({
      success: true,
      count: docs.length,
      documents: docs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Odometer History
// @route   GET /api/driver/odometer
// @access  Private (Driver only)
exports.getOdometerHistory = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(200).json({
        success: true,
        currentOdometer: 0,
        history: [],
      });
    }

    const vehicle = await Vehicle.findById(driver.assignedVehicle);
    const history = await OdometerLog.find({
      vehicle: driver.assignedVehicle,
      organization: req.organizationId,
    })
      .sort({ recordedAt: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      currentOdometer: vehicle.odometer,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Odometer Reading
// @route   POST /api/driver/odometer
// @access  Private (Driver only)
exports.updateOdometer = async (req, res, next) => {
  try {
    const { newOdometer, notes } = req.body;

    const reading = Number(newOdometer);
    if (newOdometer === undefined || isNaN(reading)) {
      return res.status(400).json({
        success: false,
        message: 'A valid numeric odometer reading is required',
      });
    }

    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(400).json({
        success: false,
        message: 'No vehicle is currently assigned to your account to update odometer',
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: driver.assignedVehicle,
      organization: req.organizationId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Assigned vehicle record not found',
      });
    }

    if (reading < vehicle.odometer) {
      return res.status(400).json({
        success: false,
        message: `New reading (${reading.toLocaleString()} km) cannot be less than current odometer (${vehicle.odometer.toLocaleString()} km)`,
      });
    }

    // Update vehicle odometer
    vehicle.odometer = reading;
    await vehicle.save();

    // Create Odometer log entry
    const log = await OdometerLog.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      driver: driver._id,
      reading,
      recordedAt: new Date(),
      notes: notes || `Updated by Driver ${req.user.name}`,
    });

    // Check preventive maintenance overdue triggers
    await Maintenance.updateMany(
      {
        vehicle: vehicle._id,
        nextDueOdometer: { $lte: reading },
        status: { $ne: 'completed' },
      },
      { status: 'overdue' }
    );

    // Socket.IO broadcast to organization
    try {
      const io = getIO();
      if (io) {
        io.to(`org_${req.organizationId}`).emit('odometer_updated', {
          vehicleId: vehicle._id,
          vehicleNumber: vehicle.vehicleNumber,
          odometer: reading,
          updatedBy: req.user.name,
        });
      }
    } catch (err) {
      console.warn('Socket broadcast warning:', err.message);
    }

    res.status(200).json({
      success: true,
      message: `Odometer updated to ${reading.toLocaleString()} km`,
      currentOdometer: reading,
      log,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Issues Reported by Driver / for Vehicle
// @route   GET /api/driver/issues
// @access  Private (Driver only)
exports.getIssues = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    const query = {
      organization: req.organizationId,
      $or: [{ reportedBy: req.user._id }],
    };

    if (driver && driver.assignedVehicle) {
      query.$or.push({ vehicle: driver.assignedVehicle });
    }

    const issues = await Repair.find(query)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report Vehicle Issue
// @route   POST /api/driver/issues
// @access  Private (Driver only)
exports.reportIssue = async (req, res, next) => {
  try {
    const { issueType, title, description, priority, odometerAtIncident } = req.body;

    if (!issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Issue category and description are required',
      });
    }

    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    if (!driver || !driver.assignedVehicle) {
      return res.status(400).json({
        success: false,
        message: 'Cannot report issue: No vehicle is currently assigned to you',
      });
    }

    const vehicle = await Vehicle.findById(driver.assignedVehicle);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Assigned vehicle not found' });
    }

    // Process photos
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => photos.push(`/uploads/${file.filename}`));
    } else if (req.file) {
      photos.push(`/uploads/${req.file.filename}`);
    }

    // Prefix title into description if title provided
    const fullDescription = title ? `[${title.trim()}] ${description.trim()}` : description.trim();

    const repair = await Repair.create({
      organization: req.organizationId,
      vehicle: vehicle._id,
      reportedBy: req.user._id,
      issueType,
      description: fullDescription,
      photos,
      priority: priority || 'medium',
      status: 'reported',
      odometerAtIncident: Number(odometerAtIncident) || vehicle.odometer,
    });

    if (priority === 'critical') {
      vehicle.status = 'in_shop';
      await vehicle.save();
    }

    // Create Notification in DB
    const notification = await Notification.create({
      organization: req.organizationId,
      targetRole: 'all',
      title: `Driver Issue Reported: ${vehicle.vehicleNumber}`,
      message: `${req.user.name} reported [${issueType}]: "${(title || description).slice(0, 75)}"`,
      type: 'repair',
      link: `/repairs/${repair._id}`,
    });

    const populatedRepair = await Repair.findById(repair._id)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email phone');

    // Socket.IO broadcast
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

// @desc    Get Repairs and Tracking Timelines
// @route   GET /api/driver/repairs
// @access  Private (Driver only)
exports.getRepairs = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id, organization: req.organizationId });

    const query = {
      organization: req.organizationId,
      $or: [{ reportedBy: req.user._id }],
    };

    if (driver && driver.assignedVehicle) {
      query.$or.push({ vehicle: driver.assignedVehicle });
    }

    const repairs = await Repair.find(query)
      .populate('vehicle', 'vehicleNumber vehicleType model manufacturer odometer')
      .populate('reportedBy', 'name email phone')
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

// @desc    Get Single Repair by ID
// @route   GET /api/driver/repairs/:id
// @access  Private (Driver only)
exports.getRepairById = async (req, res, next) => {
  try {
    const repair = await Repair.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    })
      .populate('vehicle')
      .populate('reportedBy', 'name email phone');

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair ticket not found',
      });
    }

    // Build timeline stages
    const stages = [
      { key: 'reported', label: 'Reported', completed: true, timestamp: repair.createdAt },
      {
        key: 'reviewed',
        label: 'Reviewed',
        completed: ['in_progress', 'completed'].includes(repair.status),
        timestamp: repair.status !== 'reported' ? repair.updatedAt : null,
      },
      {
        key: 'approved',
        label: 'Approved',
        completed: ['in_progress', 'completed'].includes(repair.status),
        timestamp: repair.status !== 'reported' ? repair.updatedAt : null,
      },
      {
        key: 'in_progress',
        label: 'In Progress',
        completed: repair.status === 'completed',
        current: repair.status === 'in_progress',
        timestamp: ['in_progress', 'completed'].includes(repair.status) ? repair.updatedAt : null,
      },
      {
        key: 'completed',
        label: 'Completed',
        completed: repair.status === 'completed',
        timestamp: repair.completedAt || null,
      },
    ];

    res.status(200).json({
      success: true,
      repair,
      timeline: stages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Driver Notifications
// @route   GET /api/driver/notifications
// @access  Private (Driver only)
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      organization: req.organizationId,
      $or: [
        { recipient: req.user._id },
        { targetRole: { $in: ['driver', 'all'] } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const formatted = notifications.map((n) => {
      const isRead = Array.isArray(n.readBy) && n.readBy.some((id) => id.toString() === req.user._id.toString());
      return {
        id: n._id,
        _id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        link: n.link,
        createdAt: n.createdAt,
        isRead,
      };
    });

    const unreadCount = formatted.filter((n) => !n.isRead).length;

    res.status(200).json({
      success: true,
      count: formatted.length,
      unreadCount,
      notifications: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Notification as Read
// @route   PATCH /api/driver/notifications/:id/read
// @access  Private (Driver only)
exports.markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        organization: req.organizationId,
      },
      {
        $addToSet: { readBy: req.user._id },
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark All Notifications as Read
// @route   PATCH /api/driver/notifications/read-all
// @access  Private (Driver only)
exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        organization: req.organizationId,
        $or: [
          { recipient: req.user._id },
          { targetRole: { $in: ['driver', 'all'] } },
        ],
      },
      {
        $addToSet: { readBy: req.user._id },
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};
