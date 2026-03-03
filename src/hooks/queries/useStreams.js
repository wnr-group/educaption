import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

/**
 * Fetch all educational streams
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with streams data
 */
export function useStreams() {
  return useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}

/**
 * Fetch a single stream by ID
 * @param {string} streamId - The UUID of the stream
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with stream data
 */
export function useStreamById(streamId) {
  return useQuery({
    queryKey: ['streams', streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('id', streamId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!streamId
  })
}
