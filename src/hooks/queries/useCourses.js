import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

/**
 * Fetch courses with optional stream filter
 * @param {Object} options - Query options
 * @param {string} [options.streamId] - Optional stream ID to filter courses
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with courses data
 */
export function useCourses({ streamId } = {}) {
  return useQuery({
    queryKey: streamId ? ['courses', { streamId }] : ['courses'],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select(`
          *,
          stream:streams(id, name, name_ta)
        `)
        .order('name', { ascending: true })

      if (streamId) {
        query = query.eq('stream_id', streamId)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    }
  })
}

/**
 * Fetch a single course by ID
 * @param {string} courseId - The UUID of the course
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with course data
 */
export function useCourseById(courseId) {
  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          stream:streams(id, name, name_ta, formula, max_cutoff)
        `)
        .eq('id', courseId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!courseId
  })
}
