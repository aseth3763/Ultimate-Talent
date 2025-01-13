const mongoose = require("mongoose");
const mongoUrl = "mongodb://localhost:27017/CreativeGenius";

mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on("connected", () => {
    console.log("Successfully connected to MongoDB ");
});

db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

module.exports = db;
