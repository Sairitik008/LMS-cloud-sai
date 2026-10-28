# LMS Cloud Sai 🎓

[![CI Status](https://github.com/Sairitik008/LMS-cloud-sai/actions/workflows/ci.yml/badge.svg)](https://github.com/Sairitik008/LMS-cloud-sai/actions)
[![Frontend Status](https://img.shields.io/badge/Vercel-Live%20(200%20OK)-000000?logo=vercel)](https://lms-cloud-sai.vercel.app)
[![Backend Status](https://img.shields.io/badge/Render-Active%20(Connected)-46E3B7?logo=render)](https://lms-cloud-sai.onrender.com/api/health)
[![Test Suite](https://img.shields.io/badge/Tests-78%20Passed-brightgreen)](https://github.com/Sairitik008/LMS-cloud-sai)
[![Node Version](https://img.shields.io/badge/Node-v20%2B-339933?logo=node.js)](https://nodejs.org/)

**LMS Cloud Sai** is a production-grade, full-stack **Campus Placement & Engineering Learning Management System** built with **React 19**, **Express 5**, and **MongoDB Atlas**. Designed specifically for engineering students preparing for technical interviews, coding rounds, and core computer science assessments.

---

## 🌐 Live Deployments

* **Frontend Web Application (Vercel Edge CDN):**  
  👉 **[https://lms-cloud-sai.vercel.app](https://lms-cloud-sai.vercel.app)**
* **Backend REST API (Render Web Service):**  
  👉 **[https://lms-cloud-sai.onrender.com](https://lms-cloud-sai.onrender.com)**
* **Live Healthcheck & Database Ping:**  
  👉 **[https://lms-cloud-sai.onrender.com/api/health](https://lms-cloud-sai.onrender.com/api/health)**

---

## 🚀 Key Highlights & Architecture

* **Empathetic, Humanized Experience**:
  * Dynamic "Placement Calibration" levels (`Explorer Mode 🌱`, `Steady Contender ⚡`, `Placement Ready 🚀`).
  * Daily Interview Pro-Tips (DSA two-pointers, CAP theorem, DBMS indexing, STAR format).
  * Conversational empty states with interactive study tips (`EmptyState.jsx`).
  * Low-stakes mock exam arena with color-coded countdown timer and pacing analytics.
* **Atlas TTL Auto-Eviction & Free-Tier Longevity**:
  * 30-day automatic eviction on mock test results and 14-day eviction on announcements to enforce bounded storage budgets on MongoDB Atlas M0 free tier.
  * Real-time storage monitor (`dbStorageGuard.js`) preventing hard quota overages.
* **Cooling Period & Dormancy Resilience**:
  * Automated 9-minute internal self-ping preventing Render free instance sleep.
  * Active 45-second MongoDB database ping preventing cloud NAT connection drops.
* **Tiered Defense-in-Depth Security**:
  * Dual IP + Account exponential backoff throttling (`authBackoffMiddleware.js`).
  * Strict Zod input schema validation rejecting unknown keys and mass-assignment payloads.
  * Prototype pollution protection and custom recursive NoSQL injection stripping.
  * Runtime secret scrubbing in error responses (`errorHandler.js`).

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion | 19.2 / 8.3 | Ultra-fast SPA with cyber-dark aesthetics |
| **Backend** | Node.js, Express.js | 20.x / 5.x | Stateless RESTful API with middleware pipelines |
| **Database** | MongoDB Atlas, Mongoose ODM | 9.4 | NoSQL document storage with native TTL indexing |
| **Authentication**| JWT (JSON Web Tokens), Bcryptjs | 9.0 / 3.0 | Secure Bearer authorization & salted password hashing |
| **Media CDN** | Cloudinary SDK | 1.41 | Multipart course thumbnails, videos, and avatars |
| **CI / CD** | GitHub Actions | v4 | Automated linting, client building, and backend test runner |

---

## 🏗️ Repository Structure

```
lms/
├── .github/workflows/
│   └── ci.yml               # Automated CI pipeline (Node 20 + Mongo 7.0)
├── client/                  # React 19 SPA (Vite + Tailwind v4)
│   ├── src/
│   │   ├── components/      # Common UI (Navbar, Sidebar, EmptyState, Logo)
│   │   ├── pages/           # Student & Admin route views
│   │   ├── context/         # AuthContext & global state
│   │   └── index.css        # Cyber-dark design tokens & utility classes
│   └── vercel.json          # SPA rewrite rules
├── server/                  # Express 5 REST API
│   ├── config/              # MongoDB & Cloudinary connectors
│   ├── controllers/         # Business logic & Aggregation pipelines
│   ├── middleware/          # Auth, RBAC, Validation, Rate Limiters
│   ├── models/              # Mongoose schemas (User, Course, MockTest, Result...)
│   ├── routes/              # Express API routers
│   ├── utils/               # Schemas, sanitizers, storage guards
│   └── tests/               # 78 automated unit & integration tests
└── docs/                    # Technical architecture & engineering records
```

---

## 📚 Complete Project Documentation

Detailed architectural specifications, API references, and operating guides are maintained in the [`docs/`](file:///e:/DEVELOPMENT/projects/lms/docs/) directory:

| Document | Description |
| :--- | :--- |
| **[docs/architecture.md](file:///e:/DEVELOPMENT/projects/lms/docs/architecture.md)** | High-level system architecture, client-server tier diagrams, and data flows. |
| **[docs/api.md](file:///e:/DEVELOPMENT/projects/lms/docs/api.md)** | Complete REST API endpoint reference, authentication schemas, and payloads. |
| **[docs/database.md](file:///e:/DEVELOPMENT/projects/lms/docs/database.md)** | Entity-Relationship (ER) diagram, Mongoose schemas, and Atlas TTL auto-eviction. |
| **[docs/deployment.md](file:///e:/DEVELOPMENT/projects/lms/docs/deployment.md)** | Cloud deployment on Render, Vercel, Atlas, and GitHub Actions CI pipeline. |
| **[docs/memory.md](file:///e:/DEVELOPMENT/projects/lms/docs/memory.md)** | Architectural Decision Records (ADRs 001–007), quirks, and test credentials. |
| **[docs/phases.md](file:///e:/DEVELOPMENT/projects/lms/docs/phases.md)** | Milestone roadmap, completed evolutionary phases, and future plans. |

---

## ⚙️ Getting Started Locally

### 1. Prerequisites
* **Node.js** v20.x or higher
* **npm** v10.x or higher
* **MongoDB Atlas** or local MongoDB instance

### 2. Backend Setup
```bash
cd server
npm install --legacy-peer-deps
cp .env.example .env     # Fill in MONGO_URI, JWT_SECRET, CLOUDINARY credentials
npm run dev              # Starts Express API at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev              # Starts Vite dev server at http://localhost:5173
```

### 4. Running Tests
```bash
cd server
npm test                 # Executes 78 unit & integration tests
```

---

## 👥 Verified Test Accounts

For testing, use the pre-configured accounts:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `password123` | Full admin CRUD on curriculum, tests, announcements |
| **Student** | `student@example.com` | `password123` | Course enrolment, mock test taking, leaderboard participation |

To seed sample data:
```bash
node server/seed-final.js
```

---

## 📄 License & Intellectual Property Notice

**PROPRIETARY & CONFIDENTIAL — ALL RIGHTS RESERVED**  
Unauthorized duplication, distribution, reverse engineering, or commercial use is strictly prohibited.
