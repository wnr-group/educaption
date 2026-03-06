import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../lib/airtable'

/**
 * Fetch all community categories (OC, BC, MBC, SC, ST, etc.)
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with categories data
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(cat => ({
      id: cat.id,
      code: cat.Code,
      name: cat.Name,
      name_ta: cat.Name_Tamil
    }))
  })
}

/**
 * Fetch a single category by ID
 * @param {string} categoryId - The ID of the category
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with category data
 */
export function useCategoryById(categoryId) {
  const { data: categories = [], ...rest } = useCategories()
  const category = categories.find(c => c.id === categoryId) || null

  return {
    ...rest,
    data: category
  }
}
