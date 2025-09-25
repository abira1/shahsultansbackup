/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // Primary (60%)
        primary: {
          DEFAULT: '#0a2a66', // Deep Navy Blue
          light: '#1e3f7d',
          dark: '#071d47',
        },
        // Secondary (30%)
        secondary: {
          DEFAULT: '#f9f9f9', // White/Light Gray
          dark: '#e5e5e5',
        },
        // Accent (10%)
        accent: {
          DEFAULT: '#c6a545', // Elegant Gold
          light: '#d4b968',
          dark: '#b08f33',
        },
        // Text colors
        text: {
          primary: '#333333',
          secondary: '#666666',
          tertiary: '#999999',
        },
        // Status colors
        success: '#2e7d32',
        warning: '#ed6c02',
        error: '#d32f2f',
        info: '#0288d1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}