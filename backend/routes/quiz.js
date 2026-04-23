const express = require('express');
const Groq = require('groq-sdk');

const quizRouter = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

quizRouter.post('/', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const prompt = `Based on the following notes, generate 5 multiple choice quiz questions to test understanding. Each question should have 4 answer options with the full text of each option. Return ONLY valid JSON in this exact format, no other text:
[
  {
    "question": "...?",
    "options": ["Full text of option A", "Full text of option B", "Full text of option C", "Full text of option D"],
    "answer": "Full text of the correct option"
  }
]

Notes:
${content}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
        });

        const text = chatCompletion.choices[0].message.content;
        const questions = JSON.parse(text);

        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = quizRouter;
