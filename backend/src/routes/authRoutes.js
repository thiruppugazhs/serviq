const express = require('express');
const router = express.Router();
const {
  registerCompany,
  login,
  getMe,
  sendOtp,
  verifyOtp,
  sendDeletionOtp,
  verifyAndDeleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-company', registerCompany);
router.post('/login', login);
router.get('/me', protect, getMe);

// Account deletion with OTP verification
router.post('/send-deletion-otp', protect, sendDeletionOtp);
router.post('/verify-and-delete-account', protect, verifyAndDeleteAccount);

module.exports = router;
