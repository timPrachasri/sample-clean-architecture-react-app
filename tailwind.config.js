const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      height: {
        halfscreen: '50vh',
        '2/3screen': '67vh',
      },
      minHeight: {
        halfscreen: '50vh',
        halffull: '50%',
        '2/3screen': '67vh',
      },
      maxHeight: {
        halfscreen: '50vh',
        halffull: '50%',
        '2/3screen': '67vh',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        99: '99',
      },
      screens: {
        tablet: '640px',
        // => @media (min-width: 640px) { ... }

        laptop: '1024px',
        // => @media (min-width: 1024px) { ... }

        desktop: '1280px',
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['lemonade'],
  },
}
