const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const handleUploads = (req, res, next) => {
  const uploadFields = uploadMiddleware.fields([
    { name: 'bug_screenshot', maxCount: 1 },
    { name: 'bug_video', maxCount: 1 }
  ]);

  uploadFields(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error.' });
    }
    next();
  });
};

router.post('/', authMiddleware, roleMiddleware('tester'), handleUploads, bugController.createBug);
router.get('/', authMiddleware, bugController.getBugs);
router.get('/:id', authMiddleware, bugController.getBugById);
router.put('/:id/assign', authMiddleware, roleMiddleware('developer'), bugController.assignBug);
router.put('/:id/status', authMiddleware, roleMiddleware('developer'), bugController.changeStatus);

module.exports = router;
