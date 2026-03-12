import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navigation from './Navigation'
import LanguageToggle from './LanguageToggle'
import AnnouncementTicker from './AnnouncementTicker'
import { useAnnouncements } from '../../hooks/queries/useAnnouncements'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const { data: announcements = [] } = useAnnouncements()

  const hasAnnouncements = announcements.length > 0

  useEffect(() => {
    const handleScroll = () => {
      // Change header style after scrolling past 100px
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // On homepage: transparent when at top, solid when scrolled
  // On other pages: always solid
  const isTransparent = isHome && !scrolled

  return (
    <>
      {/* Announcement Ticker - fixed at very top */}
      {hasAnnouncements && (
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <AnnouncementTicker />
        </div>
      )}

      <header className={`
        fixed left-0 right-0 z-50
        transition-all duration-300
        ${hasAnnouncements ? 'top-10 sm:top-11' : 'top-0'}
        ${isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-lg border-b border-[#1A1A2E]/[0.06] shadow-sm'
        }
      `}>
        {/* Language Toggle Bar */}
        <div className={`
          transition-all duration-300
          ${isTransparent
            ? 'bg-white/[0.05]'
            : 'bg-[#1A1A2E]'
          }
        `}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-9 text-sm">
              <p className={`
                hidden sm:block font-medium
                ${isTransparent ? 'text-white/40' : 'text-white/60'}
              `}>
                Tamil Nadu Engineering Admissions Guide
              </p>
              <LanguageToggle isTransparent={isTransparent} />
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <Navigation isTransparent={isTransparent} />
      </header>
    </>
  )
}
