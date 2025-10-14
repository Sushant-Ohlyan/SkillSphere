// routes/userRoutes.js
const express = require('express');
const getUserData = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');

const userRouter = express.Router();

// ✅ Protected route to get user data
userRouter.get('/data', userAuth, getUserData);

module.exports = userRouter;
