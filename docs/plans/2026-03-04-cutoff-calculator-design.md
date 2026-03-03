# Educaption Cutoff Calculator - Design Document

**Date:** 2026-03-04
**Client:** Educaption (NGO)
**Project:** Tamil Nadu 12th Standard Cutoff Calculator & Career Guidance Platform

---

## Overview

A mobile-first web application to help Tamil Nadu 12th standard students calculate their cutoff marks and explore higher education options. The platform provides cutoff calculations, eligible courses, college listings, and counselling guidance—all admin-editable via a custom panel.

---

## Requirements Summary

| Aspect | Decision |
|--------|----------|
| **Target Users** | 12th standard students in Tamil Nadu (underprivileged focus) |
| **Device Focus** | Mobile-first |
| **Languages** | English + Tamil |
| **Features** | Full guidance (calculator + courses + colleges + counselling) |
| **Admin** | Custom admin panel |
| **Backend** | Supabase |
| **Frontend** | React + Vite |
| **Community Filter** | Yes (OC, BC, MBC, SC, ST, etc.) |
| **Branding** | Fresh design |

---

## Information Architecture

### Student Portal Pages

| Page | Purpose |
|------|---------|
| **Home** | Hero section, quick calculator access, about Educaption |
| **Calculator** | Multi-step form: Personal info → Subject marks → Results |
| **Results** | Cutoff scores, eligible courses, recommended paths |
| **Courses** | Browse all courses by stream (Engineering, Medical, etc.) |
| **Colleges** | College directory with filters (govt/private, district, stream) |
| **Counselling Guide** | Step-by-step counselling process, dates, documents |
| **About** | About Educaption, mission, contact |

### Admin Panel Pages

| Page | Purpose |
|------|---------|
| **Dashboard** | Overview stats (visitors, calculations, popular streams) |
| **Groups** | Manage 106 subject group combinations |
| **Formulas** | Manage cutoff formulas for each stream |
| **Courses** | Manage course listings and eligibility mappings |
| **Colleges** | Manage college directory |
| **Counselling** | Manage counselling info, dates, documents |
| **Settings** | Site settings, language strings, announcements |

### User Flow

```
Student lands on Home
    ↓
Clicks "Calculate My Cutoff"
    ↓
Step 1: Select 12th Group (dropdown of 106 groups)
    ↓
Step 2: Enter marks for each subject in that group
    ↓
Step 3: Select Community Category
    ↓
Results Page:
  - Cutoff scores for each stream
  - Eligible courses (matched by group)
  - "Explore Colleges" / "View Counselling Guide" CTAs
```

---

## Database Schema (Supabase)

### `groups` - The 106 subject combinations

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | Group code (e.g., "1", "2", "106") |
| name | text | Display name (e.g., "Physics-Chemistry-Maths") |
| subjects | jsonb | Array of 6 subjects |
| name_ta | text | Tamil name |

### `streams` - Education streams

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Stream name |
| name_ta | text | Tamil name |
| formula | text | Cutoff formula (e.g., "M/2 + P/4 + C/4") |
| max_cutoff | integer | Maximum cutoff score (e.g., 200) |
| eligible_groups | uuid[] | Array of group IDs eligible for this stream |

### `courses` - Individual courses/degrees

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| stream_id | uuid | FK to streams |
| name | text | Course name (e.g., "B.E. Computer Science") |
| name_ta | text | Tamil name |
| duration | text | Duration (e.g., "4 years") |
| description | text | Course details |

### `colleges` - College directory

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | College name |
| name_ta | text | Tamil name |
| type | text | "government" or "private" |
| district | text | District name |
| streams | uuid[] | Streams offered |
| website | text | College website |
| seats | jsonb | Seat matrix by category |

### `counselling` - Counselling processes

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Name (e.g., "TNEA", "NEET Counselling") |
| stream_id | uuid | FK to streams |
| description | text | Process description |
| documents | jsonb | Required documents list |
| important_dates | jsonb | Key dates |
| fees | jsonb | Fee structure |
| website | text | Official website |

### `categories` - Community categories

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | Category code (OC, BC, MBC, SC, ST, etc.) |
| name | text | Full name |
| name_ta | text | Tamil name |

### `admins` - Admin users

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | FK to auth.users |
| name | text | Admin name |
| role | text | "super_admin" or "editor" |

