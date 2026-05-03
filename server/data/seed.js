import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Question from "../models/Question.js";

await mongoose.connect("mongodb://127.0.0.1:27017/placement-ai");

const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, "questions.json"), "utf-8")
);

await Question.deleteMany({});
await Question.insertMany(questions);

console.log(`✅ ${questions.length} questions inserted successfully`);
mongoose.disconnect();