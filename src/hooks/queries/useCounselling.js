import { useQuery } from '@tanstack/react-query'
import { getCounselling } from '../../lib/airtable'

/**
 * Fetch all counselling information
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with counselling data
 */
export function useCounselling() {
  return useQuery({
    queryKey: ['counselling'],
    queryFn: getCounselling,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(item => ({
      id: item.id,
      name: item.Name,
      name_ta: item.Name_Tamil,
      admission_body_id: item.Admission_Body?.[0] || null,
      description: item.Description,
      description_ta: item.Description_Tamil,
      documents: item.Documents ? JSON.parse(item.Documents) : [],
      important_dates: item.Important_Dates ? JSON.parse(item.Important_Dates) : [],
      fees: item.Fees ? JSON.parse(item.Fees) : {},
      website: item.Website,
      steps: item.Steps ? JSON.parse(item.Steps) : [],
      eligibility: item.Eligibility
    }))
  })
}
