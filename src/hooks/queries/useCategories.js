import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

/**
 * Fetch all community categories
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with categories data
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('code', { ascending: true })

      if (error) throw error
      return data
    }
  })
}

/**
 * Fetch a single category by ID
 * @param {string} categoryId - The UUID of the category
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with category data
 */
export function useCategoryById(categoryId) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!categoryId
  })
}
