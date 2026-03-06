import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../../lib/airtable'

/**
 * Fetch courses with optional admission body filter
 * @param {Object} options - Query options
 * @param {string} [options.admissionBodyId] - Optional admission body ID to filter courses
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with courses data
 */
export function useCourses({ admissionBodyId } = {}) {
  return useQuery({
    queryKey: admissionBodyId ? ['courses', { admissionBodyId }] : ['courses'],
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      const mapped = data.map(course => ({
        id: course.id,
        name: course.Name,
        name_ta: course.Name_Tamil,
        admission_body_id: course.Admission_Body?.[0] || null, // Airtable linked records are arrays
        formula_override: course.Formula_Override || null,
        duration: course.Duration,
        eligible_groups: course.Eligible_Groups ?
          course.Eligible_Groups.split(',').map(g => g.trim()) : [],
        subject_list_id: course.Subject_List?.[0] || null
      }))

      // Filter by admission body if specified
      if (admissionBodyId) {
        return mapped.filter(c => c.admission_body_id === admissionBodyId)
      }
      return mapped
    }
  })
}

/**
 * Fetch a single course by ID
 * @param {string} courseId - The ID of the course
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with course data
 */
export function useCourseById(courseId) {
  const { data: courses = [], ...rest } = useCourses()
  const course = courses.find(c => c.id === courseId) || null

  return {
    ...rest,
    data: course
  }
}
