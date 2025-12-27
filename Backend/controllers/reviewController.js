// controllers/reviewController.js
const Review = require('../models/reviewModel');
const User = require('../models/userModel'); // 👈 import User model


const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newReview = new Review({
      userId: user._id,
      userName: user.name, 
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
    });
  }
};


const Review = require('../models/Review');

const getReviews = async (req, res) => {
  try {
  
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); 
    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
    });
  }
};




module.exports = { createReview, getReviews };
