import { useTranslation } from 'react-i18next'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import { useLanguage } from '../../context/LanguageContext'

export default function Step1GroupSelect() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { group, updateGroup, nextStep } = useCalculatorContext()
  const { groups, groupOptions, isLoading, error } = useCalculator()

  const handleGroupChange = (e) => {
    updateGroup(e.target.value)
  }

  const handleNext = () => {
    if (group) {
      nextStep()
    }
  }

  // Format options with Tamil name support
  const formattedOptions = groups.map(g => ({
    value: g.id,
    label: language === 'ta' && g.name_ta
      ? `${g.code} - ${g.name_ta}`
      : `Group ${g.code} - ${g.name}`
  }))

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-slate-600">{t('common.loading')}</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-500 py-4">
          {t('common.error')}: {error.message}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">
        {t('calculator.step1.title')}
      </h2>
      <p className="text-slate-600 mb-6">
        {t('calculator.step1.description')}
      </p>

      <div className="mb-6">
        <Select
          label={t('calculator.step1.selectGroup')}
          value={group || ''}
          onChange={handleGroupChange}
          options={formattedOptions}
        />
      </div>

      {group && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-primary mb-2">
            {t('calculator.step1.selectedSubjects')}
          </h3>
          <ul className="list-disc list-inside text-slate-700">
            {groups.find(g => g.id === group)?.subjects.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!group}
        >
          {t('common.next')}
        </Button>
      </div>
    </Card>
  )
}
