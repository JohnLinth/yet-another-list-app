const mongoose = require('mongoose');
import populateDB from "../utils/populateDB";

const mongoUri = process.env.MONGO_URI; // env var passed in from docker-compose.yml

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
        console.log("Initializing database with example data...");
        await populateDB(); // populate the database with dummy data
    } catch (err) {
        console.error("Could not connect to MongoDB:", err);
    }
};

export default connectDB;