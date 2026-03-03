import { useTranslation } from 'react-i18next'
import Select from '../ui/Select'
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="max-w-xs">
        <Select
          label={t('courses.filterByStream')}
          options={streamOptions}
          value={selectedStream}
          onChange={(e) => onStreamChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
