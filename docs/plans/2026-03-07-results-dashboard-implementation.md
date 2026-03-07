# Results Dashboard UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the results page to be course-centric, showing eligible courses grouped by category with a circular progress indicator showing total eligible courses.

**Architecture:** Update Airtable schema to add Category field to Admission Bodies, update React Query hook to fetch category, create new UI components (CircularProgress, CategorySection, CourseCard), and rewrite ResultsDisplay to use the new layout.

**Tech Stack:** React, TanStack Query, Tailwind CSS, Lucide React icons, Airtable

---

## Task 1: Update Airtable CSV with Category Field

**Files:**
- Modify: `scripts/airtable-import/1-admission-bodies.csv`

**Step 1: Update CSV file with Category column**

```csv
Name,Name_Tamil,Description,Website,Max_Cutoff,Default_Formula,Category
TNEA,தமிழ்நாடு பொறியியல் சேர்க்கை,Tamil Nadu Engineering Admissions - All engineering courses,https://tneaonline.org,200,M + P/2 + C/2,Engineering
TNDALU,தமிழ்நாடு அம்பேத்கர் சட்டப் பல்கலைக்கழகம்,Tamil Nadu Dr. Ambedkar Law University - All law courses,https://tndalu.ac.in,100,(S3 + S4 + S5 + S6) / 4,Law
TANUVAS - BVSC,தமிழ்நாடு கால்நடை மருத்துவ அறிவியல் பல்கலைக்கழகம் - BVSC,BVSC - Bachelor of Veterinary Science,https://tanuvas.ac.in,200,B + P/2 + C/2,Veterinary
TANUVAS - B.Tech,தமிழ்நாடு கால்நடை மருத்துவ அறிவியல் பல்கலைக்கழகம் - B.Tech,B.Tech Food/Poultry/Dairy Technology,https://tanuvas.ac.in,200,B/2 + P/2 + C/2 + M/2,Veterinary
TNAU - Agriculture,தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - வேளாண்மை,B.Sc Agriculture/Horticulture/Forestry/Sericulture,https://tnau.ac.in,200,B/2 + P/2 + C/2 + LIST_A/2,Agriculture
TNAU - Food Nutrition,தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - உணவு ஊட்டச்சத்து,B.Sc Food Nutrition and Dietetics,https://tnau.ac.in,200,B/2 + P/2 + C/2 + LIST_B/2,Agriculture
TNAU - Agri Engineering,தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - வேளாண் பொறியியல்,B.Tech Agricultural Engineering/Food Tech/Energy,https://tnau.ac.in,200,B/2 + P/2 + C/2 + LIST_C/2,Agriculture
TNAU - Biotechnology,தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - உயிரி தொழில்நுட்பம்,B.Tech Biotechnology/Bioinformatics,https://tnau.ac.in,200,B/2 + P/2 + C/2 + LIST_A/2,Agriculture
TNAU - Agribusiness,தமிழ்நாடு வேளாண் பல்கலைக்கழகம் - வேளாண் வணிகம்,B.Sc Agribusiness Management,https://tnau.ac.in,200,B/2 + P/2 + C/2 + LIST_D/2,Agriculture
TNJFU - Fisheries,தமிழ்நாடு மீன்வளப் பல்கலைக்கழகம் - மீன்வளவியல்,B.F.Sc - Bachelor of Fisheries Science,https://tnjfu.ac.in,200,B/2 + P/2 + C/2 + LIST_D/2,Fisheries
TNJFU - B.Tech,தமிழ்நாடு மீன்வளப் பல்கலைக்கழகம் - B.Tech,B.Tech Fisheries Engineering/Food Tech,https://tnjfu.ac.in,200,B/2 + P/2 + C/2 + LIST_E/2,Fisheries
TNJFU - B.Voc,தமிழ்நாடு மீன்வளப் பல்கலைக்கழகம் - B.Voc,B.Voc Industrial Fish Processing/Aquaculture,https://tnjfu.ac.in,100,AVG,Fisheries
TN Paramedical - Bio,தமிழ்நாடு துணைமருத்துவம் - உயிரியல்,Nursing/Physio/Radiology/MLT and other paramedical (Biology group),https://tnhealth.tn.gov.in,200,B + P/2 + C/2,Medical & Paramedical
TN Paramedical - BotZoo,தமிழ்நாடு துணைமருத்துவம் - தாவர விலங்கியல்,Paramedical courses for Botany+Zoology group,https://tnhealth.tn.gov.in,200,P/2 + C/2 + BOT/2 + ZOO/2,Medical & Paramedical
TN Pharmacy,தமிழ்நாடு மருந்தியல்,B.Pharm - Bachelor of Pharmacy,https://tnhealth.tn.gov.in,200,B + P/2 + C/2,Medical & Paramedical
```

