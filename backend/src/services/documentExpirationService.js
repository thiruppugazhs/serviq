const Document = require('../models/Document');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Notification = require('../models/Notification');

/**
 * Check for documents expiring within 2 weeks (14 days) or already expired.
 * Creates notifications:
 * 1. For Admin & Fleet Managers: Notifies about any expiring/expired document across the fleet.
 * 2. For Drivers: Notifies ONLY if the document belongs to their assigned vehicle.
 * 
 * Deduplication prevents duplicate notifications on the same day for the same document.
 */
exports.checkDocumentExpirations = async (organizationId) => {
  try {
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const query = {
      expiryDate: { $lte: twoWeeksFromNow },
    };
    if (organizationId) {
      query.organization = organizationId;
    }

    const documents = await Document.find(query)
      .populate('vehicle', 'vehicleNumber model manufacturer assignedDriver')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: 'name email' },
      });

    for (const doc of documents) {
      const daysLeft = Math.ceil((new Date(doc.expiryDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
      const isExpired = daysLeft < 0;
      const vehicleNum = doc.vehicle ? doc.vehicle.vehicleNumber : (doc.documentNumber || 'Vehicle');

      const title = isExpired
        ? `Expired: ${doc.documentType} (${vehicleNum})`
        : `Expiring in ${daysLeft === 0 ? 'today' : daysLeft + ' day(s)'}: ${doc.documentType} (${vehicleNum})`;

      const message = isExpired
        ? `The ${doc.documentType} for ${vehicleNum} expired on ${new Date(doc.expiryDate).toLocaleDateString('en-IN')}. Immediate renewal required.`
        : `The ${doc.documentType} for ${vehicleNum} is scheduled to expire on ${new Date(doc.expiryDate).toLocaleDateString('en-IN')} (${daysLeft} days remaining). Please renew before the deadline.`;

      const link = doc.vehicle ? `/admin/documents?vehicleId=${doc.vehicle._id}` : '/admin/documents';

      // 1. Notify Admin & Fleet Manager
      const existingAdminNotif = await Notification.findOne({
        organization: doc.organization,
        type: 'document',
        title,
        targetRole: { $in: ['all', 'admin', 'fleet_manager'] },
        createdAt: { $gte: startOfToday },
      });

      if (!existingAdminNotif) {
        await Notification.create({
          organization: doc.organization,
          title,
          message,
          type: 'document',
          targetRole: 'admin',
          link,
        });

        await Notification.create({
          organization: doc.organization,
          title,
          message,
          type: 'document',
          targetRole: 'fleet_manager',
          link,
        });
      }

      // 2. Notify assigned Driver (ONLY if the document belongs to their assigned car)
      if (doc.vehicle) {
        // Find driver assigned to this vehicle
        let driverUser = null;
        if (doc.vehicle.assignedDriver) {
          const drv = await Driver.findById(doc.vehicle.assignedDriver).populate('user');
          if (drv && drv.user) {
            driverUser = drv.user;
          }
        }

        // If not found directly, check if driver has this vehicle assigned
        if (!driverUser) {
          const drv = await Driver.findOne({
            assignedVehicle: doc.vehicle._id,
            organization: doc.organization,
          }).populate('user');
          if (drv && drv.user) {
            driverUser = drv.user;
          }
        }

        if (driverUser) {
          const driverTitle = isExpired
            ? `Urgent: ${doc.documentType} expired for your assigned vehicle ${vehicleNum}`
            : `Notice: ${doc.documentType} expiring in ${daysLeft} days for your assigned vehicle ${vehicleNum}`;

          const driverMessage = isExpired
            ? `Your assigned vehicle (${vehicleNum}) ${doc.documentType} has expired. Please inform your fleet manager or avoid driving without updated permits.`
            : `Your assigned vehicle (${vehicleNum}) ${doc.documentType} is expiring on ${new Date(doc.expiryDate).toLocaleDateString('en-IN')}.`;

          const existingDriverNotif = await Notification.findOne({
            organization: doc.organization,
            recipient: driverUser._id,
            type: 'document',
            title: driverTitle,
            createdAt: { $gte: startOfToday },
          });

          if (!existingDriverNotif) {
            await Notification.create({
              organization: doc.organization,
              recipient: driverUser._id,
              targetRole: 'driver',
              title: driverTitle,
              message: driverMessage,
              type: 'document',
              link: '/driver',
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('[Document Expiration Check Error]:', err);
  }
};
