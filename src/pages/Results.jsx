import { useTranslation } from 'react-i18next'
import { useLocation, Link, Navigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import EligibleCoursesCard from '../components/results/EligibleCoursesCard'
import CollegeRecommendations from '../components/results/CollegeRecommendations'

export default function Results() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const results = location.state?.results

  // Redirect to calculator if no results
  if (!results) {
    return <Navigate to="/calculator" replace />
  }

  const { cutoffScores = {}, group, category, marks = {}, eligibleCourses = [], recommendedColleges = [] } = results

  // Get the primary cutoff score for display
  const primaryCutoff = Object.values(cutoffScores)[0] || 0

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('results.title')}</h1>
          <p className="text-slate-600">
            Based on your marks and category selection
          </p>
        </div>

        {/* Cutoff Score Display */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('results.cutoffScores')}</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(cutoffScores).map(([streamId, score]) => (
              <div
                key={streamId}
                className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 text-center"
              >
                <div className="text-4xl font-bold text-primary mb-1">
                  {typeof score === 'number' ? score.toFixed(2) : score}
                </div>
                <p className="text-sm text-slate-600">Cutoff Score</p>
              </div>
            ))}
          </div>

          {/* Summary Info */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {group && (
                <div>
                  <p className="text-slate-500">Group</p>
                  <p className="font-medium text-slate-700">
                    {i18n.language === 'ta' && group.name_ta ? group.name_ta : group.name}
                  </p>
                </div>
              )}
              {category && (
                <div>
                  <p className="text-slate-500">Category</p>
                  <p className="font-medium text-slate-700">
                    {i18n.language === 'ta' && category.name_ta ? category.name_ta : category.name}
                  </p>
                </div>
              )}
              {Object.keys(marks).length > 0 && (
                <div className="col-span-2">
                  <p className="text-slate-500">Marks Entered</p>
                  <p className="font-medium text-slate-700">
                    {Object.entries(marks).map(([subject, mark]) => `${subject}: ${mark}`).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <EligibleCoursesCard
            courses={eligibleCourses}
            cutoffScores={cutoffScores}
          />
          <CollegeRecommendations
            colleges={recommendedColleges}
            userCutoff={primaryCutoff}
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/calculator"
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-center"
          >
            Recalculate
          </Link>
          <Link
            to="/counselling"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
          >
            View Counselling Guide
          </Link>
        </div>
      </div>
    </div>
  )
}
