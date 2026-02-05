import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fef6f8',
          100: '#fdeef2',
          200: '#fad5de',
          300: '#f7b3c4',
          400: '#f288a3',
          500: '#e85d82',
          600: '#d63d64',
          700: '#b42d4e',
          800: '#962842',
          900: '#7d253a',
        },
        ink: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c4c6cb',
          300: '#9fa2a9',
          400: '#7a7e87',
          500: '#5f636c',
          600: '#4b4e56',
          700: '#3e4047',
          800: '#34363b',
          900: '#1a1b1e',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        japanese: ['Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
