/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper:'var(--paper)', card:'var(--card)', muted:'var(--muted)',
        ink:'var(--ink)', ink2:'var(--ink-2)', cenere:'var(--cenere)',
        rule:'var(--rule)', beitar:'var(--beitar)', beitarfg:'var(--beitar-fg)',
      },
      fontFamily: {
        hn: ['Public Sans','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        ft: ['Jost','Public Sans','sans-serif'],
        mono: ['"JetBrains Mono"','ui-monospace','Menlo','monospace'],
      },
      borderColor: { DEFAULT: 'var(--rule)' },
    },
  },
  plugins: [],
}
