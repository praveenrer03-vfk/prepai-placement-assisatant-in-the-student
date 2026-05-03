import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ─── ENV CONFIG ─────────────────────────
dotenv.config();

// ─── EXPRESS APP ────────────────────────
const app = express();

// ─── CORS FIX ───────────────────────────
app.use(cors({
  origin: "https://your-netlify-site.netlify.app"
}));

app.use(express.json());

// ─── MONGODB CONNECTION ─────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

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
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  const user = await User.create({ name, email, password });

  res.status(201).json({ message: "Registered successfully", user });
});

// ─── LOGIN ──────────────────────────────
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user)
    return res.status(401).json({ error: "Invalid credentials" });

  res.json({ message: "Login successful", user });
});

// ─── USERS ──────────────────────────────
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ─── QUESTIONS ──────────────────────────
app.get("/questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// ─── ADD QUESTION ───────────────────────
app.post("/questions", async (req, res) => {
  const { question, answer, topic } = req.body;

  const newQuestion = await Question.create({ question, answer, topic });

  res.status(201).json(newQuestion);
});

// ─── SEED DATA ──────────────────────────
app.get("/seed", async (req, res) => {
  const data = await Question.create({
    question: "What is 2% of 20?",
    answer: "0.4",
    topic: "percentage"
  });

  res.json({ message: "Data inserted ✅", data });
});

// ─── START SERVER ───────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});