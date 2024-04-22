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
        navy: {
          50: '#3F72AF',
          100: '#3a6aa4',
          200: '#356399',
          300: '#305b8f',
          400: '#2b5384',
          500: '#254c79',
          600: '#20446e',
          700: '#1b3c64',
          800: '#1a3b61',
          900: '#163458',
          950: '#112d4e',
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
