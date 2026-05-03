import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BookOpen, Loader2, FlaskConical, Palette, Wrench, Check } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import { useLanguage } from '../../context/LanguageContext'

const STREAM_CONFIG = {
  Science: {
    icon: FlaskConical,
    color: 'blue',
    commonSubjects: ['Physics', 'Chemistry'],
    labelEn: 'Science',
    labelTa: 'அறிவியல்',
  },
  Arts: {
    icon: Palette,
    color: 'purple',
    commonSubjects: ['Economics'],
    labelEn: 'Arts',
    labelTa: 'கலை',
  },
  Vocational: {
    icon: Wrench,
    color: 'amber',
    commonSubjects: [],
    labelEn: 'Vocational',
    labelTa: 'தொழிற்கல்வி',
  },
}

const STREAM_COLORS = {
  blue: {
    tab: 'bg-blue-600 text-white shadow-md shadow-blue-200',
    tabIdle: 'bg-white text-navy-600 hover:bg-blue-50 border border-navy-100',
    card: 'border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:shadow-md hover:shadow-blue-100/50',
    cardSelected: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-md shadow-blue-100/50',
    badge: 'bg-blue-100 text-blue-700',
    check: 'bg-blue-500 text-white',
  },
  purple: {
    tab: 'bg-purple-600 text-white shadow-md shadow-purple-200',
    tabIdle: 'bg-white text-navy-600 hover:bg-purple-50 border border-navy-100',
    card: 'border-purple-200 bg-purple-50/30 hover:border-purple-400 hover:shadow-md hover:shadow-purple-100/50',
    cardSelected: 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/20 shadow-md shadow-purple-100/50',
    badge: 'bg-purple-100 text-purple-700',
    check: 'bg-purple-500 text-white',
  },
  amber: {
    tab: 'bg-amber-600 text-white shadow-md shadow-amber-200',
    tabIdle: 'bg-white text-navy-600 hover:bg-amber-50 border border-navy-100',
    card: 'border-amber-200 bg-amber-50/30 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100/50',
    cardSelected: 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20 shadow-md shadow-amber-100/50',
    badge: 'bg-amber-100 text-amber-700',
    check: 'bg-amber-500 text-white',
  },
}

function getDistinguishingSubjects(subjects, commonSubjects) {
  if (!subjects || subjects.length === 0) return []
  const commonSet = new Set(commonSubjects.map(s => s.toLowerCase()))
  return subjects.filter(s => !commonSet.has(s.toLowerCase()))
}

function mergeTheoryPractical(subjects) {
  const seen = new Set()
  return subjects.reduce((acc, s) => {
    const base = s.replace(/[-–]\s*(Theory|Practical)\s*$/i, '').trim()
    if (!seen.has(base.toLowerCase())) {
      seen.add(base.toLowerCase())
      acc.push(base)
    }
    return acc
  }, [])
}

