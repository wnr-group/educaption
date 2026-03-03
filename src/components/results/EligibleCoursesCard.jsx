import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'

export default function EligibleCoursesCard({ courses = [], cutoffScores = {} }) {
  const { t, i18n } = useTranslation()

  if (!courses || courses.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {t('results.eligibleCourses')}
        </h3>
        <p className="text-slate-500 text-center py-4">
          No courses match your criteria. Try adjusting your marks or category.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        {t('results.eligibleCourses')}
      </h3>

      <div className="space-y-3">
        {courses.map((course) => {
          const courseName = i18n.language === 'ta' && course.name_ta ? course.name_ta : course.name
          const streamName = course.stream
            ? (i18n.language === 'ta' && course.stream.name_ta ? course.stream.name_ta : course.stream.name)
            : null
          const userCutoff = cutoffScores[course.stream_id] || cutoffScores.default || 0

          return (
            <div
              key={course.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{courseName}</h4>
                {streamName && (
                  <p className="text-sm text-slate-500">{streamName}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {course.min_cutoff && (
                  <div className="text-right">
                    <span className={`text-sm font-medium ${userCutoff >= course.min_cutoff ? 'text-green-600' : 'text-amber-600'}`}>
                      {userCutoff >= course.min_cutoff ? 'Eligible' : 'Below cutoff'}
                    </span>
                    <p className="text-xs text-slate-500">
                      Min: {course.min_cutoff}
                    </p>
                  </div>
                )}
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <Link
          to="/courses"
          className="text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-center"
        >
          {t('results.exploreCourses')}
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </Card>
  )
}
