/**
 * Circular progress indicator showing course count
 * Features animated ring with gradient, centered stats
 */
export default function CircularProgress({ value, label, subtitle, total, currentTotal }) {
  const size = 180
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Normalize for visual (cap at 100 courses for ring display)
  const normalizedValue = Math.min(value, 100)
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-40 blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)'
          }}
        />

        {/* SVG Ring */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#circularGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative">
            <span className="font-display text-5xl font-bold text-white tracking-tight">
              {value}
            </span>
          </div>
          <span className="font-body text-sm font-medium text-white/70 mt-1">
            {label}
          </span>
        </div>

        {/* Decorative dots on ring */}
        <div className="absolute inset-0">
          <div
            className="absolute w-2.5 h-2.5 bg-saffron-400 rounded-full shadow-lg shadow-saffron-500/50"
            style={{
              top: '50%',
              left: '0%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      {/* Subtitle below */}
      {subtitle && (
        <p className="mt-3 font-body text-sm text-white/50 text-center">
          {subtitle}
        </p>
      )}
    </div>
  )
}
