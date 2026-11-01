/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F3',
          100: '#E2EFE9',
          200: '#C5DFD3',
          300: '#9EC6B5',
          400: '#6FA792',
          500: '#478972',
          600: '#326E5A',
          700: '#235544',
          800: '#164335',
          850: '#0F382C',
          900: '#0A2D22',
          950: '#061F17',
        },
        surface: {
          50: '#FAFBF9',
          100: '#F3F5F2',
          200: '#E6ECE5',
          300: '#D5DFD4',
          400: '#94A396',
          500: '#607263',
          700: '#334036',
          800: '#202923',
          900: '#121814',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#e05a2b',
          600: '#c8481a',
          700: '#a4340e',
        },
        accent: {
          50: '#FFF7F2',
          100: '#FFEADB',
          200: '#FFD4BE',
          500: '#E05A2B',
          600: '#C8481A',
          700: '#A4340E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
