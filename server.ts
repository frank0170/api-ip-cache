import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import IPInfo from "./modelIp";

const app = express();
const PORT = 5080;

mongoose.connect("mongo-url");

app.use(express.json());

app.use(async (req, res, next) => {
  const ip = req.query.ip as string;

  const cachedInfo = await IPInfo.findOne({ ip });

  if (
    cachedInfo &&
    cachedInfo.createdAt >= new Date(new Date().getTime() - 60000)
  ) {
    res.json(cachedInfo.info);
  } else {
    try {
      const response = await axios.get(`http://ipwho.is/${ip}`);
      const info = response.data;

      await IPInfo.findOneAndUpdate(
        { ip },
        { info, createdAt: new Date() },
        { upsert: true }
      );

      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch IP info" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
