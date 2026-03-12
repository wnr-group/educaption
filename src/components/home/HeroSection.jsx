import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const { t } = useTranslation()

  const stats = [
    { value: '500+', labelKey: 'home.hero.stats.courses' },
    { value: '400+', labelKey: 'home.hero.stats.colleges' },
    { value: '40', labelKey: 'home.hero.stats.groups' },
  ]

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B35] rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-[#7B4AE2] rounded-full blur-[150px] opacity-15" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#00D4AA] rounded-full blur-[100px] opacity-10" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-12">
        {/* Eyebrow badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="
            inline-flex items-center gap-2
            px-4 py-2
            bg-white/[0.08] backdrop-blur-sm
            border border-white/[0.1]
            rounded-full
          ">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]"></span>
            </span>
            <span className="text-sm text-white/70 font-medium tracking-wide">
              {t('home.hero.badge')}
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight">
            <span className="block text-white/90 mb-2">
              {t('home.hero.title1')}
            </span>
            <span className="block bg-gradient-to-r from-[#FF6B35] via-[#FF8F5A] to-[#FFB347] bg-clip-text text-transparent">
              {t('home.hero.title2')}
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="
          text-center
          text-lg sm:text-xl md:text-2xl
          text-white/50
          max-w-2xl mx-auto
          mb-10 sm:mb-12
          leading-relaxed
          font-light
        ">
          {t('home.hero.subtitle')}
          <span className="hidden sm:inline"> {t('home.hero.subtitleExtra')}</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20">
          <Link to="/calculator" className="w-full sm:w-auto">
            <button className="
              group
              w-full sm:w-auto
              inline-flex items-center justify-center gap-3
              px-8 py-4 sm:py-5
              bg-gradient-to-r from-[#FF6B35] to-[#FF8F5A]
              text-white font-bold text-lg
              rounded-2xl
              shadow-[0_0_40px_rgba(255,107,53,0.4)]
              hover:shadow-[0_0_60px_rgba(255,107,53,0.6)]
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-300
            ">
              <span>{t('home.hero.cta')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>

          <Link to="/courses" className="w-full sm:w-auto">
            <button className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              px-8 py-4 sm:py-5
              bg-white/[0.05]
              border border-white/[0.15]
              text-white/80 font-semibold text-lg
              rounded-2xl
              hover:bg-white/[0.1]
              hover:border-white/[0.25]
              transition-all duration-300
            ">
              {t('home.hero.ctaSecondary')}
            </button>
          </Link>
        </div>

        {/* Quick stats - social proof */}
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white/90 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/40 uppercase tracking-wider">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-white/30 uppercase tracking-widest">{t('home.hero.scrollHint')}</span>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