**Step 2: Commit**

```bash
git add scripts/airtable-import/1-admission-bodies.csv
git commit -m "data: add Category field to admission bodies CSV"
```

**Step 3: User action required**

After this task, user must:
1. Go to Airtable → Admission Bodies table
2. Add new field: `Category` (Single select)
3. Delete all rows and re-import the updated CSV
4. Or manually add Category values to each row

---

## Task 2: Update useAdmissionBodies Hook

**Files:**
- Modify: `src/hooks/queries/useAdmissionBodies.js:13-21`

**Step 1: Add category field to select mapping**

```javascript
export function useAdmissionBodies() {
  return useQuery({
    queryKey: ['admissionBodies'],
    queryFn: getAdmissionBodies,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(body => ({
      id: body.id,
      name: body.Name,
      name_ta: body.Name_Tamil,
      description: body.Description,
      website: body.Website,
      max_cutoff: body.Max_Cutoff || 200,
      default_formula: body.Default_Formula,
      category: body.Category || 'Other'
    }))
  })
}
```

**Step 2: Verify the hook compiles**

Run: `npm run dev`
Expected: No errors, dev server starts

**Step 3: Commit**

```bash
git add src/hooks/queries/useAdmissionBodies.js
git commit -m "feat: add category field to useAdmissionBodies hook"
```

---

## Task 3: Add groupCoursesByCategory Helper to useCalculator

**Files:**
- Modify: `src/hooks/useCalculator.js`

**Step 1: Add the helper function after coursesByAdmissionBody (around line 134)**

```javascript
  /**
   * Group eligible courses by category for results display
   * @param {Array} eligibleCourses - Courses the student is eligible for
   * @param {Array} cutoffResults - Calculated cutoffs by admission body
   * @returns {Array} Courses grouped by category with cutoff info
   */
  const groupCoursesByCategory = useCallback((eligibleCourses, cutoffResults) => {
    const categoryMap = {}

    eligibleCourses.forEach(course => {
      const body = admissionBodies.find(b => b.name === course.admission_body_id)
      if (!body) return

      const category = body.category || 'Other'
      const cutoffResult = cutoffResults.find(r => r.admissionBodyName === body.name)

      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          courses: [],
          cutoff: cutoffResult?.cutoff || 0,
          maxCutoff: cutoffResult?.maxCutoff || 200
        }
      }

      categoryMap[category].courses.push({
        ...course,
        admissionBodyName: body.name,
        cutoff: cutoffResult?.cutoff || 0
      })

      // Update category cutoff to highest among its courses
      if (cutoffResult && cutoffResult.cutoff > categoryMap[category].cutoff) {
        categoryMap[category].cutoff = cutoffResult.cutoff
        categoryMap[category].maxCutoff = cutoffResult.maxCutoff
      }
    })

    // Sort categories by cutoff (highest first) and return as array
    return Object.values(categoryMap).sort((a, b) => b.cutoff - a.cutoff)
  }, [admissionBodies])
```

**Step 2: Add to return statement (around line 160)**

```javascript
  return {
    // ... existing exports ...
    groupCoursesByCategory
  }
```

**Step 3: Verify compilation**

Run: `npm run dev`
Expected: No errors

**Step 4: Commit**

```bash
git add src/hooks/useCalculator.js
git commit -m "feat: add groupCoursesByCategory helper to useCalculator"
```

---

## Task 4: Create CircularProgress Component

**Files:**
- Create: `src/components/calculator/CircularProgress.jsx`

**Step 1: Create the component**

```jsx
/**
 * Circular progress indicator showing course count
 * Used in results header to highlight eligible courses
 */
export default function CircularProgress({ value, label, subtitle }) {
  // SVG circle parameters
  const size = 140
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // For course count, we don't show percentage - just the number
  // But we'll animate the ring based on a normalized value (cap at 100 for visual)
  const normalizedValue = Math.min(value, 100)
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold text-white">{value}</span>
          <span className="font-body text-sm text-white/80">{label}</span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 font-body text-sm text-white/60 text-center">{subtitle}</p>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/calculator/CircularProgress.jsx
git commit -m "feat: create CircularProgress component"
```

---

## Task 5: Create CourseCard Component

