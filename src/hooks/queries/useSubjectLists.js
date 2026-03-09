import { useQuery } from '@tanstack/react-query'
import { getSubjectLists } from '../../lib/airtable'

/**
 * Parse text field - returns string value or null
 */
function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

/**
 * Fetch all subject lists (LIST_A, LIST_B, etc. for TNAU courses)
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with subject lists data
 */
export function useSubjectLists() {
  return useQuery({
    queryKey: ['subjectLists'],
    queryFn: getSubjectLists,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(list => ({
      id: list.id,
      name: parseTextField(list.Name),
      subjects: list.Subjects ?
        list.Subjects.split(',').map(s => s.trim()) : []
    }))
  })
}

/**
 * Fetch a single subject list by name (e.g., "LIST_A")
 * @param {string} listName - The name of the subject list
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with subject list data
 */
export function useSubjectListByName(listName) {
  const { data: lists = [], ...rest } = useSubjectLists()
  const list = lists.find(l => l.name === listName) || null

  return {
    ...rest,
    data: list
  }
}
