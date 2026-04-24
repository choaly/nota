const express = require('express');
const Groq = require('groq-sdk');

const explainRouter = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generate explain-back questions from note content
explainRouter.post('/generate', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const prompt = `Based on the following notes, generate 3 explain-back questions. These are open-ended questions that ask the user to explain a concept in their own words — not multiple choice. Focus on "why" and "how" questions that test deep understanding, not surface-level recall.

Return ONLY valid JSON in this exact format, no other text:
[
  {
    "question": "Explain in your own words why...",
    "keyConcepts": ["concept1", "concept2", "concept3"],
    "sampleAnswer": "A strong answer would mention..."
  }
]

- "question": An open-ended question requiring explanation (not yes/no)
- "keyConcepts": 2-4 key ideas a good answer should touch on
- "sampleAnswer": A brief reference answer for comparison (1-2 sentences)

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

// Evaluate a user's explanation against a question
explainRouter.post('/evaluate', async (req, res) => {
    try {
        const { question, userAnswer, keyConcepts, sampleAnswer } = req.body;

        if (!question || !userAnswer) {
            return res.status(400).json({ message: 'Question and answer are required' });
        }

        const prompt = `You are a supportive but honest tutor evaluating a student's explanation. The student was asked to explain a concept in their own words.

Question: "${question}"

Key concepts a good answer should cover: ${keyConcepts.join(', ')}

Reference answer: "${sampleAnswer}"

Student's answer: "${userAnswer}"

Evaluate their explanation and return ONLY valid JSON in this exact format, no other text:
{
  "rating": "strong" or "partial" or "weak",
  "conceptsCovered": ["list of key concepts they addressed correctly"],
  "conceptsMissed": ["list of key concepts they missed or got wrong"],
  "feedback": "2-3 sentences of specific, encouraging feedback. Acknowledge what they got right first, then point out what's missing or incorrect. Be specific — don't just say 'good job' or 'needs work'."
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
        });

        const text = chatCompletion.choices[0].message.content;
        const evaluation = JSON.parse(text);

        res.json({ evaluation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = explainRouter;
