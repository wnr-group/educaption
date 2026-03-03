import { useTranslation } from 'react-i18next'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'

export default function Step2MarksInput() {
  const { t } = useTranslation()
  const { group, marks, updateSingleMark, nextStep, prevStep } = useCalculatorContext()
  const { getSubjectsForGroup, validateGroupMarks } = useCalculator()

  const subjects = getSubjectsForGroup(group)
  const validation = validateGroupMarks(group, marks)

  const handleMarkChange = (subject, value) => {
    // Only allow numbers and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      updateSingleMark(subject, value)
    }
  }

  const handleNext = () => {
    if (validation.isValid) {
      nextStep()
    }
  }

  // Check if all marks are filled (for enabling next button)
  const allMarksFilled = subjects.every(subject => {
    const mark = marks[subject]
    return mark !== undefined && mark !== '' && mark !== null
  })

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">
        {t('calculator.step2.title')}
      </h2>
      <p className="text-slate-600 mb-6">
        {t('calculator.step2.description')}
      </p>

      <div className="grid gap-4 mb-6">
        {subjects.map((subject, index) => (
          <div key={index} className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                label={subject}
                type="text"
                inputMode="decimal"
                placeholder="0 - 100"
                value={marks[subject] || ''}
                onChange={(e) => handleMarkChange(subject, e.target.value)}
                error={validation.errors[subject]}
              />
            </div>
            <div className="pb-2 text-slate-500 w-12 text-right">
              / 100
            </div>
          </div>
        ))}
      </div>

      {/* Total marks preview */}
      {allMarksFilled && validation.isValid && (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-secondary mb-2">
            {t('calculator.step2.totalMarks')}
          </h3>
          <p className="text-2xl font-bold text-secondary">
            {Object.values(marks).reduce((sum, mark) => sum + (parseFloat(mark) || 0), 0).toFixed(0)}
            <span className="text-lg font-normal text-slate-600"> / {subjects.length * 100}</span>
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
          onClick={handleNext}
          disabled={!allMarksFilled || !validation.isValid}
        >
          {t('common.next')}
        </Button>
      </div>
    </Card>
  )
}
