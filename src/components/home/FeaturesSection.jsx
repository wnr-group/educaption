import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Calculator,
  BookOpen,
  Building2,
  FileText,
  ArrowUpRight,
  Zap
} from 'lucide-react'

export default function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Calculator,
      titleKey: 'home.features.calculator.title',
      descriptionKey: 'home.features.calculator.description',
      link: '/calculator',
      gradient: 'from-[#FF6B35] to-[#FF8F5A]',
      bgGlow: 'rgba(255,107,53,0.1)'
    },
    {
      icon: BookOpen,
      titleKey: 'home.features.courses.title',
      descriptionKey: 'home.features.courses.description',
      link: '/courses',
      gradient: 'from-[#7B4AE2] to-[#9D6FF2]',
      bgGlow: 'rgba(123,74,226,0.1)'
    },
    {
      icon: Building2,
      titleKey: 'home.features.colleges.title',
      descriptionKey: 'home.features.colleges.description',
      link: '/about',
      gradient: 'from-[#00D4AA] to-[#00E6BB]',
      bgGlow: 'rgba(0,212,170,0.1)'
    },
    {
      icon: FileText,
      titleKey: 'home.features.counselling.title',
      descriptionKey: 'home.features.counselling.description',
      link: '/about',
      gradient: 'from-[#3B82F6] to-[#60A5FA]',
      bgGlow: 'rgba(59,130,246,0.1)'
    }
  ]

  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1A1A2E]/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A1A2E]/5 rounded-full mb-4">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-semibold text-[#1A1A2E]/70">{t('home.features.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tight">
              {t('home.features.title')}
            </h2>
          </div>
          <p className="text-[#1A1A2E]/50 max-w-sm sm:text-right">
            {t('home.features.subtitle')}
          </p>
        </div>

        {/* Feature cards - 2x2 grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <Link
              key={i}
              to={feature.link}
              className="group block"
            >
              <div
                className="
                  relative
                  h-full
                  p-6 sm:p-8
                  rounded-3xl
                  border border-[#1A1A2E]/[0.06]
                  bg-gradient-to-br from-white to-[#FAFAFA]
                  overflow-hidden
                  transition-all duration-500
                  hover:border-[#1A1A2E]/[0.12]
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                "
              >
                {/* Hover glow effect */}
                <div
                  className="
                    absolute -top-20 -right-20
                    w-40 h-40
                    rounded-full
                    opacity-0 group-hover:opacity-100
                    blur-3xl
                    transition-opacity duration-500
                  "
                  style={{ backgroundColor: feature.bgGlow }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex-1">
                    {/* Icon */}
                    <div
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14
                        rounded-2xl
                        bg-gradient-to-br ${feature.gradient}
                        flex items-center justify-center
                        mb-5
                        shadow-lg
                        transition-transform duration-300
                        group-hover:scale-110
                      `}
                    >
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-2 tracking-tight">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-[#1A1A2E]/50 leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="
                    w-10 h-10
                    rounded-full
                    bg-[#1A1A2E]/[0.03]
                    flex items-center justify-center
                    transition-all duration-300
                    group-hover:bg-[#1A1A2E]
                  ">
                    <ArrowUpRight className="
                      w-5 h-5
                      text-[#1A1A2E]/30
                      transition-all duration-300
                      group-hover:text-white
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    " />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
