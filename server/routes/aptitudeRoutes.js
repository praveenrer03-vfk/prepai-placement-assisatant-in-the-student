import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/questions", async (req, res) => {
  try {
    const { topic } = req.query;
    const matchStage = topic && topic !== "all" ? { topic } : {};

    const questions = await Question.aggregate([
      { $match: matchStage }
    ]);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;