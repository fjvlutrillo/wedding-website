// tailwind.config.js - Style C: Modern & Minimalist
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bodoni: ['var(--font-bodoni)'],
        italianno: ['var(--font-italianno)'],
        luxury: ['var(--font-luxury)'],
      },
      colors: {
        // Style C: Modern & Minimalist Palette
        // Neutral Base
        stone: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        
        // Primary Accent (Deep Charcoal/Black)
        charcoal: {
          DEFAULT: '#2C2C2C',
          light: '#404040',
          dark: '#1A1A1A',
        },
        
        // Warm Neutrals
        warm: {
          white: '#FEFEFE',
          cream: '#FAF9F7',
          beige: '#F5F3F0',
          sand: '#EAE6E1',
        },
        
        // Subtle Accent (for interactive elements)
        accent: {
          sage: '#A8B5A3',      // Muted green
          blush: '#E8C5C0',     // Soft pink
          gold: '#D4AF37',      // Elegant gold (use sparingly)
        },

        // Legacy compatibility (optional - can remove if not needed elsewhere)
        mist: '#BFC3C6',
        almond: '#E4E0D9',
        cocoa: '#57413A',
        paper: '#F6F5F2',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      boxShadow: {
        'minimal': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft': '0 10px 40px rgba(0, 0, 0, 0.05)',
      },
      
      borderRadius: {
        '4xl': '2rem',
      },
      
      animation: {
        'fade-in': 'fade-in 1.5s ease-in-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-pulse': 'fade-pulse 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-pulse': {
          '0%, 100%': { opacity: '0.7', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(8px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      letterSpacing: {
        'widest': '0.3em',
      },
    },
  },
  plugins: [],
}
