// Stage 8 — the render gate, as an executed program. Reads ONLY the built file and the
// manifest (never any generator's context). Launches headless Chromium, walks the manifest
// tree clicking every drill node, and computes each §10 check from DOM + pixels. Verdict is a
// file, not a claim. Usage: node gate.mjs <html> <manifest.json> <thresholds.json> <out-report.json>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const [htmlPath, manifestPath, thrPath, outPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const T = JSON.parse(readFileSync(thrPath, 'utf8'));
const nodes = Object.values(manifest.nodes);
const leaves = nodes.filter((n) => n.level === 4);
const compNodes = nodes.filter((n) => n.required_component);
const sourceWords = manifest.meta.substantive_words || nodes.reduce((a, n) => a + (n.source_words || 0), 0);

const report = { source: manifest.meta.source, pages: 0, pass: true, checks: [], failing_nodes: [] };
const fail = (check, detail, theme) => { report.pass = false; report.checks.push({ check, theme, ...detail }); };
const failNode = (id, check, detail) => { report.pass = false; report.failing_nodes.push({ id, check, ...detail }); };

async function expandAll(page) {
  // nested accordions reveal more triggers as parents open — loop until stable
  for (let pass = 0; pass < 8; pass++) {
    const closed = await page.$$('[data-drill-trigger][aria-expanded="false"]');
    if (!closed.length) break;
    for (const t of closed) { try { await t.click({ timeout: 500 }); } catch {} }
    await page.waitForTimeout(120);
  }
}

