import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'

export default function CollegeRecommendations({ colleges = [], userCutoff = 0 }) {
  const { t, i18n } = useTranslation()

  if (!colleges || colleges.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recommended Colleges
        </h3>
        <p className="text-slate-500 text-center py-4">
          No college recommendations available. Explore all colleges to find options.
        </p>
        <div className="mt-2">
          <Link
            to="/colleges"
            className="text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-center"
          >
            {t('results.viewColleges')}
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </Card>
    )
  }

  // Sort colleges by best match (closest to user's cutoff)
  const sortedColleges = [...colleges].sort((a, b) => {
    const diffA = Math.abs((a.avg_cutoff || 0) - userCutoff)
    const diffB = Math.abs((b.avg_cutoff || 0) - userCutoff)
    return diffA - diffB
  })

  const getMatchLevel = (collegeCutoff) => {
    if (!collegeCutoff) return { label: 'Unknown', color: 'text-slate-500', bg: 'bg-slate-100' }
    const diff = userCutoff - collegeCutoff
    if (diff >= 10) return { label: 'Safe', color: 'text-green-700', bg: 'bg-green-100' }
    if (diff >= 0) return { label: 'Good Match', color: 'text-blue-700', bg: 'bg-blue-100' }
    if (diff >= -5) return { label: 'Reach', color: 'text-amber-700', bg: 'bg-amber-100' }
    return { label: 'Ambitious', color: 'text-red-700', bg: 'bg-red-100' }
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Recommended Colleges
      </h3>

      <div className="space-y-3">
        {sortedColleges.slice(0, 5).map((college) => {
          const collegeName = i18n.language === 'ta' && college.name_ta ? college.name_ta : college.name
          const match = getMatchLevel(college.avg_cutoff)

          return (
            <div
              key={college.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{collegeName}</h4>
                {college.location && (
                  <p className="text-sm text-slate-500 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {college.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${match.bg} ${match.color}`}>
                    {match.label}
                  </span>
                  {college.avg_cutoff && (
                    <p className="text-xs text-slate-500 mt-1">
                      Avg: {college.avg_cutoff.toFixed(1)}
                    </p>
                  )}
                </div>
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
          to="/colleges"
          className="text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-center"
        >
          {t('results.viewColleges')}
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </Card>
  )
}
