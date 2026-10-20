# LMS Cloud Sai (IT LMS Platform) — Project Overview

> **Repository Corpus:** `Sairitik008/LMS-cloud-sai`  
> **Package Name:** `it-lms-platform` (v1.0.0)  
> **Author & Maintainer:** Sairitik008  
> **Status:** Production-Ready Full-Stack Web Application

---

## 1. Executive Summary & Purpose

**LMS Cloud Sai** is a modern, full-stack Learning Management System engineered specifically for IT and computer science students, educators, and software engineering aspirants. The platform bridges the gap between structured course learning, multimedia tutorials, downloadable study resources, and competitive assessment through an integrated mock testing and gamified leaderboard engine.

Built on the MERN stack (MongoDB, Express, React 19, Node.js) with Tailwind CSS v4, Framer Motion, and Cloudinary media processing, the platform delivers a fast, responsive, cyber-themed user experience tailored for modern technical education.

---

## 2. Core Value Propositions

- **Role-Based Workflows**: Distinct student and administrator workflows with strict JWT-authenticated route guards on both frontend and backend.
- **Comprehensive IT Curriculum Delivery**: Multi-module course tracks, multimedia tutorials with video streaming support, and structured technical study materials (PDFs, cheat sheets, curated external links).
- **Automated Assessment & Gamification**: Timed mock tests with automated scoring, question-by-question answer breakdowns, and an aggregated global leaderboard based on average performance.
- **Rich Developer Profiles**: Multi-step gamified onboarding collecting educational background, technical skill tags, hobbies, and social/competitive programming profiles (GitHub, HackerRank, LinkedIn).
- **Cloud-Native Asset Pipeline**: Seamless asset pipeline using Cloudinary and Multer for direct cloud storage of course banners, user avatars, and tutorial video assets.

---

## 3. High-Level Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.4` | Component-based UI with modern React hooks & Concurrent features |
| **Frontend Tooling** | Vite | `^8.0.4` | Ultra-fast HMR and ESM production bundler |
| **Styling & Design** | Tailwind CSS / PostCSS | `^4.2.2` | Utility-first styling with custom cyber-dark design tokens |
| **Animations** | Framer Motion | `^12.38.0` | Fluid page transitions, modal spring physics, and micro-interactions |
| **Icons & Visuals** | React Icons & Lucide | `^5.6.0` / `^1.7.0` | High-fidelity icon sets across student and admin panels |
| **Client Routing** | React Router DOM | `^7.14.0` | Declarative client-side routing, protected routes, and layouts |
| **Client State / API** | Context API & Axios | `^1.14.0` | Centralized auth state and configured Axios interceptors |
| **Backend Runtime** | Node.js / Express | `^5.2.1` | RESTful API server, routing, and controller pipelines |
| **Database** | MongoDB Atlas / Mongoose | `^9.4.1` | NoSQL document storage, schemas, validations, and aggregations |
| **Authentication** | JSON Web Tokens & Bcrypt | `^9.0.3` / `^3.0.3` | Stateless Bearer token verification and salted password hashing |
| **Media & Storage** | Cloudinary & Multer Storage | `^1.41.3` / `^4.0.0` | Auto-scaling image transformations and video file hosting |
| **Security & Middleware**| Helmet & Morgan | `^8.1.0` / `^1.10.1` | HTTP header security and dev logging |
| **Deployment** | Render (API) + Vercel (Client)| SaaS | Cloud-hosted backend service and CDN edge frontend hosting |

---

## 4. Feature Matrix

### 4.1 Student Capabilities
1. **Interactive Multi-Step Registration**: 4-step wizard capturing core credentials, academic background, tech skills, and developer profile links.
2. **Student Dashboard**: Real-time overview of enrolled courses, published tutorials, resource documents, average mock test score, recent test history, and upcoming tests.
3. **Course Learning**: Browse courses categorized by topic, explore expandable module trees, and view full markdown/text module content.
4. **Video Tutorials**: Filter tutorials by category or text search; stream video tutorials directly within a dark-mode player accompanied by descriptive notes and tags.
5. **Study Materials Library**: Filter by file type (`pdf`, `link`, `notes`) or category; direct viewing and download links for technical PDFs and documentation.
6. **Mock Testing Engine**: Timed assessment environment with fullscreen mode, question navigation, radio selection, remaining time countdown, and auto-submit upon timer expiry.
7. **Instant Grading & Review**: Immediate score percentage, total questions vs correct questions, and time spent.
8. **Global Leaderboard**: Public top-10 ranking of students aggregated by average score across all mock tests taken, complete with medal badges (Gold, Silver, Bronze).
9. **Profile & Settings Management**: Update name, bio, skills, hobbies, social links, password, and upload custom avatars to Cloudinary.

### 4.2 Administrator Capabilities
1. **Admin Analytics Dashboard**: High-level KPI metric cards showing registered students, active courses, total tutorials, mock tests taken, and platform announcements.
2. **Course Management (CRUD)**: Create, edit, and delete courses with title, category, description, banner upload (Cloudinary), and dynamic module builder.
3. **Tutorial Management (CRUD)**: Create, edit, and delete tutorials with dual-file uploads for video media and thumbnail banners, tags, and category tagging.
4. **Study Material Management (CRUD)**: Upload and manage external resource links, PDF URLs, notes, and documentation.
5. **Mock Test Authoring (CRUD)**: Create timed tests with custom durations, multiple questions, options list, correct answer designations, and explanatory notes.
6. **Announcement System**: Broadcast platform announcements, maintenance notices, and competition alerts to all students.
7. **Student Directory**: Inspect registered students, emails, join dates, and account status with one-click account moderation.

