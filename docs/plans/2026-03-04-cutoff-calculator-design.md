# Educaption Cutoff Calculator - Design Document

**Date:** 2026-03-04
**Client:** Educaption (NGO)
**Project:** Tamil Nadu 12th Standard Cutoff Calculator & Career Guidance Platform

---

## Overview

A mobile-first web application to help Tamil Nadu 12th standard students calculate their cutoff marks and discover eligible higher education paths. The platform includes a custom admin panel for Educaption staff to manage all data.

### Target Users

- **Primary:** Underprivileged 12th standard students in Tamil Nadu
- **Secondary:** Parents, teachers, career counselors
- **Admin:** Educaption NGO staff

---

## Requirements Summary

| Requirement | Decision |
|-------------|----------|
| Device Focus | Mobile-first |
| Languages | English + Tamil |
| Features | Full guidance (calculator + courses + colleges + counselling) |
| Admin | Custom admin panel |
| Backend | Supabase |
| Frontend | React + Vite |
| Community Categories | Yes (OC, BC, MBC, SC, ST filtering) |
| Branding | Fresh design |

---

## Information Architecture

### Student Portal Pages

| Page | Purpose |
|------|---------|
| Home | Hero section, quick calculator access, about Educaption |
| Calculator | Multi-step form: Personal info → Subject marks → Results |
| Results | Cutoff scores, eligible courses, recommended paths |
| Courses | Browse all courses by stream |
| Colleges | College directory with filters |
| Counselling Guide | Step-by-step process, dates, documents |
| About | About Educaption, mission, contact |

### Admin Panel Pages

| Page | Purpose |
|------|---------|
| Dashboard | Overview stats |
| Groups | Manage 106 subject group combinations |
| Formulas | Manage cutoff formulas per stream |
| Courses | Manage course listings and eligibility |
| Colleges | Manage college directory |
| Counselling | Manage counselling info, dates, documents |
| Settings | Site settings, language strings |

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
  - Cutoff scores for each eligible stream
  - Eligible courses (matched by group)
  - "Explore Colleges" / "View Counselling Guide" CTAs
```

---

## Database Schema (Supabase)

### `groups`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | Group code (e.g., "1", "2") |
| name | text | Display name |
| subjects | jsonb | Array of 6 subjects |
| name_ta | text | Tamil name |

### `streams`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Stream name |
| name_ta | text | Tamil name |
| formula | text | Cutoff formula (e.g., "M/2 + P/4 + C/4") |
| max_cutoff | integer | Maximum cutoff score |
| eligible_groups | uuid[] | Array of eligible group IDs |

### `courses`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| stream_id | uuid | FK to streams |
| name | text | Course name |
| name_ta | text | Tamil name |
| duration | text | Duration |
| description | text | Course details |

### `colleges`
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

### `counselling`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Name (e.g., "TNEA") |
| stream_id | uuid | FK to streams |
| description | text | Process description |
| documents | jsonb | Required documents list |
| important_dates | jsonb | Key dates |
| fees | jsonb | Fee structure |
| website | text | Official website |

### `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | Category code (OC, BC, etc.) |
| name | text | Full name |
| name_ta | text | Tamil name |

### `admins`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | FK to auth.users |
| name | text | Admin name |
| role | text | "super_admin" or "editor" |

### `site_settings`
| Column | Type | Description |
|--------|------|-------------|
| key | text | Setting key |
| value | jsonb | Setting value |
| updated_at | timestamp | Last updated |

### `audit_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| admin_id | uuid | FK to admins |
| action | text | Action performed |
| table_name | text | Affected table |
| record_id | uuid | Affected record |
| changes | jsonb | Before/after data |
| created_at | timestamp | Timestamp |

---

## UI/UX Design

### Visual Identity

| Element | Value | Rationale |
|---------|-------|-----------|
| Primary Color | #2563EB (Blue) | Trust, education |
| Secondary Color | #10B981 (Green) | Growth, success |
| Accent | #F59E0B (Amber) | Warmth, CTAs |
| Background | #F8FAFC (Light gray) | Clean, easy on eyes |
| Text | #1E293B (Dark slate) | High readability |

### Typography

| Use | Font |
|-----|------|
| Headings | Inter (Bold) |
| Body | Inter (Regular) |
| Tamil | Noto Sans Tamil |

### Key UI Patterns

- Multi-step wizard for calculator (progress bar)
- Card-based results display
- Floating language toggle (EN | தமிழ்)
- Bottom navigation on mobile
- Minimum 44x44px touch targets
- WCAG AA contrast compliance

---

## Technical Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State/Data | TanStack React Query |
| Forms | React Hook Form + Zod |
| i18n | i18next + react-i18next |
| Backend | Supabase (DB + Auth) |
| Icons | Lucide React |
| Deployment | Vercel |

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
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Cutoff Calculation

Formulas stored in DB, parsed and evaluated at runtime:
- Engineering: M/2 + P/4 + C/4
- Medical: P/4 + C/4 + B/2
- Agriculture: M/4 + P/4 + C/4 + B/4
- etc.

### Authentication

- Supabase Auth for admin login (email/password)
- Role-based access (super_admin, editor)
- Protected routes with redirect

---

## Admin Panel Features

### Capabilities

- CRUD operations for all data tables
- CSV import/export
- Formula preview with test marks
- Rich text editor for descriptions
- Seat matrix editor
- Audit trail logging

### Roles

| Role | Permissions |
|------|-------------|
| Super Admin | Full CRUD + manage admins + settings |
| Editor | Add/Edit only, no delete or admin management |

---

## Deployment

| Aspect | Choice |
|--------|--------|
| Hosting | Vercel |
| Database | Supabase |
| Domain | Custom (e.g., cutoff.educaption.org) |
| SSL | Automatic via Vercel |

### Environment Variables

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## Future Enhancements (Post-V1)

- Student accounts (save results)
- Email/SMS notifications for counselling dates
- College comparison tool
- Predictive seat analysis
- Mobile app (React Native)

---

## Success Criteria

1. Student can calculate cutoff in under 2 minutes
2. All 106 groups supported with correct formulas
3. Bilingual support (EN/Tamil) works seamlessly
4. Admin can update any data without developer help
5. Mobile experience is smooth and accessible
6. Page load under 3 seconds on 3G connection
