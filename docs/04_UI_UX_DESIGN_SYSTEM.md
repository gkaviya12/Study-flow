
# StudyFlow V2 — UI/UX Design System

Version: 2.0

Project: StudyFlow V2

Design Language: Aurora Sage

Status: Final

# 1. Design Philosophy

## Vision

StudyFlow should feel like a peaceful digital study space, not a corporate productivity dashboard.

The experience should reduce stress the moment a student opens the app.

### Three words that define StudyFlow

* 🌿 Calm

* ✨ Cozy

* 📚 Focused

### Inspiration

* Finch (emotional companion)

* Headspace (calm experience)

* Notion (clean layouts)

* Linear (premium interface)

Our goal is not to copy, but to combine their strengths into a unique student-focused product.

# 2. Brand Identity

## Product Personality

|
Trait

|

Meaning

|
| --- | --- |
|

Calm

|

Soft colors & whitespace

|
|

Friendly

|

Lumi interactions

|
|

Premium

|

Glassmorphism + rounded UI

|
|

Minimal

|

No visual clutter

|
|

Motivational

|

Encouraging, never overwhelming

|

### Brand Tagline

> Plan Smarter. Focus Deeper. Learn Better.

# 3. Color System

## Primary Palette

These colors define the StudyFlow brand.

|
Color

|

Hex

|

Usage

|
| --- | --- | --- |
|

Sage Green

|

`#6FAF8F`

|

Primary buttons

|
|

Mint Sage

|

`#A8D5BA`

|

Hover states

|
|

Soft Mint

|

`#E8F3EC`

|

Background highlights

|
|

Cream White

|

`#F8FBF9`

|

Main background

|
|

Forest Green

|

`#2F5D50`

|

Headings

|

### Usage Guidelines

* Primary CTA → Sage Green

* Card backgrounds → White

* Main page → Cream White

* Success → Green

* Warning → Gold

* Error → Coral Red

## Accent Colors

|
Purpose

|

Color

|
| --- | --- |
|

Achievement

|

Warm Gold `#F6C453`

|
|

Love/Hearts

|

Blush Pink `#FF8FA3`

|
|

Danger

|

Coral `#EF6B6B`

|
|

Information

|

Sky Blue `#60A5FA`

|

These colors should appear sparingly.

## Text Color Rules (Contrast Safety)

The brand palette is intentionally soft, which means body text must **never** be set directly in Sage, Mint, or Gold — those pass fine as backgrounds or icons but fail 4.5:1 contrast as text on Cream White. Use this mapping instead:

|
Text Role

|

Color

|

On Background

|
| --- | --- | --- |
|

Heading

|

Forest Green `#2F5D50`

|

Cream White / White

|
|

Body Text

|

Slate `#334155`

|

Cream White / White

|
|

Secondary / Caption Text

|

Slate Muted `#64748B`

|

Cream White / White

|
|

Text on Sage Button

|

White `#FFFFFF`

|

Sage Green

|
|

Text on Gold Badge

|

Forest Green `#2F5D50`

|

Gold `#F6C453`

|

Sage, Mint, and Gold stay reserved for backgrounds, icons, borders, and illustrations — not for text a user has to read.

## Dark Mode Palette

StudyFlow ships with Light and Dark themes from day one (`ThemeContext` is part of the MVP, not a future add-on). Dark mode keeps the same Aurora Sage identity, just inverted for low-light comfort.

|
Role

|

Light Mode

|

Dark Mode

|
| --- | --- | --- |
|

Background

|

Cream White `#F8FBF9`

|

Deep Forest `#131C18`

|
|

Card Background

|

White `#FFFFFF`

|

Charcoal Sage `#1C2721`

|

Primary (buttons/accents)

|

Sage Green `#6FAF8F`

|

Sage Green `#6FAF8F` (unchanged — already passes contrast on dark)

|

Hover

|

Mint Sage `#A8D5BA`

|

Bright Mint `#8FD6AE`

|

Heading Text

|

Forest Green `#2F5D50`

|

Soft Mint `#E8F3EC`

|

Body Text

|

Slate `#334155`

|

Fog `#C7D2CE`

|

Secondary Text

|

Slate Muted `#64748B`

|

Muted Fog `#8CA39B`

|

Border

|

`#D5E8DB`

|

`#2B3833`

|

Shadow

|

Soft Sage shadow, 0.16 opacity

|

Black shadow, 0.4 opacity (softer glow, more elevation needed on dark)

|

Rules:

* Every color token above must be a CSS variable (e.g., `--bg-primary`, `--text-heading`) so components never hardcode a hex value directly — this is what makes the toggle instant and total.

* Glassmorphism cards in dark mode use `rgba(28, 39, 33, 0.8)` instead of white at 80% opacity, so the glass effect still reads as "glass" rather than "washed out."

* Lumi's colors (cream body, sage hoodie) stay the same in both themes — the companion is a fixed brand element, not themed.

# 4. Typography

## Font Family

Inter

Reason:

* Excellent readability

* Modern SaaS appearance

* Free & web optimized

