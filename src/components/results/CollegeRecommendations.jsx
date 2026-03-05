import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Building2, MapPin, ArrowRight, Target, TrendingUp, AlertTriangle } from 'lucide-react'
import Card from '../ui/Card'

export default function CollegeRecommendations({ colleges = [], userCutoff = 0 }) {
  const { t, i18n } = useTranslation()

  // Sort colleges by best match (closest to user's cutoff)
  const sortedColleges = colleges.length > 0
    ? [...colleges].sort((a, b) => {
        const diffA = Math.abs((a.avg_cutoff || 0) - userCutoff)
        const diffB = Math.abs((b.avg_cutoff || 0) - userCutoff)
        return diffA - diffB
      })
    : []

  const getMatchLevel = (collegeCutoff) => {
    if (!collegeCutoff) return {
      label: t('results.matchLevel.unknown'),
      color: 'text-navy-500',
      bg: 'bg-navy-100',
      icon: Target
    }
    const diff = userCutoff - collegeCutoff
    if (diff >= 10) return {
      label: t('results.matchLevel.safe'),
      color: 'text-emerald-700',
      bg: 'bg-emerald-100',
      icon: Target
    }
    if (diff >= 0) return {
      label: t('results.matchLevel.goodMatch'),
      color: 'text-saffron-700',
      bg: 'bg-saffron-100',
      icon: TrendingUp
    }
    if (diff >= -5) return {
      label: t('results.matchLevel.reach'),
      color: 'text-amber-700',
      bg: 'bg-amber-100',
      icon: TrendingUp
    }
    return {
      label: t('results.matchLevel.ambitious'),
      color: 'text-red-700',
      bg: 'bg-red-100',
      icon: AlertTriangle
    }
  }

  return (
    <Card variant="elevated" padding="default">
      <div className="flex items-center gap-3 mb-6">
        <div className="
          w-12 h-12
          bg-navy-100
          rounded-xl
          flex items-center justify-center
        ">
          <Building2 className="w-6 h-6 text-navy-600" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-navy-900">
            {t('results.recommendedColleges')}
          </h3>
          <p className="font-body text-sm text-navy-500">
            {t('results.basedOnCutoff')}
          </p>
        </div>
      </div>

      {!colleges || colleges.length === 0 ? (
        <div className="
          text-center py-8
          bg-cream-100 rounded-xl
        ">
          <div className="w-12 h-12 mx-auto mb-3 bg-navy-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🏫</span>
          </div>
          <p className="font-body text-navy-500 text-sm mb-4">
            {t('results.noCollegeTip')}
          </p>
          <Link
            to="/colleges"
            className="
              inline-flex items-center gap-2
              text-saffron-600
              font-body font-semibold text-sm
              hover:text-saffron-700
              transition-colors duration-200
            "
          >
            {t('results.viewColleges')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedColleges.slice(0, 5).map((college) => {
            const collegeName = i18n.language === 'ta' && college.name_ta ? college.name_ta : college.name
            const match = getMatchLevel(college.avg_cutoff)
            const MatchIcon = match.icon

            return (
              <div
                key={college.id}
                className="
                  flex items-center gap-4
                  p-4
                  bg-cream-50
                  border border-navy-100
                  rounded-xl
                  transition-all duration-200
                  hover:border-navy-200
                "
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-medium text-navy-900 truncate">
                    {collegeName}
                  </h4>
                  {college.location && (
                    <p className="font-body text-sm text-navy-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {college.location}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`
                    inline-flex items-center gap-1
                    px-2 py-1
                    ${match.bg}
                    ${match.color}
                    rounded-lg
                    font-body font-semibold text-xs
                  `}>
                    <MatchIcon className="w-3 h-3" />
                    {match.label}
                  </span>
                  {college.avg_cutoff && (
                    <p className="font-body text-xs text-navy-400">
                      {t('results.avg')} {college.avg_cutoff.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {sortedColleges.length > 5 && (
            <p className="text-center font-body text-navy-400 text-sm pt-2">
              {t('results.moreColleges', { count: sortedColleges.length - 5 })}
            </p>
          )}
        </div>
      )}

      {colleges.length > 0 && (
        <div className="mt-6 pt-4 border-t border-navy-100">
          <Link
            to="/colleges"
            className="
              flex items-center justify-center gap-2
              text-saffron-600
              font-body font-semibold
              hover:text-saffron-700
              transition-colors duration-200
            "
          >
            {t('results.viewColleges')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </Card>
  )
}
