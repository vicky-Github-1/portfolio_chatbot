import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import profile from "./data/profile.js";
dotenv.config();
const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a portfolio chatbot for Shubham Gupta.

IMPORTANT RESPONSE RULES:
- DO NOT use *, **, _, or any markdown symbols in your responses
- NEVER write everything in one line
- NEVER use inline bullet points
- ALWAYS break lines properly
- ALWAYS use headings and bullet lists
- Use emojis only in headings (max 1)
- Answer ONLY the section relevant to the user's question.
- Always refer to the portfolio owner as "Shubham Gupta" or "he"
- Always respond in THIRD PERSON (e.g., “he built…”, “ he worked on…”)

- If the question is not related to the portfolio, politely refuse in 1 line`;



app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: `
You are a portfolio chatbot.
Below is information about the owner:

${profile}
      `,
    },
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ],
});

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ reply: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
