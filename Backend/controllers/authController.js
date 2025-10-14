const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodeMailer');
require('dotenv').config();

const TOKEN_EXPIRY = "2d";
const COOKIE_MAX_AGE = 2 * 24 * 60 * 60 * 1000; // 2 days

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    const userExists = await userModel.findOne({ $or: [{ username }, { email }] });
    if (userExists)
      return res.status(400).json({ success: false, message: 'Username or Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: COOKIE_MAX_AGE
    });

    // Optional welcome mail
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome to Our App!',
        text: `Hello ${username}, your account has been created successfully.`
      });
    } catch (mailErr) {
      console.warn('Email send failed:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: newUser._id, username: newUser.username, email: newUser.email }
    });

  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and Password are required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: COOKIE_MAX_AGE
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ================= LOGOUT =================
const logOut = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= SEND VERIFY OTP =================
const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user)
      return res.json({ success: false, message: 'User not found' });

    if (user.isVerified)
      return res.json({ success: false, message: 'Account already verified' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Verify Your Email',
      text: `Your verification OTP is ${otp}. It will expire in 24 hours.`
    });

    res.json({ success: true, message: 'Verification OTP sent successfully' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ================= VERIFY EMAIL =================
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp)
    return res.json({ success: false, message: 'Missing details' });

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res.json({ success: false, message: 'User not found' });

    if (user.verifyOtp !== otp)
      return res.json({ success: false, message: 'Invalid OTP' });

    if (user.verifyOtpExpiry < Date.now())
      return res.json({ success: false, message: 'OTP expired' });

    user.isVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpiry = 0;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ================= IS AUTHENTICATED =================
const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: 'User is authenticated' });
  } catch {
    res.json({ success: false, message: 'User not authenticated' });
  }
};

// ================= SEND RESET OTP =================
const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
    });

    res.json({ success: true, message: 'Reset OTP sent successfully' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: 'Missing required fields' });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: 'User not found' });

    if (user.resetPasswordOtp !== otp)
      return res.json({ success: false, message: 'Invalid OTP' });

    if (user.resetPasswordOtpExpiry < Date.now())
      return res.json({ success: false, message: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = '';
    user.resetPasswordOtpExpiry = 0;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ================= EXPORT =================
module.exports = {
  registerUser,
  loginUser,
  logOut,
  verifyEmail,
  sendVerifyOtp,
  isAuthenticated,
  sendResetOtp,
  resetPassword
};

