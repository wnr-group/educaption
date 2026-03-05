import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Calendar, FileCheck, ExternalLink, Loader2 } from 'lucide-react'
import { useCounselling } from '../../hooks/queries/useCounselling'
import Card from '../ui/Card'

function AccordionItem({ item, isOpen, onToggle, language, t, index }) {
  const name = language === 'ta' && item.name_ta ? item.name_ta : item.name
  const description = language === 'ta' && item.description_ta ? item.description_ta : item.description

  return (
    <div className={`
      border border-navy-100
      rounded-2xl
      overflow-hidden
      bg-white
      transition-all duration-300
      ${isOpen ? 'shadow-lifted' : 'shadow-soft hover:shadow-lifted'}
    `}>
      <button
        onClick={onToggle}
        className="
          w-full px-6 py-5
          flex items-center justify-between gap-4
          text-left
          transition-colors duration-200
          hover:bg-cream-50
          focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-inset
        "
      >
        <div className="flex items-center gap-4">
          <span className="
            w-10 h-10 flex-shrink-0
            bg-gradient-to-br from-saffron-500 to-saffron-600
            rounded-xl
            flex items-center justify-center
            font-display font-bold text-white
            shadow-soft
          ">
            {index + 1}
          </span>
          <span className="font-display text-xl font-bold text-navy-900">
            {name}
          </span>
        </div>
        <ChevronDown className={`
          w-6 h-6 text-navy-400
          transition-transform duration-300
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </button>

      <div className={`
        overflow-hidden
        transition-all duration-300 ease-out
        ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 pb-6 pt-2">
          {/* Description */}
          {description && (
            <p className="font-body text-navy-600 leading-relaxed mb-6 text-lg">
              {description}
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Important Dates */}
            {item.important_dates && item.important_dates.length > 0 && (
              <div className="
                p-5
                bg-gradient-to-br from-cream-50 to-saffron-50/30
                border border-saffron-100
                rounded-xl
              ">
                <div className="flex items-center gap-3 mb-4">
                  <div className="
                    w-10 h-10
                    bg-saffron-100
                    rounded-lg
                    flex items-center justify-center
                  ">
                    <Calendar className="w-5 h-5 text-saffron-600" />
                  </div>
                  <h4 className="font-display font-bold text-navy-900">
                    {t('counselling.dates')}
                  </h4>
                </div>
                <ul className="space-y-3">
                  {item.important_dates.map((date, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="
                        w-2 h-2 mt-2
                        bg-saffron-500
                        rounded-full
                        flex-shrink-0
                      " />
                      <div>
                        <span className="font-body font-semibold text-navy-800 block">
                          {date.event}
                        </span>
                        <span className="font-body text-sm text-navy-500">
                          {date.date}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Documents */}
            {item.required_documents && item.required_documents.length > 0 && (
              <div className="
                p-5
                bg-gradient-to-br from-cream-50 to-navy-50/30
                border border-navy-100
                rounded-xl
              ">
                <div className="flex items-center gap-3 mb-4">
                  <div className="
                    w-10 h-10
                    bg-navy-100
                    rounded-lg
                    flex items-center justify-center
                  ">
                    <FileCheck className="w-5 h-5 text-navy-600" />
                  </div>
                  <h4 className="font-display font-bold text-navy-900">
                    {t('counselling.documents')}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {item.required_documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="
                        w-2 h-2 mt-2
                        bg-navy-400
                        rounded-full
                        flex-shrink-0
                      " />
                      <span className="font-body text-navy-600">
                        {doc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Website Link */}
          {item.website_url && (
            <a
              href={item.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                mt-6
                px-6 py-3
                bg-gradient-to-br from-saffron-500 to-saffron-600
                text-white
                rounded-xl
                font-body font-semibold
                shadow-soft
                hover:shadow-lifted hover:-translate-y-0.5
                active:translate-y-0
                transition-all duration-200
              "
            >
              <span>{t('counselling.visitWebsite')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CounsellingSteps() {
  const { t, i18n } = useTranslation()
  const { data: counsellingData, isLoading, error } = useCounselling()
  const [openItems, setOpenItems] = useState({ 0: true }) // First item open by default

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-saffron-500 animate-spin mb-4" />
        <p className="font-body text-navy-500">{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card variant="elevated" className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="font-body text-red-600">{t('common.error')}</p>
      </Card>
    )
  }

  if (!counsellingData || counsellingData.length === 0) {
    return (
      <Card variant="elevated" className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-navy-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <p className="font-body text-navy-500">{t('counselling.noInfo')}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {counsellingData.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          index={index}
          isOpen={openItems[item.id]}
          onToggle={() => toggleItem(item.id)}
          language={i18n.language}
          t={t}
        />
      ))}
    </div>
  )
}
