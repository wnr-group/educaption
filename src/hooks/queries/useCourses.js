import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../../lib/airtable'

/**
 * Parse eligible groups from various formats
 * Airtable can return: array of record IDs, array of codes, string (comma-separated), or undefined
 * We store both record IDs and parsed codes for matching
 */
function parseEligibleGroups(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.map(g => String(g).trim())
  if (typeof value === 'string') return value.split(',').map(g => g.trim())
  return []
}

/**
 * Parse admission body - handles both linked record (array) and text field
 */
function parseAdmissionBody(value) {
  if (!value) return null
  if (Array.isArray(value)) return value[0] || null  // Linked record returns array
  if (typeof value === 'string') return value        // Text field returns string
  return null
}

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
        // Admission_Body is a text field containing the name (e.g., "TNDALU")
        admission_body_id: course.Admission_Body,
        formula_override: course.Formula_Override || null,
        duration: course.Duration,
        eligible_groups: parseEligibleGroups(course.Eligible_Groups),
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
