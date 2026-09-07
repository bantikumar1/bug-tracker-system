const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const handlePhotoUpload = (req, res, next) => {
  const uploadSingle = uploadMiddleware.single('profile_photo');
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Profile photo upload error.' });
    }
    next();
  });
};

// Admin User Management Routes
router.post('/', authMiddleware, roleMiddleware('admin'), userController.createUser);
router.get('/', authMiddleware, roleMiddleware('admin'), userController.getUsers);
router.put('/:id/status', authMiddleware, roleMiddleware('admin'), userController.toggleUserStatus);

// Generic Profile & Password Routes (Protected: Any authenticated user can update their own profile/password)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, handlePhotoUpload, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);
router.put('/2fa', authMiddleware, userController.toggle2FA);

// Developer Settings & Preferences Routes (Protected: Developer role required)
router.get('/developer/settings', authMiddleware, roleMiddleware('developer'), userController.getDeveloperSettings);
router.put('/developer/preferences', authMiddleware, roleMiddleware('developer'), userController.updateDeveloperPreferences);
router.post('/developer/logout-all', authMiddleware, roleMiddleware('developer'), userController.logoutAllSessions);

module.exports = router;
