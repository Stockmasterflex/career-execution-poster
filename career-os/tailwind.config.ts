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
        border: '#FFFFFF1A',
        'card-bg': '#0B1020B3',
        ring: '#93C5FD33',
        // Tag colors
        'tag-gym': '#F59E0B',
        'tag-market': '#0EA5E9',
        'tag-study': '#8B5CF6',
        'tag-network': '#EC4899',
        'tag-content': '#10B981',
        'tag-meal': '#64748B',
        'tag-family': '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'section-title': ['18px', { lineHeight: '24px', letterSpacing: '-0.025em' }],
        'card-title': ['14px', { lineHeight: '20px', letterSpacing: '-0.025em' }],
        'body': ['13px', { lineHeight: '18px', letterSpacing: '0' }],
      },
      backdropBlur: {
        'glass': '12px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'glass': '16px',
      },
    },
  },
  plugins: [],
}
export default config