### `site_settings` - Configurable settings

| Column | Type | Description |
|--------|------|-------------|
| key | text | Setting key |
| value | jsonb | Setting value |
| updated_at | timestamp | Last updated |

### `audit_logs` - Admin action logs

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| admin_id | uuid | FK to admins |
| action | text | Action performed |
| table_name | text | Affected table |
| record_id | uuid | Affected record |
| changes | jsonb | Before/after values |
| created_at | timestamp | When action occurred |

---

## UI/UX Design

### Visual Identity

| Element | Value | Rationale |
|---------|-------|-----------|
| **Primary Color** | `#2563EB` (Blue) | Trust, education, professionalism |
| **Secondary Color** | `#10B981` (Green) | Growth, success, hope |
| **Accent** | `#F59E0B` (Amber) | Warmth, highlights, CTAs |
| **Background** | `#F8FAFC` (Light gray) | Easy on eyes, clean |
| **Text** | `#1E293B` (Dark slate) | High readability |

### Typography

| Use | Font |
|-----|------|
| **Headings** | Inter (Bold) |
| **Body** | Inter (Regular) |
| **Tamil** | Noto Sans Tamil |

### Key UI Patterns

- **Multi-step wizard** for calculator (progress bar, back/next)
- **Card-based layout** for results and listings
- **Floating language toggle** in header (EN | தமிழ்)
- **Bottom navigation** on mobile for main sections
- **Minimum touch target**: 44x44px
- **High contrast** (WCAG AA compliant)

---

## Technical Architecture

### Project Structure

```
educaption-cutoff/
├── public/
│   └── locales/
│       ├── en.json
│       └── ta.json
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── calculator/
│   │   └── admin/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Calculator.jsx
│   │   ├── Courses.jsx
│   │   ├── Colleges.jsx
│   │   ├── Counselling.jsx
│   │   ├── About.jsx
│   │   └── admin/
│   ├── hooks/
│   ├── lib/
│   ├── context/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Routing |
| `@supabase/supabase-js` | Database & auth |
| `tailwindcss` | Styling |
| `i18next`, `react-i18next` | Internationalization |
| `react-hook-form` | Form handling |
| `zod` | Validation |
| `@tanstack/react-query` | Data fetching & caching |
| `lucide-react` | Icons |

### Cutoff Formulas

| Stream | Formula |
|--------|---------|
| Engineering | M/2 + P/4 + C/4 = Cutoff/200 |
| Medical/Allied | P/4 + C/4 + B/2 = Cutoff/200 |
| Agriculture | M/4 + P/4 + C/4 + B/4 = Cutoff/200 |
| Law | Total marks of all subjects except language |

Formulas are stored in database and parsed dynamically.

---

## Admin Panel

### Features

- **Dashboard**: Usage stats, popular searches
- **Data Tables**: View, add, edit, delete with search/filter
- **Bulk Import**: CSV upload for groups, colleges, etc.
- **Export**: Download data as CSV/Excel
- **Rich Text Editor**: For counselling descriptions
- **Audit Trail**: Log all admin actions

### Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full CRUD + manage admins + settings |
| **Editor** | Add/Edit only, no delete or admin management |

---

## Deployment

| Aspect | Choice |
|--------|--------|
| **Hosting** | Vercel |
| **Database** | Supabase |
| **Domain** | Custom (e.g., cutoff.educaption.org) |
| **SSL** | Automatic via Vercel |

### Environment Variables

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## Future Enhancements (Not in V1)

- Student accounts to save results
- Email/SMS notifications for counselling dates
- College comparison tool
- Predictive seat allocation analysis
- Mobile app (React Native)

---

## Appendix: Reference Data

### Cutoff Calculation Example

**Student**: SAKTHIVEL M (Register: 1000060552)
**Group**: PCMC (Physics-Chemistry-Maths-Computer Science)

| Subject | Marks |
|---------|-------|
| Tamil | 89 |
| English | 66 |
| Physics | 55 |
| Chemistry | 58 |
| Mathematics | 60 |
| Computer Science | 82 |
| **Total** | **410/600** |

**Engineering Cutoff**: 60/2 + 55/4 + 58/4 = 30 + 13.75 + 14.5 = **58.25/200**

---

*Document created: 2026-03-04*
