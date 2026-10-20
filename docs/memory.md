# LMS Cloud Sai — Developer Memory & Architectural Decisions (ADR)

> **Audience:** AI Coding Assistants, Future Maintainers, and Engineering Leads.  
> **Purpose:** Serves as the authoritative persistent memory for technical decisions, known quirks, non-obvious conventions, and operational pitfalls.

---

## 1. Architectural Decision Records (ADRs)

### ADR-001: Cloudinary + Multer over Local Filesystem
- **Context:** Courses require cover thumbnails, tutorials require MP4 video assets, and students require profile avatars.
- **Decision:** Implement `multer-storage-cloudinary` directly streaming uploaded files to Cloudinary.
- **Rationale:** The backend is deployed on Render, which uses ephemeral container disks. Any local file stored under `server/uploads` is permanently wiped upon container restart or deployment rebuild. Cloudinary offloads bandwidth, ensures high availability, and provides automatic responsive image resizing (`width: 1200, height: 675, crop: 'limit'`).

### ADR-002: Stateless JWT in LocalStorage vs HttpOnly Cookies
- **Context:** The frontend is hosted on Vercel (`*.vercel.app`) while the backend API is hosted on Render (`*.onrender.com`).
- **Decision:** Store JWT in `localStorage` under key `userInfo` and transmit via standard `Authorization: Bearer <token>` headers via Axios request interceptors.
- **Rationale:** Cross-domain cookies (`SameSite=None; Secure`) are increasingly blocked by modern browser privacy controls (Safari ITP, Chrome third-party cookie deprecation). Explicit Bearer authorization avoids cross-domain cookie partition pitfalls and allows headless API testing via curl/Postman.

### ADR-003: Server-Side Assessment Grading & Score Protection
- **Context:** In online mock tests, students could theoretically inspect network payloads or dev tools to extract correct answers.
- **Decision:** 
  1. `GET /api/mocktests` explicitly projects `-questions.correctAnswer` to hide answers during test browsing.
  2. The test submission endpoint (`POST /api/results`) receives only `{ mockTestId, answers: [{ questionIndex, selectedOption }] }`.
  3. The server fetches the true answer key from MongoDB, performs the comparison, calculates the score percentage, and persists the Result document.
- **Rationale:** Guarantees academic integrity and prevents client-side answer tampering.

### ADR-004: Tailwind CSS v4 Theme Architecture
- **Context:** Tailwind CSS version `^4.2.2` was introduced with a modernized CSS-first configuration model.
- **Decision:** Declare design system tokens inside `client/src/index.css` under the `@theme` directive, utilizing CSS custom properties (`--color-background`, `--color-card`, `--color-accent`) rather than a heavy JavaScript config file.
- **Rationale:** Reduces bundle size, eliminates config compilation overhead with `@tailwindcss/vite`, and allows dynamic CSS variable adjustments at runtime.

---

## 2. Known Quirks, Gotchas & Edge Cases

