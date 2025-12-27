const express = require('express');

const {
  registerUser,
  loginUser,
  logOut,
  verifyEmail,
  sendVerifyOtp,
  isAuthenticated,
  sendResetOtp,
  resetPassword
} = require('../controllers/authController');
const userAuth = require('../middlewares/userAuth');

const authRouter = express.Router();
// Public Routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/reset-otp-send', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Protected Routes
authRouter.post('/logout', userAuth, logOut);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/isauth', userAuth, isAuthenticated);

module.exports = authRouter;
