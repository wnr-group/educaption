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
