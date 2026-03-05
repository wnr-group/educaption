import { useTranslation } from 'react-i18next'
import { MapPin, Building, Tag, Loader2, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import { useLanguage } from '../../context/LanguageContext'

export default function CollegeGrid({ colleges, isLoading, error }) {
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

  if (!colleges || colleges.length === 0) {
    return (
      <Card variant="elevated" className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-navy-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">🏫</span>
        </div>
        <p className="font-body text-navy-500">{t('colleges.noColleges')}</p>
      </Card>
    )
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'government':
        return 'bg-emerald-100 text-emerald-700'
      case 'private':
        return 'bg-saffron-100 text-saffron-700'
      case 'aided':
        return 'bg-navy-100 text-navy-700'
      default:
        return 'bg-navy-100 text-navy-600'
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {colleges.map(college => {
        const collegeName = language === 'ta' && college.name_ta ? college.name_ta : college.name

        return (
          <Card
            key={college.id}
            variant="default"
            padding="default"
            className="group"
          >
            {/* Type Badge */}
            {college.type && (
              <div className="flex items-center gap-2 mb-4">
                <span className={`
                  inline-flex items-center gap-1.5
                  px-3 py-1.5
                  rounded-lg
                  font-body font-semibold text-xs
                  ${getTypeColor(college.type)}
                `}>
                  <Building className="w-3.5 h-3.5" />
                  {t(`colleges.${college.type}`)}
                </span>
              </div>
            )}

            {/* College Name */}
            <h3 className="
              font-display text-lg font-bold
              text-navy-900
              mb-3
              group-hover:text-saffron-600
              transition-colors duration-200
              line-clamp-2
            ">
              {collegeName}
            </h3>

            {/* College Meta */}
            <div className="space-y-2">
              {college.code && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-navy-400" />
                  <span className="font-body text-sm text-navy-500">
                    {college.code}
                  </span>
                </div>
              )}

              {college.district && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-navy-400" />
                  <span className="font-body text-sm text-navy-500">
                    {college.district}
                  </span>
                </div>
              )}
            </div>

            {/* Website Link */}
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  mt-4 pt-4
                  border-t border-navy-100
                  text-saffron-600
                  font-body font-medium text-sm
                  hover:text-saffron-700
                  transition-colors duration-200
                "
              >
                <span>{t('colleges.visitWebsite')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </Card>
        )
      })}
    </div>
  )
}