### ⚠️ Quirk 1: `express-mongo-sanitize` Express 5 Compatibility
- **Location:** [server/server.js](file:///e:/DEVELOPMENT/projects/lms/server/server.js#L47)
- **Status:** Commented out (`// app.use(mongoSanitize());`).
- **Issue:** Express v5 introduces read-only property semantics for parts of `req.query` and `req.params`. The legacy `express-mongo-sanitize` package attempts in-place property mutations that can crash requests in Express 5.
- **Remedy:** Keep disabled or implement a custom middleware that performs shallow object cloning before regex sanitization.

### ⚠️ Quirk 2: Multer `FormData` Parsing with Nested JSON
- **Location:** [server/controllers/courseController.js](file:///e:/DEVELOPMENT/projects/lms/server/controllers/courseController.js) & [authController.js](file:///e:/DEVELOPMENT/projects/lms/server/controllers/authController.js)
- **Issue:** When submitting forms with file attachments (e.g., updating a user profile with an avatar or a course with a thumbnail), the browser sends `multipart/form-data`. In multipart requests, nested structures (like `skills`, `hobbies`, `socialLinks`, `modules`) are serialized as strings.
- **Remedy:** All controllers handling multipart uploads include defensive type checks:
  ```javascript
  if (typeof modules === 'string') {
    try { parsedModules = JSON.parse(modules); } 
    catch (e) { parsedModules = []; }
  }
  ```
  Never assume nested request fields are pre-parsed JSON objects when a file upload is involved.

### ⚠️ Quirk 3: Cloudinary Resource Type for Tutorials
- **Location:** [server/middleware/uploadMiddleware.js](file:///e:/DEVELOPMENT/projects/lms/server/middleware/uploadMiddleware.js#L15-L22)
- **Issue:** Standard Cloudinary storage defaults to `resource_type: 'image'`. If a user uploads an `.mp4` video tutorial, Cloudinary rejects it with a format mismatch error.
- **Remedy:** `tutorialStorage` is explicitly configured with `resource_type: 'auto'`. Never change this to `'image'`.

### ⚠️ Quirk 4: Legacy MongoDB Ghost Index (`username_1`)
- **Location:** [server/clean-db.js](file:///e:/DEVELOPMENT/projects/lms/server/clean-db.js)
- **Issue:** In an earlier prototype, the `User` schema had a `username` field with a unique index. When refactored to use `email` as the sole unique identifier, MongoDB retained the `username_1` index in existing Atlas clusters. This caused duplicate key errors (`null`) when registering new users.
- **Remedy:** The utility script `server/clean-db.js` drops the ghost index via `db.collection('users').dropIndex('username_1')`. Run this script if index collision occurs on fresh database imports.

### ⚠️ Quirk 5: Client-Side SPA Route Reloads on Vercel
- **Location:** [client/vercel.json](file:///e:/DEVELOPMENT/projects/lms/client/vercel.json)
- **Issue:** Navigating directly to `/courses` or hitting refresh in production causes Vercel's edge router to look for a static file at `/courses/index.html`, returning a 404.
- **Remedy:** `client/vercel.json` defines a rewrite rule `{ "source": "/(.*)", "destination": "/index.html" }`. This file must always be included in the client root.

### ✅ Quirk 6: `ManageStudents.jsx` Backend Routes (RESOLVED)
- **Location:** [server/routes/authRoutes.js](file:///e:/DEVELOPMENT/projects/lms/server/routes/authRoutes.js) & [server/controllers/authController.js](file:///e:/DEVELOPMENT/projects/lms/server/controllers/authController.js)
- **Status:** **Resolved**. `getStudents` and `deleteStudent` endpoints are fully implemented with `protect` and `admin` middleware guards, backed by automated integration tests.

---

## 3. Verified Credentials & Test Accounts

Always use the synchronized test accounts seeded by [server/seed-final.js](file:///e:/DEVELOPMENT/projects/lms/server/seed-final.js):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `password123` | Full CRUD on courses, tutorials, materials, tests, and announcements |
| **Student** | `student@example.com` | `password123` | Enrolled learner, test taker, leaderboard participant |

To regenerate these accounts at any time:
```bash
node server/seed-final.js
```

To elevate any arbitrary user account to Admin:
```bash
node server/admin-setup.js <user-email>
```

---

## 4. Automated Testing Suite & Verification

The project includes unit tests, integration tests, and live smoke tests. Run them from root:

```bash
# Run complete test suite (unit + integration tests)
npm test

# Run build verification for Vercel
npm run build

# Run end-to-end smoke test against running server
node server/smoke-test.js
```

### What the automated tests verify:
1. **Unit Tests (`server/tests/unit.test.js`)**:
   - Token signing and HMAC SHA-256 verification via `generateToken.js`.
   - Bcrypt password salting and `matchPassword` method.
   - CORS origin filter rules with trailing slash and Vercel domain handling.
2. **Integration Tests (`server/tests/integration.test.js`)**:
   - Health check with active database readiness state.
   - Admin login, token generation, and role checks.
   - Student registration, profile fetch (`/api/auth/me`), and profile updates.
   - Admin student management: `GET /api/auth/students` and `DELETE /api/auth/students/:id`.
   - Course CRUD with multi-module arrays.
   - Mock test creation, public question list projection (omitting correct answers), and single test ID queries.
   - Server-side answer evaluation and score calculation (100% and 50% test cases).
   - Leaderboard aggregation pipeline with average score computation and student info population.
   - Announcements CRUD.
