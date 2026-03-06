import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Trophy, BookOpen, School, FileText, RotateCcw, ArrowRight, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useLanguage } from '../../context/LanguageContext'

export default function ResultsDisplay() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { results, reset } = useCalculatorContext()

  if (!results) return null

  // Support both old (streamCutoffs) and new (cutoffResults) format
  const cutoffResults = results.cutoffResults || results.streamCutoffs || []
  const eligibleCourses = results.eligibleCourses || []
  const totalMarks = results.totalMarks || 0

  const handleStartOver = () => {
    reset()
  }

  // Get the highest cutoff for celebration display
  const highestCutoff = cutoffResults.length > 0
    ? Math.max(...cutoffResults.map(r => r.cutoff))
    : 0

  return (
    <div className="space-y-6">
      {/* Hero Summary Card */}
      <Card
        variant="dark"
        padding="lg"
        hover={false}
        className="relative overflow-hidden text-center"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pattern-kolam opacity-5" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-saffron-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-saffron-500/10 rounded-full blur-2xl" />

        <div className="relative">
          {/* Trophy Icon */}
          <div className="
            w-20 h-20 mx-auto mb-6
            bg-gradient-to-br from-saffron-400 to-saffron-500
            rounded-3xl
            flex items-center justify-center
            shadow-glow-saffron
          ">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h2 className="font-display text-3xl font-bold text-white mb-2">
            {t('calculator.results.title')}
          </h2>

          <p className="font-body text-navy-300 mb-8">
            {t('calculator.results.totalMarks')}
          </p>

          <div className="
            inline-flex items-baseline gap-3
            bg-white/10 backdrop-blur-sm
            px-8 py-4
            rounded-2xl
          ">
            <span className="font-display text-6xl font-bold text-white">
              {totalMarks.toFixed(0)}
            </span>
            <span className="font-body text-2xl text-navy-300">
              {t('results.marks')}
            </span>
          </div>
        </div>
      </Card>

      {/* Stream Cutoffs */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="
            w-12 h-12
            bg-saffron-100
            rounded-xl
            flex items-center justify-center
          ">
            <Sparkles className="w-6 h-6 text-saffron-600" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-navy-900">
              {t('calculator.results.cutoffScores')}
            </h3>
            <p className="font-body text-sm text-navy-500">
              {t('results.basedOnFormula')}
            </p>
          </div>
        </div>

        {cutoffResults.length === 0 ? (
          <div className="
            text-center py-8
            bg-cream-100 rounded-xl
          ">
            <p className="font-body text-navy-500">
              {t('calculator.results.noEligibleStreams')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cutoffResults.map((result) => (
              <div
                key={result.admissionBodyId || result.streamId}
                className="
                  p-5
                  bg-gradient-to-br from-cream-50 to-white
                  border border-navy-100
                  rounded-xl
                "
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-display font-bold text-navy-900 mb-1">
                      {language === 'ta' && (result.admissionBodyNameTa || result.streamNameTa)
                        ? (result.admissionBodyNameTa || result.streamNameTa)
                        : (result.admissionBodyName || result.streamName)}
                    </h4>
                    <p className="font-body text-sm text-navy-400">
                      {t('calculator.results.formula')}: {result.formula}
                    </p>
                    {result.courses && result.courses.length > 0 && (
                      <p className="font-body text-xs text-navy-300 mt-1">
                        {result.courses.length} courses available
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-bold text-saffron-600">
                      {result.cutoff.toFixed(2)}
                    </p>
                    <p className="font-body text-sm text-navy-400">
                      / {result.maxCutoff}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((result.cutoff / result.maxCutoff) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Eligible Courses */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="
              w-12 h-12
              bg-emerald-100
              rounded-xl
              flex items-center justify-center
            ">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-navy-900">
                {t('calculator.results.eligibleCourses')}
              </h3>
              <p className="font-body text-sm text-navy-500">
                {t('results.coursesAvailable', { count: eligibleCourses.length })}
              </p>
            </div>
          </div>
          <span className="
            px-3 py-1
            bg-emerald-100
            text-emerald-700
            rounded-full
            font-body font-semibold text-sm
          ">
            {eligibleCourses.length}
          </span>
        </div>

        {eligibleCourses.length === 0 ? (
          <div className="
            text-center py-8
            bg-cream-100 rounded-xl
          ">
            <p className="font-body text-navy-500">
              {t('calculator.results.noEligibleCourses')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {eligibleCourses.slice(0, 8).map((course) => (
              <div
                key={course.id}
                className="
                  flex items-center gap-4
                  p-4
                  bg-cream-50
                  border border-navy-100
                  rounded-xl
                  transition-all duration-200
                  hover:border-emerald-200 hover:bg-emerald-50/30
                "
              >
                <div className="
                  w-10 h-10 flex-shrink-0
                  bg-white
                  rounded-lg
                  flex items-center justify-center
                  border border-navy-100
                ">
                  <span className="font-body font-bold text-sm text-navy-500">
                    {course.code?.slice(0, 2) || '📚'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-medium text-navy-900 truncate">
                    {language === 'ta' && course.name_ta
                      ? course.name_ta
                      : course.name}
                  </h4>
                  <p className="font-body text-sm text-navy-400">
                    {course.duration} | {language === 'ta' && course.stream?.name_ta ? course.stream.name_ta : course.stream?.name}
                  </p>
                </div>
              </div>
            ))}

            {eligibleCourses.length > 8 && (
              <p className="text-center font-body text-navy-400 text-sm pt-2">
                {t('calculator.results.andMore', { count: eligibleCourses.length - 8 })}
              </p>
            )}
          </div>
        )}

        {eligibleCourses.length > 0 && (
          <Link to="/courses" className="block mt-6">
            <Button variant="outline" className="w-full" icon={ArrowRight} iconPosition="right">
              {t('calculator.results.viewAllCourses')}
            </Button>
          </Link>
        )}
      </Card>

      {/* Next Steps */}
      <Card variant="gradient" padding="lg">
        <h3 className="font-display text-xl font-bold text-navy-900 mb-6">
          {t('calculator.results.nextSteps')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link to="/colleges">
            <Button variant="primary" className="w-full" size="lg" icon={School} iconPosition="left">
              {t('calculator.results.exploreColleges')}
            </Button>
          </Link>
          <Link to="/counselling">
            <Button variant="secondary" className="w-full" size="lg" icon={FileText} iconPosition="left">
              {t('calculator.results.viewCounselling')}
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          onClick={handleStartOver}
          className="w-full"
          icon={RotateCcw}
          iconPosition="left"
        >
          {t('calculator.results.startOver')}
        </Button>
      </Card>
    </div>
  )
}
