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

### ADR-005: Free-Tier Database Longevity & Atlas TTL Auto-Eviction
- **Context:** As a demonstration and educational platform deployed on MongoDB Atlas M0 free tier (512MB storage cap), unbounded storage accumulation from continuous mock test submissions and broadcast announcements risks quota exhaustion and account suspension.
- **Decision:**
  1. Implement native MongoDB TTL (Time-To-Live) indexes:
     - `Result` documents auto-evict after 30 days (`createdAt: 1, expireAfterSeconds: 2592000`).
     - `Announcement` documents auto-evict after 14 days (`createdAt: 1, expireAfterSeconds: 1209600`).
  2. Implement an automated storage budgeting and monitoring utility in `server/utils/dbStorageGuard.js` that checks storage metrics and warns if utilization exceeds 75% of the 512MB budget.
  3. Implement automated cloud keep-alive mechanisms:
     - Backend self-ping every 9 minutes on Render to prevent container freeze (threshold: 15 mins).
     - MongoDB Atlas active database ping every 45 seconds to keep cloud firewall NAT sockets open and prevent connection drops.
- **Rationale:** Guarantees perpetual zero-maintenance operational longevity without manual database pruning.

### ADR-006: Tiered Defense-in-Depth & Anti-Tampering Engine
- **Context:** Publicly accessible student platforms face automated vulnerability scanners, brute-force credential stuffing, and prototype pollution.
- **Decision:**
  1. Enforce strict Zod schema validation (`server/utils/validationSchemas.js` and `server/middleware/validateInput.js`) that rejects malformed payloads and drops undeclared mass-assignment fields with HTTP 400.
  2. Implement dual-tracking rate limiting:
     - IP-based sliding window rate limiter (`express-rate-limit`).
     - Account-based exponential backoff (`authBackoffMiddleware.js`) which isolates targeted victim accounts while preventing legitimate users on shared campus Wi-Fi from being globally throttled.
  3. Implement deep recursive NoSQL operator sanitization (`sanitizeNoSql.js`) and prototype pollution rejection for keys matching `__proto__`, `constructor`, and `prototype`.
  4. Redact sensitive credentials (JWT secrets, Mongo URIs, Cloudinary keys) from all runtime error responses via `errorHandler.js`.
- **Rationale:** Protects against OWASP Top 10 API vulnerabilities without adding external paid firewall dependencies.

### ADR-007: Student-Centric Humanized UI Architecture
- **Context:** Educational dashboards often suffer from sterile, robotic, or intimidating interfaces that amplify testing anxiety and student disengagement.
- **Decision:**
  1. Transition to empathetic, conversational micro-copy across all views.
  2. Replace empty gray tables with interactive, animated `EmptyState.jsx` components offering actionable study pro-tips.
  3. Introduce dynamic "Placement Calibration" levels (`Explorer Mode 🌱`, `Steady Contender ⚡`, `Placement Ready 🚀`) rather than discouraging pass/fail labels.
  4. Design mock exams as low-stakes, zero-penalty practice grounds with visual reassurance, gentle timer state transitions, and a question breakdown comparing user answers with official solutions.
- **Rationale:** Substantially improves student retention, lowers test-taking anxiety, and fosters consistent daily preparation habits.

---

## 2. Known Quirks, Gotchas & Edge Cases

### ⚠️ Quirk 1: Express 5 & NoSQL Sanitization
- **Location:** [server/middleware/sanitizeNoSql.js](file:///e:/DEVELOPMENT/projects/lms/server/middleware/sanitizeNoSql.js)
- **Status:** **Resolved**. Replaced legacy `express-mongo-sanitize` (which crashes Express 5 due to mutating read-only query properties) with a custom recursive sanitizer that clones input objects and safely strips prohibited `$` and `.` operators.

### ⚠️ Quirk 2: Multer `FormData` Parsing with Nested JSON
- **Location:** [server/controllers/courseController.js](file:///e:/DEVELOPMENT/projects/lms/server/controllers/courseController.js) & [authController.js](file:///e:/DEVELOPMENT/projects/lms/server/controllers/authController.js)
- **Issue:** When submitting forms with file attachments, nested fields (`skills`, `modules`) arrive as serialized strings.
- **Remedy:** All controllers include defensive JSON parsing checks (`typeof field === 'string' ? JSON.parse(field) : field`).

### ⚠️ Quirk 3: Cloudinary Resource Type for Video Tutorials
- **Location:** [server/middleware/uploadMiddleware.js](file:///e:/DEVELOPMENT/projects/lms/server/middleware/uploadMiddleware.js)
- **Remedy:** `tutorialStorage` is explicitly configured with `resource_type: 'auto'`. Never change this to `'image'`.

### ⚠️ Quirk 4: Peer Dependency Conflict in CI (`multer-storage-cloudinary` vs `cloudinary`)
- **Location:** [server/.npmrc](file:///e:/DEVELOPMENT/projects/lms/server/.npmrc) & [.github/workflows/ci.yml](file:///e:/DEVELOPMENT/projects/lms/.github/workflows/ci.yml)
- **Issue:** `multer-storage-cloudinary@4.0.0` specifies `peerDependencies: cloudinary@"^1.21.0"`, causing `npm ci` to fail under npm 7+ with ERESOLVE.
- **Remedy:** Added `legacy-peer-deps=true` to `server/.npmrc` and `--legacy-peer-deps` flag to CI pipeline workflow steps.

### ⚠️ Quirk 5: GitHub Actions MongoDB Container Healthcheck
- **Location:** [.github/workflows/ci.yml](file:///e:/DEVELOPMENT/projects/lms/.github/workflows/ci.yml)
- **Issue:** MongoDB 6.0+ container images deprecate the legacy `mongo` CLI. Workflows specifying `--health-cmd "mongo --eval 'db.runCommand({ ping: 1 })'"` fail container readiness checks.
- **Remedy:** Use `mongosh` in the healthcheck: `--health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"`.

### ⚠️ Quirk 6: React Icons `react-icons/fa` vs `fa6`
- **Location:** Client components
- **Issue:** Modern Vite / Rolldown builds fail if non-existent icons are imported from `react-icons/fa` (e.g. `FaSparkles` does not exist in standard FA4/5 bundles).
- **Remedy:** Standardize strictly on stable FontAwesome icons exported by `react-icons/fa` (`FaBook`, `FaClock`, `FaLightbulb`, `FaTrophy`, etc.).

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

The project includes unit tests, integration tests, rate limiting tests, and strict schema validation tests (78 tests across 15 suites):

```bash
# Run backend test suite (Node 20 test runner)
cd server
npm test

# Run client lint gate
cd client
npm run lint

# Build client production bundle
cd client
npm run build
```
