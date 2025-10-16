// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRouter = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const userRouter = require('./routes/userRoutes');
const contactRouter = require('./routes/contactRoutes');

dotenv.config();
const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean); // removes undefined

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  })
);

// ✅ Security Middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny'));

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/home', homeRoutes);
app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);

// ✅ Base Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
