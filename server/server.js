import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// ─── ENV CONFIG ─────────────────────────
dotenv.config();

// ─── EXPRESS APP ────────────────────────
const app = express();

// ─── CORS ───────────────────────────────
app.use(cors({
  origin: [
    'https://prepai-placement-assisatant-in-the-two.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ─── MONGODB CONNECTION ─────────────────
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'mydatabase'
})
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error:", err));

// ─── SCHEMA & MODEL ─────────────────────
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  topic: String
});

const User = mongoose.model("User", userSchema);
const Question = mongoose.model("Question", questionSchema);

// ─── HEALTH CHECK ───────────────────────
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ─── REGISTER ───────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "Registered successfully", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LOGIN ──────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── USERS ──────────────────────────────
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── QUESTIONS ──────────────────────────
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADD QUESTION ───────────────────────
app.post("/api/questions", async (req, res) => {
  try {
    const { question, answer, topic } = req.body;
    const newQuestion = await Question.create({ question, answer, topic });
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SEED DATA ──────────────────────────
app.get("/api/seed", async (req, res) => {
  try {
    const data = await Question.create({
      question: "What is 2% of 20?",
      answer: "0.4",
      topic: "percentage"
    });
    res.json({ message: "Data inserted ✅", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START SERVER ───────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});