const path = require('path')

// Config-relative absolute glob (forward-slashed) so fast-glob resolves content
// regardless of the process CWD — the local dev server is launched with the app
// dir as an arg from a parent folder on Windows, and Vercel builds from a Linux
// path. __dirname is reliable here because this is CommonJS (.cjs); a .ts config
// silently failed to load and fell back to an empty default with no styles.
const srcGlob = path
  .join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}')
  .replace(/\\/g, '/')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [srcGlob],
  theme: {
    extend: {
      colors: {
        // ---- Warm Console core tokens (§1.1) ----
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        accent: {
          primary: 'rgb(var(--accent-primary) / <alpha-value>)',
          secondary: 'rgb(var(--accent-secondary) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        // Categorical chart set (§1.1)
        chart: {
          brass: 'rgb(var(--chart-brass) / <alpha-value>)',
          pine: 'rgb(var(--chart-pine) / <alpha-value>)',
          blue: 'rgb(var(--chart-blue) / <alpha-value>)',
          clay: 'rgb(var(--chart-clay) / <alpha-value>)',
          olive: 'rgb(var(--chart-olive) / <alpha-value>)',
          slate: 'rgb(var(--chart-slate) / <alpha-value>)',
        },
        // shadcn/ui aliases mapped onto the Warm Console palette.
        background: 'rgb(var(--bg) / <alpha-value>)',
        foreground: 'rgb(var(--ink) / <alpha-value>)',
        input: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--accent-primary) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--accent-primary) / <alpha-value>)',
          foreground: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--accent-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--ink) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          foreground: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          foreground: 'rgb(var(--ink-muted) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--surface-raised) / <alpha-value>)',
          foreground: 'rgb(var(--ink) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          foreground: 'rgb(var(--ink) / <alpha-value>)',
        },
      },
      spacing: {
        '4.5': '1.125rem',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-public-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-grotesk)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4' }],
        sm: ['14px', { lineHeight: '1.4' }],
        base: ['16px', { lineHeight: '1.4' }],
        lg: ['20px', { lineHeight: '1.3' }],
        xl: ['28px', { lineHeight: '1.1' }],
        '2xl': ['40px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        card: '10px',
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(42, 38, 32, 0.04)',
        lift: '0 6px 20px rgba(42, 38, 32, 0.10)',
        panel: '0 12px 40px rgba(42, 38, 32, 0.14)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-slide-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-slide-in': 'fade-slide-in 0.15s ease-out',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
