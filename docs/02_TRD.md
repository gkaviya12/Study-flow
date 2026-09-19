# StudyFlow V2 — Technical Requirements Document (TRD)

Version: 2.0

Project Type: Full-Stack Responsive Web Application

Status: Final

# 1. Technical Overview

## Objective

Build StudyFlow V2 as a scalable, maintainable full-stack web application using modern web technologies.

The application must prioritize:

* Clean architecture

* Reusable components

* Responsive design

* Secure authentication

* RESTful APIs

* Modular code structure

This is a production-style portfolio project, not a single-page college application.

# 2. Technology Stack

## Frontend

|
Technology

|

Purpose

|
| --- | --- |
|

React 19

|

UI Framework

|
|

Vite

|

Development & Build Tool

|
|

Tailwind CSS

|

Styling System

|
|

React Router DOM

|

Navigation

|
|

Axios

|

API Communication

|
|

Lucide React

|

Icons

|
|

Chart.js

|

Analytics Visualization

|

### Why React?

* Component-based architecture

* Reusable UI

* Easier state management

* Industry standard for frontend roles

## Backend

|
Technology

|

Purpose

|
| --- | --- |
|

Node.js

|

JavaScript Runtime

|
|

Express.js

|

REST API Framework

|
|

JWT

|

Authentication

|
|

bcrypt

|

Password Encryption

|
|

dotenv

|

Environment Variables

|
|

cors

|

Cross-Origin Requests

|
|

mysql2

|

Database Driver

|
|

cookie-parser

|

Reads httpOnly JWT cookie

|
|

express-validator

|

Request input validation

|
|

express-rate-limit

|

Basic API rate limiting

|
|

helmet

|

Secure HTTP headers

|

### Why Express?

* Lightweight

* REST-friendly

* Easy integration with React

* Excellent portfolio value

## Database

|
Technology

|

Purpose

|
| --- | --- |
|

MySQL

|

Relational Database

|

Database will store:

* Users

* Subjects

* Tasks

* Notes

* Focus Sessions

* Analytics is **derived** from Tasks/Focus Sessions at query time, not stored as its own duplicate table, to avoid sync drift.

### Core Schema Sketch

```sql
Users
  id (PK)
  name
  email (unique)
  password_hash
  college
  semester
  study_goal
  theme            -- 'light' | 'dark'
  lumi_visible     -- boolean
  reset_token
  reset_token_expires
  created_at

Subjects
  id (PK)
  user_id (FK -> Users.id)
  name
  color
  created_at

Tasks
  id (PK)
  user_id (FK -> Users.id)
  subject_id (FK -> Subjects.id, nullable)
  title
  category         -- Assignment | Exam | Placement | Personal | Project
  priority         -- Low | Medium | High
  status           -- todo | in_progress | completed
  due_date
  estimated_minutes
  recurrence       -- none | daily | weekly | weekdays
  recurrence_parent_id (FK -> Tasks.id, nullable) -- links generated occurrences
  completed_at
  created_at

Notes
  id (PK)
  user_id (FK -> Users.id)
  subject_id (FK -> Subjects.id, nullable)
  title
  content
  updated_at

FocusSessions
  id (PK)
  user_id (FK -> Users.id)
  task_id (FK -> Tasks.id, nullable)
  status           -- in_progress | completed | abandoned
  planned_minutes
  elapsed_minutes
  started_at
  ended_at
```

This is a starting point, not a locked-in migration — `database/schema.sql` should mirror it exactly so Claude Code has one source of truth.

# 3. System Architecture

## High-Level Architecture

```
                 USER
                  │
            React Frontend
                  │
             Axios Requests
                  │
          Express REST API
                  │
        Authentication Layer
                  │
              MySQL Database
```

## Request Lifecycle

```
User clicks "Create Task"

        │

React Form Validation

        │

POST /api/tasks

        │

Express Controller

        │

MySQL INSERT

        │

JSON Response

        │

React Updates UI
```

