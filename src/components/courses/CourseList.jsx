import { useTranslation } from 'react-i18next'
import Card from '../ui/Card'
import { useLanguage } from '../../context/LanguageContext'

export default function CourseList({ courses, isLoading, error }) {
  const { t } = useTranslation()
  const { language } = useLanguage()

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{t('common.error')}</p>
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">{t('courses.noCourses')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => {
        const courseName = language === 'ta' && course.name_ta ? course.name_ta : course.name
        const streamName = course.stream
          ? (language === 'ta' && course.stream.name_ta ? course.stream.name_ta : course.stream.name)
          : null

        return (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-text mb-2">
              {courseName}
            </h3>
            {streamName && (
              <p className="text-sm text-slate-500 mb-2">
                {t('courses.stream')}: {streamName}
              </p>
            )}
            {course.code && (
              <p className="text-xs text-slate-400">
                {t('courses.code')}: {course.code}
              </p>
            )}
          </Card>
        )
      })}
    </div>
  )
}
