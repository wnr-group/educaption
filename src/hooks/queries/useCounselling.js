import { useQuery } from '@tanstack/react-query'
import { getCounselling } from '../../lib/airtable'

/**
 * Fetch all counselling information
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with counselling data
 */
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

export function useCounselling() {
  return useQuery({
    queryKey: ['counselling'],
    queryFn: getCounselling,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(item => ({
      id: item.id,
      name: parseTextField(item.Name),
      name_ta: parseTextField(item.Name_Tamil),
      admission_body_id: parseTextField(item.Admission_Body),
      description: parseTextField(item.Description),
      description_ta: parseTextField(item.Description_Tamil),
      documents: parseJsonField(item.Documents, []),
      important_dates: parseJsonField(item.Important_Dates, []),
      fees: parseJsonField(item.Fees, {}),
      website: parseTextField(item.Website),
      steps: parseJsonField(item.Steps, []),
      eligibility: parseTextField(item.Eligibility)
    }))
  })
}
