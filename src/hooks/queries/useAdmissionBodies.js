import { useQuery } from '@tanstack/react-query'
import { getAdmissionBodies } from '../../lib/airtable'

/**
 * Fetch all admission bodies (TNEA, TNDALU, TNAU, etc.)
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with admission bodies data
 */
export function useAdmissionBodies() {
  return useQuery({
    queryKey: ['admissionBodies'],
    queryFn: getAdmissionBodies,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(body => ({
      id: body.id,
      name: body.Name,
      name_ta: body.Name_Tamil,
      description: body.Description,
      website: body.Website,
      max_cutoff: body.Max_Cutoff || 200,
      default_formula: body.Default_Formula,
      category: body.Category || 'Other'
    }))
  })
}

/**
 * Fetch a single admission body by ID
 * @param {string} bodyId - The ID of the admission body
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with admission body data
 */
export function useAdmissionBodyById(bodyId) {
  const { data: bodies = [], ...rest } = useAdmissionBodies()
  const body = bodies.find(b => b.id === bodyId) || null

  return {
    ...rest,
    data: body
  }
}
