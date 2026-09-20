import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const router = express.Router();

// Use 127.0.0.1 explicitly instead of localhost
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Handle Redis connection events so Node doesn't spam AggregateError
redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

router.get("/", async (req, res) => {
  try {
    const visits = await redis.ping();
    res.json({ message: `Redis ping response: ${visits}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to query Redis" });
  }
});

router.get("/connect", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(
        process.env.MONGO_URL || "mongodb://127.0.0.1:27017/mydatabase"
      );
    }
    res.json({
      message: "Connected to MongoDB",
      database: mongoose.connection.name,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Failed to connect to MongoDB" });
  }
});

export default router;
