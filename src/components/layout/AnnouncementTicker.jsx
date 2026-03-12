import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useAnnouncements } from '../../hooks/queries/useAnnouncements'
import { useLanguage } from '../../context/LanguageContext'

export default function AnnouncementTicker() {
  const { data: announcements = [], isLoading } = useAnnouncements()
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const intervalRef = useRef(null)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Auto-advance announcements
  useEffect(() => {
    if (announcements.length <= 1 || isPaused || prefersReducedMotion) {
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 5000) // 5 seconds per announcement

    return () => clearInterval(intervalRef.current)
  }, [announcements.length, isPaused, prefersReducedMotion])

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  // Don't render if loading or no announcements
  if (isLoading || announcements.length === 0) {
    return null
  }

  const current = announcements[currentIndex]
  const message = language === 'ta' && current.message_ta
    ? current.message_ta
    : current.message

  return (
    <div
      className="
        bg-[#FF6B35]
        border-b border-black/10
        h-10 sm:h-11
        flex items-center
        relative
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-live="polite"
      aria-label="Announcements"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-3">
          {/* Left arrow */}
          {announcements.length > 1 && (
            <button
              onClick={goToPrev}
              className="
                p-1.5 rounded-full
                bg-white/15 hover:bg-white/25
                transition-colors duration-200
                flex-shrink-0
              "
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Announcement text */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2">
            <p className="
              text-white text-sm font-semibold
              truncate
              transition-opacity duration-200
            ">
              {message}
            </p>
            {current.link_url && (
              <a
                href={current.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-shrink-0
                  text-white/80 hover:text-white
                  flex items-center gap-1
                  text-xs font-medium
                  underline underline-offset-2
                  transition-colors duration-200
                "
              >
                {current.link_text}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Right arrow */}
          {announcements.length > 1 && (
            <button
              onClick={goToNext}
              className="
                p-1.5 rounded-full
                bg-white/15 hover:bg-white/25
                transition-colors duration-200
                flex-shrink-0
              "
              aria-label="Next announcement"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {announcements.length > 1 && (
        <div className="
          absolute bottom-1 left-1/2 -translate-x-1/2
          hidden sm:flex items-center gap-1
        ">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                w-1.5 h-1.5 rounded-full
                transition-opacity duration-200
                ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}
              `}
              aria-label={`Go to announcement ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
