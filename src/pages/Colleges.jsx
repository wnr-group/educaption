import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2 } from 'lucide-react'
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
    <main className="min-h-screen bg-gradient-hero py-12 lg:py-16">
      {/* Background decoration */}
      <div className="fixed inset-0 pattern-kolam opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="
            inline-flex items-center gap-2
            px-4 py-2 mb-6
            bg-white/80 backdrop-blur-sm
            border border-navy-200
            rounded-full
            shadow-soft
          ">
            <Building2 className="w-4 h-4 text-saffron-500" />
            <span className="font-body text-sm font-medium text-navy-700">
              Engineering Colleges
            </span>
          </div>

          <h1 className="
            font-display text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-4
          ">
            {t('colleges.title')}
          </h1>
          <p className="
            font-body text-lg
            text-navy-500
            max-w-2xl mx-auto
          ">
            {t('colleges.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <CollegeSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Results count */}
        {filteredColleges && (
          <div className="mb-6">
            <p className="font-body text-navy-500">
              Showing <span className="font-semibold text-navy-700">{filteredColleges.length}</span> colleges
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* College Grid */}
        <CollegeGrid
          colleges={filteredColleges}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  )
}
