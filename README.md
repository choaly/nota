# Klaviyo AI Builder Residency Application

## Video Walkthrough

---

## Project Title

**Nota** - AI-Powered Note-Taking App with Explain-Back Quizzing

---

## Problem Statement
Nota solves the problem of passive note-taking. Students studying dense subjects like computer science or history, professionals learning new domains, and independent learners all take notes constantly, but most note-taking apps are optimized for storage and organization rather than learning specifically. Consequently these apps encourage passive note-taking, which feels productive but is far less effective than active recall. The challenge is that turning notes into quality study materials is tedious and time-consuming, making active recall difficult to adopt consistently.
Nota solves this problem by instantly transforming your notes into personalized quizzes and study materials so that learning becomes active by default and note-takers retain more knowledge.
Success means users come back to Nota not just to write notes, but to test themselves using Nota’s quiz generation and explain-back features. Measurable signals would include: users engaging with Explain-Back mode repeatedly, improvements in ratings from “weak” to “strong on the same material over time, and users choosing Nota over other competitors because it pushes them beyond surface-level recall.

---

## Solution Overview
Nota is a full-stack web application where users can create, edit, organize, and search their notes, and test their understanding through two different AI-powered study modes. The app is built with a React frontend (deployed on Vercel), an Express.js backend (deployed on Render), and MongoDB Atlas for cloud storage.

