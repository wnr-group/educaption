export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'default'
}) {
  const variants = {
    default: `
      bg-white
      border border-navy-100
      shadow-soft
    `,
    elevated: `
      bg-white
      shadow-lifted
    `,
    glass: `
      bg-white/80
      backdrop-blur-lg
      border border-white/50
      shadow-soft
    `,
    gradient: `
      bg-gradient-to-br from-white via-cream-50 to-saffron-50/30
      border border-saffron-100/50
      shadow-soft
    `,
    dark: `
      bg-gradient-to-br from-navy-800 to-navy-900
      text-white
      shadow-glow-navy
    `
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const hoverEffect = hover ? 'card-hover' : ''

  return (
    <div className={`
      rounded-2xl
      ${variants[variant]}
      ${paddings[padding]}
      ${hoverEffect}
      ${className}
    `}>
      {children}
    </div>
  )
}
