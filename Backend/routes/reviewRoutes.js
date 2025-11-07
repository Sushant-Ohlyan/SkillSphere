// routes/reviewRoutes.js
const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const userAuth = require('../middlewares/userAuth');
const { body, validationResult } = require('express-validator');

const reviewRouter = express.Router();

// ✅ Input validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .isLength({ min: 5 })
    .withMessage('Comment must be at least 5 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ✅ Routes
reviewRouter.post('/', userAuth, validateReview, createReview);
reviewRouter.get('/', getReviews);

module.exports = reviewRouter;
