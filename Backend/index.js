// index.js
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/Db.js');
const app = require('./app.js');
const chalk = require('chalk');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(chalk.green(`Server running on port ${PORT}`));
    });

    const shutdown = async (signal) => {
      console.log(chalk.yellow(`\n${signal} received. Shutting down gracefully...`));
      server.close(() => {
        console.log(chalk.blue('Server closed'));
      });
      await mongoose.connection.close();
      console.log(chalk.magenta('MongoDB disconnected'));
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error(chalk.red('Failed to start server:', error));
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error(chalk.red(` Unhandled Rejection: ${err.message}`));
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(chalk.red(`Uncaught Exception: ${err.message}`));
  process.exit(1);
});

startServer();
