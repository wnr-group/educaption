# Announcement Ticker Design

## Overview

A news-ticker-style banner at the top of the homepage for displaying manually-managed announcements about counselling dates and other important updates.

## Data Structure

**New Airtable table: "Announcements"**

| Field | Type | Description |
|-------|------|-------------|
| Message | Text | Alert text (English) |
| Message_Tamil | Text | Tamil translation |
| Link_URL | URL | Optional external link |
| Link_Text | Text | Custom link label (defaults to "Learn more") |
| Active | Checkbox | Only checked items appear |
| Order | Number | Display sequence (lower = first) |

## Component Behavior

**AnnouncementTicker**

- Position: Fixed at viewport top, above Header
- Height: 40px mobile, 44px desktop
- Auto-scroll: Continuous left-to-right at ~50px/second
- Pause on hover: Animation stops on hover, resumes on leave
- Manual navigation: Left/right arrow buttons to jump between announcements
- Current indicator: Dots showing active announcement
- Links: Clickable text or subtle arrow if URL exists
- Empty state: Component returns null if no active announcements

**Header adjustment**

- Header receives `top: 40px` (or 44px) when announcements exist
- Page content padding adjusts accordingly

## Visual Style

- Background: `#FF6B35` (brand orange)
- Text: White, 14px, semi-bold
- Arrow buttons: White icons on `rgba(255,255,255,0.15)` circular backgrounds
- Dot indicators: White, active = full opacity, inactive = 40%
- Border: Subtle `rgba(0,0,0,0.1)` bottom border
- Animation: CSS `translateX`, 200ms crossfade on manual navigation

**Responsive**

- Mobile: Smaller arrows, dots hidden (swipe gesture)
- Text truncates with ellipsis if too long

## Technical Implementation

**New files**

- `src/components/layout/AnnouncementTicker.jsx`
- `src/hooks/queries/useAnnouncements.js`

**Airtable changes**

- Create "Announcements" table
- Add `getAnnouncements()` to `src/lib/airtable.js`

**Existing file changes**

- `src/components/layout/Header.jsx` — Render ticker, adjust positioning

**Data flow**

1. `useAnnouncements` fetches records where `Active = true`, sorted by `Order`
2. Empty array = ticker returns null
3. 1+ announcements = ticker displays with auto-scroll and navigation
4. Header reads announcement count to adjust `top` position

## Accessibility

- `aria-live="polite"` on ticker region
- Arrow buttons have `aria-label="Previous/Next announcement"`
- Respects `prefers-reduced-motion` media query (pauses animation)
