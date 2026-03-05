import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import Card from '../ui/Card'

export default function CollegeSearchBar({ searchQuery, onSearchChange }) {
  const { t } = useTranslation()

  return (
    <Card variant="glass" padding="default" hover={false}>
      <div className="relative max-w-2xl mx-auto">
        <div className="
          absolute left-4 top-1/2 -translate-y-1/2
          pointer-events-none
        ">
          <Search className="w-5 h-5 text-navy-400" />
        </div>
        <input
          type="text"
          placeholder={t('colleges.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full
            pl-12 pr-12 py-4
            bg-white
            border-2 border-navy-200
            rounded-xl
            font-body text-navy-900
            placeholder:text-navy-300
            transition-all duration-200
            hover:border-navy-300
            focus:outline-none focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10
          "
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              p-1
              rounded-lg
              text-navy-400
              hover:text-navy-600 hover:bg-navy-100
              transition-colors duration-200
            "
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </Card>
  )
}
