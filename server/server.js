import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://prepai-placement-assisatant-in-the-two.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

/* ---------------- SCHEMAS ---------------- */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  explanation: String,
  topic: String,
});

/* ---------------- MODELS ---------------- */
const User = mongoose.model("User", userSchema);
const Question = mongoose.model("Question", questionSchema);

/* ---------------- HOME ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("Server is running ✅ Final Fix");
});

/* ---------------- REGISTER ---------------- */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- LOGIN ---------------- */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- GET USERS ---------------- */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- GET QUESTIONS ---------------- */
app.get("/api/aptitude/questions", async (req, res) => {
  try {
    const { topic } = req.query;

    console.log("Requested topic:", topic);

    let questions;

    if (topic) {
      questions = await Question.find({ topic }).lean();
    } else {
      questions = await Question.find().lean();
    }

    console.log("Questions found:", questions.length);

    res.json(questions);
  } catch (err) {
    console.log("Questions Route Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- ADD QUESTION ---------------- */
app.post("/api/questions", async (req, res) => {
  try {
    const { question, options, answer, explanation, topic } = req.body;

    const newQuestion = await Question.create({
      question,
      options,
      answer,
      explanation,
      topic,
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- SEED DATA ---------------- */
app.get("/api/seed", async (req, res) => {
  try {
    const data = await Question.create({
      question: "What is 2% of 20?",
      options: ["0.2", "0.4", "2", "4"],
      answer: "0.4",
      explanation: "2% of 20 = (2/100) × 20 = 0.4",
      topic: "percentage",
    });

    res.json({
      message: "Sample question inserted ✅",
      data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- START SERVER AFTER DB CONNECT ---------------- */
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "mydatabase",
    });

    console.log("MongoDB Connected ✅");
    console.log("DB Name:", mongoose.connection.name);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
  }
};

startServer();
await mongoose.connect(process.env.MONGO_URI, {
  dbName: "mydatabase",
  serverSelectionTimeoutMS: 30000
});
console.log("Mongo Ready State:", mongoose.connection.readyState);
console.log("Connected Host:", mongoose.connection.host);
console.log("Connected DB:", mongoose.connection.name);
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "mydatabase",
      serverSelectionTimeoutMS: 30000
    });

    console.log("MongoDB Connected ✅");
    console.log("Mongo Ready State:", mongoose.connection.readyState);
    console.log("Connected Host:", mongoose.connection.host);
    console.log("Connected DB:", mongoose.connection.name);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (err) {
    console.log("MongoDB Connection Error:", err);
  }
};
