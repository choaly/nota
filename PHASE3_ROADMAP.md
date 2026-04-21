# Phase 3: Advanced Features - Complete Roadmap

## High-Level Overview

We're adding three major features to the nota app: **user authentication**, **AI-powered study tools**, and **deployment** to make it live on the internet.

### Architectural Shift:
- **Before**: Anyone can see all notes. App runs only on localhost.
- **After**: Users have accounts. Each user sees only their notes. AI generates quizzes from note content. App is live on the internet.

---

## The Full Map

### **Part 1: Authentication** (Steps 1-6)
**What we're building**: User accounts with secure login

- **Step 1**: Create User model (Mongoose schema for users)
- **Step 2**: Password hashing with bcrypt (never store plain text passwords)
- **Step 3**: Build signup & login API routes
- **Step 4**: JWT authentication (tokens that prove "I'm logged in")
- **Step 5**: Protect routes with auth middleware (only logged-in users can access notes)
- **Step 6**: Connect notes to users (each note belongs to a user)

**Time estimate**: 3-5 hours
**Key concepts**: Password hashing, JWT tokens, middleware, authorization vs authentication

---

### **Part 2: Frontend Auth Flow** (Steps 7-9)
**What we're building**: Login/signup pages and token management in React

- **Step 7**: Build Login and Signup pages
- **Step 8**: Store JWT token and manage auth state (React Context)
- **Step 9**: Protect frontend routes and attach token to API calls

**Time estimate**: 3-5 hours
**Key concepts**: React Context, protected routes, token storage, conditional rendering

---

### **Part 3: AI Features** (Steps 10-12)
**What we're building**: AI-powered quiz generation from notes

- **Step 10**: Set up AI API integration (Claude API on the backend)
- **Step 11**: Build quiz generation endpoint
- **Step 12**: Build quiz UI component and wire it to the "Generate Quiz" button

**Time estimate**: 4-6 hours
**Key concepts**: Third-party API integration, prompt engineering, streaming responses, new UI components

---

### **Part 4: Deployment** (Steps 13-15)
**What we're building**: Getting the app live on the internet

- **Step 13**: Deploy backend to Render
- **Step 14**: Deploy frontend to Vercel
- **Step 15**: Connect everything (environment variables, production URLs, CORS)

**Time estimate**: 2-4 hours
**Key concepts**: Environment variables, CI/CD, production vs development configuration

---

## Total Timeline
**12-20 hours** spread across multiple sessions

---

## Key Architectural Decisions We'll Make

1. **JWT vs Sessions** — why stateless tokens for a React + API architecture
2. **Where to store tokens** — localStorage vs cookies (tradeoffs)
3. **bcrypt rounds** — how many hashing rounds balance security vs speed
4. **AI on backend, not frontend** — why API keys must never touch the browser
5. **Monorepo deployment** — deploying frontend and backend as separate services

---

## What Could Go Wrong (and Prevention Strategies)

| Risk | Prevention Strategy |
|------|---------------------|
| Storing passwords in plain text | bcrypt hashing before save |
| JWT token stolen | Short expiration, HTTPS in production |
| API key exposed in frontend code | All AI calls go through YOUR backend |
| CORS errors in production | Configure allowed origins per environment |
| Environment variables missing in deploy | Checklist before each deploy |

---

## Project Structure (Updated)

```
/nota/
  /src/                      # React app
    /components/
      Dashboard.jsx
      Sidebar.jsx
      NoteView.jsx
      Login.jsx              # New!
      Signup.jsx             # New!
      QuizView.jsx           # New!
    /context/
      AuthContext.jsx         # New! (manages logged-in state)
    /services/
      notes.js
      auth.js                # New! (login/signup API calls)
      quiz.js                # New! (quiz generation API calls)
    App.jsx
    main.jsx
  /backend/
    /models/
      Note.js
      User.js                # New!
    /routes/
      notes.js
      auth.js                # New!
      quiz.js                # New!
    /middleware/
      auth.js                # New! (JWT verification middleware)
    /config/
      db.js
    server.js
    package.json
  package.json
  vite.config.js
  PHASE2_ROADMAP.md
  PHASE3_ROADMAP.md          # This file
```

---

## REST API Endpoints We'll Add

### Auth Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login and receive JWT token |

### Quiz Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/quiz/generate` | Generate quiz from note content |

