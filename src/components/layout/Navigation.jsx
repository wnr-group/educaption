import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'

export default function Navigation() {
  const { t } = useTranslation()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/calculator', label: t('nav.calculator') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/colleges', label: t('nav.colleges') },
    { path: '/counselling', label: t('nav.counselling') },
    { path: '/about', label: t('nav.about') },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="
              w-11 h-11
              bg-gradient-to-br from-saffron-500 to-saffron-600
              rounded-xl
              flex items-center justify-center
              shadow-soft
              group-hover:shadow-lifted
              group-hover:-translate-y-0.5
              transition-all duration-200
            ">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="
              font-display font-bold text-2xl
              text-gradient
              tracking-tight
            ">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`
                  relative px-4 py-2
                  font-body font-medium text-sm
                  rounded-lg
                  transition-all duration-200
                  ${isActive(path)
                    ? 'text-saffron-600 bg-saffron-50'
                    : 'text-navy-600 hover:text-saffron-600 hover:bg-saffron-50/50'
                  }
                `}
              >
                {label}
                {isActive(path) && (
                  <span className="
                    absolute bottom-0 left-1/2 -translate-x-1/2
                    w-1 h-1 rounded-full
                    bg-saffron-500
                  " />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              md:hidden
              p-2
              rounded-lg
              text-navy-600
              hover:bg-saffron-50
              transition-colors duration-200
            "
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="
          md:hidden
          absolute top-full left-0 right-0
          bg-white/95 backdrop-blur-lg
          border-b border-navy-100
          shadow-lifted
          animate-slide-up
        ">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-4 py-3
                  font-body font-medium
                  rounded-xl
                  transition-all duration-200
                  ${isActive(path)
                    ? 'text-saffron-600 bg-saffron-50'
                    : 'text-navy-600 hover:text-saffron-600 hover:bg-saffron-50/50'
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
