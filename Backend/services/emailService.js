const transporter = require('../config/nodeMailer');
require('dotenv').config();

const sendUserConfirmation = async (name, email) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'We have received your message',
      text: `Hello ${name},

Thank you for contacting us! We have received your message and will get back to you shortly.

Best regards,
Support Team`,
    });

    console.log(`📩 Confirmation email sent to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send user confirmation:', err.message);
  }
};


const sendAdminNotification = async (name, email, message) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: '📨 New Contact Form Submission',
      text: `You received a new message from the contact form:

Name: ${name}
Email: ${email}
Message: ${message}`,
    });

    console.log('📢 Admin notified about new message');
  } catch (err) {
    console.error('❌ Failed to send admin notification:', err.message);
  }
};

module.exports = {
  sendUserConfirmation,
  sendAdminNotification,
};
