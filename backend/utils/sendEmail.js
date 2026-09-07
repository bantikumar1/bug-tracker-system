const nodemailer = require('nodemailer');//Nodemailer ek Node.js library hai jo backend se email bhejne ke kaam aati hai.

const sendEmail = async ({ to, subject, html, text }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const isConfigured = emailUser && emailPass && emailUser !== 'your_email@gmail.com' && emailPass !== 'your_gmail_app_password';

  if (!isConfigured) {
    console.log('----------------------------------------------------');
    console.log('[DEV MAIL NOTICE] SMTP credentials not configured in .env');
    console.log(`[TO]: ${to}`);
    console.log(`[SUBJECT]: ${subject}`);
    console.log(`[TEXT CONTENT]:\n${text}`);
    console.log('----------------------------------------------------');
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"BugTracker" <${emailUser}>`,
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Password reset email sent to ${to}: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
