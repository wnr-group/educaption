import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2 } from 'lucide-react'
import { generateCutoffReport } from '../../lib/reportGenerator'

export default function DownloadReport({ group, marks, cutoffResults }) {
  const { t, i18n } = useTranslation()
  const [studentName, setStudentName] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      await generateCutoffReport({
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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-saffron-50 rounded-2xl border border-saffron-100">
      <input
        type="text"
        placeholder={t('results.enterName')}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="flex-1 px-4 py-2.5 border border-navy-200 rounded-xl text-sm font-body text-navy-800 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
      />
      <button
        onClick={handleDownload}
        disabled={generating}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-saffron-500 text-white rounded-xl text-sm font-body font-semibold hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2 disabled:opacity-50 transition-colors whitespace-nowrap"
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