### Updated Notes Endpoints (now protected)
| Method | Endpoint | Change |
|--------|----------|--------|
| All | `/api/notes/*` | Requires JWT token; returns only that user's notes |

---

## Technologies & Why

### New in Phase 3:
- **bcrypt**: Industry-standard password hashing (one-way, salted, slow by design)
- **jsonwebtoken (JWT)**: Stateless auth tokens (no server-side session storage needed)
- **React Context**: Global state management without prop drilling (for auth state)
- **Claude API**: AI text generation for quiz creation
- **Render**: Free Node.js hosting for the backend
- **Vercel**: Free static site hosting optimized for React/Vite

---

## Learning Objectives

By the end of Phase 3, you should be able to:
1. Implement secure user authentication from scratch
2. Explain the difference between authentication and authorization
3. Use JWT tokens for stateless API authentication
4. Integrate third-party APIs securely (keys on backend only)
5. Manage global state in React with Context
6. Deploy a full-stack application to production
7. Configure environment-specific settings (dev vs production)

---

## Checkpoints

- **After Part 1**: Can you explain the full auth flow from signup to authenticated API request?
- **After Part 2**: Can you explain why the token is stored client-side and sent with every request?
- **After Part 3**: Can you explain why AI calls go through YOUR backend instead of directly from the browser?
- **After Part 4**: Can you deploy a new full-stack app independently?

---

---

## Detailed Step-by-Step Progress

### ✅ Step 1: Create User Model (COMPLETED)

**What we did**:
1. Created `backend/models/User.js` with Mongoose schema
2. Fields: `email` (unique, required) and `password` (required)
3. Added `timestamps: true` for automatic `createdAt`/`updatedAt`

**What was created**:
- `backend/models/User.js` - User schema and model

---

### ✅ Step 2: Password Hashing with bcrypt (COMPLETED)

**What we did**:
1. Added a Mongoose `pre('save')` hook that hashes the password before saving
2. Used `bcrypt.genSalt(10)` and `bcrypt.hash()` for secure one-way hashing

**Key learnings**:
- **Never store plain text passwords** — bcrypt hashes are one-way; even if the database is compromised, passwords can't be reversed
- **Salt** — random data added before hashing to prevent rainbow table attacks
- **Pre-save hook** — Mongoose middleware that runs automatically before every `save()` call

---

### ✅ Step 3: Build Signup & Login API Routes (COMPLETED)

**What we did**:
1. Created `backend/routes/auth.js` with Express Router
2. Built `POST /api/auth/signup` — creates user, returns JWT token
3. Built `POST /api/auth/login` — verifies credentials, returns JWT token

**What was created**:
- `backend/routes/auth.js` - Auth API router

---

### ✅ Step 4: JWT Authentication (COMPLETED)

**What we did**:
1. Installed `jsonwebtoken` package
2. Generated JWT tokens on signup and login using `jwt.sign()`
3. Token payload contains `userId`, signed with secret from `.env`

**Key learnings**:
- **JWT structure** — three parts: header, payload, signature (base64-encoded, dot-separated)
- **Stateless auth** — server doesn't store session data; the token itself proves identity
- **Secret key** — used to sign tokens; must be kept secret in `.env`

---

### ✅ Step 5: Protect Routes with Auth Middleware (COMPLETED)

**What we did**:
1. Created `backend/middleware/auth.js` — extracts and verifies JWT from `Authorization: Bearer <token>` header
2. Attaches `req.userId` for downstream route handlers
3. Applied middleware to `/api/notes` routes in `server.js`

**What was created**:
- `backend/middleware/auth.js` - JWT verification middleware

**Key learnings**:
- **Middleware chain** — `app.use('/api/notes', authenticate, notesRouter)` runs auth check before any notes route
- **`req.userId`** — middleware adds data to the request object for later handlers to use
- **401 Unauthorized** — returned when token is missing or invalid

---

### ✅ Step 6: Connect Notes to Users (COMPLETED)

**What we did**:
1. Added `userId` field to Note schema (references User model)
2. Updated notes routes to filter by `req.userId` — each user only sees their own notes
3. Automatically sets `userId` when creating notes

**Key learnings**:
- **Authorization vs Authentication** — authentication = "who are you?", authorization = "what can you access?"
- **Data isolation** — `Note.find({ userId: req.userId })` ensures users only see their own data

---

### ✅ Step 7: Build Login and Signup Pages (COMPLETED)