**Files:**
- Create: `src/components/calculator/CourseCard.jsx`

**Step 1: Create the component**

```jsx
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Individual course card for results display
 * Shows course name, duration, admission body, and link to colleges
 */
export default function CourseCard({ course }) {
  const { language } = useLanguage()

  const courseName = language === 'ta' && course.name_ta
    ? course.name_ta
    : course.name

  return (
    <div className="p-4 bg-white border border-navy-100 rounded-xl hover:border-saffron-200 hover:shadow-md transition-all duration-200">
      <h4 className="font-display font-semibold text-navy-900 text-sm leading-tight mb-1 line-clamp-2">
        {courseName}
      </h4>
      <p className="font-body text-xs text-navy-500 mb-3">
        {course.duration} • {course.admissionBodyName || course.admission_body_id}
      </p>
      <Link
        to={`/colleges?course=${course.id}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-saffron-600 hover:text-saffron-700 transition-colors"
      >
        Find Colleges →
      </Link>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/calculator/CourseCard.jsx
git commit -m "feat: create CourseCard component"
```

---

## Task 6: Create CategorySection Component

**Files:**
- Create: `src/components/calculator/CategorySection.jsx`

**Step 1: Create the component**

```jsx
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'

/**
 * Collapsible category section showing courses in a category
 * Shows first 3 courses by default with expand option
 */
