# Tamil Nadu Cutoff Calculator Rework - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the website to use correct Tamil Nadu admission cutoff formulas with Airtable as the admin-configurable backend.

**Architecture:** React frontend with TanStack Query fetching data from Airtable REST API. All admission bodies, formulas, courses, and eligibility rules are admin-configurable through Airtable's spreadsheet interface.

**Tech Stack:** React, Vite, TanStack React Query, Airtable REST API, Tailwind CSS

---

## Current State Analysis

### What's Already Done
- Airtable integration (`src/lib/airtable.js`) - working
- CSV import files created (`scripts/airtable-import/`)
- Calculator logic rewritten (`src/lib/calculator.js`) with correct formulas
- React Query hooks for Airtable data
- Results display component updated

### What's Broken
- **Eligible_Groups field type mismatch**: Airtable linked record fields return record IDs, not display values. Code expects group codes like `"1, 2, 4"` but gets `["recNGtA8VYpaMdLEl"]`.
- **No results showing**: Calculator returns empty array because group matching fails.

---

## Correct Tamil Nadu Formulas Reference

| Admission Body | Formula | Max Cutoff | Notes |
|---------------|---------|------------|-------|
| **TNEA** (Engineering) | `M + P/2 + C/2` | 200 | Math full + half Physics + half Chemistry |
| **TNDALU** (Law) | `(S3 + S4 + S5 + S6) / 4` | 100 | Average of 4 main subjects (excludes languages) |
| **TANUVAS - BVSC** | `B + P/2 + C/2` | 200 | Biology full + half Physics/Chemistry |
| **TANUVAS - B.Tech** | `B/2 + P/2 + C/2 + M/2` | 200 | All four subjects at half weight |
| **TNAU - Agriculture** | `B/2 + P/2 + C/2 + LIST_A/2` | 200 | Uses subject list for 4th subject |
| **TNAU - Agri Engineering** | `M + P/2 + C/2` | 200 | Same as TNEA |
| **TNJFU** (Fisheries) | `B + P/2 + C/2` | 200 | Same as TANUVAS-BVSC |
| **Paramedical** | `B + P/2 + C/2` | 200 | Same as TANUVAS-BVSC |

### Subject Lists (for TNAU courses)
- **LIST_A**: Mathematics, Botany, Zoology, Computer Science, Home Science, Geography, Nutrition, Basic Mech Engg, etc.
- **LIST_B**: Economics, Statistics, Accountancy, Commerce, Computer Applications
- **LIST_C**: Zoology, Botany, Physics, Chemistry
- **LIST_D**: Food Service Mgmt, Nutrition, Botany, Zoology
- **LIST_E**: Physics, Chemistry, Maths, Statistics, Computer Science, Electronics

---

## Task 1: Fix Airtable Eligible_Groups Field

**Problem:** Linked record field returns Airtable record IDs instead of group codes.

**Solution:** Change to plain text field in Airtable.

**Files:**
- Airtable: Courses table → Eligible_Groups column
- No code changes needed (already handled)

**Step 1: Delete and recreate Eligible_Groups in Airtable**
1. Open Airtable → Courses table
2. Click Eligible_Groups column header → "Delete field"
3. Click "+" to add new field
4. Name: `Eligible_Groups`
5. Type: **Single line text** (NOT linked record)
6. Save

**Step 2: Re-import courses CSV**
1. Delete all rows in Courses table
2. Import `scripts/airtable-import/5-courses.csv`
3. Verify Eligible_Groups shows as text like `"1, 2, 4"`

**Step 3: Verify in browser console**
Run calculator, check that `course.eligible_groups` contains strings like `["1", "2", "4"]` not record IDs.

---

## Task 2: Verify Calculator Formula Logic

**Files:**
- Test: Manual testing in browser
- Verify: `src/lib/calculator.js`

**Step 1: Test TNEA formula**
Input: Math=95, Physics=90, Chemistry=85
Expected: 95 + 45 + 42.5 = 182.5

**Step 2: Test TNDALU formula**
Input: Tamil=80, English=85, Math=90, Physics=88, Chemistry=92, Biology=95
Expected: (90 + 88 + 92 + 95) / 4 = 91.25

**Step 3: Test Biology averaging**
For students with Botany+Zoology instead of Biology:
Input: Botany=90, Zoology=88
Expected Biology: (90 + 88) / 2 = 89

---

## Task 3: Add Missing Admission Bodies