**What we did**:
1. Created `Login.jsx` and `Signup.jsx` components with forms
2. Created `Login.module.css` and `Signup.module.css` matching design mockups
3. Added toggle between Login and Signup views
4. Top bar with Nota logo and navigation buttons

**What was created**:
- `src/components/Login.jsx` - Login page component
- `src/components/Signup.jsx` - Signup page component
- `src/components/Login.module.css` - Login page styles
- `src/components/Signup.module.css` - Signup page styles

---

### ✅ Step 8: Store JWT Token and Manage Auth State (COMPLETED)

**What we did**:
1. Created `src/context/AuthContext.jsx` with React Context
2. Stores token in `localStorage` and provides `login`, `signup`, `logout` functions
3. Created `src/services/auth.js` — frontend API calls for login/signup

**What was created**:
- `src/context/AuthContext.jsx` - Auth state management with Context
- `src/services/auth.js` - Auth API service layer

**Key learnings**:
- **React Context** — provides global state without prop drilling; any component can access auth state
- **`useContext` hook** — consumes context values in child components
- **Token persistence** — stored in `localStorage` so auth survives page refresh

---

### ✅ Step 9: Protect Frontend Routes and Attach Token to API Calls (COMPLETED)

**What we did**:
1. Updated `App.jsx` to conditionally render Login/Signup or Dashboard based on auth state
2. Updated `src/services/notes.js` to attach `Authorization: Bearer <token>` header to all API calls
3. Added logout button to the app

**Key learnings**:
- **Conditional rendering for auth** — `token ? <Dashboard /> : <Login />` pattern
- **Token in headers** — every API call includes the JWT so the backend knows who's making the request

---

### ✅ Step 10: Set Up AI API Integration (COMPLETED)

**What we did**:
1. Evaluated AI API options (OpenAI, Claude, Gemini, Groq)
2. Initially tried Google Gemini — hit `limit: 0` quota bug (free tier blocked for new projects)
3. Switched to **Groq** (free, fast, no billing required)
4. Installed `groq-sdk`, added `GROQ_API_KEY` to `.env`

**Key learnings**:
- **API keys on backend only** — never expose API keys in frontend code; all AI calls go through your server
- **Groq** — uses open-source LLMs (Llama 3.3 70B); OpenAI-compatible API format; generous free tier
- **Gemini free tier issues** — Google restricted free tier quotas in late 2025; many new projects get `limit: 0`

---

### ✅ Step 11: Build Quiz Generation Endpoint (COMPLETED)

**What we did**:
1. Created `backend/routes/quiz.js` with `POST /` endpoint
2. Uses Groq SDK with `llama-3.3-70b-versatile` model
3. Prompt engineering: instructs LLM to return exactly 5 MCQ questions as JSON
4. Parses JSON response and returns to frontend
5. Protected with `authenticate` middleware in `server.js`

**What was created**:
- `backend/routes/quiz.js` - Quiz generation router

**Key learnings**:
- **Prompt engineering** — explicit format instructions ("Return ONLY valid JSON") prevent extraneous text
- **`JSON.parse()`** — converts the LLM's text response into a JavaScript object
- **Answer format matters** — initially the LLM returned letter answers ("A") instead of full option text; fixed by updating the prompt to specify "answer must be the full text of the correct option"

---

### ✅ Step 12: Build Quiz UI Component (COMPLETED)

**What we did**:
1. Created `src/services/quiz.js` — frontend service to call quiz API
2. Created `src/components/Quiz.jsx` — quiz modal component with state management
3. Created `src/components/Quiz.module.css` — modal overlay styling with correct/incorrect feedback
4. Wired into `NoteView.jsx` — "Generate Quiz" button triggers quiz generation, renders Quiz component

**What was created**:
- `src/services/quiz.js` - Quiz API service layer
- `src/components/Quiz.jsx` - Quiz component
- `src/components/Quiz.module.css` - Quiz modal styles

**Key learnings**:
- **State vs regular variables** — use `useState` when changing the value should re-render; use regular variables for derived/computed values
- **Arrow function in onClick** — `onClick={() => fn(arg)}` creates a function to call later; `onClick={fn(arg)}` calls immediately on render
- **Props vs local state** — props come from the parent (data the component receives); local state is owned by the component itself
- **Parent controls child visibility** — Quiz can't remove itself; the parent (NoteView) controls `quizQuestions` state and conditionally renders `<Quiz />`
- **`<>` fragment** — wraps multiple sibling elements when a component needs to return more than one root element
- **`disabled={showResult}`** — prevents double-clicking during the 1-second answer feedback delay
- **Conditional CSS classes** — template literals with ternaries to apply `.correct` or `.incorrect` styles based on answer state

