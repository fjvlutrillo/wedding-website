/** 
 * TAILWIND CONFIG - Modular Wedding Theme
 * 
 * BASE COLOR: #47091C (Deep Burgundy)
 * 
 * LEARNING NOTE:
 * - All colors are defined here in ONE place
 * - To change the theme, just update the colors object below
 * - Components reference these colors by name (e.g., 'wedding-burgundy')
 * - This makes the design system maintainable and consistent
 */

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
        // ========================================
        // WEDDING THEME COLORS - Your Custom Palette
        // ========================================
        
        // Primary Wedding Colors
        wedding: {
          // Main burgundy (your base color #47091C)
          burgundy: {
            DEFAULT: '#47091C',  // Main accent color
            light: '#6B1429',     // Lighter burgundy
            dark: '#2D0512',      // Darker burgundy
            50: '#FDF3F5',        // Very light tint
            100: '#FAE7EB',       // Light tint
            200: '#F2C5CF',       // Soft tint
            300: '#E39DAD',       // Medium tint
            400: '#D4758B',       // 
            500: '#B54D68',       // 
            600: '#8B2F48',       // 
            700: '#6B1429',       // 
            800: '#47091C',       // Base color
            900: '#2D0512',       // Darkest
          },
          
          // Rose gold (complementary warm tone)
          rose: {
            DEFAULT: '#B76E79',
            light: '#D4A1AA',
            dark: '#8B4A54',
            50: '#FDF8F9',
            100: '#F9EFF1',
            200: '#F0D9DD',
            300: '#E4BDC4',
            400: '#D4A1AA',
            500: '#B76E79',
            600: '#9A5963',
            700: '#7D444D',
            800: '#5F3037',
            900: '#421C21',
          },
          
          // Blush (soft romantic accent)
          blush: {
            DEFAULT: '#E8C5C0',
            light: '#F5E5E3',
            dark: '#D4A8A3',
          },
          
          // Gold accent (use sparingly for elegance)
          gold: {
            DEFAULT: '#D4AF37',
            light: '#E8D48C',
            dark: '#9A7A1A',
          },
        },
        
        // ========================================
        // NEUTRALS - For text, backgrounds, borders
        // ========================================
        
        // Stone gray scale (keeping for flexibility)
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
        
        // Warm neutrals (better for wedding aesthetic)
        warm: {
          white: '#FEFEFE',     // Pure white with warmth
          cream: '#FAF9F7',     // Warm off-white
          beige: '#F5F3F0',     // Light warm background
          sand: '#EAE6E1',      // Soft warm gray
          taupe: '#D4CFC7',     // Medium warm gray
        },
        
        // Primary text and UI elements
        charcoal: {
          DEFAULT: '#2C2C2C',
          light: '#404040',
          dark: '#1A1A1A',
        },
        
        // ========================================
        // SEMANTIC COLORS - For UI states
        // ========================================
        
        success: {
          DEFAULT: '#10B981',
          light: '#6EE7B7',
          dark: '#059669',
        },
        
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        
        error: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          dark: '#DC2626',
        },
      },
      
      // ========================================
      // SPACING & SIZING
      // ========================================
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      // ========================================
      // SHADOWS - Using burgundy tints
      // ========================================
      
      boxShadow: {
        'wedding': '0 2px 8px rgba(71, 9, 28, 0.08)',        // Subtle burgundy shadow
        'wedding-md': '0 4px 20px rgba(71, 9, 28, 0.12)',    // Medium burgundy shadow
        'wedding-lg': '0 10px 40px rgba(71, 9, 28, 0.15)',   // Large burgundy shadow
        'wedding-xl': '0 20px 60px rgba(71, 9, 28, 0.20)',   // Extra large
        'minimal': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft': '0 10px 40px rgba(0, 0, 0, 0.05)',
      },
      
      // ========================================
      // BORDER RADIUS
      // ========================================
      
      borderRadius: {
        '4xl': '2rem',
      },
      
      // ========================================
      // ANIMATIONS
      // ========================================
      
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
