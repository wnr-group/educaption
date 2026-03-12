import { useQuery } from '@tanstack/react-query'
import { getAnnouncements } from '../../lib/airtable'

function parseTextField(value) {
  if (!value) return null
  if (typeof value === 'string') return value.trim()
  return String(value)
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
    staleTime: 1000 * 60 * 2, // 2 minutes - announcements may change more frequently
    select: (data) => data.map(item => ({
      id: item.id,
      message: parseTextField(item.Message),
      message_ta: parseTextField(item.Message_Tamil),
      link_url: parseTextField(item.Link_URL),
      link_text: parseTextField(item.Link_Text) || 'Learn more',
      order: item.Order || 0
    }))
  })
}
