import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Calendar, ChevronDown, X, ExternalLink } from 'lucide-react'
import { useEvents } from '../hooks/queries/useEvents'
import { useLanguage } from '../context/LanguageContext'
import { useHeaderOffset } from '../hooks/useHeaderOffset'
import SEO, { schemas } from '../components/SEO'

const COLOR_MAP = {
  blue:   { row: 'bg-blue-50 border-blue-300',   badge: 'bg-blue-100 border-blue-200 text-blue-700' },
  green:  { row: 'bg-emerald-50 border-emerald-300', badge: 'bg-emerald-100 border-emerald-200 text-emerald-700' },
  red:    { row: 'bg-rose-50 border-rose-300',    badge: 'bg-rose-100 border-rose-200 text-rose-700' },
  orange: { row: 'bg-amber-50 border-amber-300',  badge: 'bg-amber-100 border-amber-200 text-amber-700' },
  purple: { row: 'bg-purple-50 border-purple-300', badge: 'bg-purple-100 border-purple-200 text-purple-700' },
  yellow: { row: 'bg-yellow-50 border-yellow-300', badge: 'bg-yellow-100 border-yellow-200 text-yellow-700' },
}

const DEFAULT_COLOR = { row: 'bg-gray-50 border-gray-200', badge: 'bg-gray-100 border-gray-200 text-gray-600' }

function getEventColors(color) {
  if (!color) return DEFAULT_COLOR
  return COLOR_MAP[color.toLowerCase()] || DEFAULT_COLOR
}

