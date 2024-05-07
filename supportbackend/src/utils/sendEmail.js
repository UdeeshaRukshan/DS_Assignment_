const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

// Function to send a simple email
const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport(emailConfig);

  const mailOptions = {
    from: emailConfig.auth.user, // assuming this is your email
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Failed to send email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
};

module.exports = { sendEmail };