export default function Step1GroupSelect() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { group, updateGroup, nextStep } = useCalculatorContext()
  const { groups, isLoading, error } = useCalculator()

  // Determine active stream — default to stream of selected group, or Science
  const selectedGroup = groups.find(g => g.id === group)
  const [activeStream, setActiveStream] = useState(
    selectedGroup?.stream || 'Science'
  )

  // Group by stream
  const groupsByStream = useMemo(() => {
    const result = { Science: [], Arts: [], Vocational: [] }
    groups.forEach(g => {
      const stream = g.stream || 'Science'
      if (result[stream]) result[stream].push(g)
    })

    // Sort Science: Biology groups first, then Botany+Zoology, then Maths groups
    result.Science.sort((a, b) => {
      const rank = (g) => {
        const subs = (g.subjects || []).map(s => s.toLowerCase())
        if (subs.includes('biology') && subs.includes('mathematics')) return 1
        if (subs.includes('biology')) return 0
        if (subs.includes('botany')) return 2
        return 3
      }
      return rank(a) - rank(b)
    })

    return result
  }, [groups])

  const handleGroupSelect = (groupId) => {
    updateGroup(groupId)
  }

  const handleNext = () => {
    if (group) nextStep()
  }


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
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="font-body text-red-600">
            {t('common.error')}: {error.message}
          </p>
        </div>
      </Card>
    )
  }

  const streamConfig = STREAM_CONFIG[activeStream]
  const colors = STREAM_COLORS[streamConfig.color]
  const currentGroups = groupsByStream[activeStream] || []

  return (
    <Card variant="elevated" padding="lg">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="
          w-14 h-14 flex-shrink-0
          bg-gradient-to-br from-saffron-100 to-saffron-50
          rounded-2xl flex items-center justify-center
        ">
          <BookOpen className="w-7 h-7 text-saffron-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">
            {t('calculator.step1.title')}
          </h2>
          <p className="font-body text-navy-500 text-sm">
            {t('calculator.step1.description')}
          </p>
        </div>
      </div>

      {/* Stream Tabs */}
      <div className="flex gap-2 mb-6">
        {Object.entries(STREAM_CONFIG).map(([stream, config]) => {
          const Icon = config.icon
          const isActive = activeStream === stream
          const count = (groupsByStream[stream] || []).length
          const tabColors = STREAM_COLORS[config.color]

          return (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                font-body font-semibold text-sm
                transition-all duration-200
                ${isActive ? tabColors.tab : tabColors.tabIdle}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'ta' ? config.labelTa : config.labelEn}</span>
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-white/25 text-white' : 'bg-navy-100 text-navy-500'}
              `}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Common subjects hint */}
      {streamConfig.commonSubjects.length > 0 && (
        <p className="font-body text-xs text-navy-400 mb-3 px-1">
          {language === 'ta' ? 'அனைத்து குழுக்களிலும் பொதுவானவை: ' : 'Common to all groups: '}
          <span className="font-medium text-navy-500">
            {streamConfig.commonSubjects.join(', ')}
          </span>
          {activeStream === 'Science' && (
            <span className="text-navy-400">
              {language === 'ta'
                ? ' — கீழே உள்ள வேறுபடும் பாடங்களைத் தேர்ந்தெடுக்கவும்'
                : ' — select by the subjects that differ below'}
            </span>
          )}
        </p>
      )}

      {/* Group Cards Grid */}
      <div className={`
        grid gap-2.5
        ${activeStream === 'Vocational' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}
        mb-6 max-h-[400px] overflow-y-auto pr-1
        scrollbar-thin scrollbar-thumb-navy-200 scrollbar-track-transparent
      `}>
        {currentGroups.map((g) => {
          const isSelected = group === g.id
          const displaySubjects = mergeTheoryPractical(
            (language === 'ta' && g.name_ta) ? g.name_ta.split(', ') : g.subjects || []
          )

          return (
            <button
              key={g.id}
              onClick={() => handleGroupSelect(g.id)}
              className={`
                relative text-left p-3.5 rounded-xl border-2
                transition-all duration-200 cursor-pointer
                ${isSelected ? colors.cardSelected : colors.card}
              `}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className={`
                  absolute top-2.5 right-2.5 w-5 h-5 rounded-full
                  flex items-center justify-center ${colors.check}
                `}>
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Group code badge */}
              <span className={`
                inline-block text-[10px] font-bold font-body
                px-1.5 py-0.5 rounded-md mb-2
                ${colors.badge}
              `}>
                {g.code}
              </span>

              {/* Distinguishing subjects */}
              <div className="flex flex-wrap gap-1.5">
                {displaySubjects.map((subj, i) => (
                  <span
                    key={i}
                    className="
                      font-body text-sm font-medium text-navy-800
                      bg-white/80 px-2 py-0.5 rounded-md
                      border border-navy-100/50
                    "
                  >
                    {subj}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Group Preview */}
      {selectedGroup && (
        <div className="
          bg-gradient-to-br from-saffron-50 to-cream-100
          border border-saffron-100
          p-5 rounded-2xl mb-6
          animate-fade-in
        ">
          <h3 className="font-display font-bold text-base text-navy-900 mb-3">
            {t('calculator.step1.selectedSubjects')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(() => {
              const subjects = mergeTheoryPractical(
                language === 'ta' && selectedGroup.subjects_ta?.length
                  ? selectedGroup.subjects_ta
                  : selectedGroup.subjects || []
              )
              return subjects.map((subject, index) => (
                <div
                  key={index}
                  className="
                    flex items-center gap-2
                    bg-white px-3 py-2 rounded-xl
                    border border-saffron-100 shadow-soft
                  "
                >
                  <span className="
                    w-6 h-6 flex-shrink-0 bg-saffron-100 rounded-lg
                    flex items-center justify-center
                    font-display font-bold text-xs text-saffron-600
                  ">
                    {index + 1}
                  </span>
                  <span className="font-body text-navy-700 font-medium text-sm">
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
