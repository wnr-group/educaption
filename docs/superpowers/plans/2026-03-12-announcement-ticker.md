# Announcement Ticker Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a news-ticker banner above the header that displays manually-managed announcements from Airtable, with auto-scrolling and manual navigation.

**Architecture:** New Airtable table "Announcements" → `getAnnouncements()` API function → `useAnnouncements` hook → `AnnouncementTicker` component rendered in Header. Header adjusts its top position when announcements exist.

**Tech Stack:** React, TanStack Query, Tailwind CSS, Airtable REST API

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/airtable.js` | Modify | Add `getAnnouncements()` function |
| `src/hooks/queries/useAnnouncements.js` | Create | React Query hook for announcements |
| `src/components/layout/AnnouncementTicker.jsx` | Create | Ticker UI component |
| `src/components/layout/Header.jsx` | Modify | Render ticker, adjust positioning |

---

## Chunk 1: Data Layer

### Task 1: Add Airtable fetch function

**Files:**
- Modify: `src/lib/airtable.js:155-175`

- [ ] **Step 1: Add getAnnouncements function to airtable.js**

Add after `getCounselling()` function (around line 159):

```javascript
/**
 * Fetch active announcements
 * @returns {Promise<Array>} Array of announcement records
 */
export async function getAnnouncements() {
  return fetchTable('Announcements', {
    filterByFormula: '{Active} = TRUE()',
    sort: [{ field: 'Order', direction: 'asc' }]
  })
}
```

- [ ] **Step 2: Add to exports object**

Update the `airtable` export object to include `getAnnouncements`:

```javascript
export const airtable = {
  fetchTable,
  getAdmissionBodies,
  getCourses,
  getGroups,
  getSubjectLists,
  getCategories,
  getColleges,
  getCounselling,
  getAnnouncements,
  isConfigured
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/airtable.js
git commit -m "feat: add getAnnouncements Airtable function"
```

---

### Task 2: Create useAnnouncements hook

**Files:**
- Create: `src/hooks/queries/useAnnouncements.js`

- [ ] **Step 1: Create the hook file**

```javascript
import { useQuery } from '@tanstack/react-query'
import { getAnnouncements } from '../../lib/airtable'

function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
    staleTime: 1000 * 60 * 2, // 2 minutes - announcements may change more frequently
    select: (data) => data.map(item => ({
      id: item.id,
      message: parseTextField(item.Message),
      message_ta: parseTextField(item.Message_Tamil),
      link_url: parseTextField(item.Link_URL),
      link_text: parseTextField(item.Link_Text) || 'Learn more',
      order: item.Order || 0
    }))
  })
}
```

- [ ] **Step 2: Export from hooks index**

Check if `src/hooks/queries/index.js` exists. If so, add export. If not, skip this step.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/queries/useAnnouncements.js
git commit -m "feat: add useAnnouncements React Query hook"
```

---

## Chunk 2: UI Component

### Task 3: Create AnnouncementTicker component

**Files:**
- Create: `src/components/layout/AnnouncementTicker.jsx`

- [ ] **Step 1: Create the ticker component**

