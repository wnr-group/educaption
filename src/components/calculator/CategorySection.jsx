import { useState, useEffect } from 'react'
import { ChevronDown, Calculator } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CourseCard from './CourseCard'
import { getFormulaBreakdown } from '../../lib/calculator'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Collapsible category section with courses grid and formula breakdown
 *
 * Debug mode: Run `window.EDUCAPTION_DEBUG = true` in console to show formula breakdown
 */
export default function CategorySection({ category, category_ta, courses, cutoff, maxCutoff, formula, defaultExpanded = true }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showAllCourses, setShowAllCourses] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const { marks, group } = useCalculatorContext()
  const { getGroupById } = useCalculator()

  // Check for debug mode on mount and when window variable changes
  useEffect(() => {
    const checkDebugMode = () => setDebugMode(!!window.EDUCAPTION_DEBUG)
    checkDebugMode()

    // Allow toggling debug mode from console
    window.enableEducaptionDebug = () => { window.EDUCAPTION_DEBUG = true; checkDebugMode() }
    window.disableEducaptionDebug = () => { window.EDUCAPTION_DEBUG = false; checkDebugMode() }

    // Check periodically in case user sets it manually
    const interval = setInterval(checkDebugMode, 1000)
    return () => clearInterval(interval)
  }, [])

  // Use Tamil category name if available and language is Tamil
  const displayCategory = (language === 'ta' && category_ta) ? category_ta : category

  const visibleCourses = showAllCourses ? courses : courses.slice(0, 6)
  const hasMore = courses.length > 6
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
              {displayCategory}
            </h3>
            <p className="font-body text-sm text-navy-500 mt-0.5">
              {courses.length} {courses.length !== 1 ? t('calculator.results.coursesAvailable') : t('calculator.results.courseAvailable')}
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
              {t('calculator.results.outOf')} {maxCutoff}
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

            {/* Formula Breakdown - Only visible in debug mode */}
            {debugMode && breakdown.length > 0 && (
              <div className="mt-4 mb-5 p-4 bg-gradient-to-br from-navy-50 to-cream-50 rounded-xl border border-navy-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-navy-500" />
                  <span className="font-body text-xs font-semibold text-navy-600 uppercase tracking-wider">
                    {t('calculator.results.howCutoffCalculated')}
                    <span className="ml-2 text-amber-600">(Debug Mode)</span>
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
                    {t('calculator.results.formula')}: {formula}
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

            {/* Show more/less toggle */}
            {hasMore && (
              <button
                onClick={() => setShowAllCourses(!showAllCourses)}
                className="group mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-cream-50 hover:bg-saffron-50 rounded-xl border border-cream-200 hover:border-saffron-200 transition-colors"
              >
                <span className="font-body text-sm font-semibold text-saffron-600 group-hover:text-saffron-700">
                  {showAllCourses ? t('calculator.results.showFewerCourses') : t('calculator.results.showAllCourses', { count: courses.length })}
                </span>
                <ChevronDown className={`w-4 h-4 text-saffron-500 transition-transform ${showAllCourses ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
