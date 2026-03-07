import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { School, FileText, RotateCcw, Sparkles, GraduationCap, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Button from '../ui/Button'
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

  const selectedGroup = getGroupById(group)
  const subjects = selectedGroup?.subjects || []
  const coursesByCategory = groupCoursesByCategory(eligibleCourses, cutoffResults)

  const visibleCategories = showAllCategories ? coursesByCategory : coursesByCategory.slice(0, 3)
  const hasMoreCategories = coursesByCategory.length > 3

  const handleStartOver = () => reset()

  return (
    <div className="space-y-8">
      {/* Hero Results Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-2xl">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron-600/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-saffron-500/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-saffron-400" />
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
              Your Admission Analysis
            </h2>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left: Subject Marks Grid */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((subject, idx) => (
                  <div
                    key={subject}
                    className="group relative bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-sm rounded-xl p-3 transition-colors duration-200"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex flex-col">
                      <span className="font-body text-[11px] text-white/50 uppercase tracking-wider mb-1 truncate">
                        {subject}
                      </span>
                      <div className="flex items-end justify-between gap-2">
                        <span className="font-display text-2xl font-bold text-white leading-none">
                          {marks[subject] || 0}
                        </span>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-700"
                            style={{ width: `${marks[subject] || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Circular Progress */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center">
              <CircularProgress
                value={eligibleCourses.length}
                label="Courses"
                subtitle="You're eligible for"
                total={subjects.length * 100}
                currentTotal={totalMarks}
              />
            </div>

            {/* Right: Summary Stats */}
            <div className="lg:col-span-4 order-3 space-y-3">
              {/* Total Score */}
              <div className="bg-gradient-to-r from-saffron-500/20 to-saffron-600/10 backdrop-blur-sm rounded-xl p-4 border border-saffron-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-saffron-500/20 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-saffron-400" />
                    </div>
                    <div>
                      <p className="font-body text-xs text-white/50 uppercase tracking-wider">Total Score</p>
                      <p className="font-display text-2xl font-bold text-white">
                        {totalMarks.toFixed(0)}
                        <span className="text-white/40 text-lg font-normal"> / {subjects.length * 100}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 bg-saffron-500/20 rounded-full">
                      <span className="font-display text-sm font-semibold text-saffron-400">
                        {((totalMarks / (subjects.length * 100)) * 100).toFixed(0)}%
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories Summary */}
              <div className="bg-white/[0.05] backdrop-blur-sm rounded-xl p-4">
                <p className="font-body text-xs text-white/50 uppercase tracking-wider mb-3">Eligible Categories</p>
                <div className="flex flex-wrap gap-2">
                  {coursesByCategory.slice(0, 4).map((cat) => (
                    <span
                      key={cat.category}
                      className="inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-medium text-white/80 transition-colors cursor-default"
                    >
                      {cat.category}
                      <span className="ml-1.5 text-saffron-400">{cat.courses.length}</span>
                    </span>
                  ))}
                  {coursesByCategory.length > 4 && (
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white/40">
                      +{coursesByCategory.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl md:text-2xl font-bold text-navy-900">
              Eligible Courses
            </h3>
            <span className="inline-flex items-center px-3 py-1 bg-saffron-100 rounded-full">
              <span className="font-display text-sm font-semibold text-saffron-700">
                {eligibleCourses.length} total
              </span>
            </span>
          </div>
        </div>

        {coursesByCategory.length === 0 ? (
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-cream-100 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-cream-400" />
            </div>
            <p className="font-body text-navy-500">
              {t('calculator.results.noEligibleCourses')}
            </p>
          </div>
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
                className="group w-full py-4 text-sm font-semibold text-saffron-600 hover:text-saffron-700 bg-gradient-to-r from-cream-50 to-saffron-50/50 hover:from-cream-100 hover:to-saffron-100/50 rounded-xl border border-cream-200 hover:border-saffron-200 transition-colors flex items-center justify-center gap-2"
              >
                {showAllCategories ? (
                  'Show Less'
                ) : (
                  <>
                    Show {coursesByCategory.length - 3} More Categories
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Path Forward Section */}
      <div className="bg-gradient-to-br from-cream-50 via-white to-saffron-50/30 rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-navy-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-navy-600" />
          </div>
          <h3 className="font-display text-lg md:text-xl font-bold text-navy-900">
            Your Path Forward
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/colleges" className="block">
            <Button variant="primary" className="w-full" size="lg" icon={School} iconPosition="left">
              Explore Colleges
            </Button>
          </Link>
          <Link to="/counselling" className="block">
            <Button variant="secondary" className="w-full" size="lg" icon={FileText} iconPosition="left">
              Counselling Guide
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleStartOver}
            className="w-full border border-navy-200 hover:border-navy-300 hover:bg-navy-50"
            size="lg"
            icon={RotateCcw}
            iconPosition="left"
          >
            Calculate Again
          </Button>
        </div>
      </div>
    </div>
  )
}
