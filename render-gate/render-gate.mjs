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

const FORBIDDEN_FONTS = ['-apple-system', 'system-ui', 'BlinkMacSystemFont', 'SF Pro', 'Segoe UI', 'Futura'];

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

    // G · Beitar is a MARK, never text or a wash behind text. Yellow fails as text — so this fires
    // only when the accent (--red) is bright yellow (the Beitar case); legible red/other accents pass.
    (() => {
      const acc = getComputedStyle(document.documentElement).getPropertyValue('--red').trim();
      const m = document.createElement('span'); m.style.color = acc; document.body.appendChild(m);
      const c = getComputedStyle(m).color; m.remove();
      const n = (c.match(/\d+/g) || []).slice(0,3).map(Number); if (n.length < 3) return;
      const [r,g,b] = n; const mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx - mn;
      let h = 0; if (d) { h = mx===r ? ((g-b)/d)%6 : mx===g ? (b-r)/d+2 : (r-g)/d+4; h*=60; if (h<0) h+=360; }
      const isBeitarYellow = h >= 38 && h <= 62 && mx > 200 && b < 140; // bright warm yellow
      if (!isBeitarYellow) return;
      const same = (x) => { const q = (x.match(/\d+/g)||[]).slice(0,3).map(Number); return q.length===3 && Math.abs(q[0]-r)<10 && Math.abs(q[1]-g)<10 && Math.abs(q[2]-b)<10; };
      document.querySelectorAll('body *').forEach(el => {
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'SVG' || !vis(el)) return;
        // the element's OWN direct text (not descendants), so a yellow-coloured eyebrow div is caught
        const own = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        if (own.length >= 12 && same(getComputedStyle(el).color)) V.push(`beitar-as-text: <${el.tagName.toLowerCase()}.${(el.className||'').split(' ')[0]}> "${own.slice(0,24)}"`);
        const box = el.getBoundingClientRect();
        if ((el.innerText||'').trim().length >= 12 && box.width*box.height > 9000 && same(getComputedStyle(el).backgroundColor))
          V.push(`beitar-wash-behind-text: <${el.tagName.toLowerCase()}> ${Math.round(box.width)}x${Math.round(box.height)}`);
        // §3.1a — text/glyph ON a solid Beitar fill must be FIXED dark ink, never near-white (the dark-mode bug).
        // Only a near-opaque fill counts (a faint alpha tint with ink text stays legible).
        const bgc = getComputedStyle(el).backgroundColor; const bgn = (bgc.match(/[\d.]+/g)||[]).map(Number);
        const bgOpaque = bgn.length < 4 || bgn[3] >= 0.6;
        if (bgOpaque && same(bgc) && (el.innerText||'').trim().length >= 1) {
          const fg = (getComputedStyle(el).color.match(/\d+/g)||[]).slice(0,3).map(Number);
          if (fg.length === 3) { const lum = 0.2126*fg[0] + 0.7152*fg[1] + 0.0722*fg[2];
            if (lum > 120) V.push(`beitar-foreground: near-white text (lum ${Math.round(lum)}) on a Beitar fill <${el.tagName.toLowerCase()}.${(el.className||'').split(' ')[0]}> — use fixed #141210`); }
        }
      });
    })();

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
  const page = await browser.newPage({ viewport: { width: 1512, height: 982 } }); // §4: wide, so dead margins show
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
      // §4 · FILL THE CANVAS — on a wide viewport the content must use the width, not float in one
      // narrow centred column. Fires only on the egregious case (content < 62% of the viewport).
      if (theme === 'light') {
        const dm = await page.evaluate(() => {
          const vw = window.innerWidth;
          const els = [...document.querySelectorAll('main *, [data-page] *')].filter(e => {
            const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden') return false;
            return (e.innerText || '').trim().length > 0 || /TABLE|SVG|FIGURE/.test(e.tagName);
          });
          if (!els.length) return null;
          let L = Infinity, R = -Infinity;
          els.forEach(e => { const b = e.getBoundingClientRect(); if (b.width < 4) return; L = Math.min(L, b.left); R = Math.max(R, b.right); });
          const used = (R - L) / vw;
          return used < 0.62 ? { used: Math.round(used * 100), vw } : null;
        });
        if (dm) reasons.push(`[layout/${id}] dead-lateral-margins: content uses only ${dm.used}% of a ${dm.vw}px canvas (§4 — fill the canvas)`);
      }
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
