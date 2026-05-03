import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../../lib/airtable'

function parseTextField(value) {
  if (!value) return ''
  if (Array.isArray(value)) return value[0] || ''
  return String(value).trim()
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 2,
    select: (data) => data.map(record => ({
      id: record.id,
      date: parseTextField(record.Date),
      event: parseTextField(record.Event),
      event_ta: parseTextField(record.Event_Tamil) || parseTextField(record.Event),
      counselling_body: parseTextField(record.Counselling_Body),
      counselling_body_ta: parseTextField(record.Counselling_Body_Tamil) || parseTextField(record.Counselling_Body),
      description: parseTextField(record.Description),
      color: parseTextField(record.Color) || null,
      link_url: parseTextField(record.Link_URL) || null
    }))
  })
}
