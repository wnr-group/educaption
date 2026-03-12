import { useTranslation } from 'react-i18next'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { Trophy, Calculator, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
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

  const { cutoffScores = {}, group, marks = {}, eligibleCourses = [], recommendedColleges = [] } = results

  // Get the primary cutoff score for display
  const primaryCutoff = Object.values(cutoffScores)[0] || 0

  return (
    <main className="min-h-screen bg-gradient-hero pt-40 sm:pt-44 pb-12 lg:pb-16">
      {/* Background decoration */}
      <div className="fixed inset-0 pattern-kolam opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="
            inline-flex items-center gap-2
            px-4 py-2 mb-6
            bg-white/80 backdrop-blur-sm
            border border-emerald-200
            rounded-full
            shadow-soft
          ">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="font-body text-sm font-medium text-navy-700">
              Calculation Complete
            </span>
          </div>

          <h1 className="
            font-display text-4xl sm:text-5xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-4
          ">
            {t('results.title')}
          </h1>
          <p className="
            font-body text-lg
            text-navy-500
          ">
            {t('results.subtitle')}
          </p>
        </div>

        {/* Cutoff Score Display */}
        <Card
          variant="dark"
          padding="lg"
          hover={false}
          className="mb-8 relative overflow-hidden text-center"
        >
          {/* Decorative */}
          <div className="absolute top-0 left-0 w-full h-full pattern-kolam opacity-5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-saffron-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="
              w-16 h-16 mx-auto mb-6
              bg-gradient-to-br from-saffron-400 to-saffron-500
              rounded-2xl
              flex items-center justify-center
              shadow-glow-saffron
            ">
              <Trophy className="w-8 h-8 text-white" />
            </div>

            <h2 className="font-display text-2xl font-bold text-white mb-6">
              {t('results.cutoffScores')}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(cutoffScores).map(([streamId, score]) => (
                <div
                  key={streamId}
                  className="
                    bg-white/10 backdrop-blur-sm
                    rounded-xl p-5
                    text-center
                  "
                >
                  <div className="font-display text-4xl font-bold text-white mb-1">
                    {typeof score === 'number' ? score.toFixed(2) : score}
                  </div>
                  <p className="font-body text-sm text-navy-300">{t('results.cutoffScore')}</p>
                </div>
              ))}
            </div>

            {/* Summary Info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {group && (
                  <div className="text-left">
                    <p className="font-body text-navy-400 mb-1">{t('results.group')}</p>
                    <p className="font-body font-medium text-white">
                      {i18n.language === 'ta' && group.name_ta ? group.name_ta : group.name}
                    </p>
                  </div>
                )}
                {Object.keys(marks).length > 0 && (
                  <div className="text-left">
                    <p className="font-body text-navy-400 mb-1">{t('results.marksEntered')}</p>
                    <p className="font-body font-medium text-white">
                      {Object.entries(marks).map(([subject, mark]) => `${subject}: ${mark}`).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
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
        <Card variant="gradient" padding="lg" hover={false}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculator">
              <Button
                variant="ghost"
                size="lg"
                icon={Calculator}
                iconPosition="left"
              >
                {t('results.recalculate')}
              </Button>
            </Link>
            <Link to="/counselling">
              <Button
                variant="primary"
                size="lg"
              >
                {t('results.viewCounselling')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
