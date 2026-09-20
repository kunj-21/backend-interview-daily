import express from 'express'
import Redis from 'ioredis'

const router = express.Router()
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379")

redis.on("connect", () => {
    console.log("Connected to Redis1!");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});


function otpKey(phone){
    return `user:${phone}:otp`
}

router.post('/generate',async(req,res)=>{
    try{
        const phone = req.body.phone;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await redis.set(otpKey(phone), otp, 'EX', 300);
        res.json({ success: true, message: "OTP sent successfully", phone, otp });
    }catch(error){
        res.status(500).json({ error: "Failed to generate OTP" });
    }
})

router.post('/verify', async(req,res)=>{
    try{
        const {phone, otp} = req.body;
        const storedOtp = await redis.get(otpKey(phone));
        if(storedOtp === otp){
            await redis.del(otpKey(phone));
            res.json({ success: true, message: "OTP verified successfully" });
        }else{
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    }catch(error){
        res.status(500).json({ error: "Failed to verify OTP" });
    }
})

router.get('/count', async(req,res) => {
    try {
        const count = await redis.dbsize();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Failed to get database size" });
    }
})

router.post('/reset', async(req,res) => {
    try {
        await redis.flushdb();
        res.json({ message: 'All keys deleted from Redis' });
    } catch (error) {
        res.status(500).json({ error: "Failed to flush database" });
    }
})

router.post('/del', async(req,res) => {
    try {
        const {key} = req.body;
        await redis.del(key);
        res.json({ message: 'Key deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete key" });
    }
})

export default router;
