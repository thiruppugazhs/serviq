const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Driver = require('../models/Driver');

const generateToken = (id, role, organizationId) => {
  return jwt.sign(
    { id, role, organizationId },
    process.env.JWT_SECRET || 'serviq_dev_secret_jwt_key_2026_xyz',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// In-memory OTP store for email verification
const otpStore = new Map();

// Periodic cleanup of expired OTPs
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

// @desc    Generate and send 6-digit OTP for email verification
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user email is already registered
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(normalizedEmail, { otp, expiresAt, verified: false });

    console.log(`\n======================================================`);
    console.log(`[SERVIQ AUTH OTP] Email: ${normalizedEmail}`);
    console.log(`[SERVIQ AUTH OTP] 6-Digit Code: ${otp}`);
    console.log(`======================================================\n`);

    res.status(200).json({
      success: true,
      message: `OTP verification code sent to ${normalizedEmail}`,
      otp, // Provided for instant development/testing experience
      expiresInMinutes: 10,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 6-digit OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email or it has expired' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code' });
    }

    if (record.otp !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again' });
    }

    record.verified = true;
    otpStore.set(normalizedEmail, record);

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Email successfully verified',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new company and create the Organization Admin
// @route   POST /api/auth/register-company
// @access  Public
exports.registerCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      companyEmail,
      companyLogo,
      firstName,
      lastName,
      phone,
      companyAddress,
      registrationNumber,
      adminName,
      adminEmail,
      password,
      confirmPassword,
    } = req.body;

    const resolvedEmail = (adminEmail || companyEmail || '').toLowerCase().trim();
    const resolvedAdminName = (
      firstName && lastName
        ? `${firstName} ${lastName}`.trim()
        : adminName || firstName || 'Admin'
    ).trim();
    const resolvedCompanyName = (companyName || '').trim();

    if (!resolvedCompanyName) {
      return res.status(400).json({
        success: false,
        message: 'Company/Organization name is required',
      });
    }

    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Admin email is required',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email: resolvedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this admin email already exists',
      });
    }

    // 1. Create Organization
    const organization = await Organization.create({
      name: resolvedCompanyName,
      email: (companyEmail || resolvedEmail).toLowerCase().trim(),
      phone: phone || '',
      address: companyAddress || '',
      registrationNumber: registrationNumber || '',
      logo: companyLogo || '',
    });

    // 2. Create Organization Admin User
    const adminUser = await User.create({
      name: resolvedAdminName,
      firstName: firstName || '',
      lastName: lastName || '',
      email: resolvedEmail,
      password,
      role: 'admin',
      organization: organization._id,
      phone: phone || '',
      status: 'active',
    });

    const token = generateToken(adminUser._id, adminUser.role, organization._id);

    res.status(201).json({
      success: true,
      message: 'Company and Organization Admin registered successfully',
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        organization: {
          id: organization._id,
          name: organization.name,
          email: organization.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Admin, Fleet Manager, Driver)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+password')
      .populate('organization');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact your organization administrator.',
      });
    }

    // If driver, retrieve driver details & assigned vehicle
    let driverData = null;
    if (user.role === 'driver') {
      driverData = await Driver.findOne({ user: user._id }).populate({
        path: 'assignedVehicle',
      });
    }

    const token = generateToken(user._id, user.role, user.organization._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        driverProfile: driverData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('organization');

    let driverData = null;
    if (user.role === 'driver') {
      driverData = await Driver.findOne({ user: user._id }).populate('assignedVehicle');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        employeeId: user.employeeId,
        address: user.address,
        organization: user.organization,
        driverProfile: driverData,
      },
    });
  } catch (error) {
    next(error);
  }
};
