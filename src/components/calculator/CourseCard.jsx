import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Individual course card with hover effects
 * Compact design with clear information hierarchy
 */
export default function CourseCard({ course }) {
  const { language } = useLanguage()

  const courseName = language === 'ta' && course.name_ta
    ? course.name_ta
    : course.name

  return (
    <div className="group relative bg-gradient-to-br from-cream-50 to-white p-4 rounded-xl border border-navy-100 hover:border-saffron-200 hover:shadow-lg transition-all duration-200">
      {/* Course name */}
      <h4 className="font-display font-semibold text-navy-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-saffron-700 transition-colors">
        {courseName}
      </h4>

      {/* Duration & Body */}
      <div className="flex items-center gap-2 text-xs text-navy-500 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 bg-navy-100 rounded-md font-medium">
          {course.duration}
        </span>
        <span className="text-navy-300">•</span>
        <span className="truncate">
          {course.admissionBodyName || course.admission_body_id}
        </span>
      </div>

      {/* Action link */}
      <Link
        to={`/colleges?course=${course.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-600 hover:text-saffron-700 transition-colors"
      >
        Find Colleges
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Link>

      {/* Hover decoration */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-saffron-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
