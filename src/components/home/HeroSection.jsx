import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Calculator, Sparkles } from 'lucide-react'
import Button from '../ui/Button'

// Floating gradient beam component
function GradientBeam({ className, width, height, gradient, style }) {
  return (
    <div
      className={`hero-beam ${className}`}
      style={{
        width,
        height,
        background: gradient,
        ...style
      }}
    />
  )
}

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-cream-50">
      {/* Warm gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron-100/40 via-transparent to-navy-100/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-saffron-200/30 to-transparent rounded-full blur-3xl" />

      {/* Dot grid with ripple animation - light version */}
      <div className="hero-dot-grid-light absolute inset-0 overflow-hidden" />

      {/* Floating gradient beams - light version */}
      <GradientBeam
        className="hero-beam-1"
        width="500px"
        height="120px"
        gradient="linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.08), transparent)"
        style={{ left: '-10%', top: '25%' }}
      />
      <GradientBeam
        className="hero-beam-2"
        width="400px"
        height="100px"
        gradient="linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.06), transparent)"
        style={{ right: '-5%', top: '60%' }}
      />
      <GradientBeam
        className="hero-beam-3"
        width="450px"
        height="110px"
        gradient="linear-gradient(90deg, transparent, rgba(16, 42, 67, 0.05), transparent)"
        style={{ left: '5%', bottom: '20%' }}
      />
      <GradientBeam
        className="hero-beam-4"
        width="350px"
        height="90px"
        gradient="linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.07), transparent)"
        style={{ right: '10%', top: '15%' }}
      />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="hero-content-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-saffron-200 shadow-soft mb-8 md:mb-12">
            <Sparkles className="w-4 h-4 text-saffron-500" />
            <span className="text-sm text-navy-600 tracking-wide font-body font-medium">
              {t('home.badge')}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="hero-content-animate hero-content-animate-delay-1 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tighter font-display leading-[1.1]">
            <span className="text-navy-900">{t('home.titleFind')} </span>
            <span className="text-gradient">{t('home.titleYourPath')}</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-content-animate hero-content-animate-delay-2 text-lg sm:text-xl md:text-2xl text-navy-500 mb-10 md:mb-12 max-w-2xl mx-auto font-body leading-relaxed">
            {t('home.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="hero-content-animate hero-content-animate-delay-3 flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/calculator">
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold text-lg rounded-xl shadow-lifted hover:shadow-floating hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
                <Calculator className="w-5 h-5" />
                <span>{t('home.cta')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>

            <Link to="/courses">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-navy-200 text-navy-700 font-semibold text-lg rounded-xl shadow-soft hover:border-saffron-300 hover:text-saffron-600 hover:shadow-lifted transition-all duration-300">
                {t('home.exploreCourses')}
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-content-animate hero-content-animate-delay-4 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto pt-8 border-t border-navy-100">
            {[
              { value: '500+', labelKey: 'home.stats.courses' },
              { value: '400+', labelKey: 'home.stats.colleges' },
              { value: '100K+', labelKey: 'home.stats.students' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="font-body text-xs sm:text-sm text-navy-400">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#FFFDFB"
          />
        </svg>
      </div>
    </section>
  )
}
