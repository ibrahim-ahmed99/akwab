/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#E0478A',
          'pink-soft': '#F7D2E0',
          'pink-softer': '#FCE8F0',
          blue: '#89B8D8',
          'blue-soft': '#D8E8F3',
          cream: '#FEFCF0',
          'cream-2': '#FAF5E4',
          gold: '#C8A84B',
          ink: '#3D2540',
          'ink-soft': '#6B4E6E',
          line: '#F0E3E8',
        },
      },
      fontFamily: {
        cairo: ["'Cairo'", 'system-ui', 'sans-serif'],
        amiri: ["'Amiri'", 'serif'],
      },
      borderRadius: {
        brand: '22px',
        'brand-sm': '14px',
      },
      boxShadow: {
        'brand-sm': '0 4px 14px rgba(61,37,64,.06)',
        'brand-md': '0 10px 30px rgba(224,71,138,.10)',
        'brand-lg': '0 20px 50px rgba(61,37,64,.12)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '16px',
          md: '24px',
          lg: '32px',
        },
      },
    },
  },
  plugins: [],
};
