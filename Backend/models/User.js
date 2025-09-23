const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpiry: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  resetPasswordOtp: { type: String, default: '' },
  resetPasswordOtpExpiry: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin', 'Dev', 'superadmin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
 