**Files:**
- Modify: `scripts/airtable-import/1-admission-bodies.csv`
- Airtable: Admission Bodies table

**Step 1: Verify all admission bodies exist**

Required admission bodies:
```
Name,Name_Tamil,Description,Website,Max_Cutoff,Default_Formula
TNEA,தமிழ்நாடு பொறியியல் சேர்க்கை,Engineering admissions,https://tneaonline.org,200,M + P/2 + C/2
TNDALU,தமிழ்நாடு சட்டப் பல்கலைக்கழகம்,Law admissions,https://tndalu.ac.in,100,(S3 + S4 + S5 + S6) / 4
TANUVAS,தமிழ்நாடு கால்நடை மருத்துவ அறிவியல் பல்கலைக்கழகம்,Veterinary admissions,https://tanuvas.ac.in,200,B + P/2 + C/2
TNAU,தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம்,Agriculture admissions,https://tnau.ac.in,200,B/2 + P/2 + C/2 + LIST_A/2
TNJFU,தமிழ்நாடு மீன்வளப் பல்கலைக்கழகம்,Fisheries admissions,https://tnfu.ac.in,200,B + P/2 + C/2
Paramedical,துணை மருத்துவம்,Paramedical course admissions,,200,B + P/2 + C/2
```

**Step 2: Import or update in Airtable**
If admission bodies missing, import the CSV or manually add rows.

---

## Task 4: Add Subject Lists for TNAU

**Files:**
- Modify: `scripts/airtable-import/2-subject-lists.csv`
- Airtable: Subject Lists table

**Step 1: Verify subject lists exist**

```
Name,Subjects
LIST_A,"Mathematics, Botany, Zoology, Computer Science, Home Science, Geography, Nutrition, Basic Mechanical Engineering, Basic Electrical Engineering, Basic Electronics Engineering, Basic Civil Engineering, Basic Automobile Engineering, Food Management"
LIST_B,"Economics, Statistics, Accountancy, Commerce, Computer Applications"
LIST_C,"Zoology, Botany, Physics, Chemistry"
LIST_D,"Food Service Management, Nutrition and Dietetics, Botany, Zoology"
LIST_E,"Physics, Chemistry, Mathematics, Statistics, Computer Science, Electronics"
```

**Step 2: Import or verify in Airtable**

---

## Task 5: Configure Courses with Correct Formulas

**Files:**
- Modify: `scripts/airtable-import/5-courses.csv`
- Airtable: Courses table

**Step 1: Verify course formula overrides**

Courses that need formula overrides (different from admission body default):

| Course | Admission Body | Formula Override |
|--------|---------------|------------------|
| B.Tech Food Technology (TANUVAS) | TANUVAS | `B/2 + P/2 + C/2 + M/2` |
| B.Tech Dairy Technology (TANUVAS) | TANUVAS | `B/2 + P/2 + C/2 + M/2` |
| B.Sc Agriculture | TNAU | `B/2 + P/2 + C/2 + LIST_A/2` |
| B.Tech Agricultural Engineering | TNAU | `M + P/2 + C/2` |
| B.Sc Horticulture | TNAU | `B/2 + P/2 + C/2 + LIST_A/2` |

**Step 2: Update Airtable courses with Formula_Override**

---

## Task 6: Fix Group Eligibility Parsing

**Files:**
- Verify: `src/hooks/queries/useCourses.js:9-14`

**Current code (already correct):**
```javascript
function parseEligibleGroups(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.map(g => String(g).trim())
  if (typeof value === 'string') return value.split(',').map(g => g.trim())
  return []
}
```

**Step 1: Verify parsing works after Airtable field change**

Console should show:
```javascript
course.eligible_groups: ["1", "2", "4"]  // Array of strings
```

Not:
```javascript
course.eligible_groups: ["recNGtA8VYpaMdLEl"]  // Record IDs - BAD
```

---

## Task 7: Update Groups Data

**Files:**
- Modify: `scripts/airtable-import/4-groups.csv`
- Airtable: Groups table

**Step 1: Verify all Tamil Nadu 12th standard groups exist**

