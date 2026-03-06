# Cutoff Formula Correction & Airtable Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix cutoff formulas to match official TN admission formulas, migrate from Supabase to Airtable for admin-friendly data management.

**Architecture:** Replace Supabase with Airtable as the data backend. Airtable provides a spreadsheet-like UI the client can manage directly. Frontend fetches data via Airtable REST API. Formulas stored per-admission-body (TNEA, TNDALU, TNAU, etc.) with course-level formula overrides.

**Tech Stack:** React + Vite (existing), Airtable REST API, TanStack React Query (existing)

---

## Summary of Changes

### Current Problems
1. **Wrong formulas** - Current: `M/2 + P/4 + C/4` for Engineering. Correct: `M + P/2 + C/2`
2. **Missing admission bodies** - No TNDALU, TANUVAS, TNAU, TNJFU, Paramedical
3. **Missing subject lists** - No configurable optional subject lists (List A-E)
4. **Supabase** - Client can't manage data easily. Switching to Airtable for direct access.

### Correct Formulas (from client PDF)

| Admission | Course | Formula | Max |
|-----------|--------|---------|-----|
| TNEA | All Engineering | `M + P/2 + C/2` | 200 |
| TNDALU | All Law | `(S3 + S4 + S5 + S6) / 4` | 100 |
| TANUVAS | BVSC | `B + P/2 + C/2` | 200 |
| TANUVAS | B.Tech Food/Poultry/Dairy | `B/2 + P/2 + C/2 + M/2` | 200 |
| TNAU | B.Sc Agri/Horti/Forestry | `B/2 + P/2 + C/2 + LIST_A/2` | 200 |
| TNAU | B.Tech Agri Engineering | `M + P/2 + C/2` | 200 |
| TNJFU | B.F.Sc | `B + P/2 + C/2` | 200 |
| Paramedical | Nursing/Pharmacy/Physio | `B + P/2 + C/2` | 200 |

### Subject Lists (for TNAU courses)
- **LIST_A:** Biotechnology, Microbiology, Biochemistry, CS, IT, Informatics Practices, Home Science, Agriculture, Horticulture, Environmental Science
- **LIST_B:** List A + Nutrition and Dietetics
- **LIST_C:** CS, IT, Informatics Practices
- **LIST_D:** Biotechnology, Microbiology, Biochemistry, CS, Home Science, Agriculture, Horticulture, Informatics Practices, Environmental Science
- **LIST_E:** CS, Informatics Practices

---

## Airtable Schema Design

### Base: `Educaption Cutoff`

#### Table: `Admission Bodies`
| Field | Type | Example |
|-------|------|---------|
| Name | Text | TNEA |
| Name_Tamil | Text | தமிழ்நாடு பொறியியல் சேர்க்கை |
| Description | Long Text | Tamil Nadu Engineering Admissions |
| Website | URL | https://tneaonline.org |
| Max_Cutoff | Number | 200 |
| Default_Formula | Text | M + P/2 + C/2 |

#### Table: `Courses`
| Field | Type | Example |
|-------|------|---------|
| Name | Text | B.E. Computer Science |
| Name_Tamil | Text | கணினி அறிவியல் பொறியியல் |
| Admission_Body | Link to Admission Bodies | TNEA |
| Formula_Override | Text | (blank = use default) |
| Duration | Text | 4 years |
| Eligible_Groups | Multiple Select | 1, 2, 4 |
| Subject_List | Link to Subject Lists | (for TNAU courses) |

#### Table: `Groups`
| Field | Type | Example |
|-------|------|---------|
| Code | Text | 1 |
| Name | Text | Physics, Chemistry, Maths, Biology |
| Name_Tamil | Text | இயற்பியல், வேதியியல், கணிதம், உயிரியல் |
| Subjects | Long Text (JSON) | ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Tamil"] |

#### Table: `Subject Lists`
| Field | Type | Example |
|-------|------|---------|
| Name | Text | LIST_A |
| Subjects | Long Text | Biotechnology, Microbiology, Biochemistry... |

#### Table: `Categories`
| Field | Type | Example |
|-------|------|---------|
| Code | Text | BC |
| Name | Text | Backward Class |
| Name_Tamil | Text | பிற்படுத்தப்பட்ட வகுப்பு |

