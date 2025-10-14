// middlewares/userAuth.js
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — Invalid token',
      });
    }

    // Attach userId to request body for controller access
    req.body.userId = decoded.id;

    next();
  } catch (err) {
    console.error('⚠️ Auth Error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Token verification failed: ' + err.message,
    });
  }
};

module.exports = userAuth;
