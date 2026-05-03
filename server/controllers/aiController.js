import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const getFeedback = async (req, res) => {
  try {
    const { answer } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Evaluate this answer:

${answer}

Give:
- Score out of 10
- Strengths
- Weaknesses
- Improved answer`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const feedback = chatCompletion.choices[0]?.message?.content;

    res.json({ feedback });

  } catch (error) {
    console.error("Groq Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};