import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          {t('home.subtitle')}
        </p>
        <Link to="/calculator">
          <Button size="lg" variant="secondary">
            {t('home.cta')}
          </Button>
        </Link>
      </div>
    </section>
  )
}
