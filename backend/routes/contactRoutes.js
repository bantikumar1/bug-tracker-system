const express = require('express');
const router = express.Router();

// POST /api/contact - Handle contact form submissions
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, and message are required.' 
    });
  }

  // Simple email format validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address.' 
    });
  }

  console.log('--- NEW CONTACT FORM SUBMISSION ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Subject: ${subject || 'N/A'}`);
  console.log(`Message: ${message}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('-----------------------------------');

  return res.status(200).json({
    success: true,
    message: 'Thank you for getting in touch! Our team will respond within 24 hours.'
  });
});

module.exports = router;
