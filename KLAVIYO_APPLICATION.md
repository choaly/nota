# Klaviyo AI Builder Residency Application

---

## Project Title

**Nota — AI-Powered Note-Taking App with Instant Quiz Generation**

---

## Problem Statement

**What problem are you solving or what opportunity are you addressing? Who is most affected by this problem?**

Students and self-learners take notes constantly, but most note-taking apps treat notes as static text — write it down, maybe read it later, hope it sticks. The problem is that passive note-taking creates a false sense of understanding. You highlight, you summarize, you feel productive — but when it's time to recall that information, it's gone. Research on active recall and spaced repetition consistently shows that testing yourself is one of the most effective ways to learn, yet most people don't do it because creating good quiz questions from your own material is tedious and time-consuming.

This problem hits hardest for students studying dense material (biology, history, computer science), professionals learning new domains, and self-taught learners who don't have an instructor to quiz them.

**Why is it important, and what would be different if it were solved?**

If your notes could instantly transform into personalized quizzes, you'd close the gap between "I wrote this down" and "I actually know this." Learning would become active by default, not by extra effort. Students would retain more, study more efficiently, and actually enjoy the review process instead of dreading it.

**What would success look like, and how would you know if it worked?**

Success means users come back to Nota not just to write notes, but to test themselves — and more importantly, to *explain* what they've learned. Measurable signals would include: users engaging with explain-back mode repeatedly (indicating they're building real understanding, not just recognizing answers), improvement in ratings from "weak" to "strong" on the same material over time, and users choosing Nota over competitors because it pushes them beyond surface-level recall. At a product level, success is a user saying: "I didn't just take notes — I actually learned from them."

---

## Solution Overview

**Describe your solution at a high level: what it does, how it works, and key features.**

Nota is a full-stack web application where users can create, edit, organize, and search their notes — and with one click, generate a personalized 5-question multiple-choice quiz from any note's content. The app is built with a React frontend (deployed on Vercel), an Express.js backend (deployed on Render), and MongoDB Atlas for cloud storage.

Key features:
- **Secure user accounts** with JWT authentication, password hashing (bcrypt), and per-user data isolation
- **Full CRUD note management** with search, grid dashboard, and collapsible sidebar
- **AI-powered quiz generation** — a single button press sends note content to a Llama 3.3 70B model (via Groq API), which returns 5 multiple-choice questions with instant scoring and feedback
- **Profile management** — edit display name, change password, delete account with cascading data cleanup
- **Production deployment** — live at [nota-indol.vercel.app](https://nota-indol.vercel.app) with CORS-restricted API, environment-specific configuration, and auto-logout on token expiration

**What role does AI play in your solution? Is it core to the functionality, or supplementary?**

AI is core to what differentiates Nota from any other note-taking app. Without the quiz generation, Nota is a competent but unremarkable notes app. The AI transforms it into an active learning tool — it's the feature that turns passive notes into an interactive study experience.

**How does the AI component make the solution meaningfully better than a non-AI approach?**

Without AI, users would have to write their own quiz questions — which nobody does. Manually creating good multiple-choice questions with plausible distractors requires deep understanding of the material *and* the patience to formalize it into a quiz format. The LLM handles both instantly: it reads the note content, identifies key concepts, generates questions that test understanding (not just surface-level recall), and produces realistic wrong answers. What would take 20-30 minutes of manual work happens in under 3 seconds.

---

## AI Integration

**What LLMs, models, APIs, or agentic patterns did you use, and why did you choose them?**

I use **Llama 3.3 70B Versatile** through the **Groq API**. The model selection was driven by a real constraint: I initially tried Google Gemini's free tier, but hit a `limit: 0` quota bug that blocked new projects entirely. I pivoted to Groq because it offers free inference on open-source models with no billing setup required, fast response times (Groq's custom LPU hardware is optimized for inference speed), and an OpenAI-compatible API format that makes it straightforward to swap providers later if needed.

I chose Llama 3.3 70B specifically because it's the latest open-source model from Meta with competitive quality against proprietary models — it reliably generates well-structured JSON, creates meaningful questions (not just "what is X?"), and produces plausible distractor options.

**Did you use RAG, tool use, multi-step reasoning, or chaining?**

