import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('courses.title')}</h1>

        <CourseFilters
          selectedStream={selectedStream}
          onStreamChange={setSelectedStream}
        />

        <CourseList
          courses={courses}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
