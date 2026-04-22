export default {
  darkMode: 'class', // MUST be this
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        indicator: {
          '0%': { opacity: '1' },
          '30%': { opacity: '0' },
          '100%': {
            opacity: '1',
            borderColor: '#60d480',
            transform: 'translateX(-68%)'
          }
        }
      },
      animation: {
        indicator: 'indicator 1s forwards'
      }
    }
  },
  plugins: [],
};