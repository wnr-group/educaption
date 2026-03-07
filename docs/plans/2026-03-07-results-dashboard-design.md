# Results Dashboard UI Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

## Overview

A course-centric results dashboard that helps Tamil Nadu 12th students discover eligible courses based on their subjects and marks. The design shifts focus from admission bodies (TNEA, TNDALU) to actual courses (B.E. Computer Science, B.Pharm) grouped by category.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Personalization | Anonymous - no user name | No auth system currently |
| Achievement messaging | None - just show score | Keep it clean and factual |
| Navigation from cards | Filtered views (`/colleges?course=X`) | More useful than generic links |
| Overflow handling | Show top 3 per category, expand button | Prevents scroll fatigue |
| Primary focus | Courses grouped by category | Aligns with client vision - guide students to courses |
| Category source | Airtable configurable | Admin can manage groupings |
| Course card info | Minimal: name, duration, admission body | Keep it simple |
| Center highlight | Eligible course count | Reinforces course-centric approach |
| CTAs | Explore Colleges, Counselling Guide, Calculate Again | Match existing pages |

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR ADMISSION ANALYSIS                                    │
│                                                             │
│  [Subject Pills]         [42 Courses]        [Subject Pills]│
│  Physics: 98             You're eligible     English: 98    │
│  Chemistry: 98           for                 Tamil: 98      │
│  Biology: 98                                                │
│                                              Total: 588/600 │
└─────────────────────────────────────────────────────────────┘

┌─ Eligible Courses for You ──────────────────────────────────┐
│                                                             │
│  ▼ Engineering (24 courses)                    Cutoff: 198  │
│  [Course Card] [Course Card] [Course Card]    [View all →]  │
│                                                             │
│  ▼ Medical & Paramedical (12 courses)          Cutoff: 196  │
│  [Course Card] [Course Card] [Course Card]    [View all →]  │
│                                                             │
│  ▼ Law (4 courses)                             Cutoff: 98   │
│  [Course Card] [Course Card] [Course Card]    [View all →]  │
│                                                             │
│                              [Show More Categories]         │
└─────────────────────────────────────────────────────────────┘

┌─ Your Path Forward ─────────────────────────────────────────┐
│ [Explore Colleges] [Counselling Guide] [Calculate Again]    │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Header Card (Dark Background)

- **Title**: "Your Admission Analysis"
- **Left side**: Subject marks in pill format with mini progress bars
- **Center**: Circular progress showing eligible course count
  - Large number: course count (e.g., "42")
  - Subtitle: "Courses" + "You're eligible for"
- **Right side**: Remaining subjects + total marks (588/600)

### 2. Courses by Category Section

- **Section title**: "Eligible Courses for You"
- **Category groups**: Collapsible sections
  - Header: Category name, course count, cutoff score for that stream
  - Content: Grid of first 3 course cards
  - Footer: "View all X →" link
- **Categories from Airtable**: Engineering, Medical & Paramedical, Agriculture, Veterinary, Fisheries, Law
- **Show first 3 categories**, "Show More Categories" button to expand

### 3. Course Card

```
┌────────────────────────┐
│ B.E. Computer Science  │
│ 4 years • TNEA         │
│ [Find Colleges]        │
└────────────────────────┘
```

- Course name (bold)
- Duration + Admission body (subtitle)
- "Find Colleges" button → `/colleges?course={courseId}`

### 4. Path Forward Section

3-column grid:
1. "Explore Top-Ranked Colleges" → `/colleges`
2. "Counselling Guide" → `/counselling`
3. "Calculate Again" → reset calculator

## Data Changes

### Airtable: Admission Bodies Table

Add new field:
- **Field name**: `Category`
- **Type**: Single select
- **Options**: Engineering, Medical & Paramedical, Agriculture, Veterinary, Fisheries, Law

### CSV Update (1-admission-bodies.csv)

Add Category column:
```
Name,Category,...
TNEA,Engineering,...
TNDALU,Law,...
TANUVAS - BVSC,Veterinary,...
TANUVAS - B.Tech,Veterinary,...
TNAU - Agriculture,Agriculture,...
TNAU - Food Nutrition,Agriculture,...
TNAU - Agri Engineering,Agriculture,...
TNAU - Biotechnology,Agriculture,...
TNAU - Agribusiness,Agriculture,...
TNJFU - Fisheries,Fisheries,...
TNJFU - B.Tech,Fisheries,...
TNJFU - B.Voc,Fisheries,...
TN Paramedical - Bio,Medical & Paramedical,...
TN Paramedical - BotZoo,Medical & Paramedical,...
TN Pharmacy,Medical & Paramedical,...
```

## Code Changes

### Files to Modify

1. `src/components/calculator/ResultsDisplay.jsx` - Complete rewrite
2. `src/hooks/queries/useAdmissionBodies.js` - Add category field mapping
3. `src/hooks/useCalculator.js` - Add groupCoursesByCategory helper

### New Components (if needed)

- `src/components/calculator/CircularProgress.jsx` - Circular progress indicator
- `src/components/calculator/CategorySection.jsx` - Collapsible category with courses
- `src/components/calculator/CourseCard.jsx` - Individual course card

## Styling Notes

- Match existing design system (navy, saffron, cream colors)
- Dark card for header (variant="dark")
- Light cards for course sections (variant="elevated")
- Progress bars use saffron gradient
- Responsive: 3 columns desktop, 2 tablet, 1 mobile for course grids
