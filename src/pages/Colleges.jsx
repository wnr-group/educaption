import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import CollegeSearchBar from '../components/colleges/CollegeSearchBar'
import CollegeGrid from '../components/colleges/CollegeGrid'
import { useColleges } from '../hooks/queries'
import { useLanguage } from '../context/LanguageContext'

export default function Colleges() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: colleges, isLoading, error } = useColleges()

  const filteredColleges = useMemo(() => {
    if (!colleges || !searchQuery.trim()) {
      return colleges
    }

    const query = searchQuery.toLowerCase().trim()
    return colleges.filter(college => {
      const name = college.name?.toLowerCase() || ''
      const nameTa = college.name_ta?.toLowerCase() || ''
      const code = college.code?.toLowerCase() || ''
      const district = college.district?.toLowerCase() || ''

      return name.includes(query) ||
             nameTa.includes(query) ||
             code.includes(query) ||
             district.includes(query)
    })
  }, [colleges, searchQuery])

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('colleges.title')}</h1>

        <CollegeSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <CollegeGrid
          colleges={filteredColleges}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
