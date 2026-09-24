const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Maintenance = require('../models/Maintenance');
const Repair = require('../models/Repair');
const Expense = require('../models/Expense');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const Otp = require('../models/Otp');
const {
  sendRegistrationOtpEmail,
  sendDeletionOtpEmail,
} = require('../utils/emailService');

const generateToken = (id, role, organizationId) => {
  return jwt.sign(
    { id, role, organizationId },
    process.env.JWT_SECRET || 'serviq_dev_secret_jwt_key_2026_xyz',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// In-memory fallback OTP store
const memoryOtpStore = new Map();

// Periodic cleanup of in-memory store
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, data] of memoryOtpStore.entries()) {
    if (data.expiresAt < now) {
      memoryOtpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (cleanupTimer && cleanupTimer.unref) {
  cleanupTimer.unref();
}

// @desc    Generate and send 6-digit OTP for email verification during account creation
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
    try {
      if (User.db && User.db.readyState === 1) {
        const existing = await User.findOne({ email: normalizedEmail }).maxTimeMS(3000);
        if (existing) {
          return res.status(400).json({ success: false, message: 'An account with this email already exists' });
        }
      }
    } catch (e) {
      // Allow proceeding if DB check is not ready
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Persist to MongoDB with TTL
    try {
      if (Otp.db && Otp.db.readyState === 1) {
        await Otp.findOneAndUpdate(
          { email: normalizedEmail, purpose: 'registration' },
          { otp, verified: false, createdAt: new Date() },
          { upsert: true, new: true }
        ).maxTimeMS(3000);
      }
    } catch (dbErr) {
      console.warn('[OTP DB SAVE WARN]', dbErr.message);
    }

    // Backup to in-memory store
    memoryOtpStore.set(`reg_${normalizedEmail}`, { otp, expiresAt, verified: false });

    console.log(`\n======================================================`);
    console.log(`[SERVIQ REGISTRATION OTP] Email: ${normalizedEmail}`);
    console.log(`[SERVIQ REGISTRATION OTP] 6-Digit Code: ${otp}`);
    console.log(`======================================================\n`);

    // Dispatch real email via Brevo API
    let emailDispatched = false;
    let emailError = null;
    try {
      const emailResult = await sendRegistrationOtpEmail(normalizedEmail, otp);
      if (emailResult && emailResult.success) {
        emailDispatched = true;
      }
    } catch (mailErr) {
      emailError = mailErr.message;
      console.error('[SERVIQ BREVO DISPATCH ERROR]:', mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: emailDispatched
        ? `A 6-digit verification code has been dispatched to ${normalizedEmail}. Please check your inbox.`
        : `Verification code generated for ${normalizedEmail}. (Note: Email delivery encountered an issue: ${emailError || 'fallback mode'})`,
      emailDispatched,
      expiresInMinutes: 10,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 6-digit OTP for email verification
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Check MongoDB Otp first
    let record = null;
    try {
      if (Otp.db && Otp.db.readyState === 1) {
        record = await Otp.findOne({ email: normalizedEmail, purpose: 'registration' }).maxTimeMS(3000);
      }
    } catch (e) {
      // Fallback to memory
    }

    // Fallback to in-memory
    const memRecord = memoryOtpStore.get(`reg_${normalizedEmail}`);

    const targetOtp = record?.otp || memRecord?.otp;

    if (!targetOtp) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP verification code found for this email, or code has expired. Please request a new code.',
      });
    }

    if (memRecord && Date.now() > memRecord.expiresAt) {
      memoryOtpStore.delete(`reg_${normalizedEmail}`);
      if (record && Otp.db && Otp.db.readyState === 1) await Otp.deleteOne({ _id: record._id }).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      });
    }

    if (targetOtp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    // Mark verified
    if (record && Otp.db && Otp.db.readyState === 1) {
      record.verified = true;
      await record.save().catch(() => {});
    }
    if (memRecord) {
      memRecord.verified = true;
      memoryOtpStore.set(`reg_${normalizedEmail}`, memRecord);
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Email successfully verified.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send 6-digit OTP for Account Deletion
// @route   POST /api/auth/send-deletion-otp
// @access  Private (Requires authentication)
exports.sendDeletionOtp = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.email) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const normalizedEmail = user.email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Persist to MongoDB with TTL
    try {
      if (Otp.db && Otp.db.readyState === 1) {
        await Otp.findOneAndUpdate(
          { email: normalizedEmail, purpose: 'deletion' },
          { otp, verified: false, createdAt: new Date() },
          { upsert: true, new: true }
        ).maxTimeMS(3000);
      }
    } catch (dbErr) {
      console.warn('[DELETION OTP DB SAVE WARN]', dbErr.message);
    }

    // Backup to in-memory store
    memoryOtpStore.set(`del_${normalizedEmail}`, { otp, expiresAt, verified: false });

    console.log(`\n======================================================`);
    console.log(`[SERVIQ DELETION OTP] Email: ${normalizedEmail}`);
    console.log(`[SERVIQ DELETION OTP] 6-Digit Code: ${otp}`);
    console.log(`======================================================\n`);

    // Dispatch critical deletion warning email via Brevo
    let emailDispatched = false;
    let emailError = null;
    try {
      const emailResult = await sendDeletionOtpEmail(
        normalizedEmail,
        otp,
        user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Administrator'
      );
      if (emailResult && emailResult.success) {
        emailDispatched = true;
      }
    } catch (mailErr) {
      emailError = mailErr.message;
      console.error('[SERVIQ BREVO DELETION DISPATCH ERROR]:', mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: emailDispatched
        ? `A critical deletion authorization code has been sent to ${normalizedEmail}. Please check your inbox.`
        : `Deletion code generated for ${normalizedEmail}. (Note: ${emailError || 'Email fallback'})`,
      emailDispatched,
      expiresInMinutes: 10,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and permanently delete account (and cascade organization data if Admin)
// @route   POST /api/auth/verify-and-delete-account
// @access  Private (Requires authentication)
exports.verifyAndDeleteAccount = async (req, res, next) => {
  try {
    const user = req.user;
    const { otp } = req.body;

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Security authorization code is required to confirm account deletion.',
      });
    }

    const normalizedEmail = user.email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Check MongoDB Otp first
    let record = null;
    try {
      if (Otp.db && Otp.db.readyState === 1) {
        record = await Otp.findOne({ email: normalizedEmail, purpose: 'deletion' }).maxTimeMS(3000);
      }
    } catch (e) {
      // Fallback
    }

    const memRecord = memoryOtpStore.get(`del_${normalizedEmail}`);
    const targetOtp = record?.otp || memRecord?.otp;

    if (!targetOtp) {
      return res.status(400).json({
        success: false,
        message: 'No active deletion code found or it has expired. Please request a new code.',
      });
    }

    if (memRecord && Date.now() > memRecord.expiresAt) {
      memoryOtpStore.delete(`del_${normalizedEmail}`);
      if (record && Otp.db && Otp.db.readyState === 1) await Otp.deleteOne({ _id: record._id }).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'Authorization code has expired. Please request a new code.',
      });
    }

    if (targetOtp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authorization code. Deletion cancelled for your security.',
      });
    }

    // Cleanup OTPs for this email
    try {
      await Otp.deleteMany({ email: normalizedEmail });
    } catch (e) {}
    memoryOtpStore.delete(`del_${normalizedEmail}`);

    const orgId = user.organization;

    if (user.role === 'admin' && orgId) {
      // Cascade delete entire fleet organization
      console.log(`[ACCOUNT DELETION] Admin initiated permanent purge of Organization ID: ${orgId}`);

      await Promise.all([
        Vehicle.deleteMany({ organization: orgId }),
        Driver.deleteMany({ organization: orgId }),
        Maintenance.deleteMany({ organization: orgId }),
        Repair.deleteMany({ organization: orgId }),
        Expense.deleteMany({ organization: orgId }),
        Document.deleteMany({ organization: orgId }),
        Notification.deleteMany({ organization: orgId }),
        User.deleteMany({ organization: orgId }),
        Organization.findByIdAndDelete(orgId),
      ]);

      return res.status(200).json({
        success: true,
        message: 'Organization, all fleet telemetry, and associated user accounts have been permanently deleted.',
      });
    }

    // Individual non-admin user deletion
    if (user.role === 'driver') {
      await Driver.deleteMany({ user: user._id });
    }
    await Notification.deleteMany({ recipient: user._id });
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'Your account has been permanently deleted from SERVIQ.',
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

    // Clean up any remaining registration OTP records for this email
    try {
      await Otp.deleteMany({ email: resolvedEmail });
    } catch (e) {}
    memoryOtpStore.delete(`reg_${resolvedEmail}`);

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
