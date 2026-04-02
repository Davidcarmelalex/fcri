/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-light': '#E8C872',
        'gold-dark': '#B8941F',
        black: '#0A0A0C',
        'black-soft': '#121214',
        'black-light': '#1A1A1F',
        charcoal: '#2A2A30',
        white: '#FAFAFA',
        silver: '#A0A0A8',
      },
      animation: {
        gridMove: 'gridMove 20s linear infinite',
        orbFloat: 'orbFloat 8s ease-in-out infinite',
        rotate: 'rotate 30s linear infinite',
        fadeInUp: 'fadeInUp 1s ease forwards',
        bounce: 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(60px, 60px)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -30px) scale(1.1)' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(10px)' },
        },
      },
    },
  },
  plugins: [],
}