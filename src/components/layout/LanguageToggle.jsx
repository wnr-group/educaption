import { useLanguage } from '../../context/LanguageContext'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 bg-slate-200 rounded text-sm font-medium hover:bg-slate-300 transition"
    >
      {language === 'en' ? 'தமிழ்' : 'EN'}
    </button>
  )
}
