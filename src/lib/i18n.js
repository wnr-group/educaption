import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enLocale from '../../public/locales/en.json'
import taLocale from '../../public/locales/ta.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enLocale },
      ta: { translation: taLocale }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
