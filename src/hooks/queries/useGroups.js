import { useQuery } from '@tanstack/react-query'
import { getGroups } from '../../lib/airtable'

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
      code: group.Code,
      stream: group.Stream,
      name: group.Name,
      name_ta: group.Name_Tamil,
      subjects: JSON.parse(group.Subjects || '[]')
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
