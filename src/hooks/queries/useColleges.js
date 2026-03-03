import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}
