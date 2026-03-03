import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Navigation() {
  const { t } = useTranslation()

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">
            Educaption
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-100">{t('nav.home')}</Link>
            <Link to="/calculator" className="hover:text-blue-100">{t('nav.calculator')}</Link>
            <Link to="/courses" className="hover:text-blue-100">{t('nav.courses')}</Link>
            <Link to="/colleges" className="hover:text-blue-100">{t('nav.colleges')}</Link>
            <Link to="/counselling" className="hover:text-blue-100">{t('nav.counselling')}</Link>
            <Link to="/about" className="hover:text-blue-100">{t('nav.about')}</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
