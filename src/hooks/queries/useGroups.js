import { useQuery } from '@tanstack/react-query'
import { getGroups } from '../../lib/airtable'

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
 * Fetch all subject groups
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with groups data
 */
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(group => ({
      id: group.id,
      code: parseTextField(group.Code),
      stream: parseTextField(group.Stream),
      name: parseTextField(group.Name),
      name_ta: parseTextField(group.Name_Tamil),
      subjects: parseJsonField(group.Subjects, [])
    }))
  })
}

/**
 * Fetch a single group by ID
 * @param {string} groupId - The ID of the group
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with group data
 */
export function useGroupById(groupId) {
  const { data: groups = [], ...rest } = useGroups()
  const group = groups.find(g => g.id === groupId) || null

  return {
    ...rest,
    data: group
  }
}

/**
 * Fetch a single group by code (e.g., "SCI-10")
 * @param {string} groupCode - The code of the group
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with group data
 */
export function useGroupByCode(groupCode) {
  const { data: groups = [], ...rest } = useGroups()
  const group = groups.find(g => g.code === groupCode) || null

  return {
    ...rest,
    data: group
  }
}
