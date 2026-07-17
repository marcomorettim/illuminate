# Kestrel — React reference build (illuminate Part K §5)

The modern-stack demonstrator: **React + TypeScript + Tailwind + Radix (shadcn primitives) +
TanStack Table + visx + Framer Motion**, bundled to **one self-contained offline HTML** via
`vite build` + `vite-plugin-singlefile` — the output is `../illuminate-kestrel-react.html`.

```bash
npm install
npm run build      # → dist/index.html : one file, all JS/CSS/fonts inlined, zero external requests
node ../../render-gate/render-gate.mjs dist/index.html
```

Demonstrates: every driver→mechanism developed as a uniform data model (Completeness Law §1.1a,
no head/tail compression); real multi-level drill-down (nested Radix accordions + master-detail
evidence Sheet); TanStack faceted/sortable tables; visx charts (contribution bridge, loss curve,
couplings web) — monochrome + one Beitar finding; One-Dark code panels; the Beitar palette with the
fixed-dark finding-mark foreground; a canvas-filling grid (tree rail + wide main).
`src/fonts.css` is `assets/embedded-font.css` (base64 Nimbus/Jost/JetBrains).
