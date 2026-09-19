
# StudyFlow V2 — Application Flow Document

Version: 2.0

Project: StudyFlow V2

Document Type: User Experience & Navigation Specification

Status: Final

# 1. Purpose

The App Flow document defines the complete navigation, screen hierarchy, user journeys, and interaction rules for StudyFlow.

Its purpose is to ensure:

* Every page has a clear responsibility.

* Navigation remains simple.

* Users never feel lost.

* Mobile, tablet, and desktop follow the same logic.

* Lumi behaves consistently across the application.

This document becomes the UX source of truth before UI design and development.

# 2. Primary Navigation Structure

StudyFlow contains 6 primary modules.

|
Navigation

|

Purpose

|
| --- | --- |
|

🏠 Home

|

Daily productivity dashboard

|
|

✅ Planner

|

Tasks, Kanban, Calendar & Notes

|
|

⏱ Focus

|

Pomodoro & study sessions

|
|

🌱 Buddy

|

Lumi interaction & encouragement

|
|

📊 Analytics

|

Productivity insights

|
|

👤 Profile

|

Account & preferences

|

> Important: Planner contains multiple views rather than separate pages because they represent the same task data.

# 3. Global User Journey

## First-Time Visitor

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20300%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22grad%22%20x1%3D%220%22%20x2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23A8D5BA%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%236FAF8F%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20x%3D%2240%22%20y%3D%2210%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%221%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2228%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3ELanding%20Page%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%2038%26%2310%3B%20%20%20%20%20%20%20%20%20%20V50%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2250%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%220.92%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2268%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EContinue%20as%20Guest%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%2078%26%2310%3B%20%20%20%20%20%20%20%20%20%20V90%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2290%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%220.92%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22108%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EDashboard%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%20118%26%2310%3B%20%20%20%20%20%20%20%20%20%20V130%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%22130%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%220.92%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22148%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3ECreate%20First%20Task%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%20158%26%2310%3B%20%20%20%20%20%20%20%20%20%20V170%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%22170%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%220.92%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22188%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EStart%20Focus%20Session%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%20198%26%2310%3B%20%20%20%20%20%20%20%20%20%20V210%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%22210%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%220.92%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22228%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EComplete%20Task%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%20238%26%2310%3B%20%20%20%20%20%20%20%20%20%20V250%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%22250%22%20width%3D%22240%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad\)%22%20opacity%3D%220.92%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22268%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23123524%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EAnalytics%20Updated%3C%2Ftext%3E%3C%2Fsvg%3E)

### Experience

1. User opens StudyFlow.

2. Sees the landing page.

3. Clicks Continue as Guest.

4. Enters the dashboard immediately.

5. Creates their first task.

6. Starts a Pomodoro.

7. Completes the task.

8. Analytics update automatically.

9. Lumi celebrates the achievement.

This journey should take under 2 minutes.

## Returning User Journey

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20180%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22grad2%22%20x1%3D%220%22%20x2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23E8F3EC%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23A8D5BA%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20x%3D%2255%22%20y%3D%2212%22%20width%3D%22210%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad2\)%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2230%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EOpen%20Website%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%2040%26%2310%3B%20%20%20%20%20%20%20%20%20%20V52%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2255%22%20y%3D%2252%22%20width%3D%22210%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad2\)%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2270%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3ELogin%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%2080%26%2310%3B%20%20%20%20%20%20%20%20%20%20V92%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2255%22%20y%3D%2292%22%20width%3D%22210%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad2\)%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22110%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EDashboard%3C%2Ftext%3E%3Cpath%20d%3D%22%26%2310%3B%20%20%20%20%20%20%20%20%20%20M160%20120%26%2310%3B%20%20%20%20%20%20%20%20%20%20V132%26%2310%3B%20%20%20%20%20%20%20%20%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2255%22%20y%3D%22132%22%20width%3D%22210%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22url\(%23grad2\)%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22150%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EResume%20Previous%20Tasks%3C%2Ftext%3E%3C%2Fsvg%3E)

Returning users continue exactly where they left off.

## Guest → Registered Journey

A guest who decides to create an account should never feel like they're "starting over."

1. Guest has been working locally — tasks, notes, streak already exist.

2. Guest clicks Register (available anytime from Navbar/Profile, not just the landing page).

3. Completes the registration form.

4. App silently uploads the local dataset in the background.

5. A brief, calm confirmation appears: "Your data has been saved to your new account."

6. Guest is now a Registered User, on the same Dashboard, with everything intact.

