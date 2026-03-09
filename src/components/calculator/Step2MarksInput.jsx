import { useTranslation } from 'react-i18next'
import { ArrowLeft, Calculator, CheckCircle, PenLine } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import { useLanguage } from '../../context/LanguageContext'

export default function Step2MarksInput() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { group, marks, updateSingleMark, setResults, prevStep } = useCalculatorContext()
  const { getSubjectsForGroup, getTranslatedSubjectsForGroup, validateGroupMarks, calculateCutoffs, getEligibleCourses, isLoading } = useCalculator()

  const subjects = getSubjectsForGroup(group)
  const translatedSubjects = getTranslatedSubjectsForGroup(group, language)
  const validation = validateGroupMarks(group, marks)

  // Language subjects are always required (fixed labels)
  const languageSubjects = ['Language 1', 'Language 2']

  // All subjects: 2 languages + 4 group subjects
  const allSubjects = [...languageSubjects, ...subjects]
  const allTranslatedSubjects = [
    language === 'ta' ? 'மொழி 1' : 'Language 1',
    language === 'ta' ? 'மொழி 2' : 'Language 2',
    ...translatedSubjects
  ]

  const handleMarkChange = (subject, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      updateSingleMark(subject, value)
    }
  }

  const handleCalculate = () => {
    if (!validation.isValid) return

    const streamCutoffs = calculateCutoffs(group, marks)
    const eligibleCourses = getEligibleCourses(streamCutoffs)

    setResults({
      streamCutoffs,
      eligibleCourses,
      marks,
      totalMarks: Object.values(marks).reduce((sum, m) => sum + (parseFloat(m) || 0), 0)
    })
  }

  const allMarksFilled = allSubjects.every(subject => {
    const mark = marks[subject]
    return mark !== undefined && mark !== '' && mark !== null
  })

  const totalMarks = Object.values(marks).reduce((sum, mark) => sum + (parseFloat(mark) || 0), 0)
  const maxMarks = allSubjects.length * 100
  const percentComplete = allMarksFilled ? (totalMarks / maxMarks) * 100 : 0

  return (
    <Card variant="elevated" padding="lg">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="
          w-14 h-14 flex-shrink-0
          bg-gradient-to-br from-navy-100 to-navy-50
          rounded-2xl
          flex items-center justify-center
        ">
          <PenLine className="w-7 h-7 text-navy-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
            {t('calculator.step2.title')}
          </h2>
          <p className="font-body text-navy-500">
            {t('calculator.step2.description')}
          </p>
        </div>
      </div>

      {/* Marks Input Grid */}
      <div className="space-y-4 mb-8">
        {allSubjects.map((subject, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-4
              p-4
              ${index < 2 ? 'bg-saffron-50 border-saffron-200' : 'bg-cream-50 border-navy-100'}
              border
              rounded-xl
              transition-all duration-200
              focus-within:border-saffron-300
              focus-within:shadow-soft
            `}
          >
            {/* Subject Number */}
            <span className={`
              w-10 h-10 flex-shrink-0
              ${index < 2 ? 'bg-saffron-100 text-saffron-700' : 'bg-white text-navy-600'}
              rounded-xl
              flex items-center justify-center
              font-display font-bold text-sm
              border border-navy-100
            `}>
              {index < 2 ? 'L' + (index + 1) : index - 1}
            </span>

            {/* Subject Name */}
            <div className="flex-1 min-w-0">
              <label className="font-body font-medium text-navy-800 block mb-1">
                {allTranslatedSubjects[index] || subject}
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={t('calculator.step2.enterMarks') || "Enter marks (0-100)"}
                value={marks[subject] || ''}
                onChange={(e) => handleMarkChange(subject, e.target.value)}
                className="
                  w-full
                  bg-transparent
                  border-none
                  p-0
                  font-body text-lg
                  text-navy-900
                  placeholder:text-navy-300
                  focus:outline-none focus:ring-0
                "
              />
            </div>

            {/* Max Marks */}
            <div className="flex items-center gap-2">
              <span className="font-body text-navy-400">/100</span>
              {marks[subject] && parseFloat(marks[subject]) >= 0 && parseFloat(marks[subject]) <= 100 && (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Total Marks Preview */}
      {allMarksFilled && validation.isValid && (
        <div className="
          bg-gradient-to-br from-emerald-50 to-green-50
          border border-emerald-100
          p-6 rounded-2xl mb-8
          animate-fade-in
        ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-navy-900">
              {t('calculator.step2.totalMarks')}
            </h3>
            <span className="
              px-3 py-1
              bg-emerald-500
              text-white
              rounded-full
              font-body font-semibold text-sm
            ">
              Ready to Calculate
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-emerald-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-emerald-600">
              {totalMarks.toFixed(0)}
            </span>
            <span className="font-body text-lg text-navy-500">
              / {maxMarks}
            </span>
            <span className="ml-auto font-body font-semibold text-emerald-600">
              {percentComplete.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="ghost"
          onClick={prevStep}
          icon={ArrowLeft}
          iconPosition="left"
          size="lg"
        >
          {t('common.back')}
        </Button>
        <Button
          onClick={handleCalculate}
          disabled={!allMarksFilled || !validation.isValid || isLoading}
          variant="primary"
          size="lg"
          icon={Calculator}
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          {isLoading ? t('common.loading') : t('calculator.step3.calculate')}
        </Button>
      </div>
    </Card>
  )
}
