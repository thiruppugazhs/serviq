const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const Repair = require('../models/Repair');
const Expense = require('../models/Expense');
const Document = require('../models/Document');

// @desc    Get comprehensive organization dashboard KPI metrics
// @route   GET /api/reports/dashboard-stats
// @access  Private (Admin & Fleet Manager)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const orgId = req.organizationId;

    // Run parallel counts for fast response
    const [
      totalVehicles,
      availableVehicles,
      inShopVehicles,
      totalDrivers,
      activeDrivers,
      totalFleetManagers,
      activeRepairsCount,
      maintenanceOverdueCount,
      expiringDocumentsCount,
      expensesSummary,
      vehiclesRequiringAttention,
    ] = await Promise.all([
      Vehicle.countDocuments({ organization: orgId }),
      Vehicle.countDocuments({ organization: orgId, status: 'available' }),
      Vehicle.countDocuments({ organization: orgId, status: 'in_shop' }),
      Driver.countDocuments({ organization: orgId }),
      Driver.countDocuments({ organization: orgId, status: 'active' }),
      User.countDocuments({ organization: orgId, role: 'fleet_manager' }),
      Repair.countDocuments({ organization: orgId, status: { $in: ['reported', 'in_progress'] } }),
      Maintenance.countDocuments({ organization: orgId, status: { $in: ['due_soon', 'overdue'] } }),
      Document.countDocuments({ organization: orgId, status: { $in: ['expiring_soon', 'expired'] } }),
      Expense.aggregate([
        { $match: { organization: orgId } },
        { $group: { _id: null, totalSpent: { $sum: '$amount' } } },
      ]),
      // Vehicles Requiring Attention (overdue maintenance, active repair, expiring document)
      getAttentionList(orgId),
    ]);

    const totalSpent = expensesSummary.length > 0 ? expensesSummary[0].totalSpent : 0;

    res.status(200).json({
      success: true,
      stats: {
        vehicles: {
          total: totalVehicles,
          available: availableVehicles,
          inShop: inShopVehicles,
        },
        drivers: {
          total: totalDrivers,
          active: activeDrivers,
        },
        fleetManagers: {
          total: totalFleetManagers,
        },
        maintenance: {
          dueOrOverdue: maintenanceOverdueCount,
        },
        repairs: {
          active: activeRepairsCount,
        },
        documents: {
          expiringOrExpired: expiringDocumentsCount,
        },
        expenses: {
          totalSpent,
        },
        vehiclesRequiringAttention,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper to construct "Vehicles Requiring Attention" list dynamically from actual records
async function getAttentionList(orgId) {
  const attentionItems = [];

  // 1. Vehicles with active repair tickets
  const activeRepairs = await Repair.find({
    organization: orgId,
    status: { $in: ['reported', 'in_progress'] },
  })
    .populate('vehicle', 'vehicleNumber model manufacturer')
    .limit(5);

  activeRepairs.forEach((rep) => {
    if (rep.vehicle) {
      attentionItems.push({
        id: `repair-${rep._id}`,
        vehicleNumber: rep.vehicle.vehicleNumber,
        model: `${rep.vehicle.manufacturer} ${rep.vehicle.model}`,
        issue: `Repair ${rep.status === 'in_progress' ? 'In Progress' : 'Reported'}: ${rep.issueType}`,
        severity: rep.priority === 'critical' ? 'critical' : 'warning',
        type: 'repair',
      });
    }
  });

  // 2. Vehicles with overdue or due soon maintenance
  const attentionMaintenance = await Maintenance.find({
    organization: orgId,
    status: { $in: ['due_soon', 'overdue'] },
  })
    .populate('vehicle', 'vehicleNumber model manufacturer')
    .limit(5);

  attentionMaintenance.forEach((maint) => {
    if (maint.vehicle) {
      attentionItems.push({
        id: `maint-${maint._id}`,
        vehicleNumber: maint.vehicle.vehicleNumber,
        model: `${maint.vehicle.manufacturer} ${maint.vehicle.model}`,
        issue: `Maintenance ${maint.status === 'overdue' ? 'Overdue' : 'Due Soon'}: ${maint.serviceType}`,
        severity: maint.status === 'overdue' ? 'critical' : 'warning',
        type: 'maintenance',
      });
    }
  });

  // 3. Vehicles with expiring documents
  const expiringDocs = await Document.find({
    organization: orgId,
    status: { $in: ['expiring_soon', 'expired'] },
  })
    .populate('vehicle', 'vehicleNumber model manufacturer')
    .limit(5);

  expiringDocs.forEach((doc) => {
    if (doc.vehicle) {
      attentionItems.push({
        id: `doc-${doc._id}`,
        vehicleNumber: doc.vehicle.vehicleNumber,
        model: `${doc.vehicle.manufacturer} ${doc.vehicle.model}`,
        issue: `Document ${doc.status === 'expired' ? 'Expired' : 'Expiring Soon'}: ${doc.documentType}`,
        severity: doc.status === 'expired' ? 'critical' : 'warning',
        type: 'document',
      });
    }
  });

  return attentionItems;
}
