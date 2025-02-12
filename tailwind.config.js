/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#40CDB5', // Custom teal from logo
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        coral: {
          50: '#fff5f2',
          100: '#ffe6e0',
          200: '#ffd0c7',
          300: '#ffb3a7',
          400: '#ff8a7a',
          500: '#FF6B4A', // Custom coral from logo
          600: '#e85a3a',
          700: '#d44a2a',
          800: '#c03a1a',
          900: '#b02a0a',
          950: '#a01a00',
        }
      },
    },
  },
  plugins: [],
};