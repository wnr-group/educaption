# Client Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 5 client-requested changes: show all subjects on group cards, rename vocational groups in Airtable, label formula cutoff groups by distinguishing subject, fix PDF footer URL, and add clickable links to event rows.

**Architecture:** Tasks 1–4 are frontend-only changes; Task 2 also writes to Airtable via MCP; Task 5 requires both an Airtable schema change (add Link_URL field to Events table) and frontend wiring. Tasks are independent and can be done in any order.

**Tech Stack:** React 18, Tailwind CSS, jsPDF, @tanstack/react-query, Airtable MCP tools, i18next

---

## File Map

| File | Change |
|------|--------|
| `src/components/calculator/Step1GroupSelect.jsx` | Show all 4 subjects on group cards (not just distinguishing) |
| `src/lib/calculator.js` | Tag each cutoff group with its distinguishing subject |
| `src/components/calculator/CategorySection.jsx` | Render distinguishing-subject label on each cutoff sub-group |
| `src/lib/reportGenerator.js` | Fix footer URL from `educaption.org` → `https://www.educaption.in/` |
| `src/hooks/queries/useEvents.js` | Map `Link_URL` field from Airtable Events records |
| `src/pages/Events.jsx` | Render clickable link in each event row when `link_url` exists |
| Airtable (via MCP) | Rename 10 vocational groups; add `Link_URL` field to Events table |

---

## Task 1: Show All 4 Subjects on Group Cards

**Files:**
- Modify: `src/components/calculator/Step1GroupSelect.jsx:222-276`

The current logic computes `distinguishing` subjects (strips common ones like Physics/Chemistry) and shows only those on each card. The fix: always show `g.subjects` (all 4) on the card, regardless of stream. The "Common to all groups" hint below the tabs already communicates the common subjects — so removing them from cards was an extra step that now needs reverting.

- [ ] **Step 1: Update `displaySubjects` to always use all subjects**

In `Step1GroupSelect.jsx`, find the card rendering loop starting at line 222. Replace the `displaySubjects` derivation:

```jsx
// Before (lines 224-228):
const subjects = (language === 'ta' && g.name_ta) ? g.name_ta.split(', ') : g.subjects || []
const distinguishing = getDistinguishingSubjects(g.subjects || [], streamConfig.commonSubjects)
const displaySubjects = (language === 'ta' && g.name_ta)
  ? g.name_ta.split(', ')
  : distinguishing.length > 0 ? distinguishing : subjects

// After:
const displaySubjects = (language === 'ta' && g.name_ta)
  ? g.name_ta.split(', ')
  : g.subjects || []
```

- [ ] **Step 2: Verify in browser**

Start dev server (`npm run dev`) and navigate to the calculator Step 1. Switch between Science, Arts, and Vocational tabs. Each card should now show all 4 subjects (e.g. a Science-Biology card shows Physics, Chemistry, Biology, Computer Science — not just Biology).

- [ ] **Step 3: Commit**

```bash
git add "src/components/calculator/Step1GroupSelect.jsx"
git commit -m "feat: show all 4 subjects on group selection cards"
```

---

## Task 2: Rename 10 Vocational Groups in Airtable

**Files:**
- Airtable base `appOetXyUlOOtRYCs`, table `tbl4Wh05N1OwdTTel` (Groups)

The PDF table maps new names (left column) to groups identified by their 4 subjects. VOC-3 and VOC-4 are marked "Keep Existing Name" and must not be changed.

The rename mapping (derived from PDF + Airtable subject data):

| Record ID | Code | New Name |
|-----------|------|----------|
| `rec8TBPvB4VIDDbK6` | VOC-1 | Agricultural Science |
| `rec7jPZakZYggKN3w` | VOC-2 | Nursing (Vocational) |
| `rec06ZlNZF6wGRqHN` | VOC-3 | *(Keep existing — no change)* |
| `recxX2kk7JRtFmrNm` | VOC-4 | *(Keep existing — no change)* |
| `reciHggMoO6BakcAK` | VOC-5 | Food Service Management |
| `recPzyDZH47QhPC8x` | VOC-6 | Textile and Dress Designing |
| `recaHLWiTHGxBDslP` | VOC-7 | Basic Automobile Engineering |
| `recHNFkPePcw10qYw` | VOC-8 | Basic Civil Engineering |
| `recPhKoladqCvn5p8` | VOC-9 | Basic Electrical Engineering |
| `rec94ljSQzcSZD53i` | VOC-10 | Basic Electronics Engineering |
| `rec6rCE71CnU6Yn8O` | VOC-11 | Basic Mechanical Engineering |
| `recyzZsEO7jAwFGir` | VOC-12 | Textile Technology |

- [ ] **Step 1: Update 10 vocational group names in Airtable**

Use `mcp__airtable__update_records_for_table` with baseId `appOetXyUlOOtRYCs`, tableId `tbl4Wh05N1OwdTTel`. Update all 10 records (skip VOC-3 and VOC-4). The `Name` field ID is `fldZYXP2fHYohN19S`.

