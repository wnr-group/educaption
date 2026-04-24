# Change Request CR1 — Design Spec

**Date:** 2026-04-24
**CR Number:** CR1
**Requested By:** Deepan (Educaption)
**Source PDF:** formula II 2.pdf
**Source Doc:** Change Request - Educaption.pdf

---

## 1. Overview

Five changes to the Educaption cutoff calculator platform:

1. **Formula/Course Restructuring** — new courses, formulas, subject lists, and course sub-categories
2. **Results Grouping** — group courses by distinct cutoff values within each admission body (no formula exposed)
3. **PDF Report Generation** — downloadable branded PDF with student info, cutoffs, and eligible courses
4. **Events Page** — Airtable-managed table of counselling dates with search and filter
5. **Law Expansion** — 5 specific law courses replacing 1 generic entry (covered in #1)

---

## 2. Formula/Course Restructuring

### 2.1 New Subject Lists

Add 3 new subject lists to Airtable:

| List | Subjects (exact from PDF) |
|---|---|
| LIST_G | Commerce |
| LIST_H | Computer Science, Computer Application |
| LIST_I | Commerce, Geography, Agricultural Science-Theory, Nursing (Vocational)-Theory, Accountancy-Theory, Accountancy-Theory, Food Service Management-Theory, Textile and Dress Designing-Theory, Basic Automobile Engineering-Theory, Basic Civil Engineering-Theory, Basic Electrical Engineering-Theory, Basic Electronics Engineering-Theory, Basic Mechanical Engineering-Theory, Textile Technology-Theory |

### 2.2 New Admission Bodies

Add 5 new admission body records:

| Name | Default Formula | Max Cutoff | Category |
|---|---|---|---|
| TNAU Diploma (Bio) | Biology + Physics/2 + Chemistry/2 | 200 | Agriculture |
| TNAU Diploma (Maths) | Maths + Physics/2 + Chemistry/2 | 200 | Agriculture |
| Paramedical Diploma (Bio) | Biology/2 + Physics/4 + Chemistry/4 | 100 | Medical & Paramedical |
| Paramedical Diploma (Maths) | Maths/2 + Physics/4 + Chemistry/4 | 100 | Medical & Paramedical |
| Paramedical Diploma (Voc) | (S3 + LIST_I + S5 + S6) / 4 | 100 | Medical & Paramedical |

### 2.3 Bug Fixes

1. **Pharmacy formula**: Change `Physics/2 + Chemistry/2 + LIST_F/2` to `Physics/2 + Chemistry/2 + LIST_F` (no /2 on LIST_F). PDF is source of truth.
2. **VOC-2 eligibility**: Add VOC-2 to eligible groups for TNAU Agriculture Vocational, TANUVAS BVSC Vocational, and Fisheries Vocational.
3. **LIST regex**: Change `LIST_[A-F]` to `LIST_[A-I]` in `calculator.js` `resolveSubjectList()`.

### 2.4 New Data Field: Course_Category

Add a `Course_Category` text field to the Courses table in Airtable. Used for display grouping only — no calculation logic.

Engineering sub-categories:
- Computer / IT & Data Science
- Mechanical & Production
- Civil & Infrastructure
- Electrical & Electronics
- Aerospace
- Chemical & Materials
- Bio / Medical
- Agriculture
- Textile / Fashion
- Food & Packaging
- Robotics
- Industrial
- Geo

### 2.5 Course Entries — Complete List

Total: 243 course entries (current 81 → +162 new).

#### S.No 1: ENGINEERING – TNEA (140 entries = 70 science + 70 vocational)

Each of the 70 courses below gets TWO entries:
- One under **TNEA** (eligible: SCI-1..5, SCI-10)
- One under **TNEA - Vocational** (eligible: VOC-7..12)

| # | Course Name | Course_Category |
|---|---|---|
| 1 | Artificial Intelligence and Data Science | Computer / IT & Data Science |
| 2 | Computer and Communication Engineering | Computer / IT & Data Science |
| 3 | Computer Science and Business System | Computer / IT & Data Science |
| 4 | Computer Science and Engineering | Computer / IT & Data Science |
| 5 | Computer Science and Engineering (Tamil Medium) | Computer / IT & Data Science |
| 6 | Computer Science and Engineering (AI and Machine Learning) | Computer / IT & Data Science |
| 7 | Computer Science and Engineering (Big Data Analytics) | Computer / IT & Data Science |
| 8 | Computer Science and Engineering (IoT & Cyber Security including Blockchain) | Computer / IT & Data Science |
| 9 | Computer Science and Technology | Computer / IT & Data Science |
| 10 | Cyber Security | Computer / IT & Data Science |
| 11 | Information Science and Engineering | Computer / IT & Data Science |
| 12 | Information Technology | Computer / IT & Data Science |
| 13 | Automobile Engineering | Mechanical & Production |
| 14 | Manufacturing Engineering | Mechanical & Production |
| 15 | Marine Engineering | Mechanical & Production |
| 16 | Mechanical (Manufacturing) | Mechanical & Production |
| 17 | Mechanical and Automation Engineering | Mechanical & Production |
| 18 | Mechanical and Mechatronics Engineering (Additive Manufacturing) | Mechanical & Production |
| 19 | Mechanical Engineering | Mechanical & Production |
| 20 | Mechanical Engineering (Tamil Medium) | Mechanical & Production |
| 21 | Mechanical Engineering (Sandwich) | Mechanical & Production |
| 22 | Mechatronics | Mechanical & Production |
| 23 | Mining Engineering | Mechanical & Production |
| 24 | Production Engineering | Mechanical & Production |
| 25 | Production Engineering (Sandwich) | Mechanical & Production |
| 26 | Architecture | Civil & Infrastructure |
| 27 | Civil Engineering | Civil & Infrastructure |
| 28 | Civil Engineering (Tamil Medium) | Civil & Infrastructure |
| 29 | Civil Engineering and Planning | Civil & Infrastructure |
| 30 | Civil and Structural Engineering | Civil & Infrastructure |
| 31 | Environmental Engineering | Civil & Infrastructure |
| 32 | Electrical and Electronics | Electrical & Electronics |
| 33 | Electrical and Electronics Engineering | Electrical & Electronics |
| 34 | Electronics and Communication Engineering | Electrical & Electronics |
| 35 | Electronics and Instrumentation Engineering | Electrical & Electronics |
| 36 | Electronics and Telecommunication Engineering | Electrical & Electronics |
| 37 | Instrumentation and Control Engineering | Electrical & Electronics |
| 38 | Medical Electronics Engineering | Electrical & Electronics |
| 39 | Aeronautical Engineering | Aerospace |
| 40 | Aerospace Engineering | Aerospace |
| 41 | Ceramic Technology | Chemical & Materials |
| 42 | Chemical Engineering | Chemical & Materials |
| 43 | Chemical and Electro Chemical Engineering | Chemical & Materials |
| 44 | Material Science and Engineering | Chemical & Materials |
| 45 | Metallurgical Engineering | Chemical & Materials |
| 46 | Petro Chemical Technology | Chemical & Materials |
| 47 | Petrochemical Engineering | Chemical & Materials |
| 48 | Petroleum Engineering | Chemical & Materials |
| 49 | Petroleum Engineering and Technology | Chemical & Materials |
| 50 | Polymer Technology | Chemical & Materials |
| 51 | Plastic Technology | Chemical & Materials |
| 52 | Rubber and Plastic Technology | Chemical & Materials |
| 53 | Bio Technology | Bio / Medical |
| 54 | BioMedical Engineering | Bio / Medical |
| 55 | Industrial BioTechnology | Bio / Medical |
| 56 | Nano Science and Technology | Bio / Medical |
| 57 | Agriculture Engineering | Agriculture |
| 58 | Agricultural and Irrigation Engineering | Agriculture |
| 59 | Apparel Technology | Textile / Fashion |
| 60 | Fashion Technology | Textile / Fashion |
| 61 | Handloom and Textile Technology | Textile / Fashion |
| 62 | Leather Technology | Textile / Fashion |
| 63 | Textile Chemistry | Textile / Fashion |
| 64 | Textile Technology | Textile / Fashion |
| 65 | Food Technology | Food & Packaging |
| 66 | Printing and Packaging Technology | Food & Packaging |
| 67 | Robotics and Automation | Robotics |
| 68 | Industrial Engineering | Industrial |
| 69 | Industrial Engineering and Management | Industrial |
| 70 | Geoinformatics | Geo |

#### S.No 2: LAW – TNDALU (5 entries replacing 1 generic)

| Course | Admission Body | Formula Override | Eligible Groups | Subject List |
|---|---|---|---|---|
| B.A. LL.B. (Hons.) | TNDALU | — (uses default) | ALL groups | — |
| B.B.A. LL.B. (Hons.) | TNDALU | — (uses default) | ALL groups | — |
| B.A. LL.B. | TNDALU | — (uses default) | ALL groups | — |
| B.Com. LL.B. (Hons.) | TNDALU | (S3 + LIST_G + S5 + S6) / 4 | ART-1..8, VOC-3, VOC-4 | LIST_G |
| B.C.A. LL.B. (Hons.) | TNDALU | (S3 + S4 + S5 + LIST_H) / 4 | SCI-1, SCI-7, ART-1, ART-10, VOC-4 | LIST_H |

#### S.No 3: VETERINARY SCIENCE – TANUVAS (no changes)

Existing entries: B.V.Sc & A.H. (science) + B.V.Sc & A.H. - Vocational. No changes needed.

#### S.No 4: VETERINARY TECHNOLOGY – TANUVAS (no changes)

Existing entries: B.Tech Food Tech, B.Tech Poultry Tech, B.Tech Dairy Tech. No changes needed.

#### S.No 5: AGRICULTURE – TNAU UG (+4 entries)

New entries to add:

| Course | Admission Body | Eligible Groups | Subject List |
|---|---|---|---|
| B.Sc. (Hons.) Agriculture (Tamil Medium) | TNAU - Agriculture | SCI-6..13 | LIST_A |
| B.Sc. (Hons.) Agriculture (Tamil Medium) - BotZoo | TNAU - Agriculture - BotZoo | SCI-14 | — |
| B.Sc. (Hons.) Horticulture (Tamil Medium) | TNAU - Agriculture | SCI-6..13 | LIST_A |
| B.Sc. (Hons.) Horticulture (Tamil Medium) - BotZoo | TNAU - Agriculture - BotZoo | SCI-14 | — |

Existing 26 entries unchanged.

#### S.No 6 & 7: AGRICULTURE – TNAU DIPLOMA (+4 entries, all new)

| Course | Admission Body | Eligible Groups |
|---|---|---|
| Diploma in Agriculture | TNAU Diploma (Bio) | SCI-6..14 |
| Diploma in Agriculture (Tamil Medium) | TNAU Diploma (Bio) | SCI-6..14 |
| Diploma in Horticulture | TNAU Diploma (Bio) | SCI-6..14 |
| Diploma in Agricultural Engineering | TNAU Diploma (Maths) | SCI-1..5, SCI-10 |

#### S.No 8: FISHERIES SCIENCE – TNJFU (no changes)

Existing 3 entries (science + BotZoo + vocational) unchanged.

#### S.No 9: FISHERIES TECHNOLOGY – TNJFU (no changes)

Existing 3 entries unchanged.

#### S.No 11: FISHERIES VOCATIONAL – TNJFU (no changes)

Existing 3 entries unchanged.

#### S.No 12: PARAMEDICAL DEGREE (no changes)

Existing 38 entries unchanged. Bug fix: pharmacy formula `LIST_F` not `LIST_F/2`.

#### S.No 13, 14, 15: PARAMEDICAL DIPLOMA (+12 entries, all new)

| Course | Admission Body | Eligible Groups |
|---|---|---|
| Diploma in Dental Mechanic | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Dental Hygienist | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Medical Laboratory Technology | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Radio Diagnosis Technology | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Radio Therapy Technology | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Home Health Care | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Opthalmic Nursing Assistant | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Nursing (Women) | Paramedical Diploma (Bio) | SCI-6..14 |
| Diploma in Optometry | Paramedical Diploma (Maths) | SCI-1..5, SCI-10 |
| Diploma in Pharmacy | Paramedical Diploma (Maths) | SCI-1..5, SCI-10 |
| Diploma in Nursing (Women) | Paramedical Diploma (Maths) | SCI-1..5, SCI-10 |
| Diploma in Nursing (Women) | Paramedical Diploma (Voc) | VOC-1..12, ART-1..14 |

### 2.6 Formula Parser Changes (calculator.js)

1. **LIST regex**: `LIST_[A-F]` → `LIST_[A-I]`
2. **Pharmacy formula fix**: Update admission body CSV — `Physics/2 + Chemistry/2 + LIST_F` (remove /2 from LIST_F)
3. **New formula pattern**: `(S3 + LIST_X + S5 + S6) / 4` — subject list replaces a positional slot. The `resolveSubjectList()` function replaces `LIST_X` with the matched subject mark. The positional formula `(S3 + <mark> + S5 + S6) / 4` then evaluates normally. No structural code change needed beyond the regex fix — the existing formula evaluator handles this once LIST_X is replaced with a number.
4. **VOC-2 eligibility**: Add VOC-2 to eligible groups in course CSV entries for TNAU Agriculture Vocational, TANUVAS BVSC Vocational, and TNJFU Fisheries Vocational.

---

## 3. Results Grouping by Cutoff

### Current Behavior
`calculateCourseCutoffs()` groups results by admission body. One cutoff per admission body. All courses under that body shown together.

### New Behavior
Within each admission body, courses are grouped by their **calculated cutoff value**. Different cutoffs shown as separate buckets.

### Data Structure Change

Current return:
```
{
  admissionBodyName: "TNAU Agriculture",
  cutoff: 170,
  courses: [all courses]
}
```

New return:
```
{
  admissionBodyName: "TNAU Agriculture",
  cutoffGroups: [
    { cutoff: 170, maxCutoff: 200, courses: [courses with this cutoff] },
    { cutoff: 165, maxCutoff: 200, courses: [courses with this cutoff] },
    { cutoff: 160, maxCutoff: 200, courses: [courses with this cutoff] }
  ]
}
```

### UI Change
Results page shows each cutoff bucket under the admission body heading. Courses listed under their cutoff value. **No formula shown to the user.**

### Files Affected
- `src/lib/calculator.js` — `calculateCourseCutoffs()` return structure
- `src/components/calculator/ResultsDisplay.jsx` — render cutoff groups
- `src/pages/Results.jsx` — if it consumes the data structure
- `src/components/results/` — any result card/list components

---

## 4. PDF Report Generation

### Approach
Client-side PDF using **jsPDF + jsPDF-AutoTable**. No backend needed.

### Trigger
"Download Report" button on the Results page, after cutoff calculation.

### PDF Contents
1. **Header** — Educaption logo, "Cutoff Report", generation date
2. **Student Info** — Name (input field on results page), Group selected, Marks entered per subject
3. **Cutoff Scores** — Table: Admission Body | Cutoff | Max Cutoff — for each eligible body
4. **Eligible Courses** — Grouped by admission body, then by cutoff value within each body. Shows course name and course category.
5. **Footer** — Educaption branding, website URL, disclaimer

### Dependencies
- `jspdf` npm package
- `jspdf-autotable` npm package

### Files
- `src/lib/reportGenerator.js` — PDF generation logic
- `src/components/results/DownloadReport.jsx` — button component
- `public/logo.png` — embedded in PDF header

---

## 5. Events Page

### Airtable Table: Events

| Field | Type | Required |
|---|---|---|
| Date | Date | Yes |
| Event | Single line text | Yes |
| Counselling_Body | Single line text | Yes |
| Description | Long text | No |
| Color | Single line text | No (for row color mapping) |

### React Implementation

| File | Purpose |
|---|---|
| `src/hooks/queries/useEvents.js` | React Query hook to fetch events from Airtable |
| `src/pages/Events.jsx` | Events page with table, search, filters |
| `src/App.jsx` | Add `/events` route |
| `src/components/layout/Header.jsx` | Add Events nav link |

### UI Features
- Table with columns: Date, Event, Counselling Body
- Search bar (filters across all columns)
- Dropdown filter by Counselling Body
- Color-coded rows by counselling body (color mapping defined in code or from Airtable Color field)
- Sorted by date (ascending — upcoming first)
- Bilingual support (Tamil translations for column headers and counselling body names)
- Mobile responsive

---

## 6. Eligible Group Derivations (Reference)

Complete mapping of formulas to eligible groups, derived from group subjects:

| S.No | Field | Variant | Eligible Groups |
|---|---|---|---|
| 1 | TNEA | Science | SCI-1..5, SCI-10 |
| 1 | TNEA | Vocational | VOC-7..12 |
| 2 | TNDALU | Standard (3 courses) | ALL groups |
| 2 | TNDALU | B.Com. LL.B. (LIST_G) | ART-1..8, VOC-3, VOC-4 |
| 2 | TNDALU | B.C.A. LL.B. (LIST_H) | SCI-1, SCI-7, ART-1, ART-10, VOC-4 |
| 3 | TANUVAS BVSC | Science | SCI-6..14 |
| 3 | TANUVAS BVSC | Vocational | VOC-1 |
| 4 | TANUVAS B.Tech | Science | SCI-6..13, SCI-10 |
| 5 | TNAU UG | Science (LIST_A) | SCI-6..13 |
| 5 | TNAU UG | BotZoo | SCI-14 |
| 5 | TNAU UG | Vocational | VOC-1, VOC-2 |
| 5 | TNAU UG | Food Nutrition (LIST_B) | SCI-6..13 |
| 5 | TNAU UG | Food Nutrition BotZoo | SCI-14 |
| 5 | TNAU UG | Agri Engineering (LIST_C) | SCI-6..13 |
| 6 | TNAU Diploma (Bio) | — | SCI-6..14 |
| 7 | TNAU Diploma (Maths) | — | SCI-1..5, SCI-10 |
| 8 | TNJFU Fisheries | Science (LIST_D) | SCI-6..13 |
| 8 | TNJFU Fisheries | BotZoo | SCI-14 |
| 8 | TNJFU Fisheries | Vocational | VOC-1, VOC-2 |
| 9 | TNJFU B.Tech | Science (LIST_E) | SCI-1..5, SCI-10 |
| 11 | TNJFU B.Voc | AVG | ALL groups |
| 12 | Paramedical Pharmacy | Science (LIST_F) | SCI-1..13 |
| 12 | Paramedical Pharmacy | BotZoo | SCI-14 |
| 12 | Paramedical Nursing | Science | SCI-6..13 |
| 12 | Paramedical Nursing | BotZoo | SCI-14 |
| 13 | Paramedical Diploma (Bio) | — | SCI-6..14 |
| 14 | Paramedical Diploma (Maths) | — | SCI-1..5, SCI-10 |
| 15 | Paramedical Diploma (Voc) | — | VOC-1..12, ART-1..14 |

---

## 7. Subject Lists (Complete Reference)

| List | Subjects | Used By |
|---|---|---|
| LIST_A | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science | TNAU Agriculture UG |
| LIST_B | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science, Nutrition and Dietetics | TNAU Food Nutrition |
| LIST_C | Mathematics, Computer Science | TNAU Agri Engineering |
| LIST_D | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science | TNJFU Fisheries |
| LIST_E | Biology, Computer Science | TNJFU B.Tech |
| LIST_F | Biology*, Mathematics* (*1st preference Biology, then Mathematics) | Paramedical Pharmacy |
| LIST_G | Commerce | Law B.Com. LL.B. |
| LIST_H | Computer Science, Computer Application | Law B.C.A. LL.B. |
| LIST_I | Commerce, Geography, Agricultural Science-Theory, Nursing (Vocational)-Theory, Accountancy-Theory, Accountancy-Theory, Food Service Management-Theory, Textile and Dress Designing-Theory, Basic Automobile Engineering-Theory, Basic Civil Engineering-Theory, Basic Electrical Engineering-Theory, Basic Electronics Engineering-Theory, Basic Mechanical Engineering-Theory, Textile Technology-Theory | Paramedical Diploma (Voc) |

---

## 8. Tamil Translations

All new course names, admission body names, and course categories need Tamil translations (`Name_Tamil` field in Airtable). These will be added during the data entry phase. The events page UI labels also need Tamil translations in `public/locales/ta.json`.
