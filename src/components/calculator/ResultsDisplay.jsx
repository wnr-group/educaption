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
