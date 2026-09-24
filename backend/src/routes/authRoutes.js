const express = require('express');
const router = express.Router();
const { registerCompany, login, getMe, sendOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-company', registerCompany);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
