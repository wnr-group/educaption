# CR1 Change Request Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 5 CR1 changes: formula/course restructuring with 243 courses, results grouping by cutoff, PDF report generation, events page, and calculator bug fixes.

**Architecture:** Data changes via CSV files that feed Airtable. Calculator logic changes in `src/lib/calculator.js`. New results grouping in `calculateCourseCutoffs()`. New Events page following existing query hook pattern. Client-side PDF via jsPDF.

**Tech Stack:** React 18, React Query, Airtable, jsPDF + jsPDF-AutoTable, Tailwind CSS, i18next

---

## File Map

### Modified Files
| File | Changes |
|---|---|
| `src/lib/calculator.js` | Fix LIST regex, fix pharmacy formula handling, update `calculateCourseCutoffs()` return structure for cutoff grouping |
| `src/hooks/useCalculator.js` | Update `groupCoursesByCategory()` to handle new cutoff groups structure |
| `src/components/calculator/ResultsDisplay.jsx` | Render cutoff groups instead of single cutoff per admission body |
| `src/pages/Results.jsx` | Consume new cutoff groups, add Download Report button |
| `src/components/results/EligibleCoursesCard.jsx` | Update to handle cutoff groups |
| `src/App.jsx` | Add `/events` route |
| `src/components/layout/Header.jsx` | Add Events nav link |
| `src/lib/airtable.js` | Add `getEvents()` fetch function |
| `public/locales/en.json` | Add events page translations |
| `public/locales/ta.json` | Add events page translations (Tamil) |
| `scripts/airtable-import/1-admission-bodies.csv` | Fix pharmacy formula, add 5 new admission bodies |
| `scripts/airtable-import/2-subject-lists.csv` | Add LIST_G, LIST_H, LIST_I |
| `scripts/airtable-import/5-courses.csv` | Replace generic entries with 243 individual courses |

### New Files
| File | Purpose |
|---|---|
| `src/pages/Events.jsx` | Events page with table, search, filter |
| `src/hooks/queries/useEvents.js` | React Query hook for events data |
| `src/lib/reportGenerator.js` | Client-side PDF generation |
| `src/components/results/DownloadReport.jsx` | Download Report button component |

---

### Task 1: Fix calculator.js LIST regex and pharmacy formula

**Files:**
- Modify: `src/lib/calculator.js:143-144` (LIST regex)
- Modify: `scripts/airtable-import/1-admission-bodies.csv:19` (pharmacy formula)

- [ ] **Step 1: Fix the LIST regex to support LIST_G through LIST_I**

In `src/lib/calculator.js`, find the `resolveSubjectList` function and change the regex:

```javascript
// Line 144: Change LIST_[A-F] to LIST_[A-I] in both occurrences
function resolveSubjectList(formula, marks, subjectListSubjects) {
  const listMatch = formula.match(/LIST_[A-I]/i)
  if (!listMatch || !subjectListSubjects || subjectListSubjects.length === 0) {
    return formula
  }

  let listSubjectMark = null
  for (const subject of subjectListSubjects) {
    const code = getSubjectCode(subject)
    if (marks[code] !== undefined && marks[code] > 0) {
      listSubjectMark = marks[code]
      break
    }
  }

  if (listSubjectMark === null) {
    return null
  }

  return formula.replace(/LIST_[A-I]/gi, listSubjectMark.toString())
}
```

- [ ] **Step 2: Fix pharmacy formula in admission bodies CSV**

In `scripts/airtable-import/1-admission-bodies.csv`, change line 19 from:
```
TN Paramedical - Pharmacy,...,Physics/2 + Chemistry/2 + LIST_F/2,...
```
to:
```
TN Paramedical - Pharmacy,...,Physics/2 + Chemistry/2 + LIST_F,...
```

The full corrected line:
```csv
TN Paramedical - Pharmacy,தமிழ்நாடு துணைமருத்துவம் - மருந்தியல்,B.Pharm/BASLP/B.Optom,https://tnhealth.tn.gov.in,200,Physics/2 + Chemistry/2 + LIST_F,Medical & Paramedical
```

- [ ] **Step 3: Verify the fix works with existing test setup**

Run: `cd "/Users/dineshlearning/Documents/make money/educaption-cutoff" && npx vitest run --reporter=verbose 2>&1 | head -50`

If no tests exist yet, manually verify in browser console:
```javascript
// After dev server starts, open browser console and run:
window.EDUCAPTION_DEBUG = true
// Then calculate cutoff for SCI-7 student — pharmacy courses should show cutoff /200 not /150
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/calculator.js scripts/airtable-import/1-admission-bodies.csv
git commit -m "fix: extend LIST regex to A-I, fix pharmacy LIST_F formula (no /2)"
```

---

### Task 2: Update subject lists CSV with LIST_G, LIST_H, LIST_I

**Files:**
- Modify: `scripts/airtable-import/2-subject-lists.csv`

- [ ] **Step 1: Add 3 new subject list rows**

