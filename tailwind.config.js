/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#183c34',
        teal: '#43856b',
        mint: '#edf4e9',
      },
    },
  },
  plugins: [],
};
