# StudyFlow V2 — Master Project Documentation

> Version 2.1 • Product Documentation Bundle
> This file is a synced condensed index of the four detailed documents (PRD, TRD, App Flow, UI/UX). Where more detail is needed, refer to the standalone document — this file should never contradict them.

---

# Contents

1. Product Requirements Document (PRD)
2. Technical Requirements Document (TRD)
3. Application Flow
4. UI/UX Design System

---

# DOCUMENT 01 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Executive Summary

**Product:** StudyFlow V2

**Tagline:** Plan Smarter. Focus Deeper. Learn Better.

StudyFlow V2 is a premium full-stack student productivity web application that combines task planning, calendar scheduling, Kanban workflow, Pomodoro focus sessions, notes, analytics, and a virtual study companion called **Lumi** into one calm, responsive workspace.

### Problem Statement

Students constantly switch between multiple apps for assignments, calendars, notes, and focus. StudyFlow unifies everything into a single academic operating system.

### Target Users

- College students
- Placement aspirants
- University students
- Self-learners

### Core MVP Features

- Login / Register / Forgot Password
- Continue as Guest (with auto-migration to a real account on signup)
- Dashboard
- Planner (Tasks + Subjects + limited recurrence)
- Kanban
- Calendar
- Notes
- Focus Mode (with session-abandon handling)
- Analytics
- Profile (incl. Light/Dark theme)
- Lumi Companion

### Guest Mode & Migration

Users can use the entire application without signing up. Data is stored locally. When a guest registers, their local data (tasks, notes, focus history, goals) is **automatically migrated** to their new account in one background upload — nothing is lost, and a failed upload is retried rather than discarded.

### Subjects (First-Class Entity)

Subjects are user-managed (not a hardcoded list), shared across Planner, Notes, and Analytics, and can optionally carry a color used consistently across Kanban, Calendar, and charts.

### Recurring Tasks — V2 Scope

Daily, Weekly, and Weekdays-only patterns. Editing a recurring task affects future occurrences only. Custom intervals and monthly recurrence are deferred to V2.1.

### Focus Session Interruptions

Sessions closed early are marked **Abandoned**, not Completed — elapsed time is saved to history but excluded from streaks and focus-minute analytics.

### Future Version 2.1

- AI Study Mentor
- Google Calendar Sync
- PDF Reports
- Email Reminders
- Advanced recurrence rules

---

# DOCUMENT 02 — TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MySQL |
| Authentication | JWT (httpOnly, Secure, SameSite=Lax cookie) + bcrypt |
| Validation | express-validator |
| Security | helmet, express-rate-limit |
| Charts | Chart.js |
| Icons | Lucide React |
| HTTP | Axios (`withCredentials: true`) |

## Important Change

**Bootstrap is removed from this project.** StudyFlow V2 uses **Tailwind CSS only**.

## JWT Storage Decision

The JWT lives only in an **httpOnly cookie** set by the server — never in localStorage or React state. `cookie-parser` reads it server-side; CORS must use `credentials: true` with an explicit (non-wildcard) origin.

## Guest → Registered Migration

`POST /api/auth/migrate-guest-data` — a one-time bulk import that runs right after registration, assigning all local records to the new `userId` in a single transaction.

## Architecture

React → Axios (credentials) → Express REST API → MySQL

## Folder Structure

```
studyflow-v2/
├── client/
├── server/
├── database/
├── docs/
└── README.md
```

## Core Schema (see TRD Section 2 for full column detail)

```
Users  ──< Subjects  ──< Tasks (recurrence, recurrence_parent_id)
Users  ──< Notes (subject_id nullable)
Users  ──< FocusSessions (status: in_progress | completed | abandoned)
```

Analytics is **derived** at query time from Tasks/FocusSessions — it is not its own duplicated table.

## State Management

React Context API

- AuthContext (user + isGuest + migrateGuestData(); the JWT itself never enters React state)
- TaskContext
- SubjectContext
- ThemeContext (persists to localStorage for guests, to the user profile for registered users)
- BuddyContext

## API Additions Beyond V1 Scope

- `POST /auth/forgot-password`, `POST /auth/reset-password`
- `POST /auth/migrate-guest-data`
- `GET/POST/PUT/DELETE /subjects`
- `POST /focus/abandon`
- Pagination/filter query params on `GET /tasks` and `GET /notes`
- Every write endpoint validated by `express-validator`

## Deployment

