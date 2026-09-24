const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const fullUser = await UserModel.findById(user.id);

    // Check if account status is inactive (requires Admin approval)
    if (fullUser.status && fullUser.status.toLowerCase() === 'inactive') {
      return res.status(403).json({ message: 'Your account is pending Admin approval.' });
    }

    // Check if 2FA OTP login is enabled for this account
    if (fullUser.twofa_enabled === 1 || fullUser.twofa_enabled === true) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      const tempToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await UserModel.setLoginOTP(fullUser.id, hashedOtp, tempToken, expiry);

      const textContent = `Hello ${fullUser.name},\n\nYour 2FA verification code for BugTracker login is: ${otp}\nThis code is valid for 10 minutes.\n\nBest regards,\nBugTracker Security Team`;

      const htmlContent = `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0b0f17; color: #f8fafc; padding: 2rem; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #6366f1; margin-top: 0;">BugTracker 2FA Login Code</h2>
          <p>Hello <strong>${fullUser.name}</strong>,</p>
          <p>Enter the 6-digit verification code below to complete your sign in:</p>
          <div style="font-size: 2.2rem; font-weight: 800; letter-spacing: 8px; color: #6366f1; background: rgba(99,102,241,0.12); border: 1px dashed #6366f1; padding: 1rem; border-radius: 8px; text-align: center; margin: 1.5rem 0;">
            ${otp}
          </div>
          <p style="font-size: 0.85rem; color: #94a3b8;">This code is valid for 10 minutes. If you did not attempt to log in, please update your password immediately.</p>
        </div>
      `;

      await sendEmail({
        to: fullUser.email,
        subject: '2FA Verification Code - BugTracker',
        text: textContent,
        html: htmlContent
      });

      return res.status(200).json({
        requiresOtp: true,
        tempToken,
        message: 'A 6-digit verification code has been sent to your email.'
      });
    }

    const payload = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      profile_photo: fullUser.profile_photo,
      theme: fullUser.theme,
      language: fullUser.language,
      default_dashboard_view: fullUser.default_dashboard_view,
      notify_bug_assigned: fullUser.notify_bug_assigned,
      notify_status_change: fullUser.notify_status_change,
      notify_comment: fullUser.notify_comment,
      twofa_enabled: fullUser.twofa_enabled
    };

    const token = jwt.sign(
      { id: fullUser.id, name: fullUser.name, email: fullUser.email, role: fullUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { tempToken, otp } = req.body;

    if (!tempToken || !otp) {
      return res.status(400).json({ message: 'Temporary login token and OTP are required.' });
    }

    const user = await UserModel.findByLoginTempToken(tempToken);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired login session. Please sign in again.' });
    }

    if (user.login_otp_attempts >= 5) {
      await UserModel.clearLoginOTP(user.id);
      return res.status(429).json({ message: 'Too many failed verification attempts. Please sign in again.' });
    }

    const isMatch = await bcrypt.compare(otp.toString().trim(), user.login_otp_code);
    if (!isMatch) {
      await UserModel.incrementLoginOtpAttempts(user.id);
      return res.status(400).json({ message: 'Invalid verification code. Please try again.' });
    }

    await UserModel.clearLoginOTP(user.id);

    const fullUser = await UserModel.findById(user.id);

    const payload = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      profile_photo: fullUser.profile_photo,
      theme: fullUser.theme,
      language: fullUser.language,
      default_dashboard_view: fullUser.default_dashboard_view,
      notify_bug_assigned: fullUser.notify_bug_assigned,
      notify_status_change: fullUser.notify_status_change,
      notify_comment: fullUser.notify_comment,
      twofa_enabled: fullUser.twofa_enabled
    };

    const token = jwt.sign(
      { id: fullUser.id, name: fullUser.name, email: fullUser.email, role: fullUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    return res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};

const registerDeveloper = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'developer'
    });

    return res.status(201).json({
      message: 'Developer registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Developer registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

const registerTester = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'tester'
    });

    return res.status(201).json({
      message: 'Tester registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Tester registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

const registerPublicUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const normalizedRole = role.toString().trim().toLowerCase();
    if (normalizedRole !== 'tester' && normalizedRole !== 'developer') {
      return res.status(400).json({ message: 'Invalid role selection. Only Tester or Developer self-registration is allowed.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
      status: 'inactive'
    });

    return res.status(201).json({
      message: 'Account created successfully! Your account is currently pending Admin approval.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (error) {
    console.error('Public user registration error:', error);
    return res.status(500).json({ message: 'Server error during account registration.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findByEmail(cleanEmail);

    const genericResponse = {
      message: 'If an account with that email exists, a 6-digit OTP has been sent to your email.'
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserModel.setOTP(user.id, hashedOtp, expiry);

    const textContent = `Hello ${user.name},\n\nYou requested a password reset for your BugTracker account.\nYour 6-digit verification OTP code is: ${otp}\n\nThis OTP is valid for 10 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nBugTracker Security Team`;
    
    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0b0f17; color: #f8fafc; padding: 2rem; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #6366f1; margin-top: 0;">BugTracker Password Reset OTP</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>We received a request to reset the password for your BugTracker account.</p>
        <p style="margin-bottom: 0.5rem; font-weight: 600;">Your 6-digit verification code:</p>
        <div style="font-size: 2.2rem; font-weight: 800; letter-spacing: 8px; color: #6366f1; background: rgba(99,102,241,0.12); border: 1px dashed #6366f1; padding: 1rem; border-radius: 8px; text-align: center; margin: 1rem 0;">
          ${otp}
        </div>
        <p style="font-size: 0.85rem; color: #94a3b8;">This code is valid for 10 minutes. Enter this OTP along with your new password on the reset page.</p>
        <p style="font-size: 0.8rem; color: #64748b; margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP Code - BugTracker',
      text: textContent,
      html: htmlContent
    });

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error while processing password reset request.' });
  }
};

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    if (!otp || !otp.toString().trim()) {
      return res.status(400).json({ message: '6-digit OTP code is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findByEmail(cleanEmail);

    const savedOtpCode = user ? (user.reset_otp || user.otp_code) : null;
    const savedOtpExpiry = user ? (user.reset_otp_expiry || user.otp_expiry) : null;

    if (!user || !savedOtpCode || !savedOtpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please request a new OTP.' });
    }

    if (new Date(savedOtpExpiry) < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new OTP.' });
    }

    if (user.otp_attempts >= 5) {
      return res.status(429).json({ message: 'Too many failed OTP attempts. Please request a new OTP.' });
    }

    const isMatch = await bcrypt.compare(otp.toString().trim(), savedOtpCode);
    if (!isMatch) {
      await UserModel.incrementOtpAttempts(user.id);
      return res.status(400).json({ message: 'Invalid OTP code. Please check your email and try again.' });
    }

    return res.status(200).json({ message: 'OTP verified successfully. Proceed to reset password.' });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    return res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    if (!otp || !otp.toString().trim()) {
      return res.status(400).json({ message: '6-digit OTP code is required.' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findByEmail(cleanEmail);

    const savedOtpCode = user ? (user.reset_otp || user.otp_code) : null;
    const savedOtpExpiry = user ? (user.reset_otp_expiry || user.otp_expiry) : null;

    if (!user || !savedOtpCode || !savedOtpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please request a new OTP.' });
    }

    if (new Date(savedOtpExpiry) < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new OTP.' });
    }

    if (user.otp_attempts >= 5) {
      return res.status(429).json({ message: 'Too many failed OTP attempts. Please request a new OTP.' });
    }

    const isMatch = await bcrypt.compare(otp.toString().trim(), savedOtpCode);
    if (!isMatch) {
      await UserModel.incrementOtpAttempts(user.id);
      return res.status(400).json({ message: 'Invalid OTP code. Please check your email and try again.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updatePasswordAndClearOTP(user.id, hashedPassword);

    return res.status(200).json({
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error while resetting password.' });
  }
};

module.exports = {
  login,
  verifyLoginOtp,
  registerDeveloper,
  registerTester,
  registerPublicUser,
  forgotPassword,
  verifyResetOTP,
  resetPassword
};
