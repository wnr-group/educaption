import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ClipboardList, GraduationCap, Bell, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HowItWorksSection() {
  const { t } = useTranslation()

  const steps = [
    {
      number: '01',
      icon: ClipboardList,
      titleKey: 'home.howItWorks.step1.title',
      descriptionKey: 'home.howItWorks.step1.description',
      color: '#FF6B35',
      highlightKeys: ['home.howItWorks.step1.highlight1', 'home.howItWorks.step1.highlight2']
    },
    {
      number: '02',
      icon: GraduationCap,
      titleKey: 'home.howItWorks.step2.title',
      descriptionKey: 'home.howItWorks.step2.description',
      color: '#7B4AE2',
      highlightKeys: ['home.howItWorks.step2.highlight1', 'home.howItWorks.step2.highlight2']
    },
    {
      number: '03',
      icon: Bell,
      titleKey: 'home.howItWorks.step3.title',
      descriptionKey: 'home.howItWorks.step3.description',
      color: '#00D4AA',
      highlightKeys: ['home.howItWorks.step3.highlight1', 'home.howItWorks.step3.highlight2']
    }
  ]

  return (
    <section className="relative py-20 sm:py-28 bg-[#FAFAFA] overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(#00000008 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/10 rounded-full mb-6">
            <span className="text-sm font-bold text-[#FF6B35] uppercase tracking-wider">
              {t('home.howItWorks.badge')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tight mb-4">
            {t('home.howItWorks.title')}
          </h2>
          <p className="text-lg sm:text-xl text-[#1A1A2E]/50 max-w-xl mx-auto">
            {t('home.howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className="
                group
                relative
                bg-white
                rounded-3xl
                p-6 sm:p-8
                border border-[#1A1A2E]/[0.06]
                shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                hover:border-[#1A1A2E]/[0.1]
                transition-all duration-500
              "
            >
              {/* Step number */}
              <div
                className="
                  absolute -top-4 -right-2 sm:-right-4
                  text-6xl sm:text-7xl font-black
                  opacity-[0.06]
                  select-none
                "
                style={{ color: step.color }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="
                  w-14 h-14 sm:w-16 sm:h-16
                  rounded-2xl
                  flex items-center justify-center
                  mb-6
                  transition-transform duration-300
                  group-hover:scale-110
                "
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  style={{ color: step.color }}
                  strokeWidth={2}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-3 tracking-tight">
                {t(step.titleKey)}
              </h3>
              <p className="text-[#1A1A2E]/50 leading-relaxed mb-5">
                {t(step.descriptionKey)}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {step.highlightKeys.map((highlightKey, j) => (
                  <span
                    key={j}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1.5
                      bg-[#1A1A2E]/[0.03]
                      rounded-full
                      text-xs font-medium text-[#1A1A2E]/60
                    "
                  >
                    <CheckCircle2 className="w-3 h-3" style={{ color: step.color }} />
                    {t(highlightKey)}
                  </span>
                ))}
              </div>

              {/* Connector line (hidden on mobile, last item) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 sm:-right-5 w-8 sm:w-10 h-[2px] bg-gradient-to-r from-[#1A1A2E]/10 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/calculator">
            <button className="
              group
              inline-flex items-center gap-3
              px-8 py-4
              bg-[#1A1A2E]
              text-white font-bold text-lg
              rounded-2xl
              shadow-[0_4px_20px_rgba(26,26,46,0.3)]
              hover:shadow-[0_8px_30px_rgba(26,26,46,0.4)]
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-300
            ">
              <span>{t('home.howItWorks.cta')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
          <p className="mt-4 text-sm text-[#1A1A2E]/40">
            {t('home.howItWorks.ctaSubtext')}
          </p>
        </div>
      </div>
    </section>
  )
}
