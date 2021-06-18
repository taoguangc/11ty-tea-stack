module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.njk',
    './src/**/*.md',
    './src/**/*.html',
    './src/**/*.js',
  ],
  darkMode: false,
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'Roboto', 'san-serif',]
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens'),
  ],
}