If upload fails, the app quietly keeps the local copy and retries the next time the user is online — it never tells the user their data is lost.

# 4. Information Architecture

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20260%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%2288%22%20y%3D%228%22%20width%3D%22144%22%20height%3D%2224%22%20rx%3D%228%22%20fill%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2224%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2210%22%20fill%3D%22%23fff%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EStudyFlow%3C%2Ftext%3E%3Crect%20x%3D%2216%22%20y%3D%2256%22%20width%3D%2292%22%20height%3D%2230%22%20rx%3D%228%22%20fill%3D%22%23E8F3EC%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%2262%22%20y%3D%2275%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EHome%3C%2Ftext%3E%3Crect%20x%3D%22114%22%20y%3D%2256%22%20width%3D%2292%22%20height%3D%2230%22%20rx%3D%228%22%20fill%3D%22%23E8F3EC%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2275%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EPlanner%3C%2Ftext%3E%3Crect%20x%3D%22212%22%20y%3D%2256%22%20width%3D%2292%22%20height%3D%2230%22%20rx%3D%228%22%20fill%3D%22%23E8F3EC%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22258%22%20y%3D%2275%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EFocus%3C%2Ftext%3E%3Crect%20x%3D%2216%22%20y%3D%22120%22%20width%3D%2292%22%20height%3D%2230%22%20rx%3D%228%22%20fill%3D%22%23E8F3EC%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%2262%22%20y%3D%22139%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EBuddy%3C%2Ftext%3E%3Crect%20x%3D%22114%22%20y%3D%22120%22%20width%3D%2292%22%20height%3D%2230%22%20rx%3D%228%22%20fill%3D%22%23E8F3EC%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22139%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EAnalytics%3C%2Ftext%3E%3Crect%20x%3D%22212%22%20y%3D%22120%22%20width%3D%2292%22%20height%3D%2230%22%20rx%3D%228%22%20fill%3D%22%23E8F3EC%22%20stroke%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22258%22%20y%3D%22139%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EProfile%3C%2Ftext%3E%3Cpath%20d%3D%22M160%2032%20V46%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%2046%20L62%2056%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%2046%20L160%2056%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%2046%20L258%2056%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%2096%20V108%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%20108%20L62%20120%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%20108%20L160%20120%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M160%20108%20L258%20120%22%20stroke%3D%22%236FAF8F%22%20stroke-dasharray%3D%224%204%22%20stroke-linecap%3D%22round%22%2F%3E%3Crect%20x%3D%2272%22%20y%3D%22190%22%20width%3D%22176%22%20height%3D%2252%22%20rx%3D%2210%22%20fill%3D%22%23F8FBF9%22%20stroke%3D%22%23A8D5BA%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22205%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EPlanner%20Internal%20Tabs%3C%2Ftext%3E%3Ctext%20x%3D%22160%22%20y%3D%22219%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%227%22%20fill%3D%22%23456%22%20text-anchor%3D%22middle%22%3EList%20%E2%80%A2%20Kanban%3C%2Ftext%3E%3Ctext%20x%3D%22160%22%20y%3D%22231%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%227%22%20fill%3D%22%23456%22%20text-anchor%3D%22middle%22%3ECalendar%20%E2%80%A2%20Notes%3C%2Ftext%3E%3C%2Fsvg%3E)

The Planner contains four internal tabs:

* List

* Kanban

* Calendar

* Notes

These are views, not independent pages.

# 5. Screen Specifications

## 5.1 Landing Page

### Purpose

Introduce the product and allow users to enter quickly.

### Sections

1. Navigation Bar

2. Hero Section

3. Features

4. Why StudyFlow?

5. Testimonials (placeholder)

6. Footer

### Primary Buttons

* Continue as Guest

* Login

* Create Account

### Success Action

User reaches Dashboard within one click.

## 5.2 Dashboard (Home)

The Dashboard is the emotional center of the application.

