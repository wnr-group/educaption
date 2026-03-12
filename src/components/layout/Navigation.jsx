import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation({ isTransparent }) {
  const { t } = useTranslation()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/calculator', label: t('nav.calculator') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/counselling', label: t('nav.counselling') },
    { path: '/about', label: t('nav.about') },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo.png"
              alt="Educaption Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className={`
              font-black text-xl tracking-tight
              transition-colors duration-300
              ${isTransparent ? 'text-white' : 'text-[#1A1A2E]'}
            `}>
              Educaption
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
                  font-semibold text-sm
                  rounded-lg
                  transition-all duration-300
                  ${isTransparent
                    ? isActive(path)
                      ? 'text-white bg-white/[0.1]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                    : isActive(path)
                      ? 'text-[#FF6B35] bg-[#FF6B35]/[0.08]'
                      : 'text-[#1A1A2E]/60 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/[0.04]'
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              md:hidden
              p-2
              rounded-lg
              transition-colors duration-300
              ${isTransparent
                ? 'text-white/80 hover:bg-white/[0.1]'
                : 'text-[#1A1A2E] hover:bg-[#1A1A2E]/[0.05]'
              }
            `}
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
        <div className={`
          md:hidden
          absolute top-full left-0 right-0
          border-b shadow-lg
          ${isTransparent
            ? 'bg-[#0A0A0F]/95 backdrop-blur-xl border-white/[0.05]'
            : 'bg-white/95 backdrop-blur-xl border-[#1A1A2E]/[0.06]'
          }
        `}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-4 py-3
                  font-semibold
                  rounded-xl
                  transition-all duration-200
                  ${isTransparent
                    ? isActive(path)
                      ? 'text-white bg-white/[0.1]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                    : isActive(path)
                      ? 'text-[#FF6B35] bg-[#FF6B35]/[0.08]'
                      : 'text-[#1A1A2E]/70 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/[0.04]'
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
