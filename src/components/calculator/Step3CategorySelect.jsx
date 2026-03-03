import { useTranslation } from 'react-i18next'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import { useLanguage } from '../../context/LanguageContext'

export default function Step3CategorySelect() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const {
    group,
    marks,
    category,
    updateCategory,
    setResults,
    prevStep
  } = useCalculatorContext()
  const {
    categories,
    calculateCutoffs,
    getEligibleCourses,
    isLoading
  } = useCalculator()

  const handleCategoryChange = (e) => {
    updateCategory(e.target.value)
  }

  const handleCalculate = () => {
    if (!category) return

    // Calculate cutoffs for all eligible streams
    const streamCutoffs = calculateCutoffs(group, marks)

    // Get eligible courses
    const eligibleCourses = getEligibleCourses(streamCutoffs)

    // Find selected category info
    const selectedCategory = categories.find(c => c.id === category)

    // Set results
    setResults({
      streamCutoffs,
      eligibleCourses,
      category: selectedCategory,
      marks,
      totalMarks: Object.values(marks).reduce((sum, m) => sum + (parseFloat(m) || 0), 0)
    })
  }

  // Format options with Tamil name support
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: language === 'ta' && cat.name_ta
      ? `${cat.code} - ${cat.name_ta}`
      : `${cat.code} - ${cat.name}`
  }))

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">
        {t('calculator.step3.title')}
      </h2>
      <p className="text-slate-600 mb-6">
        {t('calculator.step3.description')}
      </p>

      <div className="mb-6">
        <Select
          label={t('calculator.step3.selectCategory')}
          value={category || ''}
          onChange={handleCategoryChange}
          options={categoryOptions}
        />
      </div>

      {category && (
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-amber-700 mb-2">
            {t('calculator.step3.readyToCalculate')}
          </h3>
          <p className="text-slate-600">
            {t('calculator.step3.calculationInfo')}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
        >
          {t('common.back')}
        </Button>
        <Button
          onClick={handleCalculate}
          disabled={!category || isLoading}
          variant="secondary"
        >
          {isLoading ? t('common.loading') : t('calculator.step3.calculate')}
        </Button>
      </div>
    </Card>
  )
}
