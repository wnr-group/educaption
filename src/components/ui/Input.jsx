import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', icon: Icon, ...props }, ref) => {
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
        {Icon && (
          <div className="
            absolute left-4 top-1/2 -translate-y-1/2
            pointer-events-none
          ">
            <Icon className="w-5 h-5 text-navy-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full
            px-4 py-4
            ${Icon ? 'pl-12' : ''}
            bg-white
            border-2 border-navy-200
            rounded-xl
            font-body text-navy-900
            placeholder:text-navy-300
            transition-all duration-200
            hover:border-navy-300
            focus:outline-none focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="font-body text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