#### Table: `Colleges`
(Same as current schema)

#### Table: `Counselling`
(Same as current schema, linked to Admission Bodies instead of Streams)

---

## Task Breakdown

### Task 1: Set Up Airtable Base and Tables

**Files:**
- Create: `docs/airtable-setup.md`

**Step 1: Create Airtable base**

Manual step - create base in Airtable:
1. Go to airtable.com, create base "Educaption Cutoff"
2. Create tables: Admission Bodies, Courses, Groups, Subject Lists, Categories, Colleges, Counselling
3. Set up fields as per schema above
4. Note down Base ID and generate API key

**Step 2: Document the setup**

Create `docs/airtable-setup.md` with base ID placeholder and table structure.

**Step 3: Commit**

```bash
git add docs/airtable-setup.md
git commit -m "docs: add Airtable schema documentation"
```

---

### Task 2: Create Airtable Client Library

**Files:**
- Create: `src/lib/airtable.js`
- Delete: `src/lib/supabase.js`

**Step 1: Write the Airtable client**

```javascript
// src/lib/airtable.js
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.warn('Missing Airtable environment variables - using mock data')
}

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`

async function fetchTable(tableName, options = {}) {
  const { filterByFormula, sort, maxRecords } = options

  const params = new URLSearchParams()
  if (filterByFormula) params.append('filterByFormula', filterByFormula)
  if (sort) params.append('sort[0][field]', sort.field)
  if (sort?.direction) params.append('sort[0][direction]', sort.direction)
  if (maxRecords) params.append('maxRecords', maxRecords)

  const url = `${BASE_URL}/${encodeURIComponent(tableName)}?${params}`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.status}`)
  }

  const data = await response.json()
  return data.records.map(record => ({
    id: record.id,
    ...record.fields
  }))
}

export const airtable = {
  fetchTable,

  async getAdmissionBodies() {
    return fetchTable('Admission Bodies')
  },

  async getCourses() {
    return fetchTable('Courses')
  },

  async getGroups() {
    return fetchTable('Groups')
  },

  async getSubjectLists() {
    return fetchTable('Subject Lists')
  },

  async getCategories() {
    return fetchTable('Categories')
  },

  async getColleges() {
    return fetchTable('Colleges')
  },

  async getCounselling() {
    return fetchTable('Counselling')
  }
}
```

**Step 2: Run linter to verify syntax**

