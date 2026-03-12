import { useTranslation } from 'react-i18next'
import { FileText, Info, ExternalLink } from 'lucide-react'
import Card from '../components/ui/Card'
import CounsellingSteps from '../components/counselling/CounsellingSteps'

export default function Counselling() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-gradient-hero pt-40 sm:pt-44 pb-12 lg:pb-16">
      {/* Background decoration */}
      <div className="fixed inset-0 pattern-kolam opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="
            inline-flex items-center gap-2
            px-4 py-2 mb-6
            bg-white/80 backdrop-blur-sm
            border border-navy-200
            rounded-full
            shadow-soft
          ">
            <FileText className="w-4 h-4 text-saffron-500" />
            <span className="font-body text-sm font-medium text-navy-700">
              TNEA Counselling
            </span>
          </div>

          <h1 className="
            font-display text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-4
          ">
            {t('counselling.title')}
          </h1>
          <p className="
            font-body text-lg
            text-navy-500
            max-w-2xl mx-auto
          ">
            {t('counselling.subtitle')}
          </p>
        </div>

        {/* Important Info Banner */}
        <Card
          variant="gradient"
          padding="lg"
          hover={false}
          className="mb-10 border-l-4 border-saffron-500"
        >
          <div className="flex items-start gap-4">
            <div className="
              w-12 h-12 flex-shrink-0
              bg-saffron-100
              rounded-xl
              flex items-center justify-center
            ">
              <Info className="w-6 h-6 text-saffron-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-navy-900 mb-2">
                {t('counselling.infoTitle')}
              </h3>
              <p className="font-body text-navy-600 leading-relaxed">
                {t('counselling.infoText')}
              </p>
              <a
                href="https://tneaonline.org"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  mt-4
                  text-saffron-600
                  font-body font-semibold
                  hover:text-saffron-700
                  transition-colors duration-200
                "
              >
                <span>Visit TNEA Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>

        {/* Counselling Steps */}
        <CounsellingSteps />
      </div>
    </main>
  )
}
