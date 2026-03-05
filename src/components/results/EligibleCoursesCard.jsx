import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'

export default function EligibleCoursesCard({ courses = [], cutoffScores = {} }) {
  const { t, i18n } = useTranslation()

  return (
    <Card variant="elevated" padding="default">
      <div className="flex items-center gap-3 mb-6">
        <div className="
          w-12 h-12
          bg-emerald-100
          rounded-xl
          flex items-center justify-center
        ">
          <BookOpen className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-navy-900">
            {t('results.eligibleCourses')}
          </h3>
          <p className="font-body text-sm text-navy-500">
            {courses.length} courses available
          </p>
        </div>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="
          text-center py-8
          bg-cream-100 rounded-xl
        ">
          <div className="w-12 h-12 mx-auto mb-3 bg-navy-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">📚</span>
          </div>
          <p className="font-body text-navy-500 text-sm">
            {t('results.noCoursesTip')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.slice(0, 5).map((course) => {
            const courseName = i18n.language === 'ta' && course.name_ta ? course.name_ta : course.name
            const streamName = course.stream
              ? (i18n.language === 'ta' && course.stream.name_ta ? course.stream.name_ta : course.stream.name)
              : null
            const userCutoff = cutoffScores[course.stream_id] || cutoffScores.default || 0
            const isEligible = !course.min_cutoff || userCutoff >= course.min_cutoff

            return (
              <div
                key={course.id}
                className="
                  flex items-center gap-4
                  p-4
                  bg-cream-50
                  border border-navy-100
                  rounded-xl
                  transition-all duration-200
                  hover:border-emerald-200
                "
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-medium text-navy-900 truncate">
                    {courseName}
                  </h4>
                  {streamName && (
                    <p className="font-body text-sm text-navy-400 truncate">
                      {streamName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEligible ? (
                    <span className="
                      inline-flex items-center gap-1
                      px-2 py-1
                      bg-emerald-100
                      text-emerald-700
                      rounded-lg
                      font-body font-semibold text-xs
                    ">
                      <CheckCircle className="w-3 h-3" />
                      {t('results.eligible')}
                    </span>
                  ) : (
                    <span className="
                      inline-flex items-center gap-1
                      px-2 py-1
                      bg-saffron-100
                      text-saffron-700
                      rounded-lg
                      font-body font-semibold text-xs
                    ">
                      <AlertCircle className="w-3 h-3" />
                      {t('results.belowCutoff')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {courses.length > 5 && (
            <p className="text-center font-body text-navy-400 text-sm pt-2">
              +{courses.length - 5} more courses
            </p>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-navy-100">
        <Link
          to="/courses"
          className="
            flex items-center justify-center gap-2
            text-saffron-600
            font-body font-semibold
            hover:text-saffron-700
            transition-colors duration-200
          "
        >
          {t('results.exploreCourses')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  )
}
