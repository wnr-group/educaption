import { useTranslation } from 'react-i18next'
import Card from '../components/ui/Card'

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">{t('about.title')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* About Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {t('about.aboutTitle')}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {t('about.aboutText')}
          </p>
        </Card>

        {/* Mission Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {t('about.missionTitle')}
          </h2>
          <p className="text-slate-600 mb-4">
            {t('about.missionText')}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-600">{t('about.mission1')}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-600">{t('about.mission2')}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-600">{t('about.mission3')}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-600">{t('about.mission4')}</span>
            </li>
          </ul>
        </Card>

        {/* Contact Section */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {t('about.contactTitle')}
          </h2>
          <p className="text-slate-600 mb-6">
            {t('about.contactText')}
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('about.email')}</p>
                <a href="mailto:support@educaption.com" className="text-primary hover:text-primary-dark font-medium">
                  support@educaption.com
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('about.location')}</p>
                <p className="text-slate-700 font-medium">Tamil Nadu, India</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
