import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../lib/airtable'

/**
 * Parse text field - returns string value or null
 */
function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

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
      code: parseTextField(cat.Code),
      name: parseTextField(cat.Name),
      name_ta: parseTextField(cat.Name_Tamil)
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

/**
 * Fetch a single category by code (e.g., "OC", "BC")
 * @param {string} categoryCode - The code of the category
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with category data
 */
export function useCategoryByCode(categoryCode) {
  const { data: categories = [], ...rest } = useCategories()
  const category = categories.find(c => c.code === categoryCode) || null

  return {
    ...rest,
    data: category
  }
}
