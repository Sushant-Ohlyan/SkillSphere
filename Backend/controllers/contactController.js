const contactModel = require('../models/contactModel');
const { sendUserConfirmation, sendAdminNotification } = require('../services/emailService');

const createContactEntry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const newMessage = await contactModel.create({ name, email, message });

    // Send emails asynchronously (don’t block response)
    sendUserConfirmation(name, email);
    sendAdminNotification(name, email, message);

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (err) {
    console.error('❌ createContactEntry error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    });
  }
};

module.exports = { createContactEntry };
