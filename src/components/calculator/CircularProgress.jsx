/**
 * Circular progress indicator showing course count
 * Used in results header to highlight eligible courses
 */
export default function CircularProgress({ value, label, subtitle }) {
  // SVG circle parameters
  const size = 140
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // For course count, we don't show percentage - just the number
  // But we'll animate the ring based on a normalized value (cap at 100 for visual)
  const normalizedValue = Math.min(value, 100)
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold text-white">{value}</span>
          <span className="font-body text-sm text-white/80">{label}</span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 font-body text-sm text-white/60 text-center">{subtitle}</p>
      )}
    </div>
  )
}
