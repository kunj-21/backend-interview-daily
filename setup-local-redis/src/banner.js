import express from "express";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
const banner = "app:banner";

redis.on("connect", () => {
    console.log("Connected to Redis!");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

router.post("/create", async (req, res) => {
  try {
    await redis.set("banner", req.body.message || "Game changer in the house");
    res.json({ message: "Banner set successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to set banner in Redis" });
  }
});

router.get("/banner", async (req, res) => {
    try{
        const banner = await redis.get("banner");
        res.json({ banner,"message":"banner got from redis" });
    }catch(error){
        res.status(500).json({ error: "Failed to get banner from Redis" });
    }
});

router.get('/eixst',async(req,res)=>{
    try{
        const banner = await redis.exists("banner");
        res.json({ banner });
    }catch(error){
        res.status(500).json({ error: "Failed to get banner from Redis" });
    }
})

router.delete('/delete',async(req,res)=>{ 
    try{
        const banner = await redis.del("banner");
        res.json({ banner });
    }catch(error){
        res.status(500).json({ error: "Failed to delete banner from Redis" });
    }
})
export default router;
