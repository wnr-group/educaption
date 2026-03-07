import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
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
