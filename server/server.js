import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "https://prepai-placement-assisatant-in-the-two.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "mydatabase"
})
.then(() => {
  console.log("MongoDB Connected ✅");
  console.log("DB Name:", mongoose.connection.name);
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Question Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  explanation: String,
  topic: String
});

// Models
const User = mongoose.model("User", userSchema);
const Question = mongoose.model("Question", questionSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Register Route
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: "Registration successful",
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// FIXED Aptitude Questions Route
app.get("/api/aptitude/questions", async (req, res) => {
  try {
    const { topic } = req.query;

    let questions;

    if (topic) {
      questions = await Question.find({ topic });
    } else {
      questions = await Question.find();
    }

    res.json(questions);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Add Question
app.post("/api/questions", async (req, res) => {
  try {
    const { question, options, answer, explanation, topic } = req.body;

    const newQuestion = await Question.create({
      question,
      options,
      answer,
      explanation,
      topic
    });

    res.status(201).json(newQuestion);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Seed sample question
app.get("/api/seed", async (req, res) => {
  try {
    const data = await Question.create({
      question: "What is 2% of 20?",
      options: ["0.2", "0.4", "2", "4"],
      answer: "0.4",
      explanation: "2% of 20 = (2/100) × 20 = 0.4",
      topic: "percentage"
    });

    res.json({
      message: "Sample question inserted ✅",
      data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});