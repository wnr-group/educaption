import { useTranslation } from 'react-i18next'
import { Clock, Layers, Code, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import { useLanguage } from '../../context/LanguageContext'

export default function CourseList({ courses, isLoading, error }) {
  const { t } = useTranslation()
  const { language } = useLanguage()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-saffron-500 animate-spin mb-4" />
        <p className="font-body text-navy-500">{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card variant="elevated" className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="font-body text-red-600">{t('common.error')}</p>
      </Card>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <Card variant="elevated" className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-navy-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <p className="font-body text-navy-500">{t('courses.noCourses')}</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => {
        const courseName = language === 'ta' && course.name_ta ? course.name_ta : course.name
        const streamName = course.stream
          ? (language === 'ta' && course.stream.name_ta ? course.stream.name_ta : course.stream.name)
          : null

        return (
          <Card
            key={course.id}
            variant="default"
            padding="default"
            className="group"
          >
            {/* Course Code Badge */}
            {course.code && (
              <div className="
                inline-flex items-center gap-2
                px-3 py-1.5 mb-4
                bg-saffron-50
                rounded-lg
              ">
                <Code className="w-3.5 h-3.5 text-saffron-600" />
                <span className="font-body font-semibold text-xs text-saffron-700">
                  {course.code}
                </span>
              </div>
            )}

            {/* Course Name */}
            <h3 className="
              font-display text-xl font-bold
              text-navy-900
              mb-3
              group-hover:text-saffron-600
              transition-colors duration-200
            ">
              {courseName}
            </h3>

            {/* Course Meta */}
            <div className="space-y-2">
              {streamName && (
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-navy-400" />
                  <span className="font-body text-sm text-navy-500">
                    {streamName}
                  </span>
                </div>
              )}

              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy-400" />
                  <span className="font-body text-sm text-navy-500">
                    {course.duration}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