The current implementation uses a single, carefully engineered prompt — no RAG, tool use, or chaining. The note content is passed directly as context (no retrieval needed since the user's note is the entire knowledge base for that quiz). This is intentional: the problem is well-scoped enough that a single prompt produces high-quality results without the complexity and latency of multi-step patterns.

That said, I've designed the architecture to support more advanced patterns as the product evolves. RAG would become valuable when generating quizzes across multiple related notes (e.g., "quiz me on everything I've written about databases"). Multi-step reasoning would enable adaptive difficulty — generating easier questions first, then harder ones based on what the user gets wrong.

**What tradeoffs did you consider around cost, latency, reliability, or accuracy?**

- **Cost vs. quality**: Groq's free tier with Llama 3.3 70B hits a sweet spot — zero cost with output quality that's more than sufficient for quiz generation. A proprietary model like GPT-4 might produce marginally better questions, but the cost-per-call would require rate limiting or a paid tier.
- **Latency**: Groq's inference speed (sub-3-second responses) keeps the UX snappy. Users click "Generate Quiz" and questions appear almost immediately — no loading spinners that kill engagement.
- **Reliability**: I use `temperature: 0.5` to balance creativity with consistency. Too low and questions become repetitive; too high and the JSON structure occasionally breaks. I also enforce strict JSON-only output in the prompt to prevent the LLM from adding conversational text around the response.
- **Accuracy**: The biggest risk is the LLM generating factually incorrect questions or marking wrong answers as correct. For educational content, this is a meaningful concern — I mitigate it by using a large model (70B parameters) and keeping the prompt focused, but this remains an area for improvement (see Future Improvements).

**Where did the AI integration exceed your expectations, and where did it fall short?**

**Exceeded expectations**: The quality of generated questions genuinely surprised me. The model doesn't just pull sentences from the notes and turn them into fill-in-the-blank — it synthesizes concepts, asks "why" and "how" questions, and generates distractor options that are plausible but distinctly wrong. For a zero-cost integration, the output quality is remarkable.

**Fell short**: Prompt engineering was more finicky than expected. My initial prompt included an example with options formatted as `["A", "B", "C", "D"]`, and the LLM mimicked that format literally — returning letter-only options instead of descriptive text. The fix was simple (changing the example to show full-text options), but it taught me that LLMs follow examples more closely than instructions. I also can't fully guarantee factual accuracy in generated questions, which is a gap I'd address with validation layers in a production-grade version.

---

## Architecture / Design Decisions

**Explain your design choices: backend/frontend structure, data flow, use of APIs, or other AI features. Note any tradeoffs or assumptions you made.**

### System Architecture

```
┌──────────────────────────────┐
│   React Frontend (Vercel)    │
│   - Vite build tooling       │
│   - CSS Modules for styling  │
│   - AuthContext (React)      │
│   - JWT stored in localStorage│
└──────────┬───────────────────┘
           │ REST API (CORS-restricted)
           │ Authorization: Bearer <token>
┌──────────▼───────────────────┐
│  Express.js Backend (Render) │
│  - JWT auth middleware       │
│  - Input sanitization (XSS)  │
│  - User-scoped data queries  │
│  ┌─────────┐  ┌───────────┐ │
│  │ Auth    │  │ Notes     │ │
│  │ Routes  │  │ Routes    │ │
│  └─────────┘  └───────────┘ │
│  ┌─────────────────────────┐ │
│  │ Quiz Route → Groq API  │ │
│  │ (Llama 3.3 70B)        │ │
│  └─────────────────────────┘ │
└──────────┬───────────────────┘
           │ Mongoose ODM
┌──────────▼───────────────────┐
│   MongoDB Atlas (Cloud DB)   │
│   - Users collection         │
│   - Notes collection (user-scoped) │
└──────────────────────────────┘
```

### Key Design Decisions

**1. Stateless JWT Authentication over Server-Side Sessions**
JWT tokens let the frontend and backend operate as completely independent services — no shared session store needed. This made deployment straightforward (separate Vercel and Render services) and means the backend scales horizontally without session synchronization. The tradeoff is that token revocation requires waiting for expiration (7 days), since there's no server-side session to invalidate.

**2. AI on the Backend, Never the Frontend**
All Groq API calls go through the Express backend. The API key never touches the browser. This isn't just a security best practice — it also means I can swap LLM providers, adjust prompts, or add rate limiting without deploying a new frontend build.

**3. Monorepo with Split Deployment**
Frontend (`/src`) and backend (`/backend`) live in one repo but deploy to different platforms optimized for each: Vercel's CDN for the React SPA, Render's Node.js runtime for the API server. This keeps development simple (one repo, one git history) while letting each service scale independently.

**4. User-Scoped Data Isolation**
Every database query filters by `req.userId` (extracted from the JWT by auth middleware). A user can never access another user's notes, even with a valid token — the data isolation happens at the query level, not just the route level. Delete account cascades to remove all associated notes via `Note.deleteMany({ user: req.userId })`.

**5. HTML Sanitization for XSS Prevention**
Note content is stripped of HTML tags on the backend before storage using regex-based sanitization. This prevents stored XSS attacks but has a tradeoff: users can't save formatted/rich text. For a future version, I'd switch to a library like DOMPurify to allow safe HTML while blocking malicious tags.

**6. CORS Whitelist in Production**
The backend only accepts requests from `localhost:5173` (development) and the Vercel production URL. This prevents unauthorized domains from calling the API — a critical security measure that's easy to overlook when moving from development to production.

---

## What did AI help you do faster, and where did it get in your way?

**Describe how you used AI coding tools to accelerate your development process.**

I built Nota using **Claude Code** as my primary development partner — not as a code generator, but as a tutor. My approach was deliberate: I came in knowing HTML, CSS, JavaScript, and basic React, and I wanted to deepen my skills by building something real. So I used Claude Code to provide development roadmaps, explain new concepts, and give hints — but I wrote the code myself.

**What did it help you move through quickly?**

- **Learning new concepts**: Claude Code taught me JWT authentication, bcrypt password hashing, Mongoose schemas, and Express middleware patterns by explaining them in the context of what I was actually building, not abstract tutorials. When I was implementing the auth middleware, I could ask "why does this need to be a function that returns a function?" and get an answer tied to my specific code.
- **Architecture and planning**: Claude Code helped me structure the entire project across phases — from localStorage-only prototype to full-stack deployed app with AI features. The phase-by-phase roadmaps (which I saved as markdown files in the repo) gave me a clear learning path and prevented scope creep.
- **Debugging faster**: When the quiz feature initially returned letter-only options ("A", "B", "C", "D") instead of descriptive text, Claude Code helped me trace the issue to the prompt's example format. It also helped diagnose CORS configuration issues during deployment and a stale-state bug where profile settings persisted across login/signup transitions.
- **Understanding tradeoffs**: When choosing between JWT vs. sessions, localStorage vs. cookies, or Gemini vs. Groq, Claude Code laid out the pros and cons in a way that helped me make informed decisions rather than just following a tutorial blindly.

**Where did you hit limitations or have to work around them?**

- The biggest limitation was that Claude Code sometimes provided answers that were too comprehensive when I wanted to figure things out myself. I had to be intentional about asking for hints rather than solutions — framing questions as "what should I think about?" instead of "what should I write?"
- Occasionally when debugging UI issues (CSS specificity conflicts, modal z-index stacking), it was faster to just inspect the browser DevTools myself than to describe the visual problem in text.

**How did using these tools change your approach to the build?**

Claude Code fundamentally shifted my development process from "follow a tutorial step-by-step" to "build what I want and learn as I go." I spent more time thinking about architecture and user experience, and less time stuck on syntax or searching Stack Overflow. It made ambitious features feel accessible — I wouldn't have attempted AI integration as a relative newcomer to full-stack development without the confidence that I had a knowledgeable partner to guide me through unfamiliar APIs and patterns.

---

## Demo

**Explain how to use your application or run demos.**

### Live Application
Nota is deployed and accessible at: **[nota-indol.vercel.app](https://nota-indol.vercel.app)**

> Note: The backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first request after a cold start may take 30-50 seconds. Subsequent requests are fast.

### How to Use Nota

**1. Create an Account**
- Visit the app and click "Sign Up"
- Enter your email and a password (6+ characters)
- You'll be logged in automatically and taken to the Dashboard

**2. Create and Manage Notes**
- Click "New Note" in the sidebar to create a note
- Enter a title and content, then click "Save"
- Your notes appear in the Dashboard grid and the sidebar list
- Click any note to view/edit it; use the search bar to filter by title or content

**3. Generate a Quiz**
- Open any note with content
- Click the "Generate Quiz" button
- The AI generates 5 multiple-choice questions based on your note content
- Answer each question — you'll get instant feedback (correct/incorrect) with a 1-second delay before the next question
- At the end, you'll see your score out of 5

**4. Manage Your Profile**
- Click your name in the top-right header to open the dropdown menu
- Select "Profile Settings" to edit your display name, change your password, or delete your account

### Running Locally

```bash
# Clone the repo
git clone https://github.com/alyssacho/nota.git

# Start the backend
cd nota/backend
npm install
# Create .env with: CONNECTION_STRING, JWT_SECRET, GROQ_API_KEY, PORT=5001
node server.js

# Start the frontend (in a separate terminal)
cd nota
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## Testing / Error Handling

**Explain how you tested your project and any error handling you implemented.**

### Testing Approach

Testing was done manually and iteratively at each development phase. After implementing each feature (auth, notes CRUD, quiz generation, deployment), I tested the full user flow end-to-end before moving on. Specific testing scenarios included:

- **Authentication edge cases**: Signing up with an already-registered email (returns error, doesn't crash). Logging in with wrong password (generic "Invalid credentials" message — intentionally vague to prevent email enumeration). Accessing protected routes without a token (returns 401). Using an expired or malformed JWT (returns 401 and triggers auto-logout).
- **Data isolation**: After deploying with multiple test accounts, I verified that User A cannot see User B's notes — every query filters by `req.userId` at the database level, not just the route level.
- **Quiz generation failures**: Tested quiz generation with very short notes (single sentence), very long notes, and notes with special characters. The LLM handles these gracefully, though very short notes produce lower-quality questions.
- **CORS in production**: Verified that API requests from unauthorized origins are rejected. Tested that the Vercel frontend and localhost development server are both whitelisted correctly.
- **Deployment-specific issues**: Tested the Render cold-start experience (first request after spin-down), confirmed environment variables are correctly set across platforms, and verified MongoDB Atlas network access allows Render's dynamic IPs.

### Error Handling Implementation

**Frontend**:
- Centralized `handleResponse()` function in each service file that intercepts all API responses
- **Auto-logout on 401**: If any API call returns 401 (expired/invalid token), the app clears localStorage and reloads — preventing cryptic errors when sessions expire
- Loading states on all async operations prevent double-submissions (e.g., the "Generate Quiz" button is disabled while the AI processes)
- `try-finally` blocks ensure UI state is cleaned up even when requests fail

**Backend**:
- `try-catch` blocks around all async route handlers with appropriate HTTP status codes (400, 401, 403, 404, 500)
- **Anti-enumeration on login**: Both "user not found" and "wrong password" return the same generic "Invalid credentials" message, preventing attackers from discovering valid email addresses
- Mongoose schema validation enforces constraints (required fields, min/max length, unique email) and returns descriptive errors
- Input sanitization strips HTML tags from note titles and content before storage, preventing stored XSS attacks
- JWT middleware validates token structure and signature before any protected route executes

### Failure Modes I Considered

| Failure Mode | How It's Handled |
|---|---|
| Expired JWT token | Auto-logout: clear localStorage, reload to login screen |
| Groq API down or rate-limited | 500 error returned to frontend with message; user can retry |
| Malformed JSON from LLM | `JSON.parse()` wrapped in try-catch; returns 500 if parsing fails |
| Duplicate email on signup | Mongoose unique index throws error; backend returns 400 with message |
| Missing required fields | Mongoose validation rejects the save; backend returns descriptive error |
| XSS in note content | HTML tags stripped via regex sanitization before database storage |

---

## Future Improvements / Stretch Goals

**If you had more time, what features or improvements would you build next?**

### Near-Term (Next 1-2 Months)

- **Mobile app with React Native and Expo**: I've already planned this out in detail (Phase 4 roadmap is written). The backend API is fully ready — the mobile app would share the same database and endpoints, letting users access their notes and quizzes from any device. React Navigation for screen transitions, AsyncStorage for token persistence, and native UI patterns (pull-to-refresh, FlatList) would make it feel truly mobile-native.

- **Quiz history and spaced repetition**: Save quiz results and track which questions users get wrong repeatedly. Use spaced repetition algorithms (like SM-2) to resurface weak topics at optimal intervals. This turns Nota from a one-time quiz tool into a genuine learning system.

- **Rich text editor**: Replace the plain textarea with a proper rich text editor (like TipTap or Slate) so users can format notes with headings, bold, lists, and code blocks — while still safely sanitizing content using DOMPurify instead of regex stripping.

### Medium-Term (3-6 Months)

- **RAG across multiple notes**: Let users generate quizzes that span their entire note collection on a topic. This would use vector embeddings to retrieve relevant notes and feed them as context to the LLM — a genuine RAG pipeline. Imagine writing notes across 10 lectures and generating a comprehensive study guide from all of them.

- **Adaptive quiz difficulty**: Use multi-step reasoning to generate easier questions first, then harder conceptual questions based on the user's performance. The LLM would receive the user's previous answers as context and adjust accordingly.

- **AI-generated summaries and flashcards**: Expand beyond quizzes — auto-generate concise summaries, flashcard decks, and key concept maps from notes. Different study formats work for different learners.

- **Collaborative features**: Shared notebooks where study groups can contribute notes and quiz each other. Real-time collaboration using WebSockets.

### Long-Term Vision

- **LLM-powered study assistant**: A conversational interface within Nota where users can ask questions about their own notes — "Explain the difference between authentication and authorization based on what I wrote in my backend notes." This would combine RAG retrieval with conversational AI to create a personalized tutor grounded in the user's own material.

- **Learning analytics dashboard**: Visualize study patterns, quiz performance over time, and knowledge gaps. Help users see not just what they've written, but what they've actually learned.

The thread connecting all of these improvements is the same core belief: notes should be the beginning of learning, not the end of it. Every feature I'd build next pushes Nota further toward turning passive content into active knowledge.