### Layout Structure

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20200%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20rx%3D%2218%22%20fill%3D%22%23F8FBF9%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Crect%20x%3D%2214%22%20y%3D%2212%22%20width%3D%22292%22%20height%3D%2226%22%20rx%3D%228%22%20fill%3D%22%23DCEFE3%22%2F%3E%3Ctext%20x%3D%2226%22%20y%3D%2229%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23234%22%20font-weight%3D%22bold%22%3EGood%20Morning%2C%20Kavi%20%F0%9F%91%8B%3C%2Ftext%3E%3Crect%20x%3D%2214%22%20y%3D%2248%22%20width%3D%2296%22%20height%3D%2242%22%20rx%3D%2210%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Crect%20x%3D%22112%22%20y%3D%2248%22%20width%3D%2296%22%20height%3D%2242%22%20rx%3D%2210%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Crect%20x%3D%22210%22%20y%3D%2248%22%20width%3D%2296%22%20height%3D%2242%22%20rx%3D%2210%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Ctext%20x%3D%2262%22%20y%3D%2261%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%227%22%20fill%3D%22%23567%22%20text-anchor%3D%22middle%22%3EToday's%20Tasks%3C%2Ftext%3E%3Ctext%20x%3D%2262%22%20y%3D%2278%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3E8%3C%2Ftext%3E%3Ctext%20x%3D%22160%22%20y%3D%2261%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%227%22%20fill%3D%22%23567%22%20text-anchor%3D%22middle%22%3EFocus%3C%2Ftext%3E%3Ctext%20x%3D%22160%22%20y%3D%2278%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3E2.5h%3C%2Ftext%3E%3Ctext%20x%3D%22258%22%20y%3D%2261%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%227%22%20fill%3D%22%23567%22%20text-anchor%3D%22middle%22%3EStreak%3C%2Ftext%3E%3Ctext%20x%3D%22258%22%20y%3D%2278%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3E%F0%9F%94%A5%207%3C%2Ftext%3E%3Crect%20x%3D%2214%22%20y%3D%22102%22%20width%3D%22292%22%20height%3D%2252%22%20rx%3D%2210%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Ctext%20x%3D%2226%22%20y%3D%22118%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23567%22%20font-weight%3D%22bold%22%3EUpcoming%20Deadline%3C%2Ftext%3E%3Ctext%20x%3D%2226%22%20y%3D%22134%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23234%22%3EDBMS%20Assignment%3C%2Ftext%3E%3Ctext%20x%3D%2226%22%20y%3D%22146%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%227%22%20fill%3D%22%23789%22%3ETomorrow%20%C2%B7%20High%20Priority%3C%2Ftext%3E%3Ccircle%20cx%3D%22284%22%20cy%3D%22170%22%20r%3D%2216%22%20fill%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22284%22%20y%3D%22174%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2210%22%20fill%3D%22%23fff%22%20text-anchor%3D%22middle%22%3E%F0%9F%8C%B1%3C%2Ftext%3E%3C%2Fsvg%3E)

### Components

|
Component

|

Description

|
| --- | --- |
|

Greeting

|

Personalized welcome

|
|

Stats Cards

|

Tasks, Focus Time, Streak

|
|

Upcoming Deadline

|

Highest priority task

|
|

Quick Actions

|

Add Task / Start Focus

|
|

Daily Quote

|

Motivational message

|
|

Lumi

|

Floating companion

|

### User Actions

* Add Task

* Open Planner

* Resume Focus

* View Analytics

## 5.3 Planner

The Planner is divided into four tabs.

### Tab 1 — List View

Purpose: Traditional task management.

#### Features

* Create task

* Edit

* Delete

* Complete

* Priority

* Due date

* Subject

* Estimated time

* Search

* Filter

### Tab 2 — Kanban

Purpose: Visual workflow.

Columns:

* To Do

* In Progress

* Completed

Interactions:

* Drag & Drop

* Smooth animations

* Status auto-update

### Tab 3 — Calendar

Purpose: Time-based planning.

Features:

* Month view

* Week view

* Click date

* Deadline indicators

* Subject colors

### Tab 4 — Notes

Purpose: Subject-wise note taking.

Features:

* Rich editor

* Checklist

* Tags

* Auto save

* Search

# 6. Focus Mode

Focus Mode should remove unnecessary UI.

### Layout

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20180%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20rx%3D%2218%22%20fill%3D%22%23F8FBF9%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2224%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2211%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EFocus%20Mode%3C%2Ftext%3E%3Ccircle%20cx%3D%22160%22%20cy%3D%2284%22%20r%3D%2242%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%236FAF8F%22%20stroke-width%3D%224%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2282%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23234%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3E25%3A00%3C%2Ftext%3E%3Ctext%20x%3D%22160%22%20y%3D%2294%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%226%22%20fill%3D%22%23567%22%20text-anchor%3D%22middle%22%3EDBMS%20Assignment%3C%2Ftext%3E%3Crect%20x%3D%22100%22%20y%3D%22136%22%20width%3D%22120%22%20height%3D%2228%22%20rx%3D%2214%22%20fill%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22153%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%23fff%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3E%E2%96%B6%20Start%3C%2Ftext%3E%3Ccircle%20cx%3D%22278%22%20cy%3D%22148%22%20r%3D%2214%22%20fill%3D%22%23DCEFE3%22%2F%3E%3Ctext%20x%3D%22278%22%20y%3D%22152%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%229%22%20text-anchor%3D%22middle%22%3E%F0%9F%8C%B1%3C%2Ftext%3E%3C%2Fsvg%3E)

