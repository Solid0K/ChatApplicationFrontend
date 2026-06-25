/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg:       '#050505',
          surface:  '#0A0F0F',
          border:   '#0f2a2a',
          // Green (kept, slightly cooler)
          green:    '#3a7a6a',
          'green-dim': '#1a3a30',
          'green-bright': '#4aaa8a',
          text:     '#6aaa90',
          'text-dim': '#2d6a55',
          'text-muted': '#1a3a30',
          // Cyan/teal accents (new)
          cyan:     '#2a8a9a',
          'cyan-dim': '#0a2a30',
          'cyan-bright': '#3abaca',
          'cyan-text': '#5acada',
          // Amber for usernames
          amber:    '#7a7030',
          'amber-bright': '#baa040',
          // Error
          error:    '#7a3030',
          'error-bright': '#ca5050',
          // System messages
          system:   '#2a6a7a',
          'system-bright': '#3a8a9a',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      fontSize: {
        'xs': ['0.7rem', { lineHeight: '1rem' }],
        'sm': ['0.8rem', { lineHeight: '1.2rem' }],
        'base': ['0.875rem', { lineHeight: '1.4rem' }],
      },
    },
  },
  plugins: [],
}
