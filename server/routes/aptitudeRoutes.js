import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/questions", async (req, res) => {
  try {
    const { topic } = req.query;

    console.log("Received topic:", topic);

    const matchStage = topic && topic !== "all"
      ? { topic: topic.trim() }
      : {};

    console.log("Match stage:", matchStage);

    const questions = await Question.aggregate([
      { $match: matchStage }
    ]);

    console.log("Questions found:", questions.length);

    res.json(questions);
  } catch (err) {
    console.log("Route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;