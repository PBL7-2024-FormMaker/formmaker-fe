/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        info: '#0492de',
        success: '#1ea431',
        error: '#db221a',
        warning: '#d67813',
        'light-info': '#daebfa',
        'light-success': '#e1fada',
        'light-error': '#f8e0d1',
        'light-warning': '#fef2cb',
        malachite: {
          50: '#f2fcf1',
          100: '#e2f8e0',
          200: '#c5f0c2',
          300: '#96e392',
          400: '#48c642',
          500: '#39b334',
          600: '#2b9326',
          700: '#247421',
          800: '#215c1f',
          900: '#1c4c1b',
          950: '#0a290a',
        },
        blue: {
          50: '#c8ceed',
          100: '#6F76A7',
          200: '#0A1551',
        },
        blueButton: '#4170E2',
        toggleOn: '#92df2e',
        toggleOff: '#e8edee',
        activeTabBackground: '#8ad56c',
      },
      height: {
        headerHeight: '90px',
        contentHeight: `calc( 100vh - 70px)`,
      },
      boxShadow: {
        whiteShadow: '0 0 1px 2px rgba(225,225,225,0.5)',
      },
    },
  },
  plugins: [],
};
