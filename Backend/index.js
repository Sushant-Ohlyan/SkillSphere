const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/Db.js');
const app = require('./server.js');

dotenv.config();

const startServer = async () => {
    try{
        await connectDB();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    }catch(error){
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log(`Logged Error: ${err.message}`);
    process.exit(1);
});

startServer();