---

## Phase 3 Parts 1-3 Complete!

**What was built**:
- User authentication (signup, login, JWT tokens, protected routes)
- Frontend auth flow (Login/Signup pages, Context, token management)
- AI-powered quiz generation (Groq API, quiz UI with scoring)

**Architecture**:
```
React (localhost:5173)
  → Login/Signup → services/auth.js → /api/auth (signup/login → JWT token)
  → Dashboard → services/notes.js → /api/notes (CRUD, protected by JWT)
  → NoteView → services/quiz.js → /api/quiz (AI quiz generation, protected by JWT)
    → Quiz component (modal overlay with scoring)
```

---

## Pre-Deployment Improvements

### ✅ Header Dropdown Menu (COMPLETED)

**What we did**:
1. Replaced the direct-logout button with a dropdown menu
2. Removed the profile emoji (👤) and triangle (▼) icons
3. Added Lucide `User` and `ChevronDown` icons with dark brown button styling
4. Header now shows the user's display name (capitalized first name from email as fallback)
5. Dropdown has two options: "Profile Settings" and "Log Out"
6. Added click-outside handler to close the dropdown

**Files modified**:
- `src/components/Header.jsx` — rewrote with dropdown state, Lucide icons, `onNavigate` prop, click-outside handler via `useRef` + `useEffect`
- `src/components/Header.module.css` — added `.dropdownWrapper`, `.dropdown`, `.dropdownItem` styles; updated `.button` to dark brown with white text

**Key concepts**:
- **Click-outside pattern** — `useRef` on a container + `useEffect` with `mousedown` event listener to detect clicks outside the dropdown
- **Prop-based navigation** — `onNavigate` callback from `App.jsx` allows the Header to trigger view changes without owning the state

---

### ✅ Profile Settings Page (COMPLETED)

**What we did**:
1. Created a full Profile Settings page with three tabs: Account, Security, Preferences
2. **Account tab** — editable email and display name fields with save functionality
3. **Security tab** — change password form (current password, new password, confirm new password)
4. **Preferences tab** — placeholder for future features
5. Bottom bar with Log Out, Delete Account, and Save Changes buttons
6. Delete Account opens a confirmation modal requiring password entry
7. Added `displayName` field to User model
8. Added three new backend routes: `PUT /profile`, `PUT /password`, `DELETE /account`

**Files created**:
- `src/components/ProfileSettings.jsx` — Profile Settings page with tabbed layout, forms, and delete confirmation modal
- `src/components/ProfileSettings.module.css` — styles matching app design (settings card, tab navigation, bottom bar, modal overlay)

**Files modified**:
- `backend/models/User.js` — added `displayName` field (String, trimmed, default empty)
- `backend/routes/auth.js` — added `PUT /profile` (update email/display name), `PUT /password` (change password), `DELETE /account` (delete user and all their notes); included `displayName` in signup/login responses
- `src/services/auth.js` — added `updateProfile`, `changePassword`, `deleteAccount` service functions
- `src/context/AuthContext.jsx` — stores `displayName` in user object; exposes `updateProfile` and `deleteAccount` through context
- `src/components/Header.jsx` — uses `displayName` from context if set, falls back to email prefix
- `src/App.jsx` — imported `ProfileSettings`, added `'profileSettings'` view, passed `onNavigate` to Header

### New API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| PUT | `/api/auth/profile` | Update email and/or display name | Yes |
| PUT | `/api/auth/password` | Change password (requires current password) | Yes |
| DELETE | `/api/auth/account` | Delete account and all notes (requires password) | Yes |

**Key concepts**:
- **Route-level middleware** — `authenticate` applied per-route in `auth.js` (not globally) so signup/login remain public
- **Tabbed UI with local state** — `activeTab` state controls which panel renders; each tab has its own form state
- **Confirmation modal pattern** — delete account uses a modal overlay with password input instead of `window.confirm`, allowing secure password verification before destructive action
- **Cascading delete** — deleting a user also deletes all their notes via `Note.deleteMany({ user: req.userId })`

---

## Next Steps

Move to **Phase 3 Part 4: Deployment** (Steps 13-15)

---
