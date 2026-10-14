const Notification = require('../models/Notification');
const { checkDocumentExpirations } = require('../services/documentExpirationService');

// @desc    Get Notifications for current user (Admin, Fleet Manager, or Driver)
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    // Run real-time check on document expirations for this organization
    await checkDocumentExpirations(req.organizationId);

    const userRole = req.user.role;
    const userId = req.user._id;

    // Filters based on role:
    // Admin / Manager sees notifications targeted to their role, 'all', or specifically to them
    // Driver sees notifications targeted specifically to them (recipient: userId) or general driver notifications
    let queryConditions = [
      { recipient: userId },
    ];

    if (userRole === 'admin') {
      queryConditions.push({ targetRole: { $in: ['admin', 'all'] } });
    } else if (userRole === 'fleet_manager') {
      queryConditions.push({ targetRole: { $in: ['fleet_manager', 'all'] } });
    } else if (userRole === 'driver') {
      // Driver only receives general driver announcements or specifically addressed items (such as their assigned car's document warnings)
      queryConditions.push({ targetRole: 'driver', recipient: null });
    }

    const notifications = await Notification.find({
      organization: req.organizationId,
      $or: queryConditions,
    })
      .sort({ createdAt: -1 })
      .limit(60);

    const formatted = notifications.map((n) => {
      const isRead = Array.isArray(n.readBy) && n.readBy.some((id) => id.toString() === userId.toString());
      return {
        _id: n._id,
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        link: n.link,
        targetRole: n.targetRole,
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

// @desc    Mark a specific notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
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

// @desc    Mark all notifications for current user as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    let queryConditions = [
      { recipient: userId },
    ];

    if (userRole === 'admin') {
      queryConditions.push({ targetRole: { $in: ['admin', 'all'] } });
    } else if (userRole === 'fleet_manager') {
      queryConditions.push({ targetRole: { $in: ['fleet_manager', 'all'] } });
    } else if (userRole === 'driver') {
      queryConditions.push({ targetRole: 'driver', recipient: null });
    }

    await Notification.updateMany(
      {
        organization: req.organizationId,
        $or: queryConditions,
      },
      {
        $addToSet: { readBy: userId },
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
