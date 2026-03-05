import { createContext, useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)

  // Sync state when i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng)
      localStorage.setItem('language', lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => i18n.off('languageChanged', handleLanguageChange)
  }, [i18n])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ta' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
