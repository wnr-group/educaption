import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-saffron-500/30 to-transparent" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl" />

      {/* Kolam Pattern */}
      <div className="absolute inset-0 pattern-kolam opacity-5" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="
          inline-flex items-center gap-2
          px-4 py-2 mb-8
          bg-white/10 backdrop-blur-sm
          border border-white/10
          rounded-full
        ">
          <Sparkles className="w-4 h-4 text-saffron-400" />
          <span className="font-body text-sm font-medium text-white/80">
            {t('home.ctaSection.badge')}
          </span>
        </div>

        {/* Heading */}
        <h2 className="
          font-display text-4xl sm:text-5xl lg:text-6xl
          font-bold
          text-white
          tracking-tighter
          mb-6
        ">
          {t('home.ctaSection.title')}{' '}
          <span className="
            bg-gradient-to-r from-saffron-400 via-saffron-300 to-saffron-400
            bg-clip-text text-transparent
          ">
            {t('home.ctaSection.titleHighlight')}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="
          font-body text-lg sm:text-xl
          text-navy-200
          max-w-2xl mx-auto
          mb-10
        ">
          {t('home.ctaSection.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/calculator">
            <Button
              size="xl"
              variant="primary"
              className="group shadow-glow-saffron"
            >
              {t('home.cta')}
              <ArrowRight className="
                w-5 h-5 ml-1
                group-hover:translate-x-1
                transition-transform duration-200
              " />
            </Button>
          </Link>

          <Link to="/counselling">
            <Button
              size="xl"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              {t('home.ctaSection.viewCounselling')}
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="font-body text-sm text-navy-400">
            {t('home.ctaSection.trustText')}
          </p>
        </div>
      </div>
    </section>
  )
}
