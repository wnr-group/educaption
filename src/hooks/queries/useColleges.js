import { useQuery } from '@tanstack/react-query'
import { getColleges } from '../../lib/airtable'

/**
 * Parse text field - returns string value or null
 */
function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

/**
 * Safely parse JSON field - returns parsed value or default
 */
function parseJsonField(value, defaultValue = []) {
  if (!value) return defaultValue
  try {
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

/**
 * Fetch all colleges
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with colleges data
 */
export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(college => ({
      id: college.id,
      name: parseTextField(college.Name),
      name_ta: parseTextField(college.Name_Tamil),
      type: parseTextField(college.Type),
      district: parseTextField(college.District),
      address: parseTextField(college.Address),
      website: parseTextField(college.Website),
      phone: parseTextField(college.Phone),
      email: parseTextField(college.Email),
      streams: parseJsonField(college.Streams, []),
      seats: parseJsonField(college.Seats, {})
    }))
  })
}