Run: `npm run build 2>&1 | head -20`
Expected: No syntax errors (build may fail due to missing env vars, that's ok)

**Step 3: Commit**

```bash
git add src/lib/airtable.js
git rm src/lib/supabase.js
git commit -m "feat: replace Supabase client with Airtable client"
```

---

### Task 3: Update React Query Hooks for Airtable

**Files:**
- Modify: `src/hooks/queries/useGroups.js`
- Modify: `src/hooks/queries/useStreams.js` → rename to `useAdmissionBodies.js`
- Modify: `src/hooks/queries/useCourses.js`
- Modify: `src/hooks/queries/useCategories.js`
- Modify: `src/hooks/queries/index.js`
- Create: `src/hooks/queries/useSubjectLists.js`

**Step 1: Update useGroups.js**

```javascript
// src/hooks/queries/useGroups.js
import { useQuery } from '@tanstack/react-query'
import { airtable } from '../../lib/airtable'

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () => airtable.getGroups(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(group => ({
      id: group.id,
      code: group.Code,
      name: group.Name,
      name_ta: group.Name_Tamil,
      subjects: JSON.parse(group.Subjects || '[]')
    }))
  })
}
```

**Step 2: Create useAdmissionBodies.js (replaces useStreams.js)**

```javascript
// src/hooks/queries/useAdmissionBodies.js
import { useQuery } from '@tanstack/react-query'
import { airtable } from '../../lib/airtable'

export function useAdmissionBodies() {
  return useQuery({
    queryKey: ['admissionBodies'],
    queryFn: () => airtable.getAdmissionBodies(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(body => ({
      id: body.id,
      name: body.Name,
      name_ta: body.Name_Tamil,
      description: body.Description,
      website: body.Website,
      max_cutoff: body.Max_Cutoff || 200,
      default_formula: body.Default_Formula
    }))
  })
}
```

**Step 3: Update useCourses.js**

```javascript
// src/hooks/queries/useCourses.js
import { useQuery } from '@tanstack/react-query'
import { airtable } from '../../lib/airtable'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => airtable.getCourses(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(course => ({
      id: course.id,
      name: course.Name,
      name_ta: course.Name_Tamil,
      admission_body_id: course.Admission_Body?.[0], // Airtable returns linked records as array
      formula_override: course.Formula_Override || null,
      duration: course.Duration,
      eligible_groups: course.Eligible_Groups || [],
      subject_list_id: course.Subject_List?.[0] || null
    }))
  })
}
```

**Step 4: Create useSubjectLists.js**

```javascript
// src/hooks/queries/useSubjectLists.js
import { useQuery } from '@tanstack/react-query'
import { airtable } from '../../lib/airtable'

export function useSubjectLists() {
  return useQuery({
    queryKey: ['subjectLists'],
    queryFn: () => airtable.getSubjectLists(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(list => ({
      id: list.id,
      name: list.Name,
      subjects: list.Subjects?.split(',').map(s => s.trim()) || []
    }))
  })
}
```

**Step 5: Update useCategories.js**

```javascript
// src/hooks/queries/useCategories.js
import { useQuery } from '@tanstack/react-query'
import { airtable } from '../../lib/airtable'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => airtable.getCategories(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(cat => ({
      id: cat.id,
      code: cat.Code,
      name: cat.Name,
      name_ta: cat.Name_Tamil
    }))
  })
}
```

**Step 6: Update index.js exports**

```javascript
// src/hooks/queries/index.js
export { useGroups } from './useGroups'
export { useAdmissionBodies } from './useAdmissionBodies'
export { useCourses } from './useCourses'
export { useCategories } from './useCategories'
export { useSubjectLists } from './useSubjectLists'
export { useColleges } from './useColleges'
export { useCounselling } from './useCounselling'
```

**Step 7: Delete old useStreams.js**

```bash
git rm src/hooks/queries/useStreams.js
```

**Step 8: Commit**

```bash
git add src/hooks/queries/
git commit -m "feat: update React Query hooks for Airtable data structure"
```

---

### Task 4: Rewrite Calculator Logic with Correct Formulas

**Files:**
- Modify: `src/lib/calculator.js`

**Step 1: Read current calculator.js**

(Already read above)

**Step 2: Rewrite calculator.js with new formula system**

```javascript
// src/lib/calculator.js

/**
 * Subject code mapping for formula parsing
 */
const SUBJECT_CODE_MAP = {
  'M': ['Mathematics', 'Maths', 'MATHEMATICS', 'MATHS', 'Business Mathematics'],
  'P': ['Physics', 'PHYSICS'],
  'C': ['Chemistry', 'CHEMISTRY'],
  'B': ['Biology', 'BIOLOGY'],
  'BOT': ['Botany', 'BOTANY'],
  'ZOO': ['Zoology', 'ZOOLOGY'],
  'CS': ['Computer Science', 'COMPUTER SCIENCE'],
  'IT': ['Information Technology', 'INFORMATION TECHNOLOGY'],
  'S3': ['Subject3'], // For TNDALU - 3rd subject in marksheet
  'S4': ['Subject4'], // 4th subject
  'S5': ['Subject5'], // 5th subject
  'S6': ['Subject6'], // 6th subject (optional)
}

/**
 * Gets subject code from subject name
 */
function getSubjectCode(subjectName) {
  const normalized = subjectName.trim().toLowerCase()

  for (const [code, names] of Object.entries(SUBJECT_CODE_MAP)) {
    if (names.some(name => name.toLowerCase() === normalized)) {
      return code
    }
  }

  return subjectName.charAt(0).toUpperCase()
}

/**
 * Creates marks lookup from subjects array and marks object
 */
function createMarksLookup(subjects, marks) {
  const lookup = {}

  subjects.forEach((subject, index) => {
    const code = getSubjectCode(subject)
    lookup[code] = parseFloat(marks[subject]) || 0

    // Also add positional codes for TNDALU formula
    lookup[`S${index + 1}`] = parseFloat(marks[subject]) || 0
  })

  // Handle Biology = Botany + Zoology average if both present
  if (lookup['BOT'] !== undefined && lookup['ZOO'] !== undefined && lookup['B'] === undefined) {
    lookup['B'] = (lookup['BOT'] + lookup['ZOO']) / 2
  }

  return lookup
}

/**
 * Resolves subject list placeholder in formula
 * @param {string} formula - Formula with LIST_X placeholder
 * @param {Object} marks - Marks lookup
 * @param {Array} subjectListSubjects - Subjects in the list
 * @returns {string} Formula with LIST_X replaced by actual mark
 */
function resolveSubjectList(formula, marks, subjectListSubjects) {
  const listMatch = formula.match(/LIST_[A-E]/)
  if (!listMatch || !subjectListSubjects) return formula

  // Find which subject from the list the student has
  let listSubjectMark = 0
  for (const subject of subjectListSubjects) {
    const code = getSubjectCode(subject)
    if (marks[code] !== undefined && marks[code] > 0) {
      listSubjectMark = marks[code]
      break
    }
  }

  return formula.replace(/LIST_[A-E]/g, listSubjectMark.toString())
}

/**
 * Calculates cutoff using formula string
 * @param {string} formula - Formula like "M + P/2 + C/2"
 * @param {Object} marks - Marks lookup with subject codes as keys
 * @param {Array} subjectListSubjects - Optional subject list for TNAU courses
 * @returns {number} Calculated cutoff rounded to 2 decimals
 */
export function calculateCutoff(formula, marks, subjectListSubjects = null) {
  if (!formula || typeof formula !== 'string') return 0

  let expression = formula.toUpperCase()

  // Resolve subject list if present
  expression = resolveSubjectList(expression, marks, subjectListSubjects)

  // Sort codes by length (longest first) to avoid partial replacements
  const codes = Object.keys(marks).sort((a, b) => b.length - a.length)

  for (const code of codes) {
    const value = marks[code] || 0
    const regex = new RegExp(`\\b${code}\\b`, 'g')
    expression = expression.replace(regex, value.toString())
  }

  // Validate expression only contains numbers and math operators
  if (!/^[\d\s+\-*/().]+$/.test(expression)) {
    console.warn('Invalid formula expression:', expression)
    return 0
  }

  try {
    const result = new Function(`return ${expression}`)()
    return Math.round(result * 100) / 100
  } catch (error) {
    console.error('Error calculating cutoff:', error)
    return 0
  }
}

/**
 * Calculates cutoffs for all eligible courses based on group
 * @param {Array} courses - Courses with admission body and formula
 * @param {Array} admissionBodies - Admission bodies with default formulas
 * @param {Object} group - Selected group with subjects
 * @param {Object} marks - Subject marks
 * @param {Array} subjectLists - Subject lists for TNAU courses
 * @returns {Array} Calculated cutoffs per course
 */
export function calculateCourseCutoffs(courses, admissionBodies, group, marks, subjectLists = []) {
  if (!courses || !admissionBodies || !group || !marks) return []

  const marksLookup = createMarksLookup(group.subjects || [], marks)
  const results = []

  // Create lookup for admission bodies
  const bodyLookup = {}
  admissionBodies.forEach(body => {
    bodyLookup[body.id] = body
  })

  // Create lookup for subject lists
  const listLookup = {}
  subjectLists.forEach(list => {
    listLookup[list.id] = list.subjects
  })

  for (const course of courses) {
    // Check if group is eligible for this course
    const isEligible = course.eligible_groups?.includes(group.code)
    if (!isEligible) continue

    const admissionBody = bodyLookup[course.admission_body_id]
    if (!admissionBody) continue

    // Use course formula override or admission body default
    const formula = course.formula_override || admissionBody.default_formula
    if (!formula) continue

    // Get subject list if course uses one
    const subjectListSubjects = course.subject_list_id
      ? listLookup[course.subject_list_id]
      : null

    const cutoff = calculateCutoff(formula, marksLookup, subjectListSubjects)

    results.push({
      courseId: course.id,
      courseName: course.name,
      courseNameTa: course.name_ta,
      admissionBodyId: admissionBody.id,
      admissionBodyName: admissionBody.name,
      formula,
      cutoff,
      maxCutoff: admissionBody.max_cutoff || 200
    })
  }

  return results.sort((a, b) => b.cutoff - a.cutoff)
}

/**
 * Validates marks input
 */
export function validateMarks(marks, subjects) {
  const errors = {}

  for (const subject of subjects) {
    const mark = marks[subject]

    if (mark === undefined || mark === '' || mark === null) {
      errors[subject] = 'Mark is required'
    } else {
      const numMark = parseFloat(mark)
      if (isNaN(numMark)) {
        errors[subject] = 'Must be a number'
      } else if (numMark < 0) {
        errors[subject] = 'Cannot be negative'
      } else if (numMark > 100) {
        errors[subject] = 'Cannot exceed 100'
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

**Step 3: Run tests**

Run: `npm test -- --run`
Expected: Tests should pass (may need to update tests)

**Step 4: Commit**

```bash
git add src/lib/calculator.js
git commit -m "feat: rewrite calculator with correct TN admission formulas"
```

---

### Task 5: Update useCalculator Hook

**Files:**
- Modify: `src/hooks/useCalculator.js`

**Step 1: Read current file**

(Already read above)

**Step 2: Update hook for new data structure**

```javascript
// src/hooks/useCalculator.js
import { useMemo, useCallback } from 'react'
import { useGroups } from './queries/useGroups'
import { useAdmissionBodies } from './queries/useAdmissionBodies'
import { useCategories } from './queries/useCategories'
import { useCourses } from './queries/useCourses'
import { useSubjectLists } from './queries/useSubjectLists'
import { calculateCourseCutoffs, validateMarks } from '../lib/calculator'

export function useCalculator() {
  const { data: groups = [], isLoading: groupsLoading, error: groupsError } = useGroups()
  const { data: admissionBodies = [], isLoading: bodiesLoading, error: bodiesError } = useAdmissionBodies()
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useCourses()
  const { data: subjectLists = [], isLoading: listsLoading, error: listsError } = useSubjectLists()

  const isLoading = groupsLoading || bodiesLoading || categoriesLoading || coursesLoading || listsLoading
  const error = groupsError || bodiesError || categoriesError || coursesError || listsError

  const getGroupById = useCallback((groupId) => {
    return groups.find(g => g.id === groupId) || null
  }, [groups])

  const getGroupByCode = useCallback((groupCode) => {
    return groups.find(g => g.code === groupCode) || null
  }, [groups])

  const getSubjectsForGroup = useCallback((groupId) => {
    const group = getGroupById(groupId)
    return group?.subjects || []
  }, [getGroupById])

  const calculateCutoffs = useCallback((groupId, marks) => {
    const group = getGroupById(groupId)
    if (!group) return []

    return calculateCourseCutoffs(courses, admissionBodies, group, marks, subjectLists)
  }, [getGroupById, courses, admissionBodies, subjectLists])

  const validateGroupMarks = useCallback((groupId, marks) => {
    const subjects = getSubjectsForGroup(groupId)
    return validateMarks(marks, subjects)
  }, [getSubjectsForGroup])

  const groupOptions = useMemo(() => {
    return groups.map(group => ({
      value: group.id,
      label: `Group ${group.code} - ${group.name}`
    }))
  }, [groups])

  const categoryOptions = useMemo(() => {
    return categories.map(category => ({
      value: category.id,
      label: `${category.code} - ${category.name}`
    }))
  }, [categories])

  // Group courses by admission body for display
  const coursesByAdmissionBody = useMemo(() => {
    const grouped = {}
    courses.forEach(course => {
      const bodyId = course.admission_body_id
      if (!grouped[bodyId]) {
        const body = admissionBodies.find(b => b.id === bodyId)
        grouped[bodyId] = {
          admissionBody: body,
          courses: []
        }
      }
      grouped[bodyId].courses.push(course)
    })
    return Object.values(grouped)
  }, [courses, admissionBodies])

  return {
    groups,
    admissionBodies,
    categories,
    courses,
    subjectLists,

    isLoading,
    error,

    groupOptions,
    categoryOptions,
    coursesByAdmissionBody,

    getGroupById,
    getGroupByCode,
    getSubjectsForGroup,
    calculateCutoffs,
    validateGroupMarks
  }
}
```

**Step 3: Commit**

```bash
git add src/hooks/useCalculator.js
git commit -m "feat: update useCalculator hook for new Airtable data structure"
```

---

### Task 6: Update Results Display Components

**Files:**
- Modify: `src/components/calculator/ResultsDisplay.jsx`
- Modify: `src/components/results/EligibleCoursesCard.jsx`

**Step 1: Read current components**

**Step 2: Update ResultsDisplay.jsx**

Update to display results grouped by admission body (TNEA, TNDALU, etc.) instead of generic streams.

**Step 3: Update EligibleCoursesCard.jsx**

Update to show admission body name and correct cutoff display.

**Step 4: Commit**

```bash
git add src/components/calculator/ResultsDisplay.jsx
git add src/components/results/EligibleCoursesCard.jsx
git commit -m "feat: update results display for admission body grouping"
```

---

### Task 7: Update Environment Variables

**Files:**
- Modify: `.env.example`
- Create: `.env.local` (local only, not committed)

**Step 1: Update .env.example**

```
# Airtable Configuration
VITE_AIRTABLE_API_KEY=your_airtable_api_key
VITE_AIRTABLE_BASE_ID=your_base_id
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: update env example for Airtable configuration"
```

---

### Task 8: Seed Airtable with Correct Data

**Files:**
- Create: `scripts/airtable-seed-data.json`

**Step 1: Create seed data JSON**

JSON file containing all admission bodies, courses, groups, subject lists with correct formulas from the client PDF.

**Step 2: Document import process**

Add instructions to `docs/airtable-setup.md` for importing the seed data.

**Step 3: Commit**

```bash
git add scripts/airtable-seed-data.json
git add docs/airtable-setup.md
git commit -m "feat: add Airtable seed data with correct TN formulas"
```

---

### Task 9: Update package.json - Remove Supabase

**Files:**
- Modify: `package.json`

**Step 1: Read current package.json**

(Already read above)

**Step 2: Remove Supabase dependency**

```bash
npm uninstall @supabase/supabase-js
```

**Step 3: Verify and commit**

```bash
npm install
npm run build
git add package.json package-lock.json
git commit -m "chore: remove Supabase dependency"
```

---

### Task 10: Update Documentation

**Files:**
- Modify: `docs/DATABASE_SETUP.md` → rename to `docs/AIRTABLE_SETUP.md`
- Delete: `docs/database/schema.sql`
- Delete: `scripts/setup-database.sql`
- Delete: `scripts/seed-data.sql`
- Delete: `scripts/reset-and-setup.sql`

**Step 1: Create comprehensive Airtable setup guide**

**Step 2: Clean up old Supabase files**

```bash
git rm docs/DATABASE_SETUP.md
git rm docs/database/schema.sql
git rm scripts/setup-database.sql
git rm scripts/seed-data.sql
git rm scripts/reset-and-setup.sql
```

**Step 3: Commit**

```bash
git add docs/AIRTABLE_SETUP.md
git commit -m "docs: replace Supabase docs with Airtable setup guide"
```

---

### Task 11: Test Full Flow

**Files:**
- None (testing only)

**Step 1: Start dev server**

Run: `npm run dev`

**Step 2: Test calculator flow**

1. Select Group 1 (Physics, Chemistry, Maths, Biology)
2. Enter marks: Physics=90, Chemistry=85, Maths=95, Biology=80
3. Verify TNEA cutoff = 95 + 90/2 + 85/2 = 95 + 45 + 42.5 = 182.5
4. Verify results show courses grouped by admission body

**Step 3: Test TNDALU formula**

1. Select Group 8 (Arts)
2. Enter marks for all subjects
3. Verify Law cutoff = average of 4 subjects

**Step 4: Document any issues found**

---

### Task 12: Final Cleanup and Commit

**Step 1: Run full test suite**

Run: `npm test -- --run`

**Step 2: Run build**

Run: `npm run build`

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete migration to Airtable with correct TN cutoff formulas"
```

---

## Post-Implementation

### Client Handoff
1. Share Airtable base with client (Editor access)
2. Walk through how to edit formulas, add courses, update groups
3. Explain the formula syntax (M, P, C, B, etc.)

### Future Considerations
- Add caching layer if Airtable rate limits become an issue
- Consider Airtable Sync for real-time updates
- Add admin preview mode to test formula changes before publishing
