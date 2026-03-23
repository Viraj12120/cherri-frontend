/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        acid: "var(--color-acid, #E8F532)",
        danger: "var(--color-danger, #FF5061)",
        coral: "var(--color-coral, #FF6B57)",
        void: "var(--color-void, #0A0701)",
        surface: "var(--color-surface, #F4F4F9)",
        muted: "var(--color-muted, #6B7280)",
        glass: "var(--color-glass, rgba(255,255,255,0.06))",
        success: "var(--color-success, #22C55E)",
        warn: "var(--color-warn, #F59E0B)",
        navy: "var(--color-navy, #0D0C09)",
        dark: "var(--color-dark, #080807)",
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slideInRight': 'slideInRight 0.25s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