Every feature follows this lifecycle.

# 4. Project Folder Structure

The repository will follow a monorepo structure.

```
studyflow-v2/

│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── context/
│       ├── services/
│       ├── utils/
│       ├── routes/
│       └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── docs/
```

# 5. Frontend Architecture

## Pages

```
pages/

LandingPage
LoginPage
RegisterPage

DashboardPage
PlannerPage
FocusPage
BuddyPage
AnalyticsPage
ProfilePage
```

Each page is responsible only for layout.

Business logic belongs inside hooks or services.

## Components

Reusable components only.

```
components/

Navbar
Sidebar
TaskCard
StatCard
Calendar
KanbanBoard
PomodoroTimer
Lumi
Modal
Button
Input
EmptyState
```

### Rule

A component should have one responsibility only.

Example:

* `TaskCard` → Displays task

* `TaskModal` → Creates/Edits task

Never combine both.

# 6. Backend Architecture

```
routes
      │
controllers
      │
models
      │
database
```

Example:

```
GET /api/tasks

↓

TaskRoute

↓

TaskController

↓

TaskModel

↓

MySQL
```

Controllers contain business logic.

Models contain database queries.

Routes contain endpoints only.

# 7. Authentication Strategy

StudyFlow supports two modes.

## Mode 1 — Guest

```
Landing

↓

Continue as Guest

↓

Local Storage Session

↓

Dashboard
```

Guest users:

* No account

* No database

* Temporary storage

* Full demo access

Purpose:

Recruiters can test instantly.

## Mode 2 — Registered User

```
Register

↓

Hash Password

↓

Save User

↓

Migrate Guest Data (if any)

↓

Login

↓

Generate JWT → Set as httpOnly Cookie

↓

Protected Dashboard
```

### JWT Storage Decision

The JWT is issued by the server and set as an **httpOnly, Secure, SameSite=Lax cookie** — never stored in localStorage or exposed to client-side JavaScript. This protects the token from XSS-based theft.

Implications:

* `cookie-parser` reads the token on incoming requests.

* `axios` calls must use `withCredentials: true`.

* `cors` must set `credentials: true` and an explicit (non-wildcard) `origin` matching `CLIENT_URL`.

* Logout clears the cookie server-side (`res.clearCookie`) rather than the client deleting a token it can't see.

Protected routes require authentication via a middleware that reads and verifies this cookie on every request.

### Guest → Registered Data Migration

On successful registration, the client sends its local dataset (tasks, notes, focus history, goals) in a single request:

```
POST /api/auth/migrate-guest-data
```

The server assigns every record to the new `userId` in one transaction. Local storage is only cleared after the server confirms success. If the request fails, local data is kept and the client retries on the next login.

# 8. State Management

We will use React Context API.

## Context Structure

```
AuthContext

TaskContext

SubjectContext

ThemeContext

BuddyContext
```

### AuthContext

Stores:

* user

* isGuest

* login()

* logout()

* migrateGuestData()

Note: the JWT itself is never held in React state — it lives only in the httpOnly cookie. `AuthContext` tracks the *authenticated user object*, not the token.

### TaskContext

Stores:

* tasks

* createTask()

* updateTask()

* deleteTask()

### SubjectContext

Stores:

* subjects (user-managed list, shared by Planner, Notes, Analytics)

* createSubject()

* updateSubject()

* deleteSubject()

### ThemeContext

Stores:

* theme (`light` | `dark`)

* toggleTheme()

Persistence: guests get theme saved to `localStorage`; registered users get it saved to their profile via `PUT /api/users/profile` so it follows them across devices.

No Redux is required.

# 9. API Design

Base URL

```
/api
```

## Authentication

|
Method

|

Endpoint

|

Notes

|
| --- | --- | --- |
|

POST

|

`/auth/register`

|

Hashes password, creates user

|
|

POST

|

`/auth/login`

|

