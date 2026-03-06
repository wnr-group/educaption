import { useQuery } from '@tanstack/react-query'
import { getSubjectLists } from '../../lib/airtable'

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
      name: list.Name,
      subjects: list.Subjects ?
        list.Subjects.split(',').map(s => s.trim()) : []
    }))
  })
}

/**
 * Fetch a single subject list by ID
 * @param {string} listId - The ID of the subject list
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with subject list data
 */
export function useSubjectListById(listId) {
  const { data: lists = [], ...rest } = useSubjectLists()
  const list = lists.find(l => l.id === listId) || null

  return {
    ...rest,
    data: list
  }
}
