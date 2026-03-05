import { useLanguage } from '../../context/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="
        inline-flex items-center gap-2
        px-3 py-1.5
        bg-navy-800 hover:bg-navy-700
        rounded-lg
        font-body font-medium text-sm
        text-white
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900
      "
      aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
    >
      <Globe className="w-4 h-4 text-saffron-400" />
      <span className="text-saffron-400 font-semibold">
        {language === 'en' ? 'தமிழ்' : 'English'}
      </span>
    </button>
  )
}
