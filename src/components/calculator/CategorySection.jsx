import { useState } from 'react'
import { ChevronDown, ArrowRight, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import { getFormulaBreakdown } from '../../lib/calculator'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'

/**
 * Collapsible category section with courses grid and formula breakdown
 */
export default function CategorySection({ category, courses, cutoff, maxCutoff, formula, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { marks, group } = useCalculatorContext()
  const { getGroupById } = useCalculator()

  const visibleCourses = courses.slice(0, 3)
  const hasMore = courses.length > 3
  const percentage = ((cutoff || 0) / (maxCutoff || 200)) * 100

  // Get formula breakdown
  const selectedGroup = getGroupById(group)
  const subjects = selectedGroup?.subjects || []

  // Create marks lookup for formula breakdown
  const marksLookup = {}
  const SUBJECT_CODE_MAP = {
    'M': ['Mathematics', 'Maths', 'Business Mathematics', 'Business Mathematics & Statistics'],
    'P': ['Physics'],
    'C': ['Chemistry'],
    'B': ['Biology'],
    'BOT': ['Botany'],
    'ZOO': ['Zoology'],
    'CS': ['Computer Science', 'Computer Applications'],
    'E': ['Economics'],
    'CO': ['Commerce'],
    'A': ['Accountancy']
  }

  // Add language subjects as S1 and S2
  marksLookup['S1'] = parseFloat(marks['Language 1']) || 0
  marksLookup['S2'] = parseFloat(marks['Language 2']) || 0

  // Map group subjects to codes and S3-S6
  subjects.forEach((subject, index) => {
    // Find code for this subject
    for (const [code, names] of Object.entries(SUBJECT_CODE_MAP)) {
      if (names.some(n => n.toLowerCase() === subject.toLowerCase())) {
        marksLookup[code] = parseFloat(marks[subject]) || 0
        break
      }
    }
    // Positional codes S3-S6 for the 4 group subjects
    marksLookup[`S${index + 3}`] = parseFloat(marks[subject]) || 0
  })

  // Handle Biology = Botany + Zoology
  if (marksLookup['BOT'] && marksLookup['ZOO'] && !marksLookup['B']) {
    marksLookup['B'] = (marksLookup['BOT'] + marksLookup['ZOO']) / 2
  }

  // Create subject name mapping for S3-S6
  const subjectNameMap = {}
  subjects.forEach((subject, index) => {
    subjectNameMap[`S${index + 3}`] = subject
  })

  const breakdown = formula ? getFormulaBreakdown(formula, marksLookup, subjectNameMap) : []

  return (
    <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-cream-50/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-4">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            ${isExpanded ? 'bg-saffron-100' : 'bg-navy-50'}
            transition-colors duration-200
          `}>
            <ChevronDown
              className={`
                w-5 h-5 transition-transform duration-300 ease-out
                ${isExpanded ? 'text-saffron-600 rotate-180' : 'text-navy-400'}
              `}
            />
          </div>

          <div className="text-left">
            <h3 className="font-display text-lg font-bold text-navy-900">
              {category}
            </h3>
            <p className="font-body text-sm text-navy-500 mt-0.5">
              {courses.length} course{courses.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-24">
            <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="text-right min-w-[80px]">
            <p className="font-display text-2xl font-bold text-saffron-600 leading-none">
              {(cutoff || 0).toFixed(1)}
            </p>
            <p className="font-body text-xs text-navy-400 mt-0.5">
              out of {maxCutoff}
            </p>
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={`
          grid transition-all duration-300 ease-out
          ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 border-t border-navy-100">

            {/* Formula Breakdown */}
            {breakdown.length > 0 && (
              <div className="mt-4 mb-5 p-4 bg-gradient-to-br from-navy-50 to-cream-50 rounded-xl border border-navy-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-navy-500" />
                  <span className="font-body text-xs font-semibold text-navy-600 uppercase tracking-wider">
                    How your cutoff is calculated
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      {index > 0 && (
                        <span className="text-navy-400 font-mono text-sm mx-1">+</span>
                      )}
                      <div className="flex items-center bg-white rounded-lg border border-navy-200 overflow-hidden">
                        <div className="px-2.5 py-1.5 bg-navy-50 border-r border-navy-200">
                          <span className="font-body text-xs text-navy-500">{item.label}</span>
                        </div>
                        <div className="px-2.5 py-1.5 flex items-center gap-1.5">
                          <span className="font-display font-bold text-navy-800">{item.mark}</span>
                          <span className="font-mono text-xs text-navy-400">{item.weight}</span>
                          <span className="text-navy-300">=</span>
                          <span className="font-display font-bold text-saffron-600">{item.contribution.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <span className="text-navy-400 font-mono text-sm mx-2">=</span>
                  <div className="px-3 py-1.5 bg-saffron-100 rounded-lg border border-saffron-200">
                    <span className="font-display font-bold text-saffron-700">{(cutoff || 0).toFixed(2)}</span>
                  </div>
                </div>

                {formula && (
                  <p className="mt-3 font-mono text-xs text-navy-400">
                    Formula: {formula}
                  </p>
                )}
              </div>
            )}

            {/* Courses grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* View all link */}
            {hasMore && (
              <Link
                to={`/courses?category=${encodeURIComponent(category)}`}
                className="group mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-cream-50 hover:bg-saffron-50 rounded-xl border border-cream-200 hover:border-saffron-200 transition-colors"
              >
                <span className="font-body text-sm font-semibold text-saffron-600 group-hover:text-saffron-700">
                  View all {courses.length} courses
                </span>
                <ArrowRight className="w-4 h-4 text-saffron-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