### During Focus Session

Lumi changes behavior:

* Sits with a book 📖

* Stops giving messages

* Sleeps during breaks

This prevents distraction.

### Leaving a Session Early

If the user clicks Stop, closes the tab, or navigates away before the timer ends:

1. A lightweight confirmation appears: "End this session early?"

2. Confirming marks the session **Abandoned** — elapsed minutes are saved to history, but the session does not count toward streaks or focus-minute analytics.

3. Lumi does not celebrate an abandoned session; it gives a neutral, encouraging line instead ("Every bit counts 🌱") rather than the completion animation.

# 7. Buddy Module

## Lumi

Lumi is the emotional identity of StudyFlow.

### Default Position

* Bottom-right

* Floating

* Draggable

* Hide button

### Interaction Flow

|
User Action

|

Lumi Response

|
| --- | --- |
|

Opens app

|

Waves 👋

|
|

Creates task

|

Smiles 😊

|
|

Completes task

|

Jumps ✨

|
|

5-day streak

|

Celebrates 🎉

|
|

Idle 30 min

|

Falls asleep 😴

|

### Speech Bubble Rules

Speech appears for 3–4 seconds only.

Examples:

> "Let's finish one task 🌱"

> "You're closer than yesterday."

> "Time for a short break."

No long conversations.

# 8. Analytics Flow

Analytics are generated automatically from user activity.

### Inputs

* Tasks completed

* Focus sessions

* Study duration

* Streak

* Subject categories

### Outputs

* Weekly chart

* Completion rate

* Productivity score

* Study consistency

* Subject breakdown

Users never manually enter analytics.

# 9. Profile Flow

Profile contains:

### Personal

* Name

* Avatar

* College

* Semester

### Preferences

* Theme (Light / Dark toggle — instant switch, no page reload)

* Daily goal

* Notifications

* Lumi visibility

### Account

* Login status

* Change password / Forgot password link

* Logout

* Delete account (future)

Theme changes apply immediately across every screen (dashboard, planner, kanban, calendar, focus, analytics) since they all read from the same `ThemeContext` — there is no per-page theme.

# 10. Responsive Navigation

## Mobile

* Bottom navigation

* Hamburger for settings

* One-column cards

## Tablet

* Two-column dashboard

* Compact sidebar

* Wider planner

## Desktop

* Left sidebar

* Multi-column layout

* Expanded analytics

Navigation logic remains identical across devices.

# 11. Empty States

Beautiful empty states improve UX.

|
Module

|

Message

|
| --- | --- |
|

Planner

|

"Your study journey starts here 🌱"

|
|

Notes

|

"Every idea deserves a home."

|
|

Analytics

|

"Complete one focus session to unlock insights."

|
|

Calendar

|

"No events scheduled yet."

|

Never show blank pages.

# 12. Micro-interactions

|
Interaction

|

Animation

|
| --- | --- |
|

Button Hover

|

Scale 0.98

|
|

Card Hover

|

Lift + Shadow

|
|

Task Complete

|

Check burst

|
|

Kanban Drop

|

Smooth slide

|
|

Calendar Select

|

Fade highlight

|
|

Lumi Click

|

Gentle bounce

|

Animations should feel soft and natural.

# 13. UX Principles

### Principle 1

One primary action per screen.

Example:

Dashboard → Add Task

Focus → Start Timer

Analytics → Review Progress

### Principle 2

Three-click rule

Every important feature must be reachable within three interactions.

### Principle 3

Calm over clutter

Avoid excessive icons, notifications, and colors.

Whitespace is intentional.

# 14. End-to-End Experience

A complete study session should feel like this:

1. Open StudyFlow

2. Lumi waves hello

3. Check today's tasks

4. Create a new assignment

5. Schedule it on the calendar

6. Start a Pomodoro

7. Finish the task

8. Lumi celebrates

9. Analytics update automatically

10. End the day with a higher streak

This emotional journey is what differentiates StudyFlow from a typical task management application.