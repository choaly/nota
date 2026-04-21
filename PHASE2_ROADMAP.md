# Phase 2: Backend Integration - Complete Roadmap

## High-Level Overview

We're transforming the React app from a **client-side-only application** (localStorage) into a **full-stack application** (React + Node.js + MongoDB).

### Architectural Shift:
- **Before**: React ↔ localStorage (all data stays in browser)
- **After**: React ↔ Express API ↔ MongoDB (data persists on a server)

---

## The Full Map

### **Part 1: Backend Foundation** (Steps 1-3)
**What we're building**: A Node.js server that can talk to MongoDB

- **Step 1**: Initialize Node.js project and install dependencies
- **Step 2**: Set up Express server with basic routing
- **Step 3**: Connect to MongoDB (local or Atlas cloud)

**Time estimate**: 1-2 hours
**Key concept**: Setting up the server environment and database connection

---

### **Part 2: Data Layer** (Steps 4-5)
**What we're building**: A structured way to interact with MongoDB

- **Step 4**: Create Mongoose schema (defines what a "note" looks like in the database)
- **Step 5**: Build API routes (CRUD endpoints)

**Time estimate**: 1-2 hours
**Key concept**: RESTful API design and ORM patterns

---

### **Part 3: Frontend Integration** (Steps 6-8)
**What we're building**: Connect React to the new backend

- **Step 6**: Replace localStorage logic with API calls (using `fetch` or `axios`)
- **Step 7**: Add loading states and error handling
- **Step 8**: Test the full stack

**Time estimate**: 2-3 hours
**Key concept**: Asynchronous state management in React

---

### **Part 4: Polish** (Step 9)
- **Step 9**: Handle edge cases (network failures, validation, etc.)

**Time estimate**: 1 hour

---

