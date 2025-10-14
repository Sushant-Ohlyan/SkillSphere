// controllers/userController.js
const userModel = require('../models/User');

// ✅ Get User Data Controller
const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if ID is missing
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not provided',
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.username,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('❌ Error in getUserData:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    });
  }
};

module.exports = getUserData;
