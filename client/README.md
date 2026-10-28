# LMS Cloud Sai — Client Frontend 💻

The frontend client for **LMS Cloud Sai** is a Single-Page Application (SPA) built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 🚀 Key Features

* **Student Learning Arena**:
  * **Interactive Dashboard**: Placement calibration readiness tiers (`Explorer Mode 🌱`, `Steady Contender ⚡`, `Placement Ready 🚀`) and daily interview pro-tips.
  * **Curated Courses**: Categorized curriculum tracks with chapter checklists, difficulty tags, and estimated completion times.
  * **Video Masterclasses**: Dedicated video player with an active learning companion panel.
  * **Resource Center**: SDE sheets, gate formula guides, and verified PDF cheatsheets.
* **Assessment & Gamification Arena**:
  * **Timed Mock Drives**: Full-screen testing environment with color-coded countdown timer and single-choice question navigator.
  * **Analytics & Answer Review**: Empathetic scoring feedback, per-question pacing analysis, and side-by-side solution comparison.
  * **All-India Leaderboard**: Podium rankings (Gold, Silver, Bronze) recalculating after each mock test.
* **Developer Identity & Settings**:
  * Rich profile customizer with live avatar preview, target skill chips, and verified coding links (GitHub, LeetCode, LinkedIn).
* **Warm Design System**:
  * Cyber-dark palette configured via CSS custom properties in `src/index.css`.
  * Conversational empty states with interactive pro-tips (`EmptyState.jsx`).
  * Fast search overlay with 5-day prep streak indicators (`Navbar.jsx`).

---

## 🛠️ Tech Stack & Dependencies

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Core UI library & hooks |
| **Vite** | `^8.3.5` | Next-gen lightning-fast bundler & dev server |
| **Tailwind CSS** | `^4.2.2` | CSS-first utility classes with `@theme` directives |
| **Framer Motion** | `^12.43.0` | Declarative page and component animations |
| **React Router** | `^7.13.0` | Client-side routing with protected layout guards |
| **Axios** | `^1.13.5` | HTTP client with automatic Bearer token interceptor |
| **DOMPurify** | `^3.3.1` | XSS sanitization for rendered course/tutorial HTML |
| **React Icons** | `^5.5.0` | Accessible FontAwesome icon set |

---

## ⚙️ Development Commands

```bash
# Install dependencies
npm install

# Start Vite local development server (http://localhost:5173)
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Environment Configuration

In development, the client connects to `http://localhost:5000/api` by default.  
In production, `VITE_API_URL` points to the live backend:

```env
VITE_API_URL=https://lms-cloud-sai.onrender.com/api
```
