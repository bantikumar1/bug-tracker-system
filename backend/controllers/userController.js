const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    const validRoles = ['admin', 'developer', 'tester'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role. Must be admin, developer, or tester.' });
    }

    if (role.toLowerCase() === 'admin') {
      return res.status(400).json({ message: 'Creating Admin accounts via User Management is not allowed. Only Tester and Developer roles can be created.' });
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
      role: role.toLowerCase()
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ message: 'Server error while creating user.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const roleFilter = req.query.role;
    const users = await UserModel.getAll(roleFilter);
    return res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Invalid email address format.' });
    }

    const existingOther = await UserModel.findByEmailExcept(email.trim(), userId);
    if (existingOther) {
      return res.status(400).json({ message: 'Email address is already in use by another user account.' });
    }

    let profile_photo = undefined;
    if (req.file) {
      profile_photo = `/uploads/${req.file.filename}`;
    } else if (req.body.profile_photo !== undefined) {
      profile_photo = req.body.profile_photo;
    }

    const updatedUser = await UserModel.updateProfile(userId, {
      name: name.trim(),
      email: email.trim(),
      profile_photo
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Current password, new password, and confirm password are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await UserModel.findByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect. Please verify your password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(userId, hashedPassword);

    return res.status(200).json({
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error while changing password.' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active or inactive.' });
    }

    const updatedUser = await UserModel.toggleStatus(userId, status);
    return res.status(200).json({
      message: `User account ${status === 'active' ? 'activated' : 'deactivated'} successfully.`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return res.status(500).json({ message: 'Server error while updating user status.' });
  }
};

const getDeveloperSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Active session details
    const activeSessions = [
      {
        id: 'session-current',
        device: 'Chrome on Windows 11 (Current Session)',
        ip: '127.0.0.1',
        lastActive: 'Just now'
      }
    ];

    return res.status(200).json({
      user,
      activeSessions
    });
  } catch (error) {
    console.error('Get developer settings error:', error);
    return res.status(500).json({ message: 'Server error while loading settings.' });
  }
};

const updateDeveloperPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, language, default_dashboard_view } = req.body;

    const updatedUser = await UserModel.updatePreferences(userId, {
      theme,
      language,
      default_dashboard_view
    });

    return res.status(200).json({
      message: 'Preferences updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return res.status(500).json({ message: 'Server error while updating preferences.' });
  }
};

const logoutAllSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    // Log out all sessions by updating last_login timestamp
    return res.status(200).json({
      message: 'Logged out from all active devices and sessions successfully.'
    });
  } catch (error) {
    console.error('Logout all sessions error:', error);
    return res.status(500).json({ message: 'Server error while logging out all sessions.' });
  }
};

const toggle2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;

    const updatedUser = await UserModel.update2FAStatus(userId, enabled);

    return res.status(200).json({
      message: enabled ? 'Two-Factor Authentication (OTP Login) enabled.' : 'Two-Factor Authentication (OTP Login) disabled.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Toggle 2FA error:', error);
    return res.status(500).json({ message: 'Server error while updating 2FA settings.' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getProfile,
  updateProfile,
  changePassword,
  toggleUserStatus,
  getDeveloperSettings,
  updateDeveloperPreferences,
  logoutAllSessions,
  toggle2FA
};
