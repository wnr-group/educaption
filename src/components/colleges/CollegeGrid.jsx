import { useTranslation } from 'react-i18next'
import Card from '../ui/Card'
import { useLanguage } from '../../context/LanguageContext'

export default function CollegeGrid({ colleges, isLoading, error }) {
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

  if (!colleges || colleges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">{t('colleges.noColleges')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {colleges.map(college => {
        const collegeName = language === 'ta' && college.name_ta ? college.name_ta : college.name

        return (
          <Card key={college.id} className="hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-text mb-2">
              {collegeName}
            </h3>
            {college.code && (
              <p className="text-sm text-slate-500 mb-1">
                {t('colleges.code')}: {college.code}
              </p>
            )}
            {college.district && (
              <p className="text-sm text-slate-500 mb-1">
                {t('colleges.district')}: {college.district}
              </p>
            )}
            {college.type && (
              <p className="text-xs text-slate-400">
                {t('colleges.type')}: {college.type}
              </p>
            )}
          </Card>
        )
      })}
    </div>
  )
}