## Total Timeline
**5-8 hours** spread across multiple sessions (we'll go at your pace)

---

## Key Architectural Decisions We'll Make

1. **Why Express?** (vs other frameworks like Fastify, Koa)
2. **Why Mongoose?** (vs raw MongoDB driver)
3. **RESTful API design** (what endpoints to expose, HTTP methods)
4. **Where to validate data** (frontend, backend, or both?)
5. **How to handle async operations** in React (promises, async/await, useEffect)

---

## What Could Go Wrong (and Prevention Strategies)

| Risk | Prevention Strategy |
|------|---------------------|
| CORS errors when React calls API | Configure CORS middleware properly |
| Database connection failures | Add error handling and retries |
| Race conditions in async state updates | Use proper React patterns (cleanup, dependencies) |
| Data getting out of sync | Understand when to refetch from server |
| Security vulnerabilities | Validate on backend, sanitize inputs |

---

## Project Structure (Monorepo Approach)

```
/nota/
  /src/                  # Existing React app
    /components/
    /assets/
    App.jsx
    main.jsx
  /backend/              # New! Express server
    /models/             # Mongoose schemas
    /routes/             # API endpoints
    /config/             # Database connection
    server.js            # Entry point
    package.json         # Backend dependencies (separate from frontend)
  package.json           # Frontend dependencies (already exists)
  vite.config.js
  PHASE2_ROADMAP.md      # This file
  LEARNING_SUMMARY.md    # Phase 1 documentation
```

---

## Development Workflow

**How to run during development**:
- Terminal 1: `npm run dev` (React dev server on port 5173)
- Terminal 2: `cd backend && npm run dev` (Express server on port 5000)
- React app makes API calls to `http://localhost:5000`

**How to deploy** (later):
- Frontend: Static files on Netlify/Vercel
- Backend: Node server on Render/Railway/Heroku
- Update API calls to production backend URL

---

## REST API Endpoints We'll Build

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get single note by ID |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update existing note |
| DELETE | `/api/notes/:id` | Delete note |

---

## Technologies & Why

### Backend Stack:
- **Node.js**: JavaScript runtime (same language as React!)
- **Express**: Minimalist web framework (most popular, lots of resources)
- **MongoDB**: NoSQL database (flexible schema, easy to start)
- **Mongoose**: ODM (Object Data Modeling) library (makes MongoDB easier to work with)

### Why not alternatives?
- **Why not Django/Flask (Python)?** Could work, but using JavaScript end-to-end is simpler for learning
- **Why not SQL (PostgreSQL)?** Could work, but NoSQL is more forgiving for unstructured note data
- **Why not Firebase?** Could work, but we want to understand how backends work from scratch

---

## Learning Objectives

By the end of Phase 2, you should be able to:
1. ✅ Set up a Node.js/Express server from scratch
2. ✅ Design RESTful APIs with proper HTTP methods
3. ✅ Connect to and query MongoDB using Mongoose
4. ✅ Make async API calls from React (fetch/axios)
5. ✅ Handle loading and error states in React
6. ✅ Understand the full request-response cycle
7. ✅ Debug full-stack applications (frontend + backend)
8. ✅ Deploy a full-stack application

---

## Checkpoints

After each part, we'll pause to ensure you understand:
- **After Part 1**: Can you explain what a server is and why we need one?
- **After Part 2**: Can you design a new API endpoint from scratch?
- **After Part 3**: Can you explain the async flow from button click to UI update?
- **After Part 4**: Can you build a similar CRUD app independently?

---

---

## Detailed Step-by-Step Progress

### ✅ Step 1: Initialize Node.js Project (COMPLETED)

**What we did**:
1. Created `/backend/` folder inside `/nota/`
2. Ran `npm init` to create `package.json`
3. Installed dependencies: `npm install express mongoose cors dotenv`

**What was created**:
- `package.json` - Lists project dependencies and metadata
- `package-lock.json` - Locks exact versions of all dependencies
- `node_modules/` - Contains all installed packages and their dependencies

**Key learnings**:
- **package.json** vs **package-lock.json**:
  - package.json: "I need Express 4.x.x" (flexible versioning)
  - package-lock.json: "I installed exactly Express 4.18.0" (precise locking)
- **Transitive dependencies**: When you install 4 packages, you get 100+ folders in node_modules because of dependencies of dependencies
- **Never commit node_modules** to git - it's regenerable with `npm install`

**Commands used**:
```bash
mkdir backend
cd backend
npm init
npm install express mongoose cors dotenv
```

---

### ✅ Step 2: Set Up Express Server with Basic Routing (COMPLETED)

**What we did**:
1. Created `server.js` with Express app instance
2. Added environment variables with `dotenv` (`.env` file for PORT and CONNECTION_STRING)
3. Added middleware: `express.json()`, `cors()`, `morgan('dev')`
4. Created health check route at `/`
5. Created RESTful route stubs for `/api/notes`

**What was created**:
- `backend/server.js` - Express server entry point
- `backend/.env` - Environment variables (PORT, CONNECTION_STRING)

**Key learnings**:
- **Ports are exclusive** — only one process can bind to a port at a time (`EADDRINUSE` error). macOS AirPlay uses port 5000, so we used 5001
- **Environment variables** — configuration that changes between environments lives outside code (Twelve-Factor App pattern)
- **Middleware** — functions that run between request and route handler in a pipeline. Order matters: define middleware before routes
- **`express.json()`** — parses JSON request bodies so `req.body` works
- **`cors()`** — allows cross-origin requests (React on :5173 → Express on :5001)
- **`morgan('dev')`** — logs requests for debugging
- **Factory functions** — `require('express')` returns a function; `express()` creates the app

---

### ✅ Step 3: Connect to MongoDB Atlas (COMPLETED)

**What we did**:
1. Set up MongoDB Atlas free cluster
2. Created database user and whitelisted IP
3. Created `config/db.js` with async connection function
4. Wired connection into `server.js` startup (connect first, then listen)

**What was created**:
- `backend/config/db.js` - Database connection module

**Key learnings**:
- **Separation of concerns** — database connection logic in its own file, not in `server.js`
- **`async/await`** — `mongoose.connect()` returns a promise; `await` pauses until it resolves; without `await`, `try/catch` won't catch async errors
- **Startup order** — connect to database before starting the server; if DB is down, fail fast rather than accepting requests you can't fulfill
- **`module.exports`** — CommonJS pattern for sharing code between files (vs ES modules `export/import`)
- **Connection string** — contains credentials, stored in `.env`, never committed to git

---

### ✅ Step 4: Create Mongoose Schema (COMPLETED)

**What we did**:
1. Created `models/Note.js` with Mongoose schema and model
2. Defined `title` (String, default: 'Untitled Note') and `content` (String) fields
3. Used `{ timestamps: true }` for automatic `createdAt`/`updatedAt`

**What was created**:
- `backend/models/Note.js` - Note schema and model

**Key learnings**:
- **Schema vs Model** — schema defines the shape (blueprint), model provides methods to interact with the database (`Note.find()`, `Note.create()`, etc.)
- **`timestamps: true`** — Mongoose auto-manages `createdAt` and `updatedAt`
- **MongoDB `_id`** — MongoDB generates unique `_id` (with underscore), not `id`. This caused a frontend bug later when comparing IDs

---

### ✅ Step 5: Build API Routes - CRUD Endpoints (COMPLETED)

**What we did**:
1. Created `routes/notes.js` with Express Router
2. Implemented all five CRUD endpoints with real database operations
3. Mounted router in `server.js` at `/api/notes`

**What was created**:
- `backend/routes/notes.js` - Notes API router

**Endpoints**:
| Method | Path | Mongoose Method | Status Code |
|--------|------|----------------|-------------|
| GET | `/` | `Note.find({})` | 200 |
| GET | `/:id` | `Note.findById(id)` | 200 / 404 |
| POST | `/` | `Note.create(body)` | 201 |
| PUT | `/:id` | `Note.findByIdAndUpdate(id, body, { new: true })` | 200 |
| DELETE | `/:id` | `Note.findByIdAndDelete(id)` | 200 |

**Key learnings**:
- **Express Router** — groups related routes into separate files; paths become relative to mount point
- **Route vs Endpoint** — route is the implementation (Express code), endpoint is the interface (what clients see)
- **`{ new: true }`** — tells Mongoose to return the updated document, not the original
- **Status codes** — 200 OK, 201 Created, 404 Not Found, 500 Internal Server Error
- **`req.params`** vs **`req.body`** vs **`req.query`** — URL path parameters, request body data, and query string parameters respectively
- **`res.json()` not `return`** — routes send responses over the network, not to calling code
- **Shorthand property notation** — `res.json({ notes })` is shorthand for `res.json({ notes: notes })` when variable name matches key
- **`curl` for testing APIs** — command-line tool for making HTTP requests; browser can only test GET routes
  ```bash
  # Create a note (POST)
  curl -X POST http://localhost:5001/api/notes \
    -H "Content-Type: application/json" \
    -d '{"title": "Test Note", "content": "Hello from the API"}'

  # Get all notes (GET)
  curl http://localhost:5001/api/notes

  # Update a note (PUT) — replace <id> with actual MongoDB _id
  curl -X PUT http://localhost:5001/api/notes/<id> \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Title"}'

  # Delete a note (DELETE)
  curl -X DELETE http://localhost:5001/api/notes/<id>
  ```

---

### ✅ Step 6: Replace localStorage with API Calls (COMPLETED)

**What we did**:
1. Created `src/services/notes.js` — frontend API service layer
2. Updated `App.jsx` to fetch notes from API on mount
3. Updated `handleSaveNote` and `handleDeleteNote` to call API before updating state
4. Replaced all `note.id` references with `note._id` across components

**What was created**:
- `src/services/notes.js` - Frontend API service layer

**Key learnings**:
- **Service layer pattern** — centralize API calls in one file; if the URL or library changes, update one place
- **CommonJS vs ES modules** — backend uses `require`/`module.exports`, frontend (React/Vite) uses `import`/`export`
- **`fetch()` API** — browser built-in for HTTP requests; defaults to GET; POST/PUT need `method`, `headers`, and `body` options
- **`Content-Type: application/json`** header — tells the server the body is JSON (needed for `express.json()` to parse it)
- **Async useEffect pattern** — can't make useEffect callback async directly; define async function inside and call it
- **Server is source of truth** — React state is now a local copy of server data; always update server first, then sync local state
- **`_id` vs `id` bug** — MongoDB uses `_id`; all frontend references needed updating. Debugged by tracing data flow across the full stack

---

### ✅ Step 7: Loading States and Error Handling (COMPLETED)

**What we did**:
1. Added `loading` and `error` state variables
2. Updated `fetchNotes` with `try/catch/finally` for proper error handling
3. Added conditional rendering chain: loading → error → normal view

**Key learnings**:
- **`try/catch/finally`** — `finally` always runs regardless of success or failure; ideal for cleanup like `setLoading(false)`
- **Conditional rendering chain** — chained ternaries for mutually exclusive states: `loading ? ... : error ? ... : normalView`
- **`&&` vs ternary** — `&&` for simple one-off conditionals; chained ternary for "show exactly one of N options"
- **JSX curly braces** — toggle between JSX mode (literal text) and JavaScript evaluation; needed each time you're inside a JSX tag and want to evaluate a variable

---

### ✅ Step 8: Test the Full Stack (COMPLETED)

**What we tested**:
1. ✅ Create — new notes appear in sidebar and dashboard
2. ✅ Read — notes persist after page refresh (from database, not local state)
3. ✅ Update — edits persist after refresh
4. ✅ Delete — notes removed from UI and database
5. ✅ Error state — error message displays when backend is down

**Key learnings**:
- **Three places to check when debugging** — UI, backend terminal (morgan logs), database (Atlas Browse Collections)
- **`_id` bug** — the biggest debugging exercise; traced from morgan log (`PUT /api/notes/undefined`) back to frontend code using wrong field name
- **Systematic debugging** — identify which layer the bug is in, add console.log to check values, compare expected vs actual

---

### ✅ Step 9: Handle Edge Cases (COMPLETED)

**What we did**:
1. Added schema validation (trim, maxlength) to Mongoose model
2. Hardened Express routes: ID validation (400), missing note checks (404), `return` after responses, input sanitization, `runValidators: true`, `ValidationError` → 400
3. Added server-level safety nets: body size limit, 404 handler for unknown routes, global error handler
4. Updated frontend service layer with `handleResponse` helper to detect HTTP errors from `fetch`
5. Added try/catch to save and delete handlers in App.jsx with error alerts
6. Added `saving` state to NoteView — disabled button, "Saving..." text, only navigates away on success
7. Added null guards (`|| ''`) in Dashboard and Sidebar for search filter and formatDate

**Files modified**:
- `backend/models/Note.js` — schema validation (trim, maxlength, default)
- `backend/routes/notes.js` — ID validation, sanitization, return on 404, ValidationError handling
- `backend/server.js` — body limit, 404 handler, global error handler
- `src/services/notes.js` — `handleResponse` helper for HTTP error detection
- `src/App.jsx` — try/catch on save/delete handlers
- `src/components/NoteView.jsx` — saving state, async save with try/catch/finally
- `src/components/Dashboard.jsx` — null guards in filter and formatDate
- `src/components/Sidebar.jsx` — null guards in filter and formatDate

**Key learnings**:
- **Defense in depth** — every layer validates independently; if one fails, the next catches it
- **`fetch()` doesn't throw on HTTP errors** — only on network failures. You must check `response.ok` yourself
- **`return` before `res.status().json()`** — without it, Express continues executing and tries to send a second response ("Cannot set headers after they are sent")
- **`runValidators: true`** — Mongoose skips schema validation on updates by default; this opt-in is required
- **`error.name === 'ValidationError'`** — distinguishes client errors (400) from server errors (500)
- **Validate early, fail fast** — catch bad data as far from the database as possible
- **Block scoping with `let`** — variables declared with `const`/`let` inside `try {}` aren't accessible outside it
- **`finally` block** — runs regardless of success or failure; ideal for cleanup like `setSaving(false)`
- **Re-throwing errors** — `throw error` in a catch block passes the error up to the caller, enabling parent components to react to child failures

---

## Phase 2 Complete! 🎉

**What was built**:
- Express server with middleware pipeline
- MongoDB Atlas cloud database connection
- Mongoose schema with automatic timestamps and validation
- RESTful CRUD API (5 endpoints) with input validation and sanitization
- Frontend service layer with fetch API and HTTP error detection
- Loading and error states
- Edge case handling across the full stack
- Full-stack data flow: React → fetch → Express → Mongoose → MongoDB Atlas → back

**Architecture**:
```
React (localhost:5173)
  → src/services/notes.js (API calls + error detection)
    → Express (localhost:5001)
      → routes/notes.js (validation + sanitization + route handlers)
        → models/Note.js (schema validation)
          → MongoDB Atlas (cloud database)
```

---

## Next Steps

Move to **Phase 3**: Advanced features (authentication, collaboration, AI features)

---

## Resources for Later

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
- [REST API Best Practices](https://restfulapi.net/)