Records to update (10 records):
```json
[
  { "id": "rec8TBPvB4VIDDbK6", "fields": { "Name": "Agricultural Science" } },
  { "id": "rec7jPZakZYggKN3w", "fields": { "Name": "Nursing (Vocational)" } },
  { "id": "reciHggMoO6BakcAK", "fields": { "Name": "Food Service Management" } },
  { "id": "recPzyDZH47QhPC8x", "fields": { "Name": "Textile and Dress Designing" } },
  { "id": "recaHLWiTHGxBDslP", "fields": { "Name": "Basic Automobile Engineering" } },
  { "id": "recHNFkPePcw10qYw", "fields": { "Name": "Basic Civil Engineering" } },
  { "id": "recPhKoladqCvn5p8", "fields": { "Name": "Basic Electrical Engineering" } },
  { "id": "rec94ljSQzcSZD53i", "fields": { "Name": "Basic Electronics Engineering" } },
  { "id": "rec6rCE71CnU6Yn8O", "fields": { "Name": "Basic Mechanical Engineering" } },
  { "id": "recyzZsEO7jAwFGir", "fields": { "Name": "Textile Technology" } }
]
```

- [ ] **Step 2: Verify in browser**

In the app, go to Step 1 → Vocational tab. Confirm that all 10 groups show their new names. VOC-3 and VOC-4 should be unchanged.

- [ ] **Step 3: No code commit needed** — Airtable is the source of truth; the frontend reads names dynamically.

---

## Task 3: Label Cutoff Groups by Distinguishing Subject

**Files:**
- Modify: `src/lib/calculator.js:370-391`
- Modify: `src/components/calculator/CategorySection.jsx:83-107`

**How it works:** Each cutoff group under an admission body was calculated using a specific formula. That formula uses a distinguishing subject (e.g. Biology or Mathematics). We need to:
1. In `calculator.js`: detect which subject drives the formula and attach it to each cutoff group as `distinguishingSubject`.
2. In `CategorySection.jsx`: render that label in the cutoff sub-group header instead of (or alongside) the cutoff score.

**Detecting the distinguishing subject:** Compare the formula against a priority list of subjects the student has. The first match in order `[Biology, Mathematics, Botany, Zoology, Home Science, Commerce, Economics]` is the label. For vocational groups, use the main theory subject name.

- [ ] **Step 1: Add `getDistinguishingSubjectLabel` to `calculator.js`**

Add this function after the `SUBJECT_CODE_MAP` block (around line 40):

```js
const DISTINGUISHING_PRIORITY = ['B', 'BOT', 'ZOO', 'M', 'HS', 'CO', 'E', 'A']
const CODE_TO_SUBJECT_NAME = {
  'B': 'Biology', 'BOT': 'Botany', 'ZOO': 'Zoology',
  'M': 'Mathematics', 'HS': 'Home Science', 'CO': 'Commerce',
  'E': 'Economics', 'A': 'Accountancy', 'P': 'Physics', 'C': 'Chemistry',
  'THEORY': 'Theory', 'PRACTICAL': 'Practical'
}

function getDistinguishingSubjectLabel(formula, marksLookup) {
  if (!formula) return null
  const normalized = normalizeFormula(formula)
  for (const code of DISTINGUISHING_PRIORITY) {
    if (new RegExp(`\\b${code}\\b`).test(normalized) && marksLookup[code] !== undefined) {
      return CODE_TO_SUBJECT_NAME[code] || code
    }
  }
  // Fallback: THEORY for vocational formulas
  if (normalized.includes('THEORY') && marksLookup['THEORY'] !== undefined) {
    return CODE_TO_SUBJECT_NAME['THEORY']
  }
  return null
}
```

- [ ] **Step 2: Attach `distinguishingSubject` to each cutoff group in `calculateCourseCutoffs`**

In `calculateCourseCutoffs`, find the block that builds `cutoffGroupsMap` (around line 374). After computing `cutoff`, attach the label:

```js
// After: const cutoffKey = cutoff.toString()
// Add distinguishing subject label
const distinguishingSubject = getDistinguishingSubjectLabel(formula, marksLookup)

if (!resultsByBody[admissionBody.id].cutoffGroupsMap[cutoffKey]) {
  resultsByBody[admissionBody.id].cutoffGroupsMap[cutoffKey] = {
    cutoff,
    maxCutoff: bodyMaxCutoff,
    distinguishingSubject,  // <-- add this
    courses: []
  }
}
```

- [ ] **Step 3: Render the distinguishing subject label in `CategorySection.jsx`**

Find the sub-group header block (lines 93–107). Replace the current cutoff-only display with a label that shows the subject name first, then the score:

