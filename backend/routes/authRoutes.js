const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/register', authController.registerDeveloper);
router.post('/register-tester', authController.registerTester);
router.post('/signup', authController.registerPublicUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password-otp', authController.resetPasswordOTP);

module.exports = router;
