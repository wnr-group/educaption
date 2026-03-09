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
 * Parse text field - returns string value or null
 * All Airtable fields are now text columns
 */
function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
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
        admission_body_id: parseTextField(course.Admission_Body),
        formula_override: parseTextField(course.Formula_Override),
        duration: parseTextField(course.Duration),
        eligible_groups: parseEligibleGroups(course.Eligible_Groups),
        subject_list_id: parseTextField(course.Subject_List)
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