Standard groups:
```
Code,Name,Name_Tamil,Subjects
1,Physics Chemistry Mathematics,"இயற்பியல் வேதியியல் கணிதம்","[""Physics"", ""Chemistry"", ""Mathematics""]"
2,Physics Chemistry Biology,"இயற்பியல் வேதியியல் உயிரியல்","[""Physics"", ""Chemistry"", ""Biology""]"
3,Physics Chemistry Computer Science,"இயற்பியல் வேதியியல் கணினி அறிவியல்","[""Physics"", ""Chemistry"", ""Computer Science""]"
4,Physics Chemistry Botany Zoology,"இயற்பியல் வேதியியல் தாவரவியல் விலங்கியல்","[""Physics"", ""Chemistry"", ""Botany"", ""Zoology""]"
5,Commerce Economics Accountancy,"வணிகவியல் பொருளியல் கணக்கியல்","[""Commerce"", ""Economics"", ""Accountancy""]"
6,History Economics Political Science,"வரலாறு பொருளியல் அரசியல் அறிவியல்","[""History"", ""Economics"", ""Political Science""]"
```

---

## Task 8: Test Full Calculator Flow

**Files:**
- Test: Browser at `http://localhost:5173`

**Step 1: Select Group 1 (PCM)**
- Select group: Physics Chemistry Mathematics
- Enter marks: Math=95, Physics=90, Chemistry=85
- Expected TNEA cutoff: 182.5

**Step 2: Select Group 2 (PCB)**
- Select group: Physics Chemistry Biology
- Enter marks: Biology=92, Physics=88, Chemistry=90
- Expected TANUVAS cutoff: 92 + 44 + 45 = 181

**Step 3: Select Group 4 (PCBZ)**
- Select group: Physics Chemistry Botany Zoology
- Enter marks: Botany=90, Zoology=88, Physics=85, Chemistry=82
- Expected Biology average: (90+88)/2 = 89
- Expected TANUVAS cutoff: 89 + 42.5 + 41 = 172.5

**Step 4: Verify TNDALU for any group**
- All groups should show TNDALU cutoff
- Formula: Average of 4 main subjects

---

## Task 9: Add Admin Documentation

**Files:**
- Create: `docs/ADMIN_GUIDE.md`

**Content:**
Document how client can:
1. Add new courses in Airtable
2. Modify formulas
3. Add new admission bodies
4. Update eligible groups for courses
5. Add/modify subject lists

---

## Task 10: Final Testing and Cleanup

**Step 1: Run full test suite**
```bash
npm test
```

**Step 2: Build production**
```bash
npm run build
```

**Step 3: Verify no console errors**
Open browser console, test calculator flow, ensure no errors.

**Step 4: Commit all changes**
```bash
git add -A
git commit -m "fix: correct cutoff formulas and Airtable integration"
```

---

## Airtable Schema Reference

### Admission Bodies Table
| Field | Type | Example |
|-------|------|---------|
| Name | Text | TNEA |
| Name_Tamil | Text | தமிழ்நாடு பொறியியல் சேர்க்கை |
| Description | Long Text | Engineering admissions in Tamil Nadu |
| Website | URL | https://tneaonline.org |
| Max_Cutoff | Number | 200 |
| Default_Formula | Text | M + P/2 + C/2 |

### Courses Table
| Field | Type | Example |
|-------|------|---------|
| Name | Text | B.E. Computer Science |
| Name_Tamil | Text | பி.இ. கணினி அறிவியல் |
| Admission_Body | Text | TNEA |
| Duration | Text | 4 years |
| Eligible_Groups | Text | 1, 2, 3 |
| Formula_Override | Text | (optional) |
| Subject_List | Link | (for TNAU courses) |

### Groups Table
| Field | Type | Example |
|-------|------|---------|
| Code | Text | 1 |
| Name | Text | Physics Chemistry Mathematics |
| Name_Tamil | Text | இயற்பியல் வேதியியல் கணிதம் |
| Subjects | Long Text | ["Physics", "Chemistry", "Mathematics"] |

### Subject Lists Table
| Field | Type | Example |
|-------|------|---------|
| Name | Text | LIST_A |
| Subjects | Long Text | Mathematics, Botany, Zoology, Computer Science... |

---

## Formula Variable Reference

| Code | Subject |
|------|---------|
| M | Mathematics |
| P | Physics |
| C | Chemistry |
| B | Biology |
| BOT | Botany |
| ZOO | Zoology |
| CS | Computer Science |
| S1-S6 | Positional subjects (S1=1st language, S2=2nd language, S3-S6=main subjects) |
| LIST_A-E | Best matching subject from the list |
| AVG | Average of all subjects |