Append these 3 rows to `scripts/airtable-import/2-subject-lists.csv`:

```csv
LIST_G,"Commerce"
LIST_H,"Computer Science, Computer Application"
LIST_I,"Commerce, Geography, Agricultural Science- Theory, Nursing (Vocational)- Theory, Accountancy - Theory, Accountancy - Theory, Food Service Management - Theory, Textile and Dress Designing - Theory, Basic Automobile Engineering- Theory, Basic Civil Engineering- Theory, Basic Electrical Engineering- Theory, Basic Electronics Engineering- Theory, Basic Mechanical Engineering- Theory, Textile Technology- Theory"
```

Note: The subject names in LIST_I must match the exact subject names in `4-groups.csv` (e.g., "Agricultural Science- Theory" with the space before "Theory" matching VOC-1's subject name).

- [ ] **Step 2: Verify subject names match groups CSV**

Cross-check LIST_I subjects against VOC group subjects in `scripts/airtable-import/4-groups.csv`:
- VOC-1 S4: "Agricultural Science- Theory" ✓
- VOC-2 S4: "Nursing (Vocational)- Theory" ✓
- VOC-3 S4: "Accountancy - Theory" ✓
- VOC-4 S4: "Accountancy - Theory" ✓
- VOC-5 S4: "Food Service Management - Theory" ✓
- VOC-6 S4: "Textile and Dress Designing - Theory" ✓
- VOC-7 S4: "Basic Automobile Engineering- Theory" ✓
- VOC-8 S4: "Basic Civil Engineering- Theory" ✓
- VOC-9 S4: "Basic Electrical Engineering- Theory" ✓
- VOC-10 S4: "Basic Electronics Engineering- Theory" ✓
- VOC-11 S4: "Basic Mechanical Engineering- Theory" ✓
- VOC-12 S4: "Textile Technology- Theory" ✓
- ART-1..8 S4: "Commerce" ✓
- ART-9..14 S4: "Geography" ✓

- [ ] **Step 3: Commit**

```bash
git add scripts/airtable-import/2-subject-lists.csv
git commit -m "data: add subject lists G (Commerce), H (CS/CA), I (vocational subjects)"
```

---

### Task 3: Add new admission bodies to CSV

**Files:**
- Modify: `scripts/airtable-import/1-admission-bodies.csv`

- [ ] **Step 1: Append 5 new admission body rows**

Add to `scripts/airtable-import/1-admission-bodies.csv`:

```csv
TNAU Diploma (Bio),தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - டிப்ளோமா (உயிரி),TNAU Diploma courses for Biology stream,https://tnau.ac.in,200,Biology + Physics/2 + Chemistry/2,Agriculture
TNAU Diploma (Maths),தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - டிப்ளோமா (கணிதம்),TNAU Diploma courses for Maths stream,https://tnau.ac.in,200,Maths + Physics/2 + Chemistry/2,Agriculture
Paramedical Diploma (Bio),தமிழ்நாடு துணைமருத்துவ டிப்ளோமா (உயிரி),Paramedical Diploma courses for Biology stream,https://tnhealth.tn.gov.in,100,Biology/2 + Physics/4 + Chemistry/4,Medical & Paramedical
Paramedical Diploma (Maths),தமிழ்நாடு துணைமருத்துவ டிப்ளோமா (கணிதம்),Paramedical Diploma courses for Maths stream,https://tnhealth.tn.gov.in,100,Maths/2 + Physics/4 + Chemistry/4,Medical & Paramedical
Paramedical Diploma (Voc),தமிழ்நாடு துணைமருத்துவ டிப்ளோமா (தொழிற்கல்வி),Paramedical Diploma courses for Vocational stream,https://tnhealth.tn.gov.in,100,(S3 + LIST_I + S5 + S6) / 4,Medical & Paramedical
```

- [ ] **Step 2: Commit**

```bash
git add scripts/airtable-import/1-admission-bodies.csv
git commit -m "data: add 5 new admission bodies (TNAU Diploma, Paramedical Diploma)"
```

---

### Task 4: Rebuild courses CSV with all 243 entries

**Files:**
- Modify: `scripts/airtable-import/5-courses.csv`

This is the largest data task. The CSV must be completely rebuilt with 243 course entries. The CSV header adds a new `Course_Category` column.

- [ ] **Step 1: Update CSV header**

New header row:
```csv
Name,Name_Tamil,Admission_Body,Duration,Eligible_Groups,Formula_Override,Subject_List,Course_Category
```

- [ ] **Step 2: Write all 140 Engineering TNEA entries (70 science + 70 vocational)**

Each of the 70 engineering courses gets 2 rows. Science rows use admission body `TNEA` with eligible groups `SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10`. Vocational rows use `TNEA - Vocational` with eligible groups `VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12`. Both use their admission body's default formula (no override needed). The `Course_Category` field contains the sub-category.

Example for first 2 courses (4 rows):
```csv
Artificial Intelligence and Data Science,செயற்கை நுண்ணறிவு மற்றும் தரவு அறிவியல்,TNEA,4 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10",,,Computer / IT & Data Science
Artificial Intelligence and Data Science - Vocational,செயற்கை நுண்ணறிவு மற்றும் தரவு அறிவியல் - தொழிற்கல்வி,TNEA - Vocational,4 years,"VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12",,,Computer / IT & Data Science
Computer and Communication Engineering,கணினி மற்றும் தகவல் தொடர்பு பொறியியல்,TNEA,4 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10",,,Computer / IT & Data Science
Computer and Communication Engineering - Vocational,கணினி மற்றும் தகவல் தொடர்பு பொறியியல் - தொழிற்கல்வி,TNEA - Vocational,4 years,"VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12",,,Computer / IT & Data Science
```

Continue this pattern for all 70 courses with their correct `Course_Category` as listed in the spec (Section 2.5, S.No 1).

- [ ] **Step 3: Write 5 Law (TNDALU) entries replacing the 1 generic entry**

Remove the old generic `LLB (All Law Courses)` row. Add:
```csv
B.A. LL.B. (Hons.),பி.ஏ. எல்.எல்.பி. (ஹானர்ஸ்),TNDALU,5 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14, ART-1, ART-2, ART-3, ART-4, ART-5, ART-6, ART-7, ART-8, ART-9, ART-10, ART-11, ART-12, ART-13, ART-14, VOC-1, VOC-2, VOC-3, VOC-4, VOC-5, VOC-6, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12",,,
B.B.A. LL.B. (Hons.),பி.பி.ஏ. எல்.எல்.பி. (ஹானர்ஸ்),TNDALU,5 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14, ART-1, ART-2, ART-3, ART-4, ART-5, ART-6, ART-7, ART-8, ART-9, ART-10, ART-11, ART-12, ART-13, ART-14, VOC-1, VOC-2, VOC-3, VOC-4, VOC-5, VOC-6, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12",,,
B.A. LL.B.,பி.ஏ. எல்.எல்.பி.,TNDALU,3 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14, ART-1, ART-2, ART-3, ART-4, ART-5, ART-6, ART-7, ART-8, ART-9, ART-10, ART-11, ART-12, ART-13, ART-14, VOC-1, VOC-2, VOC-3, VOC-4, VOC-5, VOC-6, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12",,,
B.Com. LL.B. (Hons.),பி.காம். எல்.எல்.பி. (ஹானர்ஸ்),TNDALU,5 years,"ART-1, ART-2, ART-3, ART-4, ART-5, ART-6, ART-7, ART-8, VOC-3, VOC-4",(S3 + LIST_G + S5 + S6) / 4,LIST_G,
B.C.A. LL.B. (Hons.),பி.சி.ஏ. எல்.எல்.பி. (ஹானர்ஸ்),TNDALU,5 years,"SCI-1, SCI-7, ART-1, ART-10, VOC-4",(S3 + S4 + S5 + LIST_H) / 4,LIST_H,
```

- [ ] **Step 4: Keep existing TANUVAS entries unchanged (rows 3-4)**

Keep all existing Veterinary Science (BVSC) and Veterinary Technology (B.Tech) entries exactly as they are.

- [ ] **Step 5: Update TNAU UG entries — add 4 Tamil Medium + BotZoo rows, fix VOC-2**

Keep existing 26 TNAU entries. Add 4 new rows:
```csv
B.Sc. (Hons.) Agriculture (Tamil Medium),பி.எஸ்சி (ஹானர்ஸ்) வேளாண்மை (தமிழ் வழி),TNAU - Agriculture,4 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13",,LIST_A,
B.Sc. (Hons.) Agriculture (Tamil Medium) - BotZoo,பி.எஸ்சி (ஹானர்ஸ்) வேளாண்மை (தமிழ் வழி),TNAU - Agriculture - BotZoo,4 years,SCI-14,,,
B.Sc. (Hons.) Horticulture (Tamil Medium),பி.எஸ்சி (ஹானர்ஸ்) தோட்டக்கலை (தமிழ் வழி),TNAU - Agriculture,4 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13",,LIST_A,
B.Sc. (Hons.) Horticulture (Tamil Medium) - BotZoo,பி.எஸ்சி (ஹானர்ஸ்) தோட்டக்கலை (தமிழ் வழி),TNAU - Agriculture - BotZoo,4 years,SCI-14,,,
```

Also fix VOC-2 eligibility: in the existing vocational TNAU rows (Agriculture - Vocational, BVSC - Vocational, Fisheries - Vocational), change `VOC-1` to `VOC-1, VOC-2`.

- [ ] **Step 6: Add 4 TNAU Diploma courses**

```csv
Diploma in Agriculture,வேளாண்மையில் டிப்ளோமா,TNAU Diploma (Bio),3 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Agriculture (Tamil Medium),வேளாண்மையில் டிப்ளோமா (தமிழ் வழி),TNAU Diploma (Bio),3 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Horticulture,தோட்டக்கலையில் டிப்ளோமா,TNAU Diploma (Bio),3 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Agricultural Engineering,வேளாண் பொறியியலில் டிப்ளோமா,TNAU Diploma (Maths),4 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10",,,
```

- [ ] **Step 7: Keep existing Fisheries and Paramedical Degree entries unchanged**

Keep all existing TNJFU and Paramedical entries exactly as they are.

- [ ] **Step 8: Add 12 Paramedical Diploma courses**

```csv
Diploma in Dental Mechanic,பல் தொழில்நுட்ப டிப்ளோமா,Paramedical Diploma (Bio),2 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Dental Hygienist,பல் சுகாதார டிப்ளோமா,Paramedical Diploma (Bio),2 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Medical Laboratory Technology,மருத்துவ ஆய்வக தொழில்நுட்ப டிப்ளோமா,Paramedical Diploma (Bio),2 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Radio Diagnosis Technology,கதிர் கண்டறிதல் தொழில்நுட்ப டிப்ளோமா,Paramedical Diploma (Bio),2 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Radio Therapy Technology,கதிர் சிகிச்சை தொழில்நுட்ப டிப்ளோமா,Paramedical Diploma (Bio),2 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Home Health Care,இல்ல சுகாதார பராமரிப்பு டிப்ளோமா,Paramedical Diploma (Bio),1 year,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Opthalmic Nursing Assistant,கண் நர்சிங் உதவியாளர் டிப்ளோமா,Paramedical Diploma (Bio),2 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Nursing (Women),நர்சிங் டிப்ளோமா (பெண்கள்),Paramedical Diploma (Bio),3 years,"SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14",,,
Diploma in Optometry,ஒளியியல் டிப்ளோமா,Paramedical Diploma (Maths),2 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10",,,
Diploma in Pharmacy,மருந்தியல் டிப்ளோமா,Paramedical Diploma (Maths),2 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10",,,
Diploma in Nursing (Women),நர்சிங் டிப்ளோமா (பெண்கள்),Paramedical Diploma (Maths),3 years,"SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10",,,
Diploma in Nursing (Women),நர்சிங் டிப்ளோமா (பெண்கள்),Paramedical Diploma (Voc),3 years,"VOC-1, VOC-2, VOC-3, VOC-4, VOC-5, VOC-6, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12, ART-1, ART-2, ART-3, ART-4, ART-5, ART-6, ART-7, ART-8, ART-9, ART-10, ART-11, ART-12, ART-13, ART-14",,LIST_I,
```

- [ ] **Step 9: Verify total row count**

Run: `wc -l scripts/airtable-import/5-courses.csv`

Expected: 244 lines (1 header + 243 data rows).

- [ ] **Step 10: Commit**

```bash
git add scripts/airtable-import/5-courses.csv
git commit -m "data: rebuild courses CSV with 243 entries (70 eng x2, 5 law, TNAU diploma, paramedical diploma)"
```

---

### Task 5: Update useCourses hook to parse Course_Category

**Files:**
- Modify: `src/hooks/queries/useCourses.js`

- [ ] **Step 1: Add course_category to the normalized course object**

In `src/hooks/queries/useCourses.js`, find the `select` callback where course records are mapped. Add the `course_category` field:

```javascript
// Inside the select/map callback, add this line alongside existing fields:
course_category: parseTextField(record.Course_Category) || null,
```

This follows the exact same `parseTextField()` pattern used for every other field in the hook.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/queries/useCourses.js
git commit -m "feat: parse Course_Category field from Airtable courses"
```

---

### Task 6: Update calculateCourseCutoffs() for cutoff grouping

**Files:**
- Modify: `src/lib/calculator.js:273-355`

- [ ] **Step 1: Modify the results grouping logic**

Replace the current `calculateCourseCutoffs()` function body starting from the `// Group results by admission body` comment (around line 291). The key change: instead of one `cutoff` per admission body, collect courses into `cutoffGroups` keyed by their calculated cutoff value.

In `src/lib/calculator.js`, replace the section from `const resultsByBody = {}` through to the end of the function (the `return Object.values(resultsByBody)...` line):

```javascript
  const resultsByBody = {}

  for (const course of courses) {
    const groupCode = String(group.code)
    let eligibleGroupsArray = []
    if (Array.isArray(course.eligible_groups)) {
      eligibleGroupsArray = course.eligible_groups
    } else if (typeof course.eligible_groups === 'string') {
      eligibleGroupsArray = course.eligible_groups.split(',').map(g => g.trim())
    }
    const isEligible = eligibleGroupsArray.includes(groupCode)

    if (!isEligible) continue

    const admissionBody = bodyLookupByName[course.admission_body]

    if (!admissionBody) {
      console.log('No admission body match for:', course.admission_body)
      continue
    }

    const formula = course.formula_override || admissionBody.default_formula
    if (!formula) continue

    const subjectListSubjects = course.subject_list
      ? listLookup[course.subject_list]
      : null

    const cutoff = calculateCutoff(formula, marksLookup, subjectListSubjects)

    if (cutoff === null) continue

    if (!resultsByBody[admissionBody.id]) {
      resultsByBody[admissionBody.id] = {
        admissionBodyId: admissionBody.id,
        admissionBodyName: admissionBody.name,
        admissionBodyNameTa: admissionBody.name_ta,
        admissionBodyDisplayName: admissionBody.display_name || admissionBody.name,
        admissionBodyDisplayNameTa: admissionBody.display_name_ta || admissionBody.name_ta,
        formula: admissionBody.default_formula,
        maxCutoff: admissionBody.max_cutoff || 200,
        cutoffGroups: {}
      }
    }

    const cutoffKey = cutoff.toString()
    if (!resultsByBody[admissionBody.id].cutoffGroups[cutoffKey]) {
      resultsByBody[admissionBody.id].cutoffGroups[cutoffKey] = {
        cutoff,
        maxCutoff: admissionBody.max_cutoff || 200,
        courses: []
      }
    }

    resultsByBody[admissionBody.id].cutoffGroups[cutoffKey].courses.push({
      courseId: course.id,
      courseName: course.name,
      courseNameTa: course.name_ta,
      courseCategory: course.course_category || null,
      formula: course.formula_override || null,
      duration: course.duration
    })
  }

  // Convert cutoffGroups from object to sorted array (highest cutoff first)
  const results = Object.values(resultsByBody).map(body => ({
    ...body,
    cutoffGroups: Object.values(body.cutoffGroups).sort((a, b) => b.cutoff - a.cutoff)
  }))

  // Sort admission bodies by highest cutoff in their first group
  return results.sort((a, b) => {
    const aCutoff = a.cutoffGroups[0]?.cutoff || 0
    const bCutoff = b.cutoffGroups[0]?.cutoff || 0
    return bCutoff - aCutoff
  })
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/calculator.js
git commit -m "feat: group courses by cutoff value within each admission body"
```

---

### Task 7: Update useCalculator and ResultsDisplay for new cutoff groups

**Files:**
- Modify: `src/hooks/useCalculator.js`
- Modify: `src/components/calculator/ResultsDisplay.jsx`
- Modify: `src/pages/Results.jsx`
- Modify: `src/components/results/EligibleCoursesCard.jsx`

- [ ] **Step 1: Update groupCoursesByCategory() in useCalculator.js**

The `groupCoursesByCategory()` function needs to work with the new `cutoffGroups` array instead of a single `cutoff` value. Find this function in `src/hooks/useCalculator.js` and update it to flatten cutoff groups into the category display format:

```javascript
groupCoursesByCategory: (cutoffResults) => {
  if (!cutoffResults || cutoffResults.length === 0) return []

  return cutoffResults.map(body => ({
    category: body.admissionBodyDisplayName || body.admissionBodyName,
    category_ta: body.admissionBodyDisplayNameTa || body.admissionBodyNameTa,
    maxCutoff: body.maxCutoff,
    cutoffGroups: body.cutoffGroups,
    // Keep top cutoff for sorting/display
    cutoff: body.cutoffGroups[0]?.cutoff || 0,
    // Flatten all courses for total count
    courses: body.cutoffGroups.flatMap(g => g.courses)
  }))
}
```

- [ ] **Step 2: Update ResultsDisplay.jsx to render cutoff groups**

In `src/components/calculator/ResultsDisplay.jsx`, where course categories are displayed, update the rendering to show cutoff sub-groups. Inside the category section expansion, iterate over `cutoffGroups` instead of showing a single flat list:

For each category, instead of rendering a flat list of courses, render:
```jsx
{category.cutoffGroups.map((group, groupIdx) => (
  <div key={groupIdx} className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-semibold text-primary-700">
        {t('results.cutoff')}: {group.cutoff}/{group.maxCutoff}
      </span>
      <span className="text-xs text-gray-500">
        ({group.courses.length} {group.courses.length === 1 ? t('results.course') : t('results.courses')})
      </span>
    </div>
    <ul className="space-y-1 pl-4">
      {group.courses.map((course, idx) => (
        <li key={idx} className="text-sm text-gray-700">
          {i18n.language === 'ta' ? course.courseNameTa || course.courseName : course.courseName}
          {course.courseCategory && (
            <span className="text-xs text-gray-400 ml-2">— {course.courseCategory}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
))}
```

- [ ] **Step 3: Update Results.jsx to work with cutoffGroups**

In `src/pages/Results.jsx`, update how cutoff scores are displayed. The `cutoffScores` from results now contains the new structure with `cutoffGroups`. Update the score display section to iterate over bodies and show the top cutoff from each body's first cutoff group.

- [ ] **Step 4: Update EligibleCoursesCard.jsx**

In `src/components/results/EligibleCoursesCard.jsx`, update to handle the courses coming from the flattened cutoffGroups structure. The courses array is still a flat list (from `groupCoursesByCategory`), so minimal changes needed — just ensure the component can handle the `courseCategory` field if present.

- [ ] **Step 5: Verify in browser**

Run: `cd "/Users/dineshlearning/Documents/make money/educaption-cutoff" && npm run dev`

Test with a SCI-10 student (has both Maths and Biology). Navigate to calculator, select SCI-10, enter marks, verify:
- TNAU Agriculture shows multiple cutoff groups (LIST_A formula vs LIST_C formula give different cutoffs)
- Each group lists its courses underneath
- No formula text is displayed to the user

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useCalculator.js src/components/calculator/ResultsDisplay.jsx src/pages/Results.jsx src/components/results/EligibleCoursesCard.jsx
git commit -m "feat: render cutoff groups in results display (no formula shown)"
```

---

### Task 8: Add Events Airtable fetch function

**Files:**
- Modify: `src/lib/airtable.js`

- [ ] **Step 1: Add getEvents() function**

In `src/lib/airtable.js`, add the `getEvents` export following the same pattern as `getAnnouncements`:

```javascript
export async function getEvents() {
  return fetchTable('Events', {
    sort: [{ field: 'Date', direction: 'asc' }]
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/airtable.js
git commit -m "feat: add getEvents() Airtable fetch function"
```

---

### Task 9: Create useEvents query hook

**Files:**
- Create: `src/hooks/queries/useEvents.js`

- [ ] **Step 1: Write the hook**

```javascript
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../../lib/airtable'

function parseTextField(value) {
  if (!value) return ''
  if (Array.isArray(value)) return value[0] || ''
  return String(value).trim()
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 2,
    select: (data) => data.map(record => ({
      id: record.id,
      date: parseTextField(record.Date),
      event: parseTextField(record.Event),
      event_ta: parseTextField(record.Event_Tamil) || parseTextField(record.Event),
      counselling_body: parseTextField(record.Counselling_Body),
      counselling_body_ta: parseTextField(record.Counselling_Body_Tamil) || parseTextField(record.Counselling_Body),
      description: parseTextField(record.Description),
      color: parseTextField(record.Color) || null
    }))
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/queries/useEvents.js
git commit -m "feat: add useEvents React Query hook for Airtable events"
```

---

### Task 10: Create Events page

**Files:**
- Create: `src/pages/Events.jsx`

- [ ] **Step 1: Write the Events page component**

```jsx
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Search, Filter, Calendar } from 'lucide-react'
import { useEvents } from '../hooks/queries/useEvents'

const COUNSELLING_COLORS = {
  'Engineering - TNEA': 'bg-amber-50 border-amber-200',
  'Agri - TNAU': 'bg-blue-50 border-blue-200',
  'Fisheries - TNJFU': 'bg-cyan-50 border-cyan-200',
  'Veterinary - TANUVAS': 'bg-green-50 border-green-200',
  'Law - TNDALU': 'bg-purple-50 border-purple-200',
  'Paramedical': 'bg-rose-50 border-rose-200'
}

function getRowColor(counsellingBody) {
  for (const [key, value] of Object.entries(COUNSELLING_COLORS)) {
    if (counsellingBody.toLowerCase().includes(key.split(' - ')[0].toLowerCase())) {
      return value
    }
  }
  return 'bg-white border-gray-100'
}

export default function Events() {
  const { t, i18n } = useTranslation()
  const { data: events = [], isLoading, error } = useEvents()
  const [search, setSearch] = useState('')
  const [filterBody, setFilterBody] = useState('')

  const counsellingBodies = useMemo(() => {
    const bodies = new Set(events.map(e => e.counselling_body))
    return Array.from(bodies).sort()
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !search ||
        event.event.toLowerCase().includes(search.toLowerCase()) ||
        event.counselling_body.toLowerCase().includes(search.toLowerCase()) ||
        event.date.includes(search)
      const matchesFilter = !filterBody || event.counselling_body === filterBody
      return matchesSearch && matchesFilter
    })
  }, [events, search, filterBody])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(i18n.language === 'ta' ? 'ta-IN' : 'en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{t('common.error')}</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t('events.title')} | Educaption</title>
      </Helmet>
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary-600" />
            {t('events.title')}
          </h1>
          <p className="mt-2 text-gray-600">{t('events.subtitle')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('events.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterBody}
              onChange={(e) => setFilterBody(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">{t('events.allCounselling')}</option>
              {counsellingBodies.map(body => (
                <option key={body} value={body}>{body}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">{t('events.date')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">{t('events.event')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">{t('events.counselling')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    {t('events.noEvents')}
                  </td>
                </tr>
              ) : (
                filteredEvents.map(event => (
                  <tr
                    key={event.id}
                    className={`border-b border-l-4 ${getRowColor(event.counselling_body)} hover:opacity-80 transition-opacity`}
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{formatDate(event.date)}</td>
                    <td className="px-4 py-3">
                      {i18n.language === 'ta' ? event.event_ta : event.event}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {i18n.language === 'ta' ? event.counselling_body_ta : event.counselling_body}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          {t('events.showingCount', { count: filteredEvents.length, total: events.length })}
        </p>
      </main>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Events.jsx
git commit -m "feat: create Events page with search, filter, color-coded rows"
```

---

### Task 11: Wire up Events route and nav link

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/layout/Header.jsx`
- Modify: `public/locales/en.json`
- Modify: `public/locales/ta.json`

- [ ] **Step 1: Add route in App.jsx**

Import Events page and add route:

```javascript
// Add import at top
import Events from './pages/Events'

// Add route inside <Routes>, after the /courses route
<Route path="/events" element={<Events />} />
```

- [ ] **Step 2: Add nav link in Header.jsx**

Find the navigation links array in `src/components/layout/Header.jsx` (or `Navigation` sub-component) and add the Events link following the same pattern as existing links:

```javascript
{ path: '/events', label: t('nav.events') }
```

- [ ] **Step 3: Add translation keys**

In `public/locales/en.json`, add to the `nav` object:
```json
"events": "Events"
```

Add the `events` section:
```json
"events": {
  "title": "Important Events & Dates",
  "subtitle": "Stay updated with admission counselling dates and deadlines",
  "searchPlaceholder": "Search events...",
  "allCounselling": "All Counselling Bodies",
  "date": "Date",
  "event": "Event",
  "counselling": "Counselling",
  "noEvents": "No events found",
  "showingCount": "Showing {{count}} of {{total}} events"
}
```

In `public/locales/ta.json`, add corresponding Tamil:
```json
"events": "நிகழ்வுகள்"
```
(in `nav` object)

```json
"events": {
  "title": "முக்கிய நிகழ்வுகள் & தேதிகள்",
  "subtitle": "சேர்க்கை கலந்தாய்வு தேதிகள் மற்றும் காலக்கெடுவுகளைப் புதுப்பிக்கவும்",
  "searchPlaceholder": "நிகழ்வுகளைத் தேடு...",
  "allCounselling": "அனைத்து கலந்தாய்வு அமைப்புகள்",
  "date": "தேதி",
  "event": "நிகழ்வு",
  "counselling": "கலந்தாய்வு",
  "noEvents": "நிகழ்வுகள் இல்லை",
  "showingCount": "{{total}} இல் {{count}} நிகழ்வுகள் காட்டப்படுகின்றன"
}
```

- [ ] **Step 4: Verify Events page in browser**

Run dev server, navigate to `/events`. The page should load (may show empty if no Airtable data yet). Verify:
- Search bar renders
- Filter dropdown renders
- Table headers show correctly
- Tamil toggle switches labels

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/layout/Header.jsx public/locales/en.json public/locales/ta.json
git commit -m "feat: wire up Events route, nav link, and i18n translations"
```

---

### Task 12: Install jsPDF and create report generator

**Files:**
- Create: `src/lib/reportGenerator.js`

- [ ] **Step 1: Install dependencies**

Run: `cd "/Users/dineshlearning/Documents/make money/educaption-cutoff" && npm install jspdf jspdf-autotable`

- [ ] **Step 2: Write the report generator**

```javascript
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function generateCutoffReport({ studentName, group, marks, cutoffResults, language = 'en' }) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(20)
  doc.setTextColor(30, 64, 120)
  doc.text('Educaption', pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Cutoff Score Report', pageWidth / 2, y, { align: 'center' })
  y += 6

  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setDrawColor(30, 64, 120)
  doc.setLineWidth(0.5)
  doc.line(14, y, pageWidth - 14, y)
  y += 10

  // Student Info
  doc.setFontSize(13)
  doc.setTextColor(30, 30, 30)
  doc.text('Student Information', 14, y)
  y += 8

  const groupName = language === 'ta' ? (group.name_ta || group.name) : group.name
  const studentInfoRows = [
    ['Name', studentName || 'N/A'],
    ['Group', `${group.code} — ${groupName}`]
  ]

  const subjects = Object.entries(marks)
  for (const [subject, mark] of subjects) {
    studentInfoRows.push([subject, String(mark)])
  }

  doc.autoTable({
    startY: y,
    head: [['Field', 'Value']],
    body: studentInfoRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 120], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
  })

  y = doc.lastAutoTable.finalY + 12

  // Cutoff Scores Summary
  doc.setFontSize(13)
  doc.setTextColor(30, 30, 30)
  doc.text('Cutoff Scores', 14, y)
  y += 8

  const cutoffRows = cutoffResults.flatMap(body => {
    const bodyName = language === 'ta'
      ? (body.admissionBodyDisplayNameTa || body.admissionBodyName)
      : (body.admissionBodyDisplayName || body.admissionBodyName)
    return body.cutoffGroups.map(g => [
      bodyName,
      `${g.cutoff}`,
      `${g.maxCutoff}`,
      `${g.courses.length}`
    ])
  })

  doc.autoTable({
    startY: y,
    head: [['Admission Body', 'Cutoff', 'Max', 'Courses']],
    body: cutoffRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 120], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  })

  y = doc.lastAutoTable.finalY + 12

  // Eligible Courses
  for (const body of cutoffResults) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    const bodyName = language === 'ta'
      ? (body.admissionBodyDisplayNameTa || body.admissionBodyName)
      : (body.admissionBodyDisplayName || body.admissionBodyName)

    doc.setFontSize(12)
    doc.setTextColor(30, 64, 120)
    doc.text(bodyName, 14, y)
    y += 8

    for (const group of body.cutoffGroups) {
      if (y > 260) {
        doc.addPage()
        y = 20
      }

      const courseRows = group.courses.map(c => {
        const name = language === 'ta' ? (c.courseNameTa || c.courseName) : c.courseName
        return [name, c.courseCategory || '', c.duration || '']
      })

      doc.autoTable({
        startY: y,
        head: [[`Cutoff: ${group.cutoff}/${group.maxCutoff}`, 'Category', 'Duration']],
        body: courseRows,
        theme: 'striped',
        headStyles: { fillColor: [60, 120, 80], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      })

      y = doc.lastAutoTable.finalY + 6
    }

    y += 4
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('educaption.org', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
  }

  doc.save(`educaption-cutoff-report-${Date.now()}.pdf`)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/reportGenerator.js package.json package-lock.json
git commit -m "feat: add client-side PDF report generator with jsPDF"
```

---

### Task 13: Add Download Report button to Results page

**Files:**
- Create: `src/components/results/DownloadReport.jsx`
- Modify: `src/pages/Results.jsx`

- [ ] **Step 1: Create the DownloadReport component**

```jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2 } from 'lucide-react'
import { generateCutoffReport } from '../../lib/reportGenerator'

export default function DownloadReport({ group, marks, cutoffResults }) {
  const { t, i18n } = useTranslation()
  const [studentName, setStudentName] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleDownload = () => {
    setGenerating(true)
    try {
      generateCutoffReport({
        studentName,
        group,
        marks,
        cutoffResults,
        language: i18n.language
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <input
        type="text"
        placeholder={t('results.enterName')}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        onClick={handleDownload}
        disabled={generating}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
      >
        {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {t('results.downloadReport')}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Add DownloadReport to Results page**

In `src/pages/Results.jsx`, import and add the component:

```javascript
// Add import
import DownloadReport from '../components/results/DownloadReport'

// Add inside the results JSX, after the cutoff scores section:
<DownloadReport
  group={results.group}
  marks={results.marks}
  cutoffResults={results.cutoffResults || results.streamCutoffs || []}
/>
```

- [ ] **Step 3: Add translation keys**

In `public/locales/en.json`, add to the `results` section:
```json
"enterName": "Enter your name (optional)",
"downloadReport": "Download Report"
```

In `public/locales/ta.json`, add to the `results` section:
```json
"enterName": "உங்கள் பெயரை உள்ளிடவும் (விருப்பத்திற்கு)",
"downloadReport": "அறிக்கையைப் பதிவிறக்கு"
```

- [ ] **Step 4: Verify in browser**

Navigate to calculator, enter marks, view results. Verify:
- Name input field and Download button appear
- Clicking Download generates a PDF
- PDF contains student info, cutoff scores, and grouped courses

- [ ] **Step 5: Commit**

```bash
git add src/components/results/DownloadReport.jsx src/pages/Results.jsx public/locales/en.json public/locales/ta.json
git commit -m "feat: add Download Report button with PDF generation on Results page"
```

---

### Task 14: Final integration test

- [ ] **Step 1: Start dev server and test all flows**

Run: `cd "/Users/dineshlearning/Documents/make money/educaption-cutoff" && npm run dev`

Test matrix:
1. **SCI-10 student** (has M, P, C, B) — should see Engineering, Law (all 5), TANUVAS, TNAU, Fisheries, Paramedical courses. TNAU should show multiple cutoff groups.
2. **ART-1 student** — should see Law (B.A. LL.B., B.B.A. LL.B., B.A. LL.B., B.Com. LL.B.), Fisheries B.Voc, Paramedical Diploma (Voc) for Diploma in Nursing.
3. **VOC-7 student** — should see Engineering (vocational), Law standard courses, Fisheries B.Voc.
4. **SCI-14 student** — should see BotZoo formulas for TANUVAS, TNAU, Fisheries, Paramedical.
5. **Events page** — navigate to `/events`, verify table loads.
6. **PDF download** — enter marks, generate PDF, open and verify contents.
7. **Tamil toggle** — switch language, verify all new UI labels translate.

- [ ] **Step 2: Fix any issues found**

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete CR1 implementation — formulas, courses, events, PDF reports"
```