## Type Scale

|
Style

|

Size

|

Weight

|
| --- | --- | --- |
|

Hero

|

40px

|

Bold

|
|

H1

|

32px

|

Bold

|
|

H2

|

24px

|

SemiBold

|
|

H3

|

20px

|

SemiBold

|
|

Body

|

16px

|

Regular

|
|

Caption

|

13px

|

Medium

|

### Example hierarchy

# Good Evening, Kavi 👋

## Today's Focus

Finish DBMS Assignment

Due tomorrow · High Priority

# 5. Spacing System

StudyFlow uses an 8-point grid.

|
Token

|

Pixels

|
| --- | --- |
|

XS

|

4

|
|

SM

|

8

|
|

MD

|

16

|
|

LG

|

24

|
|

XL

|

32

|
|

XXL

|

48

|

### Rules

* Never use random spacing.

* Cards always use 24px padding.

* Page margins = 32px desktop / 16px mobile.

# 6. Border Radius

Rounded corners create softness.

|
Component

|

Radius

|
| --- | --- |
|

Button

|

14px

|
|

Input

|

16px

|
|

Card

|

20px

|
|

Modal

|

24px

|
|

Avatar

|

Full Circle

|

The product should never feel sharp or rigid.

# 7. Elevation & Shadows

Use soft shadows only.

### Card Shadow

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20120%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22shadow%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22160%25%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2210%22%20stdDeviation%3D%2214%22%20flood-color%3D%22%236FAF8F%22%20flood-opacity%3D%220.16%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20x%3D%2230%22%20y%3D%2218%22%20width%3D%22260%22%20height%3D%2284%22%20rx%3D%2218%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D7E9DE%22%20filter%3D%22url\(%23shadow\)%22%2F%3E%3Ctext%20x%3D%2248%22%20y%3D%2242%22%20font-size%3D%2210%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%232F5D50%22%20font-weight%3D%22bold%22%3EToday's%20Focus%3C%2Ftext%3E%3Ctext%20x%3D%2248%22%20y%3D%2268%22%20font-size%3D%2222%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%23234%22%20font-weight%3D%22bold%22%3E3h%2020m%3C%2Ftext%3E%3Ctext%20x%3D%2248%22%20y%3D%2286%22%20font-size%3D%228%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%2364748B%22%3E72%25%20of%20your%20daily%20goal%3C%2Ftext%3E%3C%2Fsvg%3E)

Rules:

* No heavy black shadows

* Blur > Opacity

* Floating feeling

# 8. Glassmorphism Style

Dashboard cards use subtle glass effects.

Properties:

* White 80% opacity

* Backdrop blur

* Soft border

* Minimal transparency

This creates depth without distraction.

# 9. Buttons

## Primary Button

Purpose: Main action.

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20220%2052%22%20width%3D%22220px%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22220%22%20height%3D%2252%22%20rx%3D%2214%22%20fill%3D%22%236FAF8F%22%2F%3E%3Ctext%20x%3D%22110%22%20y%3D%2231%22%20font-size%3D%2214%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%23FFFFFF%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3E%3Clist%20marker%3D%22bullet%22%3E%3Clist-item%3E%3Ctext%3EAdd%20Task%3C%2Ftext%3E%3C%2Flist-item%3E%3C%2Flist%3E%3C%2Ftext%3E%3C%2Fsvg%3E)

States:

|
State

|

Color

|
| --- | --- |
|

Default

|

Sage

|
|

Hover

|

Mint Sage

|
|

Disabled

|

Gray

|

## Secondary Button

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20220%2052%22%20width%3D%22220px%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%22218%22%20height%3D%2250%22%20rx%3D%2214%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23CBD5E1%22%2F%3E%3Ctext%20x%3D%22110%22%20y%3D%2231%22%20font-size%3D%2214%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3EView%20Calendar%3C%2Ftext%3E%3C%2Fsvg%3E)

Used for navigation and secondary actions.

# 10. Inputs

Input fields should feel soft.

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20280%2054%22%20width%3D%22280px%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22280%22%20height%3D%2254%22%20rx%3D%2216%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Ctext%20x%3D%2218%22%20y%3D%2231%22%20font-size%3D%2212%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%2394A3B8%22%3EEnter%20task%20title...%3C%2Ftext%3E%3C%2Fsvg%3E)

### Rules

* Rounded

* Left padding

* Focus border = Sage Green

# 11. Cards

Every module uses the same card language.

## Stat Card

![](data\:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(255%2C%20255%2C%20255\)%22%20viewBox%3D%220%200%20320%20120%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22320%22%20height%3D%22120%22%20rx%3D%2220%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23D5E8DB%22%2F%3E%3Ccircle%20cx%3D%2242%22%20cy%3D%2236%22%20r%3D%2214%22%20fill%3D%22%23E8F3EC%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2240%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E%F0%9F%8C%BF%3C%2Ftext%3E%3Ctext%20x%3D%2262%22%20y%3D%2230%22%20font-size%3D%228%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%2364748B%22%3EProductivity%3C%2Ftext%3E%3Ctext%20x%3D%2224%22%20y%3D%2272%22%20font-size%3D%2228%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%232F5D50%22%20font-weight%3D%22bold%22%3E86%25%3C%2Ftext%3E%3Ctext%20x%3D%2224%22%20y%3D%2292%22%20font-size%3D%228%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20fill%3D%22%2364748B%22%3E%2B12%25%20from%20last%20week%3C%2Ftext%3E%3C%2Fsvg%3E)

