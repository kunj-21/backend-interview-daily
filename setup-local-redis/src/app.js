import express from "express";
import banner from "./banner.js";
import index from "./index.js";
import otp from "./otp.js";
import json_hash from "./json_vs_hash.js";

const app = express();

app.use(express.json());

app.use('/redis', banner);
app.use('/mongo', index);
app.use('/otp', otp);
app.use('/json', json_hash);

app.listen(3000, () => {
    console.log(`Server is running on port http://localhost:3000`);
});