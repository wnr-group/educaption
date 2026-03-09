import { useTranslation } from 'react-i18next'
import { ArrowRight, BookOpen, Loader2 } from 'lucide-react'
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

  // Group options by stream (Science, Arts, Vocational)
  const groupedOptions = (() => {
    const streams = {
      Science: { label: language === 'ta' ? 'அறிவியல் (Science)' : 'Science', options: [] },
      Arts: { label: language === 'ta' ? 'கலை (Arts)' : 'Arts', options: [] },
      Vocational: { label: language === 'ta' ? 'தொழிற்கல்வி (Vocational)' : 'Vocational', options: [] }
    }

    groups.forEach(g => {
      // Get full subject list for display
      const subjectList = (language === 'ta' && g.name_ta)
        ? g.name_ta
        : (g.subjects || []).join(', ')

      const stream = g.stream || 'Science'
      if (streams[stream]) {
        streams[stream].options.push({
          value: g.id,
          label: subjectList
        })
      }
    })

    // Return only streams that have options
    return Object.values(streams).filter(s => s.options.length > 0)
  })()

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-saffron-500 animate-spin mb-4" />
          <span className="font-body text-navy-500">{t('common.loading')}</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-8">
          <div className="
            w-16 h-16 mx-auto mb-4
            bg-red-100 rounded-2xl
            flex items-center justify-center
          ">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="font-body text-red-600">
            {t('common.error')}: {error.message}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="elevated" padding="lg">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="
          w-14 h-14 flex-shrink-0
          bg-gradient-to-br from-saffron-100 to-saffron-50
          rounded-2xl
          flex items-center justify-center
        ">
          <BookOpen className="w-7 h-7 text-saffron-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
            {t('calculator.step1.title')}
          </h2>
          <p className="font-body text-navy-500">
            {t('calculator.step1.description')}
          </p>
        </div>
      </div>

      {/* Select Dropdown */}
      <div className="mb-8">
        <Select
          label={t('calculator.step1.selectGroup')}
          value={group || ''}
          onChange={handleGroupChange}
          options={groupedOptions}
          grouped={true}
        />
      </div>

      {/* Selected Subjects Preview */}
      {group && (
        <div className="
          bg-gradient-to-br from-saffron-50 to-cream-100
          border border-saffron-100
          p-6 rounded-2xl mb-8
          animate-fade-in
        ">
          <h3 className="
            font-display font-bold text-lg
            text-navy-900 mb-4
          ">
            {t('calculator.step1.selectedSubjects')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(() => {
              const selectedGroup = groups.find(g => g.id === group)
              const subjects = language === 'ta' && selectedGroup?.subjects_ta?.length
                ? selectedGroup.subjects_ta
                : selectedGroup?.subjects || []
              return subjects.map((subject, index) => (
                <div
                  key={index}
                  className="
                    flex items-center gap-3
                    bg-white
                    px-4 py-3
                    rounded-xl
                    border border-saffron-100
                    shadow-soft
                  "
                >
                  <span className="
                    w-8 h-8 flex-shrink-0
                    bg-saffron-100
                    rounded-lg
                    flex items-center justify-center
                    font-display font-bold text-sm
                    text-saffron-600
                  ">
                    {index + 1}
                  </span>
                  <span className="font-body text-navy-700 font-medium">
                    {subject}
                  </span>
                </div>
              ))
            })()}
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!group}
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
        >
          {t('common.next')}
        </Button>
      </div>
    </Card>
  )
}