Components:

* Icon

* Title

* Value

* Supporting text

# 12. Navigation Design

## Desktop

* Left sidebar

* Icons + Labels

* Collapsible

* Lumi floating separately

## Mobile

* Bottom navigation

* 5 icons

* No sidebar

## Tablet

* Compact sidebar

* Two-column dashboard

Navigation must remain identical logically.

# 13. Iconography

Use Lucide React exclusively.

|
Module

|

Icon

|
| --- | --- |
|

Home

|

House

|
|

Planner

|

CheckSquare

|
|

Focus

|

Timer

|
|

Buddy

|

Sparkles

|
|

Analytics

|

BarChart3

|
|

Profile

|

User

|
|

Notes

|

Notebook

|
|

Calendar

|

Calendar

|

Consistency is critical.

# 14. Lumi — Character Design

## Character Name

Lumi

## Role

Lumi is a virtual study companion, not a chatbot.

Lumi exists to make StudyFlow emotionally memorable.

## Appearance

* Tiny forest spirit

* Cream-colored body

* Sage green leaf hoodie

* Small glowing leaf on head

* Round eyes

* Pink blush cheeks

### Size

|
Device

|

Size

|
| --- | --- |
|

Mobile

|

48px

|
|

Tablet

|

56px

|
|

Desktop

|

64px

|

Always placed in the bottom-right corner.

## Lumi States

|
State

|

Description

|
| --- | --- |
|

Idle

|

Gentle floating

|
|

Blink

|

Random eye blink

|
|

Happy

|

Small jump

|
|

Focus

|

Reading book

|
|

Sleep

|

Floating asleep

|
|

Celebrate

|

Sparkles

|

## Dialogue Rules

Lumi never interrupts.

Speech bubbles disappear after 3 seconds.

Examples:

> 🌱 "One page at a time."

> ✨ "You're building a great habit."

> 📖 "Let's stay focused."

Maximum message length: 8 words.

# 15. Motion Design

Animations should feel organic.

|
Interaction

|

Duration

|
| --- | --- |
|

Hover

|

180ms

|
|

Button Press

|

120ms

|
|

Card Lift

|

220ms

|
|

Modal

|

250ms

|
|

Lumi Bounce

|

300ms

|
|

Fade

|

200ms

|

### Motion Principles

* Ease-in-out

* No exaggerated movement

* Respect reduced-motion settings

# 16. Empty State Design

Instead of blank screens, use illustrations.

### Planner

> 🌱 Your study journey starts here.

### Notes

> Every brilliant idea begins somewhere.

### Analytics

> Complete one focus session to unlock insights.

### Calendar

> Nothing scheduled today. Enjoy your free time!

# 17. Responsive Design Rules

## Mobile (320–639px)

* One column

* Bottom navigation

* Floating Lumi

* Full-width buttons

## Tablet (640–1023px)

* Two-column dashboard

* Larger cards

* Side navigation icons

## Desktop (1024px+)

* Left sidebar

* Four-column stats

* Expanded planner

* Wider analytics

No feature should be removed between devices.

Only the layout changes.

# 18. Accessibility Standards

StudyFlow must follow WCAG AA.

Requirements:

* 4.5:1 contrast ratio — enforced via the Text Color Rules table in Section 3, not by using brand accent colors directly as text

* Keyboard navigation

* Focus indicators

* Semantic HTML

* Alt text for illustrations

* 44×44 minimum touch targets

* Dark Mode palette (Section 3) meets the same 4.5:1 ratio independently — it is not just an inverted filter over the light theme

Accessibility is a feature, not an afterthought.

# 19. Design Principles

### Principle 1

Calm before productivity.

Users should feel relaxed before becoming productive.

### Principle 2

One primary action.

Every screen has one obvious CTA.

### Principle 3

Whitespace is intentional.

Never fill space unnecessarily.

### Principle 4

Lumi supports, never distracts.

The companion enhances the experience without reducing focus.

### Principle 5

Consistency over decoration.

Buttons, cards, typography, and spacing remain identical across the application.

# 20. Final Visual Identity Summary

|
Element

|

Choice

|
| --- | --- |
|

Brand Theme

|

Aurora Sage

|
|

Primary Color

|

Sage Green `#6FAF8F`

|
|

Background

|

Cream White (Light) / Deep Forest `#131C18` (Dark)

|
|

Font

|

Inter

|
|

Style

|

Minimal + Glassmorphism

|
|

Corner Radius

|

20px

|
|

Companion

|

Lumi 🌱

|
|

Experience

|

Calm, Cozy & Premium

|