```jsx
{group && (
  <div className="flex items-center gap-3 mb-3 mt-4">
    {group.distinguishingSubject && (
      <span className="font-body text-sm font-semibold text-navy-700 bg-navy-50 px-3 py-1 rounded-lg border border-navy-100">
        {group.distinguishingSubject}
      </span>
    )}
    <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100">
      <span className="font-display text-sm font-bold text-saffron-600">
        {group.cutoff.toFixed(2)}
      </span>
      <span className="font-body text-xs text-navy-400">
        / {group.maxCutoff}
      </span>
    </div>
    <span className="font-body text-xs text-navy-400">
      {groupCourses.length} {groupCourses.length !== 1 ? t('calculator.results.coursesAvailable') : t('calculator.results.courseAvailable')}
    </span>
  </div>
)}
```

- [ ] **Step 4: Verify in browser**

Run a calculation using a Science group that has both Biology and Mathematics eligible (e.g. a group with Biology). Under an admission body like TNEA that has multiple formulas, confirm you see two sub-groups — one labeled "Biology" with its cutoff, one labeled "Mathematics" with its cutoff. Each should have its own course list.

- [ ] **Step 5: Commit**

```bash
git add "src/lib/calculator.js" "src/components/calculator/CategorySection.jsx"
git commit -m "feat: label cutoff groups by distinguishing subject instead of just score"
```

---

## Task 4: Fix PDF Footer URL

**Files:**
- Modify: `src/lib/reportGenerator.js:138`

Current line 138:
```js
doc.text('educaption.org', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
```

- [ ] **Step 1: Change the URL**

Replace `'educaption.org'` with `'https://www.educaption.in/'`:

```js
doc.text('https://www.educaption.in/', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
```

- [ ] **Step 2: Verify**

Download a PDF report from the app. Open it and confirm the footer on every page shows `https://www.educaption.in/` instead of `educaption.org`.

- [ ] **Step 3: Commit**

```bash
git add "src/lib/reportGenerator.js"
git commit -m "fix: update PDF footer URL to https://www.educaption.in/"
```

---

## Task 5: Clickable Links in Event Rows

**Files:**
- Airtable: Add `Link_URL` field to Events table (`tblr6kiBeahO0WEI4`)
- Modify: `src/hooks/queries/useEvents.js`
- Modify: `src/pages/Events.jsx`

### Part A: Add Link_URL field to Airtable

- [ ] **Step 1: Create the field in Airtable**

Use `mcp__airtable__create_field` with:
- baseId: `appOetXyUlOOtRYCs`
- tableId: `tblr6kiBeahO0WEI4`
- fieldName: `Link_URL`
- type: `url`

### Part B: Wire up the frontend

- [ ] **Step 2: Map `Link_URL` in `useEvents.js`**

Add `link_url` to the select transform:

```js
// In the select: (data) => data.map(record => ({
//   ...existing fields...
link_url: parseTextField(record.Link_URL) || null
```

- [ ] **Step 3: Add clickable link to each event row in `Events.jsx`**

Import `ExternalLink` from lucide-react at the top:
```jsx
import { Search, Filter, Calendar, ChevronDown, X, ExternalLink } from 'lucide-react'
```

Inside the event row, update the grid columns from `[160px_1fr_200px]` to `[160px_1fr_200px_auto]` — both in the header and each row div. Then add a fourth column for the link:

**Header** (line 224):
```jsx
<div className="hidden sm:grid grid-cols-[160px_1fr_200px_auto] gap-4 px-6 py-4 bg-[#1A1A2E]/[0.03] border-b border-[#1A1A2E]/[0.06]">
  {/* existing Date, Event, Counselling columns */}
  <div className="text-xs font-bold text-[#1A1A2E]/50 uppercase tracking-wider">
    {/* empty header for link column */}
  </div>
</div>
```

**Row** (line 247):
```jsx
<div
  key={ev.id}
  className={`
    sm:grid sm:grid-cols-[160px_1fr_200px_auto] gap-4
    px-4 sm:px-6 py-4
    flex flex-col
    border-l-4
    transition-colors duration-150
    hover:brightness-[0.97]
    ${colors.row}
  `}
>
  {/* existing Date, Event Name, Counselling Body columns */}

  {/* Link column */}
  <div className="flex items-center">
    {ev.link_url ? (
      <a
        href={ev.link_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 rounded-lg transition-colors duration-150"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        {language === 'ta' ? 'இணைப்பு' : 'Link'}
      </a>
    ) : null}
  </div>
</div>
```

- [ ] **Step 4: Verify in browser**

Go to the Events page. Add a test URL to one event in Airtable (`Link_URL` field). Refresh the page (React Query will re-fetch within 2 minutes, or hard refresh). Confirm:
- The "Link" button appears only on that row.
- Clicking it opens the URL in a new tab.
- Rows without a URL show nothing in the link column.
- Mobile layout (stacked) also renders the link button.

- [ ] **Step 5: Commit**

```bash
git add "src/hooks/queries/useEvents.js" "src/pages/Events.jsx"
git commit -m "feat: add clickable link column to event rows"
```
