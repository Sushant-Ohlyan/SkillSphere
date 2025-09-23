const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error("❌ SMTP Connection Error:", err.message);
    } else {
        console.log("✅ SMTP Server is ready to send emails");
    }
});

module.exports = transporter;
