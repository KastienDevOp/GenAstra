import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brewed-coffee': '#7b5543',
        'muted-cocoa': '#8d7b75',
        'dark-roast': '#2c2424',
        'cream': '#f5eee6',
        'dark-chocolate': '#3a3030',
        'espresso': '#241c19',
        'mocha': '#a06e50',
        'dark-mocha': '#6c5953',
        'muted-dark-coffee': '#7d6961',
        'light-taupe': '#a89890',
        'darkest-bean': '#4a3f3b',
        'pale-latte-foam': '#ffe0b2',
        'light-latte-foam': '#f8f1e5',
        'dark-coffee-bean': '#5d4037',
        'milky-latte': '#fff9e6',
        'milk-chocolate': '#8d6e63',
        'caramel': '#c88a65',
        'warm-coffee-brown': '#b47a5a',
        'cafe-au-lait': '#a1887f',
        'dusty-mocha': '#8d776f',
        'mocha-brown': '#7d6d61',
        'light-coffee-stain': '#d7ccc8',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
