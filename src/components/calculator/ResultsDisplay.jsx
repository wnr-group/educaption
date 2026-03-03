import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useLanguage } from '../../context/LanguageContext'

export default function ResultsDisplay() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { results, reset } = useCalculatorContext()

  if (!results) {
    return null
  }

  const { streamCutoffs, eligibleCourses, category, totalMarks } = results

  const handleStartOver = () => {
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary to-blue-700 text-white">
        <h2 className="text-2xl font-bold mb-4">
          {t('calculator.results.title')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-blue-100 text-sm">{t('calculator.results.totalMarks')}</p>
            <p className="text-3xl font-bold">{totalMarks.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">{t('calculator.results.category')}</p>
            <p className="text-xl font-semibold">
              {language === 'ta' && category?.name_ta
                ? category.name_ta
                : category?.name || category?.code}
            </p>
          </div>
        </div>
      </Card>

      {/* Stream Cutoffs */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">
          {t('calculator.results.cutoffScores')}
        </h3>

        {streamCutoffs.length === 0 ? (
          <div className="text-slate-500 py-4">
            {t('calculator.results.noEligibleStreams')}
          </div>
        ) : (
          <div className="space-y-4">
            {streamCutoffs.map((stream, index) => (
              <div
                key={stream.streamId}
                className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-text">
                      {language === 'ta' && stream.streamNameTa
                        ? stream.streamNameTa
                        : stream.streamName}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {t('calculator.results.formula')}: {stream.formula}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {stream.cutoff.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500">
                      / {stream.maxCutoff}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((stream.cutoff / stream.maxCutoff) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Eligible Courses */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">
          {t('calculator.results.eligibleCourses')}
          <span className="text-slate-500 text-base font-normal ml-2">
            ({eligibleCourses.length})
          </span>
        </h3>

        {eligibleCourses.length === 0 ? (
          <div className="text-slate-500 py-4">
            {t('calculator.results.noEligibleCourses')}
          </div>
        ) : (
          <div className="grid gap-3">
            {eligibleCourses.slice(0, 10).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">
                    {language === 'ta' && course.name_ta
                      ? course.name_ta
                      : course.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {course.duration} | {course.stream?.name}
                  </p>
                </div>
              </div>
            ))}

            {eligibleCourses.length > 10 && (
              <p className="text-center text-slate-500 text-sm mt-2">
                {t('calculator.results.andMore', { count: eligibleCourses.length - 10 })}
              </p>
            )}
          </div>
        )}

        {eligibleCourses.length > 0 && (
          <Link to="/courses" className="block mt-4">
            <Button variant="outline" className="w-full">
              {t('calculator.results.viewAllCourses')}
            </Button>
          </Link>
        )}
      </Card>

      {/* Action Buttons */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          {t('calculator.results.nextSteps')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/colleges">
            <Button className="w-full">
              {t('calculator.results.exploreColleges')}
            </Button>
          </Link>
          <Link to="/counselling">
            <Button variant="secondary" className="w-full">
              {t('calculator.results.viewCounselling')}
            </Button>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleStartOver}
            className="w-full"
          >
            {t('calculator.results.startOver')}
          </Button>
        </div>
      </Card>
    </div>
  )
}
