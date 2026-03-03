import { useTranslation } from 'react-i18next'
import CounsellingSteps from '../components/counselling/CounsellingSteps'

export default function Counselling() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('counselling.title')}</h1>
          <p className="text-slate-600">
            {t('counselling.subtitle')}
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">{t('counselling.infoTitle')}</h3>
                <p className="text-sm text-blue-700">
                  {t('counselling.infoText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <CounsellingSteps />
      </div>
    </div>
  )
}