---

## 5. Repository Structure

```
lms/
├── package.json                   # Root orchestrator (concurrently runner)
├── package-lock.json
├── README.md                      # Quickstart documentation
├── test-gamified.js               # Registration & profile integration test
├── test-profile-update.js         # Multipart FormData update verification test
│
├── docs/                          # Comprehensive System Documentation
│   ├── project.md                 # Project Overview & System Index
│   ├── memory.md                  # Development Memory, Patterns & Gotchas
│   ├── phases.md                  # Roadmap, Milestones & Phase Progress
│   ├── architecture.md            # System, Component & Data Architecture
│   ├── design.md                  # Design System, Tokens, UI/UX Guidelines
│   ├── api.md                     # RESTful API Endpoint Catalogue
│   ├── database.md                # MongoDB Schemas, Relationships & Aggregations
│   └── deployment.md              # Cloud Deployment & CI/CD Guide
│
├── client/                        # React Frontend (Vite)
│   ├── index.html                 # HTML Entry point
│   ├── vite.config.js             # Vite configuration with React & Tailwind plugins
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── vercel.json                # Vercel SPA rewrite configuration
│   ├── package.json               # Client dependencies & build scripts
│   ├── .env.production            # Production backend URL pointer
│   └── src/
│       ├── main.jsx               # React DOM bootstrapping with Router & Toaster
│       ├── App.jsx                # Route hierarchy (Public, Protected, Admin)
│       ├── App.css                # Legacy component animations & styles
│       ├── index.css              # Tailwind v4 theme tokens & glass-card classes
│       ├── components/
│       │   ├── common/            # Layout, Navbar, Sidebar, Logo, Modal, Skeletons
│       │   └── routes/            # ProtectedRoute and AdminRoute guards
│       ├── context/               # AuthContext (user, login, register, updateProfile)
│       ├── hooks/                 # useFetch custom HTTP hook
│       ├── services/              # Axios instance with Bearer token interceptor
│       └── pages/
│           ├── Landing.jsx        # Marketing page with hero, stats, features & testimonials
│           ├── Login.jsx          # User authentication entry
│           ├── Register.jsx       # 4-step gamified onboarding wizard
│           ├── Dashboard.jsx      # Student dashboard & quick metrics
│           ├── Settings.jsx       # Profile editor & avatar uploader
│           ├── student/           # Courses, Tutorials, Materials, MockTest, Result, Leaderboard
│           └── admin/             # AdminDashboard, ManageCourses, ManageTutorials, etc.
│
└── server/                        # Express.js Backend API
    ├── server.js                  # Express bootstrap, CORS, Helmet, Route mounts
    ├── admin-setup.js             # Script to elevate any user to admin role
    ├── clean-db.js                # MongoDB index cleanup utility
    ├── seed-admin.js              # Test admin user seeder
    ├── seed-final.js              # Admin & Student synchronized test accounts seeder
    ├── smoke-test.js              # End-to-end automated API smoke test script
    ├── package.json               # Server dependencies & scripts
    ├── .env.example               # Template environment configuration
    ├── config/
    │   ├── db.js                  # Mongoose connection logic
    │   └── cloudinary.js          # Cloudinary SDK credentials configuration
    ├── middleware/
    │   ├── authMiddleware.js      # JWT verification (`protect`) & `admin` role check
    │   ├── errorMiddleware.js     # 404 handler & standardized JSON error formatter
    │   └── uploadMiddleware.js    # Multer Cloudinary storage engine (images & tutorials)
    ├── models/
    │   ├── User.js                # Student/Admin schema, bcrypt hooks & profile fields
    │   ├── Course.js              # Course schema with embedded module subdocuments
    │   ├── Tutorial.js            # Video tutorials, category, tags & media URLs
    │   ├── StudyMaterial.js       # Downloadable PDFs, links and study notes
    │   ├── MockTest.js            # Assessments, duration, questions and answers
    │   ├── Result.js              # Student test submissions, scores & answer details
    │   └── Announcement.js        # Global platform announcements
    ├── controllers/               # Business logic for all API resource routes
    ├── routes/                    # Express Router definitions
    └── utils/
        └── generateToken.js       # JWT signing utility (30d expiry)
```

---

## 6. Development Workflow & Quickstart

### 6.1 Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB Atlas Cluster**: Valid MongoDB connection string
- **Cloudinary Account**: Cloud Name, API Key, and API Secret

### 6.2 Installation
From the repository root, install dependencies for all tiers simultaneously:
```bash
npm run install-all
```
*(Or install each directory manually via `npm install` in the root, `/client`, and `/server`)*.

### 6.3 Environment Configuration
Create `server/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

In `client/.env` (optional for local dev, defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 6.4 Seeding Default Accounts
Run the seed script to create verified baseline accounts:
```bash
node server/seed-final.js
```
Default accounts generated:
- **Admin**: `admin@example.com` / `password123`
- **Student**: `student@example.com` / `password123`

### 6.5 Running Locally
From the root directory, start both the client and server concurrently:
```bash
npm run dev
```
- **Backend API**: Running at [http://localhost:5000](http://localhost:5000)
- **Frontend App**: Running at [http://localhost:5173](http://localhost:5173)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 6.6 Running Automated Verification
To verify the full end-to-end flow (Authentication -> Course creation -> Mock test generation -> Student test submission -> Leaderboard aggregation):
```bash
node server/smoke-test.js
```
To test profile update and avatar multipart flows:
```bash
node test-profile-update.js
```
