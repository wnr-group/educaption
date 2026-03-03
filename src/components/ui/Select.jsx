import { forwardRef } from 'react'

const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 border-2 border-slate-300 rounded focus:outline-none focus:border-primary bg-white ${className}`}
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
