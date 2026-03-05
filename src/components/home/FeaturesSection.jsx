import { BookOpen, School, Users, FileText, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'

export default function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: BookOpen,
      titleKey: 'home.features.calculate.title',
      descKey: 'home.features.calculate.description',
      color: 'saffron',
      link: '/calculator',
      gradient: 'from-saffron-500 to-saffron-600'
    },
    {
      icon: School,
      titleKey: 'home.features.courses.title',
      descKey: 'home.features.courses.description',
      color: 'navy',
      link: '/courses',
      gradient: 'from-navy-600 to-navy-700'
    },
    {
      icon: Users,
      titleKey: 'home.features.colleges.title',
      descKey: 'home.features.colleges.description',
      color: 'emerald',
      link: '/colleges',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: FileText,
      titleKey: 'home.features.counselling.title',
      descKey: 'home.features.counselling.description',
      color: 'saffron',
      link: '/counselling',
      gradient: 'from-saffron-600 to-saffron-700'
    }
  ]

  const colorClasses = {
    saffron: {
      bg: 'bg-saffron-50',
      icon: 'text-saffron-500',
      hover: 'group-hover:bg-saffron-100',
      gradient: 'from-saffron-500 to-saffron-600'
    },
    navy: {
      bg: 'bg-navy-50',
      icon: 'text-navy-600',
      hover: 'group-hover:bg-navy-100',
      gradient: 'from-navy-600 to-navy-700'
    },
    emerald: {
      bg: 'bg-green-50',
      icon: 'text-emerald-500',
      hover: 'group-hover:bg-green-100',
      gradient: 'from-emerald-500 to-emerald-600'
    }
  }

  return (
    <section className="relative py-24 lg:py-32 bg-cream-50">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="
            font-display text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-6
          ">
            {t('home.features.title')}
          </h2>
          <p className="
            font-body text-lg
            text-navy-500
            max-w-2xl mx-auto
          ">
            {t('home.features.subtitle')}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const colors = colorClasses[feature.color]
            return (
              <Link
                key={i}
                to={feature.link}
                className="group block"
              >
                <Card
                  variant="default"
                  padding="lg"
                  className="h-full relative overflow-hidden"
                >
                  {/* Decorative gradient blob */}
                  <div className={`
                    absolute -top-10 -right-10 w-32 h-32
                    bg-gradient-to-br ${feature.gradient}
                    rounded-full
                    opacity-0 group-hover:opacity-10
                    blur-2xl
                    transition-opacity duration-500
                  `} />

                  {/* Icon */}
                  <div className={`
                    w-14 h-14
                    ${colors.bg}
                    ${colors.hover}
                    rounded-2xl
                    flex items-center justify-center
                    mb-6
                    transition-colors duration-300
                  `}>
                    <feature.icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>

                  {/* Title */}
                  <h3 className="
                    font-display text-xl font-bold
                    text-navy-900
                    mb-3
                    group-hover:text-saffron-600
                    transition-colors duration-200
                  ">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="
                    font-body text-navy-500
                    leading-relaxed
                    mb-4
                  ">
                    {t(feature.descKey)}
                  </p>

                  {/* Arrow Link */}
                  <div className="
                    flex items-center gap-2
                    text-saffron-500
                    font-body font-semibold text-sm
                    opacity-0 group-hover:opacity-100
                    translate-y-2 group-hover:translate-y-0
                    transition-all duration-300
                  ">
                    <span>{t('home.features.learnMore')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
