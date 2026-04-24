import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2 } from 'lucide-react'
import { generateCutoffReport } from '../../lib/reportGenerator'

export default function DownloadReport({ group, marks, cutoffResults }) {
  const { t, i18n } = useTranslation()
  const [studentName, setStudentName] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleDownload = () => {
    setGenerating(true)
    try {
      generateCutoffReport({
        studentName,
        group,
        marks,
        cutoffResults,
        language: i18n.language
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <input
        type="text"
        placeholder={t('results.enterName')}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        onClick={handleDownload}
        disabled={generating}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
      >
        {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {t('results.downloadReport')}
      </button>
    </div>
  )
}
