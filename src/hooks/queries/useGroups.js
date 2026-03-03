import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

/**
 * Fetch all subject groups
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with groups data
 */
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('code', { ascending: true })

      if (error) throw error
      return data
    }
  })
}

/**
 * Fetch a single group by ID
 * @param {string} groupId - The UUID of the group
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with group data
 */
export function useGroupById(groupId) {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!groupId
  })
}
