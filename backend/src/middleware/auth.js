const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'serviq_dev_secret_jwt_key_2026_xyz');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact your organization administrator.',
      });
    }

    req.user = user;
    req.organizationId = user.organization;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is invalid or expired.',
      error: error.message,
    });
  }
};

module.exports = { protect };
