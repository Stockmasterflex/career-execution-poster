/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}', 
    './components/**/*.{ts,tsx}', 
    './lib/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Background colors from screenshots
        'bg-primary': '#1e293b', // Dark blue background
        'bg-secondary': '#0f172a', // Darker blue
        'bg-card': '#ffffff', // White cards
        'bg-surface': '#f8fafc', // Light gray surface
        
        // Text colors
        'text-primary': '#1e293b', // Dark gray text
        'text-secondary': '#64748b', // Medium gray text
        'text-muted': '#94a3b8', // Light gray text
        'text-white': '#ffffff',
        
        // Phase colors from screenshots
        phase: {
          '1': '#FF8C00', // Orange from Phase 1
          '2': '#12B8E6', // Cyan from Phase 2  
          '3': '#22C55E', // Green from Phase 3
          '4': '#8B5CF6', // Purple from Phase 4
        },
        
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        
        // Calendar time block colors
        'time-gym': '#e0e7ff', // Light purple/blue
        'time-study': '#ddd6fe', // Light purple
        'time-network': '#fce7f3', // Light pink
        'time-content': '#fef3c7', // Light yellow
        'time-meals': '#fed7d7', // Light red/salmon
        'time-family': '#d1fae5', // Light green
        
        // Gradient colors
        'gradient-orange': '#FF8C00',
        'gradient-orange-dark': '#FF6347',
        'gradient-blue': '#1e40af',
        'gradient-blue-dark': '#1e3a8a',
        'gradient-purple': '#7c3aed',
        'gradient-purple-dark': '#6d28d9',
        'gradient-green': '#059669',
        'gradient-green-dark': '#047857',
        'gradient-cyan': '#0891b2',
        'gradient-cyan-dark': '#0e7490',
      },
      backgroundImage: {
        'gradient-dashboard': 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        'gradient-phase-1': 'linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)',
        'gradient-phase-2': 'linear-gradient(135deg, #12B8E6 0%, #0891b2 100%)',
        'gradient-phase-3': 'linear-gradient(135deg, #22C55E 0%, #059669 100%)',
        'gradient-phase-4': 'linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '0.75rem',
        'card-lg': '1rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      }
    },
  },
  plugins: [],
}
