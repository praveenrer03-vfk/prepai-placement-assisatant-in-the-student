import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { codingQuestionsData } from "./data/codingQuestions.js"; // ← data file

dotenv.config();

const app = express();

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  "https://prepai-placement-assisatant-in-the-student-qoin-m50ozni4n.vercel.app",
  "https://prepai-placement-assisatant-in-the-two.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("/{*any}", cors());

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

/* ---------------- AUTH MIDDLEWARE ---------------- */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

/* ---------------- SCHEMAS ---------------- */
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  question:    String,
  options:     [String],
  answer:      String,
  explanation: String,
  topic:       String,
});

const codingQuestionSchema = new mongoose.Schema({
  title:        String,
  difficulty:   { type: String, enum: ["Easy", "Medium", "Hard"] },
  topic:        String,
  description:  String,
  inputFormat:  String,
  outputFormat: String,
  sampleInput:  String,
  sampleOutput: String,
  starterCode:  String,
});

/* ---------------- MODELS ---------------- */
const User           = mongoose.model("User", userSchema);
const Question       = mongoose.model("Question", questionSchema);
const CodingQuestion = mongoose.model("CodingQuestion", codingQuestionSchema);

/* ---------------- HOME ---------------- */
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

/* ==========================================
   AUTH ROUTES
   ========================================== */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ⚠️ DELETE THIS BEFORE PRODUCTION */
app.post("/api/debug-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    res.json({
      step1_received:       { email, password },
      step2_userFound:      !!user,
      step3_storedPassword: user ? user.password : null,
      step4_match:          user ? user.password === password : false,
      step5_jwtSecret:      !!process.env.JWT_SECRET,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

/* ==========================================
   USER ROUTES
   ========================================== */

app.get("/api/users", authenticate, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================
   APTITUDE ROUTES
   ========================================== */

app.get("/api/aptitude/questions", authenticate, async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = topic ? { topic } : {};
    const questions = await Question.find(filter).lean();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/questions", authenticate, async (req, res) => {
  try {
    const { question, options, answer, explanation, topic } = req.body;
    if (!question || !options || !answer || !topic)
      return res.status(400).json({ error: "Missing required fields" });

    const newQuestion = await Question.create({ question, options, answer, explanation, topic });
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/seed", async (req, res) => {
  try {
    const data = await Question.create({
      question:    "What is 2% of 20?",
      options:     ["0.2", "0.4", "2", "4"],
      answer:      "0.4",
      explanation: "2% of 20 = (2/100) × 20 = 0.4",
      topic:       "percentage",
    });
    res.json({ message: "Sample aptitude question inserted ✅", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================
   CODING ROUTES
   ========================================== */

/* GET — protected, supports ?topic= and ?difficulty= filters */
app.get("/api/coding/questions", authenticate, async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const filter = {};
    if (topic      && topic      !== "All") filter.topic      = topic;
    if (difficulty && difficulty !== "All") filter.difficulty = difficulty;

    const questions = await CodingQuestion.find(filter).lean();
    console.log(`Coding questions fetched: ${questions.length}`);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* SEED — reads from data/codingQuestions.js, run once after deploy */
app.get("/api/coding/seed", async (req, res) => {
  try {
    await CodingQuestion.deleteMany({});
    const inserted = await CodingQuestion.insertMany(codingQuestionsData);
    res.json({
      message: `Seeded ${inserted.length} coding questions ✅`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================
   START SERVER
   ========================================== */
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "mydatabase",
      serverSelectionTimeoutMS: 30000,
    });

    console.log("MongoDB Connected ✅");
    console.log("Mongo Ready State:", mongoose.connection.readyState);
    console.log("Connected Host:",    mongoose.connection.host);
    console.log("Connected DB:",      mongoose.connection.name);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
      console.log("Allowed origins:", allowedOrigins);
    });
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

startServer();