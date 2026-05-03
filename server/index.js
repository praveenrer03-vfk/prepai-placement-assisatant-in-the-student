import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import aptitudeRoutes from "./routes/aptitudeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: "https://your-netlify-site.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/user", userRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});