export default function Events() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { headerPaddingClass } = useHeaderOffset()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBody, setSelectedBody] = useState('')

  const { data: events = [], isLoading, isError } = useEvents()

  const counsellingBodies = useMemo(() => {
    const bodies = new Set()
    events.forEach(ev => {
      if (ev.counselling_body) bodies.add(ev.counselling_body)
    })
    return Array.from(bodies).sort()
  }, [events])

  const filteredEvents = useMemo(() => {
    let result = events

    if (selectedBody) {
      result = result.filter(ev => ev.counselling_body === selectedBody)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(ev => {
        const date = ev.date?.toLowerCase() || ''
        const event = ev.event?.toLowerCase() || ''
        const eventTa = ev.event_ta?.toLowerCase() || ''
        const body = ev.counselling_body?.toLowerCase() || ''
        const bodyTa = ev.counselling_body_ta?.toLowerCase() || ''
        return (
          date.includes(query) ||
          event.includes(query) ||
          eventTa.includes(query) ||
          body.includes(query) ||
          bodyTa.includes(query)
        )
      })
    }

    return result
  }, [events, selectedBody, searchQuery])

  const eventsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Important Events & Dates - Tamil Nadu Admissions',
        description: 'Stay updated with admission counselling dates and deadlines for Tamil Nadu.',
        url: 'https://educaption.org/events'
      },
      schemas.breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' }
      ])
    ]
  }

  return (
    <>
      <SEO
        title="Important Events & Dates - Tamil Nadu Admissions"
        description="Stay updated with admission counselling dates and deadlines for TNEA, TNAU, TNJFU, TANUVAS, TNDALU and more."
        schema={eventsSchema}
      />
      <main className={`min-h-screen bg-[#FAFAFA] ${headerPaddingClass} pb-12 lg:pb-16`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-[#1A1A2E] tracking-tight mb-4">
              {t('events.title')}
            </h1>
            <p className="text-lg text-[#1A1A2E]/50 max-w-2xl mx-auto">
              {t('events.subtitle')}
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-[#1A1A2E]/[0.06] shadow-sm p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A2E]/30" />
                <input
                  type="text"
                  placeholder={t('events.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-3
                    bg-[#FAFAFA]
                    border border-[#1A1A2E]/[0.08]
                    rounded-xl
                    text-[#1A1A2E]
                    placeholder:text-[#1A1A2E]/30
                    focus:outline-none focus:border-[#FF6B35]/50 focus:ring-2 focus:ring-[#FF6B35]/10
                    transition-colors duration-200
                  "
                />
              </div>

              {/* Counselling Body Filter */}
              <div className="relative min-w-[240px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A2E]/30 pointer-events-none" />
                <select
                  value={selectedBody}
                  onChange={(e) => setSelectedBody(e.target.value)}
                  className="
                    w-full pl-10 pr-10 py-3
                    bg-[#FAFAFA]
                    border border-[#1A1A2E]/[0.08]
                    rounded-xl
                    text-[#1A1A2E]
                    font-medium
                    appearance-none
                    cursor-pointer
                    focus:outline-none focus:border-[#FF6B35]/50 focus:ring-2 focus:ring-[#FF6B35]/10
                    transition-colors duration-200
                  "
                >
                  <option value="">{t('events.allCounselling')}</option>
                  {counsellingBodies.map(body => (
                    <option key={body} value={body}>{body}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A2E]/30 pointer-events-none" />
              </div>

              {/* Clear Filters */}
              {(selectedBody || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedBody('')
                    setSearchQuery('')
                  }}
                  className="
                    px-4 py-3
                    text-[#FF6B35] font-semibold
                    hover:bg-[#FF6B35]/5
                    rounded-xl
                    transition-colors duration-200
                    flex items-center gap-2
                  "
                >
                  <X className="w-4 h-4" />
                  {t('courses.clear')}
                </button>
              )}
            </div>

            {/* Results count */}
            {!isLoading && !isError && (
              <div className="mt-4 pt-4 border-t border-[#1A1A2E]/[0.06]">
                <p className="text-sm text-[#1A1A2E]/50">
                  {t('events.showingCount', {
                    count: filteredEvents.length,
                    total: events.length
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin mb-4" />
              <p className="text-[#1A1A2E]/50">{t('common.loading')}</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-rose-50 rounded-2xl flex items-center justify-center">
                <Calendar className="w-10 h-10 text-rose-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{t('common.error')}</h3>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#1A1A2E]/5 rounded-2xl flex items-center justify-center">
                <Calendar className="w-10 h-10 text-[#1A1A2E]/20" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{t('events.noEvents')}</h3>
            </div>
          )}

          {/* Events Table */}
          {!isLoading && !isError && filteredEvents.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#1A1A2E]/[0.06] shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[160px_1fr_200px_auto] gap-4 px-6 py-4 bg-[#1A1A2E]/[0.03] border-b border-[#1A1A2E]/[0.06]">
                <div className="text-xs font-bold text-[#1A1A2E]/50 uppercase tracking-wider">
                  {t('events.date')}
                </div>
                <div className="text-xs font-bold text-[#1A1A2E]/50 uppercase tracking-wider">
                  {t('events.event')}
                </div>
                <div className="text-xs font-bold text-[#1A1A2E]/50 uppercase tracking-wider">
                  {t('events.counselling')}
                </div>
                <div />
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#1A1A2E]/[0.04]">
                {filteredEvents.map((ev) => {
                  const colors = getEventColors(ev.color)
                  const eventName = language === 'ta' && ev.event_ta ? ev.event_ta : ev.event
                  const bodyName = language === 'ta' && ev.counselling_body_ta ? ev.counselling_body_ta : ev.counselling_body

                  return (
                    <div
                      key={ev.id}
                      className={`
                        sm:grid sm:grid-cols-[160px_1fr_200px_auto] gap-4
                        px-4 sm:px-6 py-4
                        flex flex-col
                        border-l-4
                        transition-colors duration-150
                        hover:brightness-[0.97]
                        ${colors.row}
                      `}
                    >
                      {/* Date */}
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0 sm:hidden" />
                        <span className="text-sm font-semibold text-[#1A1A2E]">
                          {ev.date || '—'}
                        </span>
                      </div>

                      {/* Event Name */}
                      <div>
                        <p className="text-sm font-medium text-[#1A1A2E] leading-snug">
                          {eventName || '—'}
                        </p>
                        {ev.description && (
                          <p className="text-xs text-[#1A1A2E]/50 mt-1 leading-relaxed">
                            {ev.description}
                          </p>
                        )}
                      </div>

                      {/* Counselling Body */}
                      <div>
                        <span className={`
                          inline-block text-xs font-semibold px-3 py-1 rounded-full border
                          ${colors.badge}
                        `}>
                          {bodyName || '—'}
                        </span>
                      </div>

                      {/* Link column */}
                      <div className="flex items-center">
                        {ev.link_url ? (
                          <a
                            href={ev.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 rounded-lg transition-colors duration-150"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {language === 'ta' ? 'இணைப்பு' : 'Link'}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Color Legend */}
          {!isLoading && !isError && events.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {[...new Set(events.map(ev => ev.counselling_body).filter(Boolean))].sort().map(body => {
                const ev = events.find(e => e.counselling_body === body)
                const colors = getEventColors(ev?.color)
                return (
                  <span
                    key={body}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${colors.badge}`}
                  >
                    {body}
                  </span>
                )
              })}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
