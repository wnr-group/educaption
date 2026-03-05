import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Search } from 'lucide-react'
import CourseFilters from '../components/courses/CourseFilters'
import CourseList from '../components/courses/CourseList'
import { useCourses } from '../hooks/queries'

export default function Courses() {
  const { t } = useTranslation()
  const [selectedStream, setSelectedStream] = useState('')

  const { data: courses, isLoading, error } = useCourses({
    streamId: selectedStream || undefined
  })

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
            <BookOpen className="w-4 h-4 text-saffron-500" />
            <span className="font-body text-sm font-medium text-navy-700">
              Engineering Courses
            </span>
          </div>

          <h1 className="
            font-display text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-4
          ">
            {t('courses.title')}
          </h1>
          <p className="
            font-body text-lg
            text-navy-500
            max-w-2xl mx-auto
          ">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CourseFilters
            selectedStream={selectedStream}
            onStreamChange={setSelectedStream}
          />
        </div>

        {/* Course List */}
        <CourseList
          courses={courses}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  )
}
