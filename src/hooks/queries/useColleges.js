import { useQuery } from '@tanstack/react-query'
import { getColleges } from '../../lib/airtable'

/**
 * Fetch all colleges
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result with colleges data
 */
export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.map(college => ({
      id: college.id,
      name: college.Name,
      name_ta: college.Name_Tamil,
      type: college.Type,
      district: college.District,
      address: college.Address,
      website: college.Website,
      phone: college.Phone,
      email: college.Email,
      streams: college.Streams || [],
      seats: college.Seats ? JSON.parse(college.Seats) : {}
    }))
  })
}
