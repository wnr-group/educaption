import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCounselling } from '../../hooks/queries/useCounselling'

function AccordionItem({ item, isOpen, onToggle, language }) {
  const name = language === 'ta' && item.name_ta ? item.name_ta : item.name
  const description = language === 'ta' && item.description_ta ? item.description_ta : item.description

  return (
    <div className="border border-slate-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors"
      >
        <span className="text-lg font-semibold text-slate-800">{name}</span>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
          {description && (
            <p className="text-slate-600 mb-4">{description}</p>
          )}

          {/* Important Dates */}
          {item.important_dates && item.important_dates.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Important Dates
              </h4>
              <ul className="space-y-2">
                {item.important_dates.map((date, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>
                      <strong className="text-slate-700">{date.event}:</strong>{' '}
                      <span className="text-slate-600">{date.date}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Documents */}
          {item.required_documents && item.required_documents.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Required Documents
              </h4>
              <ul className="space-y-1">
                {item.required_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Website Link */}
          {item.website_url && (
            <div className="mt-4">
              <a
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Official Website
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CounsellingSteps() {
  const { t, i18n } = useTranslation()
  const { data: counsellingData, isLoading, error } = useCounselling()
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-slate-200 rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {t('common.error')}
      </div>
    )
  }

  if (!counsellingData || counsellingData.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-600">
        No counselling information available at the moment.
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {counsellingData.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItems[item.id]}
          onToggle={() => toggleItem(item.id)}
          language={i18n.language}
        />
      ))}
    </div>
  )
}