const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: T.viewport });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 200)));
  await page.goto('file://' + resolve(htmlPath));
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  await page.waitForTimeout(150);

  // walk every domain view + expand its whole tree so all content is in the DOM
  const views = ['overview', ...manifest.roots];
  let totalRendered = 0;
  const seen = new Set();
  for (const v of views) {
    await page.evaluate((h) => { location.hash = '#/' + h; }, v);
    await page.waitForTimeout(120);
    await expandAll(page);

    // CHECK 1 — words per node vs floor (own body only; no descendant double-count)
    const counts = await page.$$eval('[data-node-body]', (els) =>
      els.map((el) => {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('[data-node-body]').forEach((c) => c.remove());
        return { id: el.getAttribute('data-node-body'), words: (clone.innerText || '').trim().split(/\s+/).filter(Boolean).length };
      }));
    for (const c of counts) { if (!seen.has(c.id)) { seen.add(c.id); totalRendered += c.words; } }
  }
  // per-node floor check across the full manifest (a missing node = 0 words)
  const wordMap = {};
  for (const v of views) {
    await page.evaluate((h) => { location.hash = '#/' + h; }, v);
    await page.waitForTimeout(80); await expandAll(page);
    const cs = await page.$$eval('[data-node-body]', (els) => els.map((el) => {
      const clone = el.cloneNode(true);
      clone.querySelectorAll('[data-node-body]').forEach((c) => c.remove());
      return { id: el.getAttribute('data-node-body'), words: (clone.innerText || '').trim().split(/\s+/).filter(Boolean).length };
    }));
    for (const c of cs) wordMap[c.id] = Math.max(wordMap[c.id] || 0, c.words);
  }
  if (theme === 'light') {
    for (const n of [...leaves, ...nodes.filter((x) => x.level <= 3)]) {
      const w = wordMap[n.id] || 0;
      if (w < n.word_floor) failNode(n.id, 'completeness', { words: w, floor: n.word_floor, level: n.level });
    }
    if (totalRendered < T.completeness_floor_ratio * sourceWords)
      fail('completeness-total', { rendered: totalRendered, need: Math.round(T.completeness_floor_ratio * sourceWords) });
  }

  // CHECK 2 — component coverage: each required node must render a component element in its body
  const missing = [];
  for (const n of compNodes) {
    const has = await page.$(`[data-node-body="${n.id}"] :is(svg,table,[data-tanstack])`);
    if (!has) missing.push(n.id);
  }
  const totalComps = await page.$$eval('svg,table,[data-tanstack]', (e) => e.length);
  if (theme === 'light' && missing.length) fail('coverage', { missing_component_nodes: missing.slice(0, 20), rendered_total: totalComps, required: compNodes.length });

  // CHECK 3 — drill-down real: deepest node level made visible purely by clicking
  const depth = await page.$$eval('[data-node-body]', (els) => {
    const vis = els.filter((el) => el.getClientRects().length > 0);
    return vis.reduce((m, el) => Math.max(m, +(el.getAttribute('data-level') || 0)), 0);
  });
  if (depth < T.min_drill_depth) fail('drill-depth', { reachable: depth, need: T.min_drill_depth }, theme);

  // CHECK 4 — canvas fill: content span vs viewport (dead lateral margin ratio)
  const dead = await page.evaluate(() => {
    const main = document.querySelector('main'); if (!main) return 1;
    const vw = window.innerWidth;
    let lo = vw, hi = 0;
    main.querySelectorAll('p,table,svg,h1,h2,li,[data-tanstack]').forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 4) return;
      lo = Math.min(lo, r.left); hi = Math.max(hi, r.right);
    });
    return hi <= lo ? 1 : 1 - (hi - lo) / vw;
  });
  if (dead > T.dead_margin_max) fail('canvas-fill', { dead_margin_ratio: +dead.toFixed(2), max: T.dead_margin_max }, theme);

  // CHECK 5 — Beitar: marks per view, fixed-dark foreground, no accent heading
  const beitar = await page.evaluate(() => {
    const isYellow = (c) => { const m = c && c.match(/\d+/g); return m && +m[0] > 230 && +m[1] > 180 && +m[1] < 220 && +m[2] < 60; };
    const lum = (c) => { const m = c.match(/\d+/g) || [0, 0, 0]; return 0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]; };
    let marks = 0, badFg = [], accentHeading = false;
    document.querySelectorAll('main *').forEach((el) => {
      const s = getComputedStyle(el);
      const painted = isYellow(s.backgroundColor) || isYellow(s.fill);
      if (painted && el.getClientRects().length) {
        marks++;
        const txt = (el.textContent || '').trim();
        if (txt && isYellow(s.backgroundColor) && lum(s.color) > 120) badFg.push(txt.slice(0, 24));
      }
      if (/^H[1-3]$/.test(el.tagName) && isYellow(s.color)) accentHeading = true;
    });
    return { marks, badFg, accentHeading };
  });
  if (beitar.badFg.length) fail('beitar-foreground', { near_white_on_beitar: beitar.badFg }, theme);
  if (beitar.accentHeading) fail('beitar-heading', { detail: 'a heading is painted in the accent' }, theme);

  // CHECK 6 — fonts: no forbidden family resolved on sampled nodes
  const fonts = await page.evaluate(() => {
    const s = new Set();
    ['body', 'h1', 'h2', 'p', '.finding', '.font-mono'].forEach((sel) => {
      const el = document.querySelector(sel); if (el) s.add(getComputedStyle(el).fontFamily);
    });
    return [...s].join(' | ');
  });
  const badFont = T.forbidden_fonts.filter((f) => fonts.toLowerCase().includes(f.toLowerCase()));
  if (badFont.length) fail('forbidden-font', { resolved: badFont, sample: fonts }, theme);

  // CHECK 7 — charts monochrome: distinct non-grey, non-Beitar, non-brick hues in chart fills
  const hues = await page.evaluate(() => {
    const set = new Set();
    document.querySelectorAll('svg [fill], svg [stroke]').forEach((el) => {
      ['fill', 'stroke'].forEach((p) => {
        const c = getComputedStyle(el)[p]; const m = c && c.match(/\d+/g); if (!m || m.length < 3) return;
        const [r, g, b] = m.map(Number); const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        if (mx - mn < 24) return;                                   // grey/ink — ignore
        if (r > 230 && g > 180 && b < 60) return;                   // Beitar
        if (r > 140 && r < 200 && g < 120 && b < 100) return;       // loss brick
        set.add(`${Math.round(r / 40)}-${Math.round(g / 40)}-${Math.round(b / 40)}`);
      });
    });
    return set.size;
  });
  if (hues > T.max_chart_hues) fail('chart-rainbow', { distinct_hues: hues, max: T.max_chart_hues }, theme);

  // CHECK 8 — motion present on drill + a reduced-motion branch exists
  const motion = await page.evaluate(() => {
    let anim = false;
    document.querySelectorAll('.acc-content').forEach((el) => { if (getComputedStyle(el).animationName !== 'none') anim = true; });
    let reduced = false;
    for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (r.cssText.includes('prefers-reduced-motion')) reduced = true; } catch {} }
    return { anim, reduced };
  });
  if (!motion.anim) fail('motion-absent', { detail: 'no animation on drill content' }, theme);
  if (!motion.reduced) fail('motion-no-fallback', { detail: 'no prefers-reduced-motion rule' }, theme);

  // CHECK 9 — behaviour: console errors + the theme control actually works
  if (consoleErrors.length) fail('console-error', { errors: consoleErrors.slice(0, 6) }, theme);
  const toggleWorks = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /theme/i.test(b.textContent || ''));
    if (!btn) return false;
    const before = document.documentElement.getAttribute('data-theme');
    btn.click();
    const after = document.documentElement.getAttribute('data-theme');
    if (before !== after) { btn.click(); return true; }
    return false;
  });
  if (!toggleWorks) fail('dead-control', { detail: 'theme toggle did not change data-theme' }, theme);

  report.pages++;
  await page.close();
}
await browser.close();

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(report, null, 2));
const reasons = report.failing_nodes.map((f) => f.id).concat(report.checks.map((c) => c.check + (c.theme ? ':' + c.theme : '')));
console.log(`[ILLUMINATE:RENDERGATE] pages:${report.pages} ${report.pass ? 'pass' : 'FAIL ' + [...new Set(reasons)].slice(0, 30).join(',')}`);
if (!report.pass) console.log(`  failing nodes: ${report.failing_nodes.length} | failing checks: ${report.checks.length}`);
process.exit(report.pass ? 0 : 1);
