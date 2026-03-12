import { useLanguage } from '../../context/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageToggle({ isTransparent }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5
        rounded-lg
        font-semibold text-sm
        transition-all duration-300
        ${isTransparent
          ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white/80'
          : 'bg-white/10 hover:bg-white/20 text-white'
        }
      `}
      aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
    >
      <Globe className="w-4 h-4 text-[#FF6B35]" />
      <span className="text-[#FF6B35]">
        {language === 'en' ? 'தமிழ்' : 'English'}
      </span>
    </button>
  )
}
