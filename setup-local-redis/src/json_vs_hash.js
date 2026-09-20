import express from 'express';
import Redis from 'ioredis';

const router = express.Router();

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redis.on('connect', () => console.log('Redis Connected (JSON vs HASH page)'));

// 1. JSON String approach (SET / GET with JSON.stringify)
router.post('/jsonkey/:key', async (req, res) => {
    const { key } = req.params;
    const data = req.body.data || req.body;
    
    try {
        await redis.set(key, JSON.stringify(data));
        res.json({ message: "Data set successfully as JSON string", key, data });
    } catch (error) {
        res.status(500).json({ error: "Failed to set JSON data", details: error.message });
    }
});

router.get('/jsonkey/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const raw = await redis.get(key);
        if (!raw) return res.status(404).json({ message: "Key not found" });
        res.json({ key, data: JSON.parse(raw) });
    } catch (error) {
        res.status(500).json({ error: "Failed to get JSON data", details: error.message });
    }
});

// 2. Hash approach (HSET / HGETALL)
router.post('/hash/:key', async (req, res) => {
    const { key } = req.params;
    const data = req.body.data || req.body;
    
    try {
        await redis.hset(key, data);
        res.json({ message: "Data set successfully as Redis Hash", key, data });
    } catch (error) {
        res.status(500).json({ error: "Failed to set Hash data", details: error.message });
    }
});

router.get('/hash/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const data = await redis.hgetall(key);
        if (!data || Object.keys(data).length === 0) {
            return res.status(404).json({ message: "Hash key not found" });
        }
        res.json({ key, data });
    } catch (error) {
        res.status(500).json({ error: "Failed to get Hash data", details: error.message });
    }
});

export default router;