import { useTranslation } from 'react-i18next'

export default function Results() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('results.title')}</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
