import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CourseCard from './CourseCard'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Collapsible category section with courses grid
 * Renders cutoff sub-groups when an admission body has multiple cutoff values
 */
export default function CategorySection({ category, category_ta, courses, cutoff, maxCutoff, cutoffGroups = [], defaultExpanded = true }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showAllCourses, setShowAllCourses] = useState(false)

  // Use Tamil category name if available and language is Tamil
  const displayCategory = (language === 'ta' && category_ta) ? category_ta : category

  const percentage = ((cutoff || 0) / (maxCutoff || 200)) * 100

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
              {(cutoff || 0).toFixed(2)}
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
            {/* Cutoff groups */}
            {(cutoffGroups.length > 1 ? cutoffGroups : [null]).map((group, groupIdx) => {
              // If single group (or no groups), show flat course list
              const groupCourses = group ? group.courses : courses
              const visibleGroupCourses = showAllCourses ? groupCourses : groupCourses.slice(0, 6)
              const hasMoreInGroup = groupCourses.length > 6

              return (
                <div key={group ? group.cutoff : 'all'} className={groupIdx > 0 ? 'mt-5' : ''}>
                  {/* Sub-header for cutoff group (only when multiple groups) */}
                  {group && (
                    <div className="flex items-center gap-3 mb-3 mt-4">
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

                  {/* Courses grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {visibleGroupCourses.map((course) => (
                      <CourseCard key={course.courseId || course.id} course={{
                        id: course.courseId || course.id,
                        name: course.courseName || course.name,
                        name_ta: course.courseNameTa || course.name_ta,
                        duration: course.duration,
                        admissionBodyName: course.admissionBodyName || course.admission_body,
                        courseCategory: course.courseCategory
                      }} />
                    ))}
                  </div>

                  {/* Show more/less toggle per group */}
                  {hasMoreInGroup && (
                    <button
                      onClick={() => setShowAllCourses(!showAllCourses)}
                      className="group mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-cream-50 hover:bg-saffron-50 rounded-xl border border-cream-200 hover:border-saffron-200 transition-colors"
                    >
                      <span className="font-body text-sm font-semibold text-saffron-600 group-hover:text-saffron-700">
                        {showAllCourses ? t('calculator.results.showFewerCourses') : t('calculator.results.showAllCourses', { count: groupCourses.length })}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-saffron-500 transition-transform ${showAllCourses ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