**Key features:**
- **Secure user accounts** — JWT authentication and password hashing (bcrypt)
- **Note creation and management**
- **Multiple-choice quizzes** — Generates 5 MCQ question from note content via Llama 3.3 (Groq API)
- **Explain-Back mode** — Users are asked open-ended questions and must explain concepts in their own words. The LLM evaluates their explanation for accuracy, identifies which key concepts they covered vs. missed, and gives specific, constructive feedback
- **Profile management** — edit display name, change password, delete account
- **Live at** [nota-indol.vercel.app](https://nota-indol.vercel.app)

---

## AI Integration
For development, I collaborated with Anthropic’s Claude Opus 4.6 model. For Nota’s AI in-app AI features (Quiz and Explain-Back mode), I chose Meta’s Llama 3.3 70B Versatile via Groq. I initially tried to use the Google Gemini API, but a bug in the free tier made it unreliable. Groq offered the best combination of zero cost, low latency, and having an OpenAI-compatible API for easy provider swapping in the future.

I used chaining for Explain-Back mode, which uses a two-step LLM call.
1. **Generate:**  First, the LLM reads the user’s note content and generates open-ended questions, key concepts each answer should cover, and a reference answer.
2. **Evaluate:** After the user submits their explanation, a second LLM call evaluates their response against the key concepts and returns a rating (strong/partial/weak), identifies gaps, and provides targeted feedback.

I used temperature 0.5 for generation, and 0.3 for evaluation, to prioritize consistency over creativity in grading. I did not use RAG because each note already contains the full context, but the architecture supports it for future cross-note quizzing.

The main tradeoff considerations were cost, latency, and evaluation accuracy. Groq’s free tier and fast inference made it ideal for an early-stage product. Other API contenders were OpenAI, Claude, and Google Gemini, but those either required rate limiting, a paid tier, or had a buggy free tier. When it comes to accuracy, Llama 3.3 can sometimes be overly generous when grading. I mitigated this through prompt design and lower evaluation temperature, but this is still an area for future tuning.

The AI exceeded my expectations in the quality of Explain-Back feedback--it can accurately pinpoint missing concepts and provide highly specific guidance. Its biggest limitation was prompt sensitivity--early on, the model followed examples more closely than instructions. My initial MCQ prompt had `["A", "B", "C", "D"]` as example options, and the model mimicked that literally. Changing the example to full-text options fixed it, which was a useful lesson in prompt engineering.

---

## Architecture / Design Decisions

```
┌──────────────────────────────┐
│   React Frontend (Vercel)    │
│   Vite  |  CSS Modules       │
│   AuthContext  |  localStorage│
└──────────┬───────────────────┘
           │ REST API (CORS-restricted)
           │ Authorization: Bearer <token>
┌──────────▼───────────────────┐
│  Express.js Backend (Render) │
│  JWT middleware | XSS sanit. │
│  Auth | Notes | Quiz | Explain│
│         ↕ Groq API           │
│      (Llama 3.3 70B)        │
└──────────┬───────────────────┘
           │ Mongoose ODM
┌──────────▼───────────────────┐
│      MongoDB Atlas           │
│  Users | Notes (user-scoped) │
└──────────────────────────────┘
```

**Key design choices:**

1. **Monorepo, split deployment** - One repo, one git history; each service deploys to a platform optimized for it (Vercel for Single Page Applications, Render for Node.js).
2. **AI on backend only** - API key never touches the browser. I can swap providers or adjust prompts without a frontend redeploy.

---

## What did AI help you do faster, and where did it get in your way?
I built Nota with assistance from Claude Code. Before starting, I was already comfortable with HTML, CSS, JavaScript, and React, but had less experience with backend development. I wanted to deepen my skills by building something real, so I used Claude Code for architecture roadmaps, concept explanations, and debugging hints, while writing the code myself.

**What it accelerated:**
- **Learning new concepts** — JWT, bcrypt, Mongoose, Express middleware — explained in the context of what I was building, not abstract tutorials
- **Architecture planning** — Structured the project across phases (localStorage prototype → full-stack → AI features → deployment). I used Claude to generate phase-by-phase development roadmaps, which I then saved as markdown files to reload as context whenever a Claude conversation limit was hit.
- **Debugging**
- **Decision-making** — JWT vs. sessions, localStorage vs. cookies, Gemini vs. Groq — laid out tradeoffs so I could make informed choices quickly
**Where it fell short:**
- Sometimes too comprehensive when I wanted to figure things out myself. I had to frame questions as "what should I think about?" instead of "what should I write?"
**How it changed my approach:** Shifted from "follow a tutorial step-by-step" to "build what I want and learn as I go." I spent more time on architecture and UX, less time stuck on syntax. Rather than using AI to replace learning, I used it to compress the feedback loop. I still had to understand every line of code I wrote, but my learning and building process accelerated from taking weeks to hours.

---

## Getting Started / Setup Instructions

```bash
# Clone the repo
git clone https://github.com/alyssacho/nota.git
cd nota

# Install and start the backend
cd backend
npm install
cp .env.example .env
# Edit .env with your keys:
#   CONNECTION_STRING=<your MongoDB Atlas connection string>
#   JWT_SECRET=<any secret string for signing tokens>
#   GROQ_API_KEY=<your Groq API key from https://console.groq.com>
#   PORT=5001
node server.js

# In a separate terminal, install and start the frontend
cd nota
npm install
npm run dev
# App runs at http://localhost:5173
```


## Demo

**Live app:** [nota-indol.vercel.app](https://nota-indol.vercel.app)

> Backend is on Render's free tier — first request after 15 min of inactivity takes ~30-50 seconds (cold start). Subsequent requests are fast.

**Walkthrough:**
1. **Sign up** with email + password (6+ chars) — auto-logged in to Dashboard
2. **Create a note** — click "New Note" in sidebar, add title + content, click Save
3. **Generate Quiz** — open a note, click "Generate Quiz" for 5 MCQ questions with instant scoring
4. **Explain Back** — open a note, click "Explain Back" to answer open-ended questions in your own words and receive AI-evaluated feedback on your understanding
5. **Profile** — click your name in the header for settings (edit name, change password, delete account)

---

## Testing / Error Handling

Testing was manual and iterative -- full end-to-end user flow tested after each feature (CRUD, quiz, explain-back, auth, deployment).

**Edge cases tested:**
- Duplicate email signup (returns error), wrong password login (generic "Invalid credentials" to prevent email enumeration), expired/malformed JWT (triggers auto-logout)
- Data isolation across multiple test accounts — queries filter by `req.userId` at the DB level
- Quiz/Explain-Back with very short notes, very long notes, special characters
- CORS rejection from unauthorized origins; Render cold starts; env var configuration across platforms

**Error handling:**

| Layer | Approach |
|---|---|
| Frontend | Centralized `handleResponse()` per service; auto-logout on 401; loading states prevent double-submission; `try-finally` for state cleanup |
| Backend | `try-catch` on all async handlers; anti-enumeration on login; Mongoose schema validation; HTML tag stripping for XSS; JWT validation before protected routes |
| LLM | `JSON.parse()` in try-catch — returns 500 on malformed responses; Groq downtime surfaces as retryable error |

---

## Future Improvements / Stretch Goals

- **Rich text editor** — Replace textarea with TipTap or Slate; use DOMPurify instead of regex sanitization.
- **Mobile app (React Native + Expo)** — Phase 4 roadmap already written. Backend API is ready; mobile app shares the same DB and endpoints.
- **Spaced repetition** — Save quiz/explain-back results, track weak concepts, resurface them at optimal intervals (SM-2 algorithm). Turns Nota from a one-time tool into a learning system.
- **RAG across notes** — Vector embeddings to retrieve related notes and generate cross-topic quizzes. "Quiz me on everything I've written about databases."
- **Adaptive difficulty** — Multi-step reasoning where the LLM adjusts question difficulty based on prior answers.
- **Conversational study assistant** — Ask questions about your own notes ("Explain the difference between auth and authorization based on my backend notes"). RAG + conversational AI = a personalized tutor grounded in your material.

--

## Link to website URL or application
[nota-indol.vercel.app](https://nota-indol.vercel.app)