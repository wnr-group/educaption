import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-white" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/5 via-[#7B4AE2]/5 to-[#00D4AA]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
        {/* Main content card */}
        <div className="
          relative
          bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F]
          rounded-[2rem] sm:rounded-[2.5rem]
          p-8 sm:p-12 md:p-16
          overflow-hidden
        ">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF6B35] rounded-full blur-[100px] opacity-20" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#7B4AE2] rounded-full blur-[100px] opacity-20" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.1] rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#FFB347]" />
              <span className="text-sm font-semibold text-white/70">
                {t('home.cta.badge')}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {t('home.cta.title')}
            </h2>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/50 max-w-lg mx-auto mb-10">
              {t('home.cta.subtitle')}
            </p>

            {/* CTA Button */}
            <Link to="/calculator">
              <button className="
                group
                inline-flex items-center justify-center gap-3
                px-10 py-5
                bg-gradient-to-r from-[#FF6B35] to-[#FF8F5A]
                text-white font-bold text-lg
                rounded-2xl
                shadow-[0_0_40px_rgba(255,107,53,0.4)]
                hover:shadow-[0_0_60px_rgba(255,107,53,0.6)]
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-300
              ">
                <span>{t('home.cta.button')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>

            {/* Reassurance */}
            <p className="mt-6 text-sm text-white/30">
              {t('home.cta.reassurance')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
