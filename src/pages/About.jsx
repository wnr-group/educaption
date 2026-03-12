import { useTranslation } from 'react-i18next'
import { Target, CheckCircle, Mail, MapPin, Users, Heart, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import { useHeaderOffset } from '../hooks/useHeaderOffset'
import SEO, { schemas } from '../components/SEO'

export default function About() {
  const { t } = useTranslation()
  const { headerPaddingClass } = useHeaderOffset()

  const missionItems = [
    t('about.mission1'),
    t('about.mission2'),
    t('about.mission3'),
    t('about.mission4')
  ]

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About Educaption',
        description: 'Learn about Educaption and our mission to help Tamil Nadu students with engineering admissions.',
        url: 'https://educaption.org/about'
      },
      schemas.organization,
      schemas.breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' }
      ])
    ]
  }

  return (
    <>
      <SEO
        title="About Us - TN Admissions Guide"
        description="Educaption helps Tamil Nadu students navigate admissions. Free cutoff calculator, course explorer, and counselling guidance."
        schema={aboutSchema}
      />
      <main className={`min-h-screen bg-gradient-hero ${headerPaddingClass} pb-12 lg:pb-16`}>
      {/* Background decoration */}
      <div className="fixed inset-0 pattern-kolam opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="
            inline-flex items-center gap-2
            px-4 py-2 mb-6
            bg-white/80 backdrop-blur-sm
            border border-saffron-200
            rounded-full
            shadow-soft
          ">
            <Sparkles className="w-4 h-4 text-saffron-500" />
            <span className="font-body text-sm font-medium text-navy-700">
              About Us
            </span>
          </div>

          <h1 className="
            font-display text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-6
          ">
            {t('about.title')}
          </h1>
          <p className="
            font-body text-lg sm:text-xl
            text-navy-500
            max-w-2xl mx-auto
            leading-relaxed
          ">
            {t('about.subtitle')}
          </p>
        </div>

        {/* About Section */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="
              w-14 h-14 flex-shrink-0
              bg-gradient-to-br from-saffron-100 to-saffron-50
              rounded-2xl
              flex items-center justify-center
            ">
              <Users className="w-7 h-7 text-saffron-600" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
                {t('about.aboutTitle')}
              </h2>
            </div>
          </div>
          <p className="font-body text-navy-600 leading-relaxed text-lg">
            {t('about.aboutText')}
          </p>
        </Card>

        {/* Mission Section */}
        <Card variant="gradient" padding="lg" className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="
              w-14 h-14 flex-shrink-0
              bg-gradient-to-br from-navy-100 to-navy-50
              rounded-2xl
              flex items-center justify-center
            ">
              <Target className="w-7 h-7 text-navy-600" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
                {t('about.missionTitle')}
              </h2>
              <p className="font-body text-navy-500">
                {t('about.missionText')}
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {missionItems.map((item, index) => (
              <div
                key={index}
                className="
                  flex items-start gap-4
                  p-4
                  bg-white
                  rounded-xl
                  border border-navy-100
                  shadow-soft
                "
              >
                <div className="
                  w-8 h-8 flex-shrink-0
                  bg-emerald-100
                  rounded-lg
                  flex items-center justify-center
                ">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-body text-navy-700 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Section */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="
              w-14 h-14 flex-shrink-0
              bg-gradient-to-br from-emerald-100 to-emerald-50
              rounded-2xl
              flex items-center justify-center
            ">
              <Heart className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
                {t('about.contactTitle')}
              </h2>
              <p className="font-body text-navy-500">
                {t('about.contactText')}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <a
              href="mailto:support@educaption.com"
              className="
                flex items-center gap-4
                p-5
                bg-cream-50
                border border-navy-100
                rounded-xl
                transition-all duration-200
                hover:border-saffron-200 hover:shadow-soft
                group
              "
            >
              <div className="
                w-12 h-12
                bg-saffron-100
                rounded-xl
                flex items-center justify-center
                group-hover:bg-saffron-200
                transition-colors duration-200
              ">
                <Mail className="w-6 h-6 text-saffron-600" />
              </div>
              <div>
                <p className="font-body text-sm text-navy-400 mb-1">{t('about.email')}</p>
                <p className="font-body font-medium text-navy-900">
                  support@educaption.com
                </p>
              </div>
            </a>

            <div className="
              flex items-center gap-4
              p-5
              bg-cream-50
              border border-navy-100
              rounded-xl
            ">
              <div className="
                w-12 h-12
                bg-navy-100
                rounded-xl
                flex items-center justify-center
              ">
                <MapPin className="w-6 h-6 text-navy-600" />
              </div>
              <div>
                <p className="font-body text-sm text-navy-400 mb-1">{t('about.location')}</p>
                <p className="font-body font-medium text-navy-900">
                  {t('about.address')}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
    </>
  )
}
