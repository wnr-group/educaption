import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      {label && (
        <label className="
          block
          font-body font-medium text-sm
          text-navy-700
          mb-2
        ">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full
            appearance-none
            px-4 py-4
            pr-12
            bg-white
            border-2 border-navy-200
            rounded-xl
            font-body text-navy-900
            cursor-pointer
            transition-all duration-200
            hover:border-navy-300
            focus:outline-none focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" className="text-navy-400">{t('common.select')}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="
          absolute right-4 top-1/2 -translate-y-1/2
          pointer-events-none
        ">
          <ChevronDown className="w-5 h-5 text-navy-400" />
        </div>
      </div>
      {error && (
        <p className="font-body text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
