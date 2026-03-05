import { useTranslation } from 'react-i18next'
import { Filter } from 'lucide-react'
import Select from '../ui/Select'
import Card from '../ui/Card'
import { useStreams } from '../../hooks/queries'
import { useLanguage } from '../../context/LanguageContext'

export default function CourseFilters({ selectedStream, onStreamChange }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { data: streams, isLoading } = useStreams()

  const streamOptions = streams?.map(stream => ({
    value: stream.id,
    label: language === 'ta' && stream.name_ta ? stream.name_ta : stream.name
  })) || []

  return (
    <Card variant="glass" padding="default" hover={false}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <div className="
            w-10 h-10
            bg-saffron-100
            rounded-xl
            flex items-center justify-center
          ">
            <Filter className="w-5 h-5 text-saffron-600" />
          </div>
          <span className="font-display font-bold text-navy-900">
            {t('common.filter')}
          </span>
        </div>

        <div className="flex-1 max-w-sm">
          <Select
            label={t('courses.filterByStream')}
            options={streamOptions}
            value={selectedStream}
            onChange={(e) => onStreamChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {selectedStream && (
          <button
            onClick={() => onStreamChange('')}
            className="
              px-4 py-2
              text-saffron-600
              font-body font-medium text-sm
              hover:text-saffron-700 hover:bg-saffron-50
              rounded-lg
              transition-colors duration-200
            "
          >
            Clear Filter
          </button>
        )}
      </div>
    </Card>
  )
}
