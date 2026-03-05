export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Saffron/Gold spectrum - aspiration, auspiciousness
        saffron: {
          50: '#FFF8F0',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Deep navy - trust, academia
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
          950: '#030712',
        },
        // Warm cream backgrounds
        cream: {
          50: '#FFFDFB',
          100: '#FFF9F5',
          200: '#FFF3EB',
        },
        // Success green
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
        // Legacy aliases for compatibility
        primary: '#F97316',
        secondary: '#10B981',
        accent: '#FB923C',
        bg: '#FFFDFB',
        text: '#102A43'
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
      lineHeight: {
        relaxed: '1.7',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(249, 115, 22, 0.1), 0 6px 20px -4px rgba(16, 42, 67, 0.08)',
        'lifted': '0 4px 12px -2px rgba(249, 115, 22, 0.12), 0 12px 32px -8px rgba(16, 42, 67, 0.12)',
        'floating': '0 8px 24px -4px rgba(249, 115, 22, 0.15), 0 20px 48px -12px rgba(16, 42, 67, 0.18)',
        'glow-saffron': '0 0 40px -8px rgba(249, 115, 22, 0.3)',
        'glow-navy': '0 0 40px -8px rgba(16, 42, 67, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    }
  },
  plugins: []
}
