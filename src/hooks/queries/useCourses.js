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
 */
function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

/**
 * Strip formula-variant suffixes (- Vocational, - BotZoo) from display names
 */
function stripVariantSuffix(name) {
  if (!name) return name
  return name
    .replace(/\s*-\s*Vocational/i, '')
    .replace(/\s*-\s*தொழிற்கல்வி/g, '')
    .replace(/\s*-\s*BotZoo/i, '')
    .replace(/\s*-\s*தாவர விலங்கியல்/g, '')
    .trim()
}

/**
 * Fetch courses with optional admission body filter
 * @param {Object} options - Query options
 * @param {string} [options.admissionBody] - Optional admission body name to filter courses
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with courses data
 */
export function useCourses({ admissionBody } = {}) {
  return useQuery({
    queryKey: admissionBody ? ['courses', { admissionBody }] : ['courses'],
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      const mapped = data.map(course => {
        const admissionBody = parseTextField(course.Admission_Body)
        return {
          id: course.id,
          name: stripVariantSuffix(course.Name),
          name_ta: stripVariantSuffix(course.Name_Tamil),
          // Raw admission_body for formula/matching logic
          admission_body: admissionBody,
          // Display group strips formula variants so all variants merge under one heading
          display_group: stripVariantSuffix(admissionBody),
          formula_override: parseTextField(course.Formula_Override),
          duration: parseTextField(course.Duration),
          eligible_groups: parseEligibleGroups(course.Eligible_Groups),
          subject_list: parseTextField(course.Subject_List)
        }
      })

      // Filter by admission body name if specified
      if (admissionBody) {
        return mapped.filter(c => c.admission_body === admissionBody)
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