```
Frontend (React/Vite)   →  Vercel
Backend (Node/Express)  →  Render or Railway (free tier)
Database (MySQL)        →  Railway MySQL or Aiven (free tier)
```

## Testing

- Backend: Jest + Supertest for controllers/models; a maintained Postman collection covering every endpoint
- Frontend: Jest + React Testing Library for TaskCard, PomodoroTimer, KanbanBoard, AuthContext
- Goal: prove the harder logic (recurrence, streaks, focus-session states) actually works — not 100% coverage

## Git Workflow

```
main
develop
feature/dashboard
feature/planner
feature/lumi
```

Commit examples:

- feat: add planner module
- feat: implement focus timer
- fix: calendar responsiveness

---

# DOCUMENT 03 — APPLICATION FLOW

## Navigation

- Home
- Planner
- Focus
- Buddy
- Analytics
- Profile

## Planner Tabs

- List
- Kanban
- Calendar
- Notes

## First Time Journey

Landing → Continue as Guest → Dashboard → Create Task → Focus Session → Analytics

## Guest → Registered Journey

Guest works locally → clicks Register anytime (not just from landing) → local data uploads silently in the background → calm confirmation shown → lands on the same Dashboard with everything intact. A failed upload retries later rather than being discarded.

## Dashboard Components

- Greeting
- Productivity Cards
- Today's Tasks
- Upcoming Deadlines
- Quick Actions
- Lumi

## Focus Experience

1. Select task
2. Start Pomodoro
3. Complete session (or leave early → marked **Abandoned**, with a lightweight confirm dialog and no celebration animation)
4. Save automatically
5. Update analytics (Abandoned sessions excluded from streaks/focus minutes)

## Profile / Theme

Theme toggle (Light/Dark) applies instantly across every screen via `ThemeContext` — there is no per-page theme. Forgot Password is reachable from the Profile/Account section.

## Lumi Behaviour

| Event | Response |
|---|---|
| Login | Wave |
| Task Complete | Jump |
| Streak | Sparkles |
| Focus | Reads Book |
| Session Abandoned | Neutral encouragement, no celebration |
| Idle | Sleep |

---

# DOCUMENT 04 — UI/UX DESIGN SYSTEM

## Design Philosophy

Calm • Cozy • Premium

Inspired by Finch, Headspace, Notion, and Linear.

## Brand Palette (Light Mode)

| Role | Hex |
|---|---|
| Primary Sage | #6FAF8F |
| Mint | #A8D5BA |
| Soft Mint | #E8F3EC |
| Background | #F8FBF9 |
| Forest | #2F5D50 |
| Gold | #F6C453 |

## Text Color Rules

Body/heading text is never set directly in Sage, Mint, or Gold (they fail 4.5:1 contrast on Cream White as text). Use Forest Green `#2F5D50` for headings, Slate `#334155` for body text, Slate Muted `#64748B` for captions — Sage/Mint/Gold stay reserved for backgrounds, icons, and borders.

## Dark Mode Palette

Ships in the MVP alongside Light Mode, driven by CSS variables so the toggle is instant.

| Role | Dark Value |
|---|---|
| Background | Deep Forest `#131C18` |
| Card | Charcoal Sage `#1C2721` |
| Heading Text | Soft Mint `#E8F3EC` |
| Body Text | Fog `#C7D2CE` |
| Secondary Text | Muted Fog `#8CA39B` |
| Border | `#2B3833` |

Full token table lives in the standalone UI/UX doc, Section 3. Lumi's own colors do not change between themes.

## Typography

Font: Inter

- Hero: 40px
- H1: 32px
- H2: 24px
- Body: 16px

## Components

- Rounded Cards (20px)
- Soft Shadows
- Glassmorphism (adjusted opacity/rgba per theme — see UI/UX doc)
- Sage Primary Buttons
- Bottom Navigation (Mobile)
- Sidebar (Desktop)

## Lumi Character

A tiny glowing forest spirit that gently encourages the user without becoming distracting.

### Design Rules

- Bottom-right floating
- Draggable
- Hide option
- Minimal speech bubbles
- Calm animations only
- Never celebrates an abandoned focus session — only completed ones

---

# Final Product Vision

StudyFlow V2 is a production-style portfolio application demonstrating:

- React
- Tailwind CSS
- Node.js
- Express
- MySQL
- Cookie-based JWT Authentication
- REST APIs
- Automated Testing (Jest/Supertest/RTL)
- Responsive Design
- Light/Dark Theming
- Product Thinking
- Modern UI/UX
