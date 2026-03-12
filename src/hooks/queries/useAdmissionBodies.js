import { useQuery } from '@tanstack/react-query'
import { getAdmissionBodies } from '../../lib/airtable'

/**
 * Parse text field - returns string value or null
 */
function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

/**
 * Parse number field - returns number or default
 */
function parseNumberField(value, defaultValue = 0) {
  if (value === null || value === undefined) return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Fetch all admission bodies (TNEA, TNDALU, TNAU, etc.)
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with admission bodies data
 */
export function useAdmissionBodies() {
  return useQuery({
    queryKey: ['admissionBodies'],
    queryFn: getAdmissionBodies,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(body => ({
      id: body.id,
      name: parseTextField(body.Name),
      name_ta: parseTextField(body.Name_Tamil),
      description: parseTextField(body.Description),
      website: parseTextField(body.Website),
      max_cutoff: parseNumberField(body.Max_Cutoff, 200),
      default_formula: parseTextField(body.Default_Formula),
      category: parseTextField(body.Category) || 'Other',
      category_ta: parseTextField(body.Category_Tamil)
    }))
  })
}

/**
 * Fetch a single admission body by ID
 * @param {string} bodyId - The ID of the admission body
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with admission body data
 */
export function useAdmissionBodyById(bodyId) {
  const { data: bodies = [], ...rest } = useAdmissionBodies()
  const body = bodies.find(b => b.id === bodyId) || null

  return {
    ...rest,
    data: body
  }
}

/**
 * Fetch a single admission body by name (e.g., "TNEA", "TNDALU")
 * @param {string} bodyName - The name of the admission body
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with admission body data
 */
export function useAdmissionBodyByName(bodyName) {
  const { data: bodies = [], ...rest } = useAdmissionBodies()
  const body = bodies.find(b => b.name === bodyName) || null

  return {
    ...rest,
    data: body
  }
}
