/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // All pages and routes
    './components/**/*.{js,ts,jsx,tsx}', // All your custom components
  ],
  theme: {
    extend: {
      colors: {
        // New palette
        wine: '#4D1C20',
        cherry: '#651D28',
        rosewood: '#9B4E54',
        blush: '#CC7379',
        pinkish: '#E5AAAE',
        //olive: '#4F5847',
        //sage: '#BDC2AC',
        linen: '#FBF3F9',
        silver: '#D2D2D2',
        paper: '#FCFCFC',
        grayish: '#9D9D9D',

        // Legacy palette (optional: comment out if not used)
        /*
        rose: '#D3AB9E',
        oldBlush: '#EAC9C1',
        cream: '#E8D8D0',
        roseWhite: '#FFFBFF',
        snow: '#FEFEFF',
        */
      },
    },
  },
  plugins: [],
}