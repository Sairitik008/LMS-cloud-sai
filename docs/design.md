# LMS Cloud Sai — Design System & UI/UX Guidelines

This document outlines the visual identity, design tokens, component architecture, and user experience specifications of the **LMS Cloud Sai** application.

---

## 1. Design Philosophy: Grounded Engineering Craft

LMS Cloud Sai is designed with a **clean, disciplined, and authentic engineering aesthetic** tailored for computer science students and software engineers, aligned with top developer platforms (GitHub, Stripe, Linear, Tailwind Labs):

- **Disciplined Dark Palette**: Grounded in deep neutral slate tones (`#0B0F19` canvas, `#0F172A` cards) rather than noisy saturated backgrounds. Minimizes visual fatigue during long coding and reading sessions.
- **Zero AI-Robotic Clichés**: Strictly avoids artificial glowing blur orbs (`blur-[140px]`), radioactive drop shadows, gradient-clipped titles, and speculative pseudo-telemetry.
- **High-Contrast Typography**: Crisp, solid white headlines (`#F8FAFC`) paired with structured neutral slate body text (`#94A3B8`) ensure maximum readability without artificial glitter.
- **Tactile, Solid Controls**: Buttons, pills, and toggles use purposeful solid colors (classic engineering blue `#2563EB` / `#3B82F6` for primary actions, subtle slate `#1E293B` for secondary) with clean border definition (`border-slate-800`).
- **Authentic Developer Tools UI**: The platform feels like real engineering software, featuring macOS-style code window headers, syntax-highlighted code blocks, line-number gutters, and deterministic test suite execution panels.

---

## 2. Design System Tokens & Color Palette

