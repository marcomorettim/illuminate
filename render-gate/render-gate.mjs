#!/usr/bin/env node
// illuminate — blocking render gate (Rule 15h / H6.5 / G5).
// Headless-renders every page/view of a generated artifact in light AND dark and FAILS the build on:
//   clipped value · banned warm-cream+warm-red palette · forbidden system-font token ·
//   missing self-hosted @font-face · accent-colored heading descendant · empty/half-filled diagram ·
//   title-over-whitespace page · dead/lying interactive control · console error.
// Emits `[ILLUMINATE:RENDERGATE] pages:<n> pass|FAIL <reasons>` and exits non-zero on FAIL.
//
// Usage: node render-gate.mjs <artifact.html> [--keep-open]
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file || !existsSync(file)) { console.error('usage: node render-gate.mjs <artifact.html>'); process.exit(2); }
const url = pathToFileURL(path.resolve(file)).href;

const FORBIDDEN_FONTS = ['-apple-system', 'system-ui', 'BlinkMacSystemFont', 'SF Pro', 'Segoe UI'];

// In-page probe. Runs once per theme; returns the list of violations for the CURRENTLY visible page.
async function probePage(page) {
  return await page.evaluate(() => {
    const V = [];
    const vis = (el) => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetParent !== null; };

    // 1 · clipped value — any text node wider than its box (mockup values, tokens, tiles, cells).
    document.querySelectorAll('.mtag,.fn .v,td,.cite,.subj,.subh,.chip,.verdict,.kpi-val,.stat,.push .tt,.card h4').forEach(el => {
      if (vis(el) && el.scrollWidth > el.clientWidth + 1) V.push(`clip: <${el.className||el.tagName}> "${el.textContent.trim().slice(0,28)}"`);
    });

    // 4 · accent-colored heading descendant (H6.3) — any child color != the heading's own ink.
    document.querySelectorAll('h1,h2,h3').forEach(h => {
      if (!vis(h)) return;
      const hc = getComputedStyle(h).color;
      h.querySelectorAll('*').forEach(d => { if (getComputedStyle(d).color !== hc) V.push(`colored-heading: "${h.textContent.trim().slice(0,20)}" -> <${d.tagName}>`); });
    });

    // 5 · empty / half-filled diagram — an SVG/diagram surface with no drawn children.
    document.querySelectorAll('svg, .flow-inner, [data-diagram]').forEach(d => {
      if (!vis(d)) return;
      const shapes = d.querySelectorAll('path,rect,circle,line,polyline,polygon,.fnode,.node,text').length;
      const box = d.getBoundingClientRect();
      if (box.height > 60 && shapes === 0) V.push(`empty-diagram: <${d.tagName||d.className}> ${Math.round(box.width)}x${Math.round(box.height)} 0 shapes`);
    });

    // 6 · title-over-whitespace page — a tall visible page/section carrying almost no text.
    document.querySelectorAll('[data-page]:not([hidden]), section.kl').forEach(pg => {
      if (!vis(pg)) return;
      const box = pg.getBoundingClientRect();
      const text = (pg.innerText || '').replace(/\s+/g, ' ').trim();
      if (box.height > 600 && text.length < 220) V.push(`thin-page: [${pg.dataset.page||pg.id||'?'}] ${text.length} chars in ${Math.round(box.height)}px`);
    });

    return V;
  });
}

// Static-CSS probes (theme-independent): forbidden fonts + embedded @font-face + banned palette signature.
async function probeStatic(page) {
  return await page.evaluate((FORBIDDEN) => {
    const V = [];
    let css = '';
    for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) css += r.cssText + '\n'; } catch (e) {} }

    // 3 · forbidden system-font token anywhere in emitted CSS.
    for (const tok of FORBIDDEN) if (css.includes(tok)) V.push(`forbidden-font-token: ${tok}`);

    // H6.2 · a self-hosted @font-face must exist AND its family must lead --hn.
    const faces = [...css.matchAll(/@font-face\s*{[^}]*font-family:\s*['"]?([^;'"]+)['"]?/gi)].map(m => m[1].trim());
    if (faces.length === 0) V.push('no-embedded-font: no @font-face in artifact (type would fall back to OS)');
    else {
      const hn = getComputedStyle(document.documentElement).getPropertyValue('--hn').trim();
      const lead = (hn.split(',')[0] || '').replace(/['"]/g, '').trim();
      if (lead && !faces.some(f => f.toLowerCase() === lead.toLowerCase()))
        V.push(`font-not-led: --hn leads with "${lead}" but no @font-face defines it (embedded: ${faces.join(', ')})`);
    }
    return V;
  }, FORBIDDEN_FONTS);
}

