/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7', 100: '#FAF5EC', 200: '#F4ECDB', 300: '#EBDFC4',
          400: '#DFCEA6', 500: '#D2BC88', 600: '#C2A96E', 700: '#A88E58',
          800: '#8A7349', 900: '#6B5A3A', 950: '#4A3E28',
        },
        champagne: {
          50: '#FBF8F0', 100: '#F6EFD9', 200: '#EDDDB3', 300: '#E0C784',
          400: '#D4B25C', 500: '#C29A3D', 600: '#A87F32', 700: '#87622B',
          800: '#6E4E27', 900: '#5B4022', 950: '#3A2814',
        },
        charcoal: {
          50: '#F6F6F4', 100: '#E7E7E3', 200: '#CFCFC9', 300: '#AFAFA6',
          400: '#888880', 500: '#6B6B63', 600: '#52524C', 700: '#3D3D38',
          800: '#292926', 900: '#1C1C1A', 950: '#0F0F0E',
        },
        beige: {
          50: '#FAF7F2', 100: '#F3EDE3', 200: '#E7DBCB', 300: '#D6C3A8',
          400: '#C4A883', 500: '#B0905F', 600: '#96764B', 700: '#775E3D',
          800: '#5F4A31', 900: '#4B3A27', 950: '#2E2418',
        },
        success: { 50: '#F1F8F0', 500: '#4F7A45', 700: '#3A5C32', 900: '#28401F' },
        warning: { 50: '#FBF6EC', 500: '#C29A3D', 700: '#87622B', 900: '#5B4022' },
        danger: { 50: '#FBF0EF', 500: '#B05A4F', 700: '#8A443B', 900: '#5E2E27' },
        info: { 50: '#F0F4F8', 500: '#5A7A9A', 700: '#3F5A78', 900: '#28401F' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
        body: ['"Jost"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h4': ['1.25rem', { lineHeight: '1.35' }],
        'eyebrow': ['0.75rem', { letterSpacing: '0.2em', lineHeight: '1.4' }],
      },
      borderRadius: {
        'sm': '2px', DEFAULT: '4px', 'md': '6px', 'lg': '10px', 'xl': '16px', '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(28,28,26,0.04), 0 2px 8px rgba(28,28,26,0.06)',
        'card': '0 4px 24px -8px rgba(28,28,26,0.12)',
        'lift': '0 12px 40px -12px rgba(28,28,26,0.18)',
        'gold': '0 0 0 1px rgba(194,154,61,0.25), 0 8px 24px -8px rgba(194,154,61,0.20)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #E0C784 0%, #C29A3D 50%, #A87F32 100%)',
        'gradient-ivory': 'linear-gradient(180deg, #FDFBF7 0%, #FAF5EC 100%)',
        'gradient-charcoal': 'linear-gradient(180deg, #292926 0%, #1C1C1A 100%)',
        'gradient-hero': 'radial-gradient(ellipse at top, #FAF5EC 0%, #FDFBF7 60%)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-down': { '0%': { opacity: '0', transform: 'translateY(-16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-down': 'fade-down 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
