import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useCounselling() {
  return useQuery({
    queryKey: ['counselling'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counselling')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}
