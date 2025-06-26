// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mist: '#BFC3C6',  // soft gray
        almond: '#E4E0D9',  // main creamy bg
        blush: '#E1BFB7',  // pink accent
        champagne: '#E4C3A1',  // sand/peach
        cocoa: '#57413A',  // deep brown (for contrast/headings)
        // Optional: keep these for text readability
        white: '#FFFFFF',
        black: '#111111',
        // Optionally add soft paper backgrounds:
        paper: '#F6F5F2',        // ultra-light off-white
        sand: '#E4E0D9',
        blush: '#E1BFB7',
      },
    },
  },
  plugins: [],
}

// New palette
//wine: '#4D1C20',
//cherry: '#651D28',
//rosewood: '#9B4E54',
//blush: '#CC7379',
//pinkish: '#E5AAAE',
//olive: '#4F5847',
//sage: '#BDC2AC',
//linen: '#FBF3F9',
//silver: '#D2D2D2',
//paper: '#FCFCFC',
//grayish: '#9D9D9D',

// Legacy palette (optional: comment out if not used)
/*
rose: '#D3AB9E',
oldBlush: '#EAC9C1',
cream: '#E8D8D0',
roseWhite: '#FFFBFF',
snow: '#FEFEFF',
*/