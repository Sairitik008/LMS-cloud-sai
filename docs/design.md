# LMS Cloud Sai — Design System & UI/UX Guidelines

This document outlines the visual identity, design tokens, component architecture, and user experience specifications of the **LMS Cloud Sai** application.

---

## 1. Design Philosophy: The Cyber-Dark Aesthetic

LMS Cloud Sai is intentionally styled with a **Cyber-Dark** aesthetic tailored to software engineers and tech students:
- **Dark Mode by Default**: Minimizes eye strain during long study sessions and aligns with modern developer tool interfaces (VS Code, GitHub, Terminal environments).
- **Glassmorphism**: Layered semi-transparent cards with high backdrop blur (`backdrop-blur-xl`) create visual depth, hierarchy, and a futuristic feel without visual clutter.
- **Electric Accent Contrast**: Deep slate backgrounds are balanced with high-contrast electric sky blue (`#38bdf8`) and neon purple gradients to direct user attention to critical actions.
- **Fluid Micro-Interactions**: Every button, card, modal, and page transition features spring physics and hover elevation powered by Framer Motion.

---

## 2. Design System Tokens & Color Palette

### 2.1 CSS Custom Properties
The core design tokens are defined in [client/src/index.css](file:///e:/DEVELOPMENT/projects/lms/client/src/index.css) using Tailwind CSS v4 `@theme` directives:

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `--color-background` | `#0f172a` (Slate 900) | Root application background |
| `--color-card` | `rgba(30, 41, 59, 0.7)` | Translucent card surface with backdrop blur |
| `--color-accent` | `#38bdf8` (Sky 400) | Primary electric brand accent & active states |
| `--color-text-primary` | `#f8fafc` (Slate 50) | High-contrast body and heading typography |
| `--color-text-muted` | `#94a3b8` (Slate 400) | Subtitles, labels, timestamps, and placeholders |
| `--color-border` | `rgba(148, 163, 184, 0.1)` | Subtle structural divider lines and card borders |

### 2.2 Semantic Status Colors

| Purpose | Tailwind Class / Hex | Example Usage |
| :--- | :--- | :--- |
| **Success / Passing** | `text-green-500` / `bg-green-500/10` | Test scores $\ge 70\%$, Active status, Rank 1 medal |
| **Warning / Moderate** | `text-yellow-500` / `bg-yellow-500/10` | Test scores $40\% - 69\%$, Gold trophy medals |
| **Danger / Failing** | `text-red-400` / `bg-red-400/10` | Test scores $< 40\%$, Delete actions, Logout button |
| **Tutorial Purple** | `text-purple-400` / `bg-purple-600/10` | Video tutorial icons, gradient highlights |
| **Course Blue** | `text-blue-400` / `bg-blue-500/10` | Course track icons, syllabus tags |

---

## 3. Typography & Hierarchy

The application employs clean system sans-serif typography (`font-sans`) optimized for legibility across technical content and code snippets.

- **Hero Title (`h1`)**: `text-5xl md:text-7xl font-bold tracking-tighter leading-tight`
- **Page Header (`h1`)**: `text-3xl font-bold text-textPrimary`
- **Section Heading (`h2`)**: `text-2xl font-bold text-textPrimary`
- **Card Title (`h3`)**: `text-lg font-bold text-textPrimary`
- **Body Text**: `text-sm text-textMuted leading-relaxed`
- **Badges / Overlines**: `text-xs font-black uppercase tracking-widest`
- **Metric Displays**: `text-2xl to text-4xl font-black`

---

## 4. Reusable Core UI Components

### 4.1 Component Classes (Defined in [index.css](file:///e:/DEVELOPMENT/projects/lms/client/src/index.css))

```css
/* Glassmorphism Surface */
.glass-card {
  @apply bg-card backdrop-blur-xl border border-border rounded-2xl shadow-2xl;
}

/* Primary Electric Action Button */
.btn-primary {
  @apply px-6 py-2.5 bg-accent text-background font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all duration-300;
}

/* Standardized Form Input */
.input-field {
  @apply w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-accent outline-none transition-all duration-300;
}
```

### 4.2 Shared React Components

1. **[AnimatedPage.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/AnimatedPage.jsx)**:
   - Wraps all routed views with Framer Motion.
   - Smooth entrance: `initial={{ opacity: 0, y: 15 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -15 }}`.
2. **[Modal.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Modal.jsx)**:
   - Accessible modal dialog mounted via `AnimatePresence`.
   - Features backdrop blur click-to-close, keyboard ESC dismiss, and animated spring entry (`scale: 0.95 -> 1`).
3. **[Sidebar.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Sidebar.jsx)**:
   - Two-state collapsible sidebar (`width: 260px` open, `80px` collapsed).
   - Dynamic menu items based on user role (`admin` vs `student`).
   - Active route detection with illuminated pill borders.
4. **[Navbar.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Navbar.jsx)**:
   - Synchronized margin offset with sidebar width (`left-64` vs `left-20`).
   - Search field, notification badge, user name, role tag, and avatar thumbnail.
5. **[SkeletonLoader.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/SkeletonLoader.jsx)**:
   - Prevents Cumulative Layout Shift (CLS) during API fetches.
   - Supports `card`, `table-row`, and `text` skeleton variants with pulsing animations.
6. **[EmptyState.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/EmptyState.jsx)**:
   - High-fidelity visual fallback for zero-data states (e.g., no tests taken, empty student list).
7. **[Logo.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/components/common/Logo.jsx)**:
   - Consistent brand badge featuring a stylized gradient icon with customizable text sizing.

---

## 5. Page-by-Page UI/UX Breakdown

### 5.1 Landing Page ([Landing.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Landing.jsx))
- **Navigation Bar**: Transparent frosted glass bar anchored to top viewport with quick anchor jumps and Auth CTAs.
- **Hero Section**: Two-column layout with glowing ambient background orbs (`blur-[120px]`), headline with gradient text clip (`bg-gradient-to-r from-accent to-purple-500`), and interactive floating achievement pills.
- **Feature Showcase**: 4-column feature grid (Interactive Courses, Video Tutorials, Timed Mock Tests, Gamified Leaderboard).
- **Social Proof**: Student testimonial cards and platform success metric counters.

### 5.2 4-Step Registration Wizard ([Register.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Register.jsx))
- **Animated Top Progress Bar**: Visually indicates completion percentage (`25%`, `50%`, `75%`, `100%`).
- **Step 1 (Core Identity)**: Name, Email, Password, Confirm Password with client validation.
- **Step 2 (Academic Info)**: Educational institution background and personal bio.
- **Step 3 (Skill Matrix)**: Technical skills (comma-separated, parsed to tags) and hobbies.
- **Step 4 (Developer Footprint)**: GitHub profile link, HackerRank handle, LinkedIn URL.
- **Smooth Navigation**: Framer Motion horizontal slide transition (`x: 50 -> 0 -> -50`) between steps.

### 5.3 Student Dashboard ([Dashboard.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Dashboard.jsx))
- **Hero Greeting**: Personalized greeting displaying student's full name.
- **Metric Row**: 4 stat cards with colored icon badges (Courses, Tutorials, Materials, Average Test Score).
- **Split Content Area**:
  - Left: Recent Test Performance list with color-coded score percentages.
  - Right: Available/Upcoming Mock Tests with direct "Start Test" CTA buttons.

### 5.4 Course Exploration & Module Reader ([Courses.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/Courses.jsx))
- **Catalog Mode**: Filter courses by category and text search; cards with thumbnail previews and module count.
- **Reader Mode**: Expandable accordion tree on the left sidebar to navigate course modules; full reading pane on the right displaying formatted module content.

### 5.5 Video Tutorial Player ([Tutorials.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/Tutorials.jsx))
- **Category Filter Chips**: Horizontal scrollable pill buttons ('All', 'Frontend', 'Backend', 'DevOps', etc.).
- **Video Card Grid**: Video preview thumbnails, category tags, and duration/topic indicators.
- **Interactive Player View**: Native HTML5 video player streaming Cloudinary video assets, accompanied by descriptive markdown notes and author metadata.

### 5.6 Study Materials Hub ([StudyMaterials.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/StudyMaterials.jsx))
- **Type Filter Tabs**: Quickly isolate `pdf`, `link`, or `notes`.
- **Resource Cards**: Distinct visual icon by document type (Red for PDF, Blue for Link, Yellow for Notes).
- **Direct Action**: One-click download or open-in-new-tab links.

### 5.7 Mock Test & Assessment Interface ([MockTest.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/MockTest.jsx))
- **Pre-Test Screen**: Test cards detailing time limit and question count.
- **Active Test Environment**:
  - Requests full-screen browser mode for distraction-free assessment.
  - Sticky header with real-time countdown timer badge.
  - Question-by-question presentation with radio option selectors.
  - Navigation controls (`Previous`, `Next`, `Submit Test`).
  - Automatic timer-expiry submission guard.

### 5.8 Test Result Summary ([TestResult.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/TestResult.jsx))
- **Celebratory Header**: Animated scaling trophy badge.
- **Score Overview Grid**: Three metric cards for Final Score %, Correct vs Total, and Time Elapsed.
- **Action Links**: "Try Another Test" or "Return to Dashboard".

### 5.9 Global Leaderboard ([Leaderboard.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/student/Leaderboard.jsx))
- **Top 3 Podium Styling**: Gold medal for Rank 1, Silver for Rank 2, Bronze for Rank 3.
- **Data Table**: Displays student avatar, name, number of assessments taken, and average score percentage.

### 5.10 Profile & Settings ([Settings.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/Settings.jsx))
- **Avatar Management**: File picker with live client preview, uploading directly to Cloudinary via multipart form-data.
- **Skill & Social Sync**: Edit skills, educational background, bio, and developer handles.
- **Password Reset**: Optional secure password update field.

### 5.11 Admin Control Panel ([AdminDashboard.jsx](file:///e:/DEVELOPMENT/projects/lms/client/src/pages/admin/AdminDashboard.jsx))
- **Platform Analytics**: Total students, active courses, mock test completions, and active announcements.
- **Quick Links**: Direct shortcuts to course, tutorial, material, and test authoring suites.
- **Strategic Focus**: Operational health alerts and platform engagement reminders.

---

## 6. Responsive Design & Breakpoints

The application is built mobile-first and responsive across all viewports:

| Breakpoint | Width | Adaptations |
| :--- | :--- | :--- |
| **Mobile (`< 768px`)** | `< 768px` | Sidebar collapses to off-canvas drawer; Single-column grids; Navbar search compresses |
| **Tablet (`768px - 1024px`)** | `768px - 1024px` | Two-column cards; Condensed table padding; Modular accordion stacks |
| **Desktop (`> 1024px`)** | `> 1024px` | Full multi-column dashboard; Persistent sidebar; Split-screen course reader |
