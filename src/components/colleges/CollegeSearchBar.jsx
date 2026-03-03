import { useTranslation } from 'react-i18next'
import Input from '../ui/Input'

export default function CollegeSearchBar({ searchQuery, onSearchChange }) {
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="max-w-md">
        <Input
          type="text"
          placeholder={t('colleges.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