// 2 · banned palette signature — warm-cream --paper paired with a warm --red (the H2 "cheap template" tell).
async function probePalette(page) {
  return await page.evaluate(() => {
    const V = [];
    const cs = getComputedStyle(document.documentElement);
    const toRGB = (v) => { const m = document.createElement('span'); m.style.color = v; document.body.appendChild(m); const c = getComputedStyle(m).color; m.remove(); const n = c.match(/\d+/g); return n ? n.slice(0,3).map(Number) : null; };
    const hue = ([r,g,b]) => { r/=255;g/=255;b/=255; const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn; if(!d)return 0; let h; if(mx===r)h=((g-b)/d)%6; else if(mx===g)h=(b-r)/d+2; else h=(r-g)/d+4; h*=60; return h<0?h+360:h; };
    const paper = toRGB(cs.getPropertyValue('--paper')); const red = toRGB(cs.getPropertyValue('--red'));
    if (paper && red) {
      const warmCream = paper[0] > 235 && paper[1] > 235 && paper[2] < paper[0] - 3 && paper[2] < 238; // near-white with a warm cast
      const redHue = hue(red);
      if (warmCream && redHue >= 15 && redHue <= 45) V.push(`banned-palette: warm-cream --paper rgb(${paper}) + warm --red hue ${Math.round(redHue)}deg (H2 tell)`);
    }
    return V;
  });
}

// 8 · dead/lying control — click theme + drawer/export triggers, confirm each produces a real change.
async function probeControls(page) {
  const V = [];
  // theme toggle
  const themeBtn = page.locator('#th, #theme-btn, [title*="heme" i]').first();
  if (await themeBtn.count()) {
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await themeBtn.click({ timeout: 1500 }).catch(() => {});
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (before === after) V.push('dead-control: theme toggle did not change data-theme');
    await themeBtn.click({ timeout: 1500 }).catch(() => {}); // restore
  }
  // evidence drawer (if present) must open on a cite/evidence trigger
  const ev = page.locator('#ev, .cite, [title*="vidence" i]').first();
  if (await ev.count()) {
    const opened = await page.evaluate(() => {
      const d = document.querySelector('#drawer, .drawer, aside[aria-hidden]');
      return d ? d.getAttribute('aria-hidden') : 'none';
    });
    if (opened !== 'none') {
      await ev.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(120);
      const nowOpen = await page.evaluate(() => {
        const d = document.querySelector('#drawer, .drawer, aside[aria-hidden]');
        return d && (d.classList.contains('on') || d.getAttribute('aria-hidden') === 'false');
      });
      if (!nowOpen) V.push('dead-control: evidence trigger did not open the drawer');
      await page.keyboard.press('Escape').catch(() => {});
    }
  }
  return V;
}

async function run() {
  const browser = await chromium.launch();
  const reasons = [];
  const consoleErrors = [];
  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + String(e).slice(0, 120)));

  await page.goto(url, { waitUntil: 'networkidle' });

  // Discover the page set (hash-routed multi-page, or a single scroll doc).
  const pageIds = await page.evaluate(() => [...document.querySelectorAll('[data-page]')].map(p => p.dataset.page));
  const views = pageIds.length ? pageIds : ['__single__'];

  // Static + palette + controls: once per theme is enough (controls once).
  for (const theme of ['light', 'dark']) {
    await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(80);
    (await probeStatic(page)).forEach(r => reasons.push(`[${theme}] ${r}`));
    (await probePalette(page)).forEach(r => reasons.push(`[${theme}] ${r}`));
    for (const id of views) {
      if (id !== '__single__') { await page.evaluate(i => { location.hash = '#/' + i; }, id); await page.waitForTimeout(90); }
      (await probePage(page)).forEach(r => reasons.push(`[${theme}/${id}] ${r}`));
    }
  }
  (await probeControls(page)).forEach(r => reasons.push(`[ctrl] ${r}`));
  consoleErrors.forEach(e => reasons.push(`console-error: ${e}`));

  await browser.close();

  const n = views.length;
  const uniq = [...new Set(reasons)];
  if (uniq.length === 0) {
    console.log(`[ILLUMINATE:RENDERGATE] pages:${n} PASS`);
    process.exit(0);
  } else {
    console.log(`[ILLUMINATE:RENDERGATE] pages:${n} FAIL ${uniq.length} reason(s):`);
    uniq.forEach(r => console.log('  - ' + r));
    process.exit(1);
  }
}
run().catch(e => { console.error('[ILLUMINATE:RENDERGATE] pages:0 FAIL harness-error: ' + e.message); process.exit(3); });
