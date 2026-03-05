export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-body font-semibold
    rounded-xl
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `

  const variants = {
    primary: `
      bg-gradient-to-br from-saffron-500 via-saffron-600 to-saffron-700
      text-white
      shadow-soft
      hover:shadow-lifted hover:-translate-y-0.5
      active:translate-y-0 active:shadow-soft
      focus-visible:ring-saffron-500
    `,
    secondary: `
      bg-gradient-to-br from-emerald-500 to-emerald-600
      text-white
      shadow-soft
      hover:shadow-lifted hover:-translate-y-0.5
      active:translate-y-0 active:shadow-soft
      focus-visible:ring-emerald-500
    `,
    outline: `
      border-2 border-saffron-500
      text-saffron-600
      bg-transparent
      hover:bg-saffron-50 hover:border-saffron-600
      active:bg-saffron-100
      focus-visible:ring-saffron-500
    `,
    ghost: `
      text-navy-700
      bg-transparent
      hover:bg-navy-50
      active:bg-navy-100
      focus-visible:ring-navy-500
    `,
    dark: `
      bg-gradient-to-br from-navy-800 to-navy-900
      text-white
      shadow-soft
      hover:shadow-lifted hover:-translate-y-0.5
      active:translate-y-0 active:shadow-soft
      focus-visible:ring-navy-500
    `
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={iconSizes[size]} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  )
}
