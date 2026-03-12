import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Search, X, Clock, GraduationCap, ChevronDown, Users } from 'lucide-react'
import { useCourses } from '../hooks/queries'
import { useLanguage } from '../context/LanguageContext'
import { useHeaderOffset } from '../hooks/useHeaderOffset'

export default function Courses() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { headerPaddingClass } = useHeaderOffset()
  const [selectedAdmissionBody, setSelectedAdmissionBody] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: courses = [], isLoading } = useCourses()

  // Get unique admission bodies from courses
  const admissionBodies = useMemo(() => {
    const bodies = new Set()
    courses.forEach(course => {
      if (course.admission_body) {
        bodies.add(course.admission_body)
      }
    })
    return Array.from(bodies).sort()
  }, [courses])

  // Filter courses by admission body and search query
  const filteredCourses = useMemo(() => {
    let result = courses

    // Filter by admission body
    if (selectedAdmissionBody) {
      result = result.filter(course => course.admission_body === selectedAdmissionBody)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(course => {
        const name = course.name?.toLowerCase() || ''
        const nameTa = course.name_ta?.toLowerCase() || ''
        const body = course.admission_body?.toLowerCase() || ''
        return name.includes(query) || nameTa.includes(query) || body.includes(query)
      })
    }

    return result
  }, [courses, selectedAdmissionBody, searchQuery])

  // Group courses by admission body for display
  const coursesByAdmissionBody = useMemo(() => {
    const grouped = {}
    filteredCourses.forEach(course => {
      const body = course.admission_body || 'Other'
      if (!grouped[body]) {
        grouped[body] = []
      }
      grouped[body].push(course)
    })

    // Sort groups by name
    const sortedKeys = Object.keys(grouped).sort()
    const sortedGrouped = {}
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key]
    })

    return sortedGrouped
  }, [filteredCourses])

  return (
    <main className={`min-h-screen bg-[#FAFAFA] ${headerPaddingClass} pb-12 lg:pb-16`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1A1A2E] tracking-tight mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-[#1A1A2E]/50 max-w-2xl mx-auto">
            Discover all the courses you can pursue after 12th standard in Tamil Nadu
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-[#1A1A2E]/[0.06] shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A2E]/30" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3
                  bg-[#FAFAFA]
                  border border-[#1A1A2E]/[0.08]
                  rounded-xl
                  text-[#1A1A2E]
                  placeholder:text-[#1A1A2E]/30
                  focus:outline-none focus:border-[#FF6B35]/50 focus:ring-2 focus:ring-[#FF6B35]/10
                  transition-all duration-200
                "
              />
            </div>

            {/* Admission Body Filter */}
            <div className="relative min-w-[220px]">
              <select
                value={selectedAdmissionBody}
                onChange={(e) => setSelectedAdmissionBody(e.target.value)}
                className="
                  w-full px-4 py-3
                  bg-[#FAFAFA]
                  border border-[#1A1A2E]/[0.08]
                  rounded-xl
                  text-[#1A1A2E]
                  font-medium
                  appearance-none
                  cursor-pointer
                  focus:outline-none focus:border-[#FF6B35]/50 focus:ring-2 focus:ring-[#FF6B35]/10
                  transition-all duration-200
                "
              >
                <option value="">All Admission Bodies</option>
                {admissionBodies.map(body => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A2E]/30 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(selectedAdmissionBody || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedAdmissionBody('')
                  setSearchQuery('')
                }}
                className="
                  px-4 py-3
                  text-[#FF6B35] font-semibold
                  hover:bg-[#FF6B35]/5
                  rounded-xl
                  transition-colors duration-200
                  flex items-center gap-2
                "
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-[#1A1A2E]/[0.06]">
            <p className="text-sm text-[#1A1A2E]/50">
              Showing <span className="font-semibold text-[#1A1A2E]">{filteredCourses.length}</span> courses
              {selectedAdmissionBody && (
                <> in <span className="font-semibold text-[#FF6B35]">{selectedAdmissionBody}</span></>
              )}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin mb-4" />
            <p className="text-[#1A1A2E]/50">Loading courses...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#1A1A2E]/5 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#1A1A2E]/20" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">No courses found</h3>
            <p className="text-[#1A1A2E]/50">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Courses by Admission Body */}
        {!isLoading && filteredCourses.length > 0 && (
          <div className="space-y-12">
            {Object.entries(coursesByAdmissionBody).map(([bodyName, bodyCourses]) => (
              <div key={bodyName}>
                {/* Section Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A2E]">
                      {bodyName}
                    </h2>
                    <p className="text-sm text-[#FF6B35] font-medium mt-1">
                      {bodyCourses.length} course{bodyCourses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {!selectedAdmissionBody && (
                    <button
                      onClick={() => setSelectedAdmissionBody(bodyName)}
                      className="text-sm text-[#1A1A2E]/50 hover:text-[#FF6B35] transition-colors"
                    >
                      View all →
                    </button>
                  )}
                </div>

                {/* Course Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bodyCourses.map(course => {
                    const courseName = language === 'ta' && course.name_ta ? course.name_ta : course.name

                    return (
                      <div
                        key={course.id}
                        className="
                          group
                          bg-white
                          rounded-2xl
                          border border-[#1A1A2E]/[0.06]
                          p-5
                          hover:border-[#FF6B35]/20
                          hover:shadow-lg hover:shadow-[#FF6B35]/5
                          transition-all duration-300
                        "
                      >
                        {/* Course Icon */}
                        <div className="
                          w-12 h-12 mb-4
                          bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5
                          rounded-xl
                          flex items-center justify-center
                          group-hover:scale-110
                          transition-transform duration-300
                        ">
                          <GraduationCap className="w-6 h-6 text-[#FF6B35]" />
                        </div>

                        {/* Course Name */}
                        <h3 className="
                          font-bold text-[#1A1A2E] text-lg
                          mb-3
                          leading-tight
                          group-hover:text-[#FF6B35]
                          transition-colors duration-200
                        ">
                          {courseName}
                        </h3>

                        {/* Course Details */}
                        <div className="flex flex-wrap gap-2">
                          {course.duration && (
                            <span className="
                              inline-flex items-center gap-1.5
                              px-3 py-1.5
                              bg-[#1A1A2E]/[0.03]
                              rounded-full
                              text-xs font-medium text-[#1A1A2E]/60
                            ">
                              <Clock className="w-3.5 h-3.5" />
                              {course.duration}
                            </span>
                          )}

                          {course.eligible_groups && course.eligible_groups.length > 0 && (
                            <span className="
                              inline-flex items-center gap-1.5
                              px-3 py-1.5
                              bg-[#7B4AE2]/10
                              rounded-full
                              text-xs font-medium text-[#7B4AE2]
                            ">
                              <Users className="w-3.5 h-3.5" />
                              {course.eligible_groups.length} groups
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