Sets httpOnly JWT cookie

|
|

POST

|

`/auth/logout`

|

Clears the JWT cookie

|
|

POST

|

`/auth/forgot-password`

|

Sends reset link/token via email

|
|

POST

|

`/auth/reset-password`

|

Consumes reset token, sets new password

|
|

GET

|

`/auth/profile`

|

Returns current user

|
|

PUT

|

`/auth/profile`

|

Update profile, theme, Lumi visibility

|
|

POST

|

`/auth/migrate-guest-data`

|

One-time bulk import of local guest data after registration

|

## Subjects

|
Method

|

Endpoint

|
| --- | --- |
|

GET

|

`/subjects`

|
|

POST

|

`/subjects`

|
|

PUT

|

`/subjects/:id`

|
|

DELETE

|

`/subjects/:id`

|

## Tasks

|
Method

|

Endpoint

|

Notes

|
| --- | --- | --- |
|

GET

|

`/tasks`

|

Supports `?status=`, `?subjectId=`, `?page=`, `?limit=` query params

|
|

POST

|

`/tasks`

|

Accepts optional `recurrence` (`none` \| `daily` \| `weekly` \| `weekdays`)

|
|

PUT

|

`/tasks/:id`

|

Editing a recurring task only affects future occurrences

|
|

DELETE

|

`/tasks/:id`

|

|

## Notes

|
Method

|

Endpoint

|

Notes

|
| --- | --- | --- |
|

GET

|

`/notes`

|

Supports `?subjectId=`, `?page=`, `?limit=`

|
|

POST

|

`/notes`

|

|
|

PUT

|

`/notes/:id`

|

Auto-save calls this on debounce

|
|

DELETE

|

`/notes/:id`

|

|

## Focus

|
Method

|

Endpoint

|

Notes

|
| --- | --- | --- |
|

POST

|

`/focus/start`

|

Creates an in-progress session

|
|

POST

|

`/focus/complete`

|

Marks session complete, updates analytics

|
|

POST

|

`/focus/abandon`

|

Marks session abandoned; elapsed minutes saved but excluded from streaks/analytics

|
|

GET

|

`/focus/history`

|

|

## Analytics

|
Method

|

Endpoint

|

Notes

|
| --- | --- | --- |
|

GET

|

`/analytics`

|

Supports `?range=week\|month\|all` for the charts

|

## Input Validation

Every `POST`/`PUT` route validates its body with `express-validator` before it reaches the controller. Invalid input returns the standard error format (Section 12) with a `400` status and a field-level message.

# 10. Coding Standards

## Naming Convention

|
Item

|

Convention

|
| --- | --- |
|

Components

|

PascalCase

|
|

Functions

|

camelCase

|
|

Variables

|

camelCase

|
|

Constants

|

UPPER_SNAKE_CASE

|
|

Files

|

PascalCase

|

Example:

```
TaskCard.jsx

DashboardPage.jsx

createTask()

API_BASE_URL
```

## CSS Rules

Tailwind only.

Avoid custom CSS unless:

* Animation

* Keyframes

* Glass effect

Never mix Bootstrap.

## Git Branch Strategy

```
main

develop

feature/dashboard

feature/planner

feature/lumi
```

Every feature gets its own branch.

Example commits:

```
feat: create dashboard layout

feat: implement kanban board

fix: resolve calendar rendering

style: improve mobile responsiveness
```

# 11. Responsive Strategy

StudyFlow follows Mobile First.

## Breakpoints

|
Device

|

Width

|

Layout

|
| --- | --- | --- |
|

Mobile

|

320–639

|

1 column

|
|

Tablet

|

640–1023

|

2 columns

|
|

Desktop

|

1024+

|

4 columns

|

Example Tailwind:

HTML

```
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

Never create separate mobile pages.

One codebase serves all devices.

# 12. Error Handling

Every API must return:

JSON

```
{
  "success": true,
  "message": "Task created successfully",
  "data": {}
}
```

Error format:

JSON

```
{
  "success": false,
  "message": "Unauthorized"
}
```

Consistent responses across the application.

# 13. Environment Variables

```
PORT=

NODE_ENV=

DB_HOST=

DB_USER=

DB_PASSWORD=

DB_NAME=

JWT_SECRET=

COOKIE_NAME=

CLIENT_URL=

SMTP_HOST=

SMTP_USER=

SMTP_PASSWORD=

RESET_TOKEN_EXPIRY_MINUTES=
```

`NODE_ENV=production` enables the `Secure` flag on the JWT cookie (cookies are only sent over HTTPS in production; `Secure` is omitted in local dev over HTTP).

SMTP vars power the Forgot Password email; any free-tier transactional email provider (e.g., Resend, Mailtrap for dev) works.

Never hardcode credentials.

`.env` is ignored in Git.

# 14. Performance Requirements

## Target

|
Metric

|

Goal

|
| --- | --- |
|

First Load

|

< 2 sec

|
|

API Response

|

< 300 ms

|
|

Lighthouse

|

90+

|
|

Accessibility

|

90+

|

Optimization:

* Lazy loading

* Image optimization

* Component memoization where necessary

# 15. Security Requirements

* Passwords hashed using bcrypt

* JWT authentication delivered via httpOnly, Secure, SameSite=Lax cookie (never localStorage)

* Protected routes verified through cookie-reading middleware

* SQL parameterized queries

* Request body validation on every write endpoint (`express-validator`)

* Basic rate limiting on `/auth/*` routes (`express-rate-limit`) to slow brute-force attempts

* Secure HTTP headers via `helmet`

* No sensitive data stored in frontend

* Environment variables for secrets

# 15a. Testing Strategy

## Backend

* Unit tests (Jest) for controllers and models, focused on task/auth/focus business logic

* Supertest for HTTP-level endpoint tests

* A maintained Postman collection covering every endpoint in Section 9, used both manually and exported for the Definition of Done check

## Frontend

* Jest + React Testing Library for core interactive components: `TaskCard`, `PomodoroTimer`, `KanbanBoard`, `AuthContext`

* Focus on behavior (does clicking "Complete" update state?) over snapshot testing

## Scope

Full coverage isn't the goal for a portfolio project — tests exist to (a) prove the harder logic (recurrence generation, streak calculation, focus session state transitions) actually works, and (b) give recruiters something concrete to look at in the repo.

# 15b. Deployment Architecture

```
Frontend (React/Vite)   →  Vercel
Backend (Node/Express)  →  Render or Railway (free tier)
Database (MySQL)        →  Railway MySQL or Aiven (free tier)
```

* Frontend and backend are deployed independently; `CLIENT_URL` and `VITE_API_BASE_URL` point them at each other per environment.

* Because the JWT is an httpOnly cross-origin cookie, the backend's CORS config must set `credentials: true` with an explicit origin — a wildcard `*` origin will silently break cookie auth in production.

* Environment variables are set in each platform's dashboard, never committed to Git.

# 16. Accessibility

Every screen must support:

* Keyboard navigation

* Focus indicators

* Screen readers

* 44×44 touch targets

* Proper semantic HTML

# 17. Definition of Done

A feature is complete only if:

* UI matches design system

* Works on Mobile

* Works on Tablet

* Works on Desktop

* API tested in Postman

* No console errors

* Git commit created

* Responsive verified

* Code follows naming conventions

# 18. Technical Constraints

* React only

* JavaScript (No TypeScript)

* Tailwind CSS

* Node + Express

* MySQL

* JWT Authentication

* REST API

* Free-tier deployment

* Modular architecture

# 19. Future Scalability

The architecture should allow future additions without major refactoring.

Planned future modules:

* AI Study Mentor

* Notifications

* Google Calendar Sync

* PDF Reports

* Email Service

* Cloud File Storage