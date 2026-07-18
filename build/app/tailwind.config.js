/** Beitar tokens mapped to Tailwind colors (var-driven so light/dark flip via [data-theme]). */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)', 'paper-1': 'var(--paper-1)', 'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)', 'ink-2': 'var(--ink-2)', 'ink-3': 'var(--ink-3)',
        rule: 'var(--rule)', 'rule-hi': 'var(--rule-hi)',
        beitar: '#FFCC00', loss: 'var(--loss)',
      },
      fontFamily: { sans: ['HN','Helvetica Neue','Helvetica','Arial','sans-serif'], hn: ['HN','Helvetica Neue','Helvetica','Arial','sans-serif'], ft: ['Jost','HN','sans-serif'], mono: ['JetBrains Mono','ui-monospace','Menlo','monospace'] },
      maxWidth: { canvas: '1600px' },
    },
  },
  plugins: [],
}