### 2.1 CSS Custom Properties
The core design tokens are defined in [client/src/index.css](file:///e:/DEVELOPMENT/projects/lms/client/src/index.css) using Tailwind CSS v4 `@theme` directives:

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `--color-background` | `#0B0F19` (Slate 950) | Root application background |
| `--color-surface` | `#0F172A` (Slate 900) | Solid card and modal container surface |
| `--color-card-elevated` | `#161F33` (Slate 850) | Highlighted sub-panels and active containers |
| `--color-accent` | `#3B82F6` (Blue 500) | Primary engineering blue brand accent & active states |
| `--color-text-primary` | `#F8FAFC` (Slate 50) | High-contrast body and heading typography |
| `--color-text-muted` | `#94A3B8` (Slate 400) | Subtitles, labels, timestamps, and placeholders |
| `--color-text-dim` | `#64748B` (Slate 500) | Line numbers, secondary metadata, and footer text |
| `--color-border` | `rgba(255, 255, 255, 0.08)` / `border-slate-800` | Subtle structural divider lines and card borders |

### 2.2 Semantic Status Colors

| Purpose | Tailwind Class / Hex | Example Usage |
| :--- | :--- | :--- |
| **Success / Passing** | `text-emerald-400` / `bg-emerald-500/10` | Test scores $\ge 70\%$, unit test passes, completed milestones |
| **Warning / Notice** | `text-amber-400` / `bg-amber-500/10` | Test scores $40\% - 69\%$, algorithmic implementation pitfalls |
| **Danger / Failing** | `text-rose-400` / `bg-rose-500/10` | Test scores $< 40\%$, delete confirmations, logout actions |
| **Engineering Blue** | `text-blue-400` / `bg-blue-600` | Primary action buttons, active navigation tabs, language switchers |

---

## 3. Brand Identity & Emblem (`Logo.jsx`)

The brand mark in [client/src/components/common/Logo.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Logo.jsx) is an architectural, precision-crafted vector emblem designed for scalability from 16px to 64px:

* **Emblem Mark**:
  * Solid dark slate squircle base (`#0F172A`, stroke `#334155`).
  * Continuous geometric architectural monogram in engineering blue (`#3B82F6`, `strokeWidth: 2.5`) intertwining an "S" with bracket vectors.
  * Solid white anchor nodes (`#FFFFFF`) representing computational endpoints.
  * **Zero blur filters, zero neon glows, zero artificial radial gradients.**
* **Typography**:
  * High-contrast title: `Sai` in solid white (`font-bold text-white`) and `Cloud` in crisp royal blue (`font-extrabold text-blue-500`).
  * Monospace status badge: `LMS` in `bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono`.

---

## 4. Reusable Core UI Components

### 4.1 Buttons & Action Controls
- **Primary Action**: Solid blue button (`bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors`).
- **Secondary Action**: Solid slate button (`bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors`).
- **Command / CLI Pill**: Monospace snippet pill (`bg-slate-900 text-slate-300 border border-slate-800 font-mono text-xs px-4 py-2.5 rounded-lg`) with one-click copy feedback.

### 4.2 Code Studio & Editor Frame
- **Window Titlebar**: Dark charcoal header (`#161B22`) with macOS window dots (`#EF4444`, `#F59E0B`, `#10B981`) and file breadcrumb path (`src/algorithms/sliding_window/Solution.java`).
- **Language Switcher**: Solid tabs for `Java 21`, `C++20`, and `Python 3.12`.
- **Editor Canvas**: Dark background (`#0D1117`), line numbers in `#484F58`, authentic syntax colors, and clean horizontal scrolling.
- **Execution Output Drawer**: Clear test suite execution feedback (`14 of 14 test cases passed`), execution timing (`0.4ms`), and memory consumption metrics.

### 4.3 Shared React Components
1. **[AnimatedPage.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/AnimatedPage.jsx)**: Lightweight opacity entrance transitions.
2. **[Modal.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Modal.jsx)**: Accessible modal dialog with keyboard ESC dismiss and backdrop blur.
3. **[Sidebar.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Sidebar.jsx)**: Collapsible sidebar (260px open vs 80px collapsed) with role-based routing.
4. **[Navbar.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Navbar.jsx)**: Sticky top navigation with search bar, notifications, and user avatar.
5. **[EmptyState.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/EmptyState.jsx)**: Conversational empty states with actionable study pro-tips.

---

## 5. Page-by-Page UI/UX Breakdown

### 5.1 Landing Page ([Landing.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Landing.jsx))
- **Navigation Bar**: Sticky clean dark header with navigation links (`Curriculum`, `Evaluation Criteria`, `Pattern Sandbox`, `Engineering Principles`) and quick Auth CTAs.
- **Hero Stage**:
  - Audience badge: `Computer Science & Campus Placement Preparation`.
  - High-impact headline: `"Master Data Structures, Web Systems, and Technical Interviews"`.
  - Subheadline explaining first-principles learning in Java, C++, and MERN.
  - Interactive multi-language Code Studio centerpiece.
- **Hiring Standards Ticker**: Verified engineering benchmark companies (`Google`, `Amazon`, `Microsoft`, `Adobe`, `Flipkart`, `Uber`, `Atlassian`, `TCS Digital`).
- **Curriculum Architecture**: 4 comprehensive tracks (DSA, Full-Stack Architecture, Timed Mock Assessments, Core CS Fundamentals).
- **Evaluation Criteria Matrix**: 4-pillar hiring committee dimensions (Asymptotic Bounds, Edge-Case Handling, System Tradeoffs, Core CS Primitives).
- **Algorithmic Pattern Sandbox**: Interactive tabbed templates (Sliding Window, Binary Search on Monotonic Ranges, Monotonic Stack) with implementation pitfalls and Big-O proofs.
- **Placement Readiness Audit**: Interactive 5-point milestone checklist with calculated readiness score.

### 5.2 Authentication Views ([Login.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Login.jsx) & [Register.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Register.jsx))
- Clean slate card containers (`#0F172A`, `border-slate-800`) with zero background blur blobs.
- Clear error toasts on network disconnects or validation issues.
- 4-step progressive onboarding in `Register.jsx` collecting academic background, technical skills, and developer profile handles.

### 5.3 Student Learning Arena
- **Dashboard ([Dashboard.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Dashboard.jsx))**: Placement calibration readiness tiers (`Explorer Mode 🌱`, `Steady Contender ⚡`, `Placement Ready 🚀`) and daily interview pro-tips.
- **Courses ([Courses.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/Courses.jsx))**: Chapter checklists, difficulty tags, and estimated completion times.
- **Tutorials ([Tutorials.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/Tutorials.jsx))**: Video streaming player with active learning notes companion.
- **Mock Tests ([MockTest.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/MockTest.jsx))**: Fullscreen assessment arena, color-coded countdown timer, and automated submit guard.
- **Leaderboard ([Leaderboard.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/Leaderboard.jsx))**: Podium rankings (Gold, Silver, Bronze) updated via real-time MongoDB aggregation.

---

## 6. Responsive Design & Breakpoints

| Breakpoint | Width | Adaptations |
| :--- | :--- | :--- |
| **Mobile (`< 768px`)** | `< 768px` | Code studio stacks vertically; single-column bento grids; off-canvas sidebar drawer |
| **Tablet (`768px - 1024px`)** | `768px - 1024px` | Two-column cards; condensed table padding; modular accordion trees |
| **Desktop (`> 1024px`)** | `> 1024px` | Full multi-column studio; persistent sidebar; split-screen course reader |