export default function CategorySection({ category, courses, cutoff, maxCutoff, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const visibleCourses = courses.slice(0, 3)
  const hasMore = courses.length > 3

  return (
    <div className="border border-navy-100 rounded-xl overflow-hidden">
      {/* Header - clickable to expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cream-50 to-white hover:from-cream-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 text-navy-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
          <div className="text-left">
            <h3 className="font-display font-bold text-navy-900">
              {category}
            </h3>
            <p className="font-body text-xs text-navy-500">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-xl font-bold text-saffron-600">
            {cutoff.toFixed(2)}
          </p>
          <p className="font-body text-xs text-navy-400">
            / {maxCutoff}
          </p>
        </div>
      </button>

      {/* Content - courses grid */}
      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            {visibleCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {hasMore && (
            <Link
              to={`/courses?category=${encodeURIComponent(category)}`}
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-saffron-600 hover:text-saffron-700 transition-colors"
            >
              View all {courses.length} courses →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/calculator/CategorySection.jsx
git commit -m "feat: create CategorySection component"
```

---

## Task 7: Rewrite ResultsDisplay Component

**Files:**
- Modify: `src/components/calculator/ResultsDisplay.jsx` (complete rewrite)

**Step 1: Replace entire file content**

```jsx
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { School, FileText, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import CircularProgress from './CircularProgress'
import CategorySection from './CategorySection'

export default function ResultsDisplay() {
  const { t } = useTranslation()
  const { results, marks, group, reset } = useCalculatorContext()
  const { getGroupById, groupCoursesByCategory } = useCalculator()
  const [showAllCategories, setShowAllCategories] = useState(false)

  if (!results) return null

  const cutoffResults = results.cutoffResults || results.streamCutoffs || []
  const eligibleCourses = results.eligibleCourses || []
  const totalMarks = results.totalMarks || 0

  // Get group info for display
  const selectedGroup = getGroupById(group)
  const subjects = selectedGroup?.subjects || []

  // Group courses by category
  const coursesByCategory = groupCoursesByCategory(eligibleCourses, cutoffResults)

  // Show first 3 categories by default
  const visibleCategories = showAllCategories ? coursesByCategory : coursesByCategory.slice(0, 3)
  const hasMoreCategories = coursesByCategory.length > 3

  const handleStartOver = () => {
    reset()
  }

  // Split subjects for left/right display
  const midpoint = Math.ceil(subjects.length / 2)
  const leftSubjects = subjects.slice(0, midpoint)
  const rightSubjects = subjects.slice(midpoint)

  return (
    <div className="space-y-6">
      {/* Header Card with Subject Pills and Circular Progress */}
      <Card variant="dark" padding="lg" hover={false} className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pattern-kolam opacity-5" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-saffron-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-saffron-500/10 rounded-full blur-2xl" />

        <div className="relative">
          <h2 className="font-display text-xl font-bold text-white text-center mb-6">
            Your Admission Analysis
          </h2>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Left: Subject marks */}
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              {leftSubjects.map((subject) => (
                <div
                  key={subject}
                  className="flex items-center justify-between gap-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[180px]"
                >
                  <span className="font-body text-sm text-white/80">{subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-white">{marks[subject] || 0}</span>
                    <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full"
                        style={{ width: `${marks[subject] || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Center: Circular Progress */}
            <div className="flex-shrink-0">
              <CircularProgress
                value={eligibleCourses.length}
                label="Courses"
                subtitle="You're eligible for"
              />
            </div>

            {/* Right: Remaining subjects + Total */}
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              {rightSubjects.map((subject) => (
                <div
                  key={subject}
                  className="flex items-center justify-between gap-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[180px]"
                >
                  <span className="font-body text-sm text-white/80">{subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-white">{marks[subject] || 0}</span>
                    <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full"
                        style={{ width: `${marks[subject] || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Total marks */}
              <div className="flex items-center justify-between gap-4 bg-saffron-500/20 backdrop-blur-sm px-4 py-2 rounded-lg mt-2">
                <span className="font-body text-sm text-white/80">Total</span>
                <span className="font-display font-bold text-saffron-400">
                  {totalMarks.toFixed(0)} / {subjects.length * 100}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Eligible Courses by Category */}
      <div>
        <h3 className="font-display text-xl font-bold text-navy-900 mb-4">
          Eligible Courses for You
        </h3>

        {coursesByCategory.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-8">
              <p className="font-body text-navy-500">
                {t('calculator.results.noEligibleCourses')}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {visibleCategories.map((cat, index) => (
              <CategorySection
                key={cat.category}
                category={cat.category}
                courses={cat.courses}
                cutoff={cat.cutoff}
                maxCutoff={cat.maxCutoff}
                defaultExpanded={index === 0}
              />
            ))}

            {hasMoreCategories && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full py-3 text-sm font-medium text-saffron-600 hover:text-saffron-700 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors"
              >
                {showAllCategories
                  ? 'Show Less'
                  : `Show ${coursesByCategory.length - 3} More Categories`
                }
              </button>
            )}
          </div>
        )}
      </div>

      {/* Your Path Forward */}
      <Card variant="gradient" padding="md">
        <h3 className="font-display text-lg font-bold text-navy-900 mb-4">
          Your Path Forward
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/colleges" className="block">
            <Button variant="primary" className="w-full" size="md" icon={School} iconPosition="left">
              Explore Colleges
            </Button>
          </Link>
          <Link to="/counselling" className="block">
            <Button variant="secondary" className="w-full" size="md" icon={FileText} iconPosition="left">
              Counselling Guide
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleStartOver}
            className="w-full"
            size="md"
            icon={RotateCcw}
            iconPosition="left"
          >
            Calculate Again
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

**Step 2: Verify it compiles and renders**

Run: `npm run dev`
Navigate to calculator, enter marks, submit
Expected: New layout renders without errors

**Step 3: Commit**

```bash
git add src/components/calculator/ResultsDisplay.jsx
git commit -m "feat: rewrite ResultsDisplay with course-centric layout"
```

---

## Task 8: Test Full Flow

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Manual test checklist**

1. Go to `/calculator`
2. Select a group (e.g., Group 2 - PCB)
3. Enter marks for all subjects (e.g., 98 each)
4. Click Calculate
5. Verify:
   - Header shows all subjects with marks and progress bars
   - Circular progress shows correct course count
   - Total marks shown correctly
   - Categories display with courses grouped
   - "Find Colleges" links work
   - "Show More Categories" works if >3 categories
   - "Your Path Forward" buttons work

**Step 3: Test responsive layout**

- Desktop: 3-column course grid
- Tablet: 2-column course grid
- Mobile: 1-column course grid, stacked header

---

## Task 9: Final Commit

**Step 1: Stage all changes**

```bash
git add -A
```

**Step 2: Review changes**

```bash
git status
git diff --cached
```

**Step 3: Commit**

```bash
git commit -m "feat: complete results dashboard UI redesign

- Add Category field to admission bodies
- Create CircularProgress, CourseCard, CategorySection components
- Rewrite ResultsDisplay with course-centric layout
- Group eligible courses by category
- Show subject marks with progress bars
- Add collapsible category sections"
```

---

## User Actions Required

After completing the implementation:

1. **Update Airtable:**
   - Add `Category` field (Single select) to Admission Bodies table
   - Options: Engineering, Medical & Paramedical, Agriculture, Veterinary, Fisheries, Law
   - Either re-import CSV or manually add categories to each row

2. **Test:**
   - Verify categories display correctly
   - Check all course groupings are correct
