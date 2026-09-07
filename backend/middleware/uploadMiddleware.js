const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `evidence-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp'];

  const allowedVideoExts = ['.mp4', '.webm', '.mov'];
  const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (file.fieldname === 'bug_screenshot' || file.fieldname === 'profile_photo') {
    if (allowedImageExts.includes(ext) && allowedImageMimes.includes(mime)) {
      return cb(null, true);
    }
    return cb(new Error('Invalid image file type. Only JPG, JPEG, PNG, and WEBP formats are allowed.'));
  }

  if (file.fieldname === 'bug_video') {
    if (allowedVideoExts.includes(ext) && allowedVideoMimes.includes(mime)) {
      return cb(null, true);
    }
    return cb(new Error('Invalid video file type. Only MP4, WEBM, and MOV formats are allowed.'));
  }

  cb(new Error('Unexpected upload field.'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max limit
  }
});

module.exports = upload;