```jsx
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useAnnouncements } from '../../hooks/queries/useAnnouncements'
import { useLanguage } from '../../context/LanguageContext'

export default function AnnouncementTicker() {
  const { data: announcements = [], isLoading } = useAnnouncements()
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const intervalRef = useRef(null)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Auto-advance announcements
  useEffect(() => {
    if (announcements.length <= 1 || isPaused || prefersReducedMotion) {
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 5000) // 5 seconds per announcement

    return () => clearInterval(intervalRef.current)
  }, [announcements.length, isPaused, prefersReducedMotion])

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  // Don't render if loading or no announcements
  if (isLoading || announcements.length === 0) {
    return null
  }

  const current = announcements[currentIndex]
  const message = language === 'ta' && current.message_ta
    ? current.message_ta
    : current.message

  return (
    <div
      className="
        bg-[#FF6B35]
        border-b border-black/10
        h-10 sm:h-11
        flex items-center
        relative
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-live="polite"
      aria-label="Announcements"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-3">
          {/* Left arrow */}
          {announcements.length > 1 && (
            <button
              onClick={goToPrev}
              className="
                p-1.5 rounded-full
                bg-white/15 hover:bg-white/25
                transition-colors duration-200
                flex-shrink-0
              "
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Announcement text */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2">
            <p className="
              text-white text-sm font-semibold
              truncate
              transition-opacity duration-200
            ">
              {message}
            </p>
            {current.link_url && (
              <a
                href={current.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-shrink-0
                  text-white/80 hover:text-white
                  flex items-center gap-1
                  text-xs font-medium
                  underline underline-offset-2
                  transition-colors duration-200
                "
              >
                {current.link_text}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Right arrow */}
          {announcements.length > 1 && (
            <button
              onClick={goToNext}
              className="
                p-1.5 rounded-full
                bg-white/15 hover:bg-white/25
                transition-colors duration-200
                flex-shrink-0
              "
              aria-label="Next announcement"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {announcements.length > 1 && (
        <div className="
          absolute bottom-1 left-1/2 -translate-x-1/2
          hidden sm:flex items-center gap-1
        ">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                w-1.5 h-1.5 rounded-full
                transition-opacity duration-200
                ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}
              `}
              aria-label={`Go to announcement ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/AnnouncementTicker.jsx
git commit -m "feat: add AnnouncementTicker component"
```

---

## Chunk 3: Integration

### Task 4: Integrate ticker into Header

**Files:**
- Modify: `src/components/layout/Header.jsx`

- [ ] **Step 1: Import AnnouncementTicker**

Add at top of file after other imports:

```javascript
import AnnouncementTicker from './AnnouncementTicker'
```

- [ ] **Step 2: Render ticker above header content**

Update the return statement to include the ticker at the very top:

```jsx
return (
  <>
    {/* Announcement Ticker - fixed at very top */}
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <AnnouncementTicker />
    </div>

    <header className={`
      fixed top-10 sm:top-11 left-0 right-0 z-50
      transition-all duration-300
      ${isTransparent
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-lg border-b border-[#1A1A2E]/[0.06] shadow-sm'
      }
    `}>
      {/* Language Toggle Bar */}
      <div className={`
        transition-all duration-300
        ${isTransparent
          ? 'bg-white/[0.05]'
          : 'bg-[#1A1A2E]'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-sm">
            <p className={`
              hidden sm:block font-medium
              ${isTransparent ? 'text-white/40' : 'text-white/60'}
            `}>
              Tamil Nadu Engineering Admissions Guide
            </p>
            <LanguageToggle isTransparent={isTransparent} />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navigation isTransparent={isTransparent} />
    </header>
  </>
)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.jsx
git commit -m "feat: integrate AnnouncementTicker into Header"
```

---

### Task 5: Adjust page content padding

**Files:**
- Modify: `src/pages/Calculator.jsx`
- Modify: `src/pages/Courses.jsx`
- Modify: `src/pages/Counselling.jsx`
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Results.jsx`

- [ ] **Step 1: Update padding in all pages**

Change `pt-28 sm:pt-32` to `pt-40 sm:pt-44` in each page to account for the ticker height (adds ~10-12px on mobile, ~11-12px on desktop).

For each file, find the main element and update the padding-top classes.

- [ ] **Step 2: Commit**

```bash
git add src/pages/Calculator.jsx src/pages/Courses.jsx src/pages/Counselling.jsx src/pages/About.jsx src/pages/Results.jsx
git commit -m "fix: adjust page padding for announcement ticker"
```

---

### Task 6: Manual testing

- [ ] **Step 1: Create test data in Airtable**

Create "Announcements" table in Airtable with these fields:
- Message (Single line text)
- Message_Tamil (Single line text)
- Link_URL (URL)
- Link_Text (Single line text)
- Active (Checkbox)
- Order (Number)

Add 2-3 test records with Active checked.

- [ ] **Step 2: Test the ticker**

Run `npm run dev` and verify:
- Ticker appears at top of page
- Auto-rotates every 5 seconds
- Pauses on hover
- Left/right arrows navigate between announcements
- Dot indicators show current announcement
- Links open in new tab
- Tamil translation shows when language is switched
- Empty state: ticker hidden when no active announcements

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete announcement ticker implementation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add Airtable fetch function | `src/lib/airtable.js` |
| 2 | Create useAnnouncements hook | `src/hooks/queries/useAnnouncements.js` |
| 3 | Create AnnouncementTicker component | `src/components/layout/AnnouncementTicker.jsx` |
| 4 | Integrate ticker into Header | `src/components/layout/Header.jsx` |
| 5 | Adjust page padding | Multiple page files |
| 6 | Manual testing | Airtable setup + verification |
