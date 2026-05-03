import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  topic: String,
  difficulty: String,
  explanation: String
});

export default mongoose.model("Question", questionSchema);