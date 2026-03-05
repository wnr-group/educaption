import Navigation from './Navigation'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-lg border-b border-navy-100/50">
      {/* Language Toggle Bar */}
      <div className="bg-navy-900 text-navy-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <p className="hidden sm:block font-body text-navy-300">
              Tamil Nadu Engineering Admissions Guide
            </p>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navigation />
    </header>
  )
}
