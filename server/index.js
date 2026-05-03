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
app.use(cors());
app.use(express.json());

// DATABASE
mongoose
  .connect("mongodb://127.0.0.1:27017/placement-ai")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/user", userRoutes);   // ✅ FIX ADDED

// TEST
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});