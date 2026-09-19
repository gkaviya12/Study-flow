# StudyFlow V2 — Product Requirements Document (PRD)

Document Version: 2.0

Project Type: Full-Stack Responsive Web Application

Project Codename: StudyFlow V2

Status: Final Draft

# 1. Executive Summary

## Product Name

StudyFlow V2

## Tagline

> Plan Smarter. Focus Deeper. Learn Better.

## Product Vision

StudyFlow is a premium productivity platform designed specifically for students. Instead of using separate applications for task management, calendars, Pomodoro timers, notes, and productivity tracking, StudyFlow brings everything together into one calm, beautiful, and intelligent workspace.

The application prioritizes focus over distraction by combining modern productivity tools with a gentle virtual companion called Lumi, a tiny forest spirit that encourages users throughout their study journey.

The goal is to create a product that feels less like a task manager and more like a supportive study environment.

# 2. Problem Statement

Students constantly switch between multiple applications during study sessions.

A typical workflow today looks like:

|
Need

|

Current App

|
| --- | --- |
|

Assignments

|

To-do App

|
|

Timetable

|

Google Calendar

|
|

Notes

|

Notes App

|
|

Focus

|

Pomodoro App

|
|

Progress

|

Nothing / Excel

|

This fragmented workflow causes:

* Loss of concentration

* Missed deadlines

* Poor habit tracking

* Unorganized academic planning

* Increased cognitive load

### Our Solution

StudyFlow becomes a single academic operating system where students can:

* Organize tasks

* Plan schedules

* Focus deeply

* Track productivity

* Build consistent habits

* Receive encouragement through Lumi

# 3. Product Goals

## Primary Goal

Build a portfolio-grade full-stack web application that demonstrates professional software engineering practices while solving a genuine productivity problem.

## Business Goal

Although this is a portfolio project, it should be designed like a real SaaS product with scalable architecture.

## User Goal

Help students study with less stress and more consistency.

# 4. Target Audience

## Primary Persona

### Kavi (Engineering Student)

Age: 21

Education: Engineering Student

Devices: Laptop + Mobile

Goals

* Complete assignments on time

* Prepare for placements

* Track study hours

* Stay motivated

* Build consistency

Pain Points

* Too many apps

* Forgetting deadlines

* Poor planning

* Easily distracted

## Secondary Persona

### University Student

Needs:

* Semester planner

* Subject-wise organization

* Weekly progress reports

* Calendar scheduling

# 5. Value Proposition

StudyFlow is different from ordinary to-do applications because it combines productivity with emotional design.

### Instead of:

* Cold dashboards

* Corporate interfaces

* Complex project management

StudyFlow provides:

* Calm UI

* Nature-inspired colors

* Friendly interactions

* Study-focused features

* Virtual companion

# 6. Core Features (MVP)

These features are mandatory for Version 2.0.

## 6.1 Authentication

### Purpose

Allow users to either continue instantly or create a permanent account.

### Features

* Register

* Login

* Logout

* Forgot / Reset Password

* Guest Mode

* JWT Authentication (httpOnly cookie session)

### Guest Mode

Guest users can access almost every feature without creating an account.

Guest data is stored locally.

This is intentionally included so recruiters can test the application immediately.

### Guest → Registered Migration

When a guest creates an account, their local data (tasks, notes, focus history, goals) is **automatically migrated** to their new account — nothing is lost.

Flow:

1. Guest has been using the app locally (tasks, notes, streak, etc. in localStorage).

2. Guest clicks Register and completes account creation.

3. On successful registration, the client uploads the local dataset in one batch request.

4. Server assigns all migrated records to the new `userId`.

5. Local storage is cleared once migration is confirmed by the server.

6. User lands on the Dashboard and sees all their guest-era data already there.

If migration fails (network issue, etc.), local data is preserved and retried on next login rather than silently discarded.

## 6.2 Dashboard

### Purpose

Provide a complete overview of today's productivity.

### Components

* Personalized greeting

* Current date

* Daily quote

* Productivity score

* Study streak

* Focus minutes

* Upcoming deadlines

* Today's schedule

* Quick action buttons

* Lumi companion

### User Actions

* Add task

* Resume focus session

* Open planner

* View analytics

## 6.3 Smart Planner

The planner is the heart of the application.

### Features

* Create task

* Edit task

* Delete task

* Mark complete

* Priority

* Categories

* Subjects

* Due date

* Estimated duration

* Recurring tasks

* Search

* Filters

### Priority Levels

* High

* Medium

* Low

### Categories

Examples:

* Assignment

* Exam

* Placement

* Personal

* Project

### Subjects

Subjects are a first-class, user-managed list (not a hardcoded dropdown).

* Users can add, rename, and remove their own subjects (e.g., "DBMS", "Placement DSA").

* Subjects are shared across Planner, Notes, and Analytics — a subject created in one place is available everywhere.

* Each subject can optionally have a color, used consistently across Kanban, Calendar, and Analytics charts.

### Recurring Tasks — Scope Note

Recurring tasks are simplified for V2 to keep scope realistic:

* Supported patterns: Daily, Weekly, Weekdays only.

* A recurring task generates its next occurrence automatically once the current one is marked complete or its due date passes.

* Editing a recurring task only affects future occurrences, never past completed ones.

* Advanced recurrence (custom intervals, monthly, end-date rules) is deferred to Version 2.1.

## 6.4 Kanban Board

A visual representation of the planner.

### Columns

* To Do

* In Progress

* Completed

### Features

* Drag & Drop

* Status updates

* Animated transitions

The Kanban board displays the same tasks created in Planner.

## 6.5 Calendar

### Views

* Month

* Week

* Agenda

### Features

* Deadline indicators

* Colored priority dots

* Click date

* View tasks

* Navigate months

The calendar is another visualization of planner data.

## 6.6 Focus Mode

### Purpose

Create a distraction-free study experience.

### Components

* Pomodoro Timer

* Short Break

* Long Break

* Current Task

* Session Counter

* Background ambience (future)

### Default Times

|
Session

|

Minutes

|
| --- | --- |
|

Focus

|

25

|
|

Short Break

|

5

|
|

Long Break

|

15

|

Every completed session contributes to analytics.

### Interrupted Sessions

If a user navigates away, closes the tab, or manually stops a session before it finishes:

* The session is marked **Abandoned**, not Completed.

* Abandoned sessions do not count toward focus-minute analytics or streaks.

* Partial progress (elapsed minutes) is still saved to Focus History for the user's own reference.

## 6.7 Notes

### Features

* Rich text

* Checklist

* Subject tags

* Auto save

* Search

Notes are linked to subjects rather than individual tasks.

## 6.8 Analytics

### Metrics

* Weekly study hours

* Daily focus time

* Completed tasks

* Pending tasks

* Productivity score

* Study streak

* Subject distribution

### Charts

* Line chart

* Donut chart

* Weekly bar graph

## 6.9 Profile

### Information

* Name

* College

* Semester

* Study goal

* Theme (Light / Dark)

* Lumi visibility preference (Hide/Show)

* Account settings

Theme preference is saved locally for guests and synced to the account for registered users, so it persists across devices.

# 7. Lumi — The Study Buddy

Lumi is not an AI chatbot.

Lumi is a tiny virtual companion that lives inside StudyFlow.

## Character Purpose

Instead of notifications feeling robotic, Lumi communicates with personality.

### Personality Traits

* Gentle

* Calm

* Curious

* Encouraging

* Never distracting

### Behaviors

|
Event

|

Lumi Action

|
| --- | --- |
|

Login

|

Waves

|
|

Task Complete

|

Happy Jump

|
|

7 Day Streak

|

Celebration

|
|

Focus Session

|

Reads a Book

|
|

User Idle

|

Sleeps

|
|

Hover

|

Smiles

|

### Design Rules

* Bottom-right floating position

* Draggable

* Hide/Show option

* Never blocks UI

* Small speech bubbles only

Example messages:

> "One task at a time 🌱"

> "You're doing great."

> "Ready for another focus session?"

# 8. Responsive Experience

StudyFlow is one responsive web application.

## Mobile

* Bottom navigation

* One-column layout

* Floating Lumi

## Tablet

* Two-column dashboard

* Expanded planner

* Larger calendar

## Desktop

* Sidebar navigation

* Multi-column analytics

* Wider workspace

No separate mobile application will be developed.

# 9. Functional Requirements

|
ID

|

Requirement

|
| --- | --- |
|

FR-01

|

User can register

|
|

FR-02

|

User can login

|
|

FR-03

|

User can continue as guest

|
|

FR-04

|

User can CRUD tasks

|
|

FR-05

|

Drag tasks in Kanban

|
|

FR-06

|

Calendar reflects tasks

|
|

FR-07

|

Pomodoro saves sessions

|
|

FR-08

|

Notes auto-save

|
|

FR-09

|

Analytics update automatically

|
|

FR-10

|

Lumi reacts to user actions

|

# 10. Non-Functional Requirements

### Performance

* Initial load under 2 seconds

* Lazy loading where necessary

### Security

* Password hashing

* JWT authentication

* Protected API routes

### Accessibility

* Keyboard navigation

* Screen reader labels

* 44×44 touch targets

* High contrast

### Responsiveness

Must support:

* Mobile

* Tablet

* Desktop

### Testing

* Backend: unit tests for controllers/models, Postman collection covering every endpoint

* Frontend: component tests for core interactive components (TaskCard, PomodoroTimer, KanbanBoard)

* Manual cross-device QA pass before each release, per the Definition of Done in the TRD

### Deployment

* Frontend deployed on Vercel

* Backend deployed on Render or Railway (free tier)

* MySQL hosted on a free-tier managed provider (e.g., Railway MySQL or Aiven)

* Environment variables managed per-environment, never committed to Git

# 11. Version Roadmap

## Version 2.0 (MVP)

* Authentication

* Dashboard

* Planner

* Kanban

* Calendar

* Focus Mode

* Notes

* Analytics

* Lumi

## Version 2.1

* AI Study Mentor

* Personalized study plans

* PDF reports

* Email reminders

* Google Calendar integration

# 12. Success Criteria

A recruiter should be able to:

1. Open the Vercel website.

2. Click Continue as Guest.

3. Create a task.

4. Move it in Kanban.

5. View it on Calendar.

6. Start a Pomodoro.

7. Complete the task.

8. Watch Lumi celebrate.

9. See analytics update.

If these actions feel smooth, intuitive, and visually premium, StudyFlow achieves its MVP vision.