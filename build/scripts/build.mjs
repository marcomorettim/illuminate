// Stages 5-6 — Assemble & bundle. Composes the manifest + agent node outputs into the React
// app's generated files (content.ts, evidence.ts), builds code/faceted-grid components verbatim
// from the source spans (no agent, no fabrication), then vite-builds to one offline HTML.
// Usage: node build.mjs <manifest.json> <source-model.json> <nodes-dir> <app-dir> <out.html>
import { readFileSync, writeFileSync, readdirSync, existsSync, copyFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';

const [manifestPath, modelPath, nodesDir, appDir, outHtml] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const model = JSON.parse(readFileSync(modelPath, 'utf8'));

// ── evidence map: S-NNN -> {source heading, verbatim span text} ──
const EVIDENCE = {};
for (const s of model.sections) if (s.trace) EVIDENCE[s.trace] = { source: s.heading, text: s.text.slice(0, 900) };

// ── collect agent node outputs ──
const bodies = {}, compData = {};
if (existsSync(nodesDir)) for (const f of readdirSync(nodesDir).filter((x) => x.endsWith('.json'))) {
  const o = JSON.parse(readFileSync(join(nodesDir, f), 'utf8'));
  if (o.driver) bodies[o.driver.id] = o.driver.body || '';
  for (const m of o.mechanisms || []) { bodies[m.id] = m.body || ''; if (m.component_data) compData[m.id] = m.component_data; }
  if (o.component_data) compData[(o.driver || {}).id] = o.component_data;   // domain/GT-level payloads
}

// ── minimal md -> html (paragraphs, bold, bullets, [S-NNN] cites) ──
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function mdToHtml(md) {
  if (!md) return '';
  const out = [];
  for (const block of md.trim().split(/\n\s*\n/)) {
    const lines = block.split('\n');
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push('<ul>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*[-*]\s+/, '')) + '</li>').join('') + '</ul>');
    } else {
      out.push('<p>' + inline(block.replace(/\n/g, ' ')) + '</p>');
    }
  }
  return out.join('');
  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(S-[A-Za-z0-9]+)\]/g, '<button class="cite" data-cite="$1">$1</button>');
  }
}

// ── One-Dark highlighter (SQL / pseudocode / config) — enough tokens for the panel look ──
const KW = /\b(SELECT|FROM|WHERE|GROUP|BY|ORDER|JOIN|LEFT|RIGHT|INNER|ON|AS|WITH|CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|OVER|PARTITION|HAVING|LIMIT|def|return|if|elif|else|for|while|in|import|from|const|let|var|function|class|new|await|async|yield|lambda|map|filter|reduce)\b/g;
function highlight(code) {
  return esc(code).split('\n').map((line) => {
    const cm = line.match(/^(\s*)(--|#|\/\/)(.*)$/);
    if (cm) return cm[1] + '<span class="c">' + cm[2] + cm[3] + '</span>';
    return line
      .replace(/(&#39;|')(.*?)\1/g, '<span class="s">$1$2$1</span>')
      .replace(/(&quot;|")(.*?)\1/g, '<span class="s">$1$2$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="nu">$1</span>')
      .replace(KW, '<span class="k">$&</span>');
  }).join('\n');
}

// ── source table rows -> TableT (detect financial-negative columns) ──
function parseTable(rows) {
  if (!rows || !rows.length) return null;
  const cols = rows[0];
  const body = rows.slice(1).map((r) => r.map((c) => c.trim()));
  const negCols = [];
  for (let i = 0; i < cols.length; i++) if (body.some((r) => /−|\(\d/.test(r[i] || ''))) negCols.push(i);
  return { cols: cols.map((c) => c.trim()), rows: body, negCols };
}

// GT front-matter "answer" span, used as the GT lede if no agent developed it (verbatim = preservation)
const answerSec = model.sections.find((s) => /answer/i.test(s.heading) && s.text.trim());

function buildComponent(node) {
  const rc = node.required_component; if (!rc) return null;
  const sp = node.source_span || {};
  if (rc.family === 'network') {
    const data = compData[node.id] || {
      hub: { label: (manifest.meta.title || 'GT').slice(0, 3), sub: 'the moat' },
      spokes: manifest.roots.map((r) => ({ label: r, sub: manifest.nodes[r].path[manifest.nodes[r].path.length - 1] })),
      caption: 'every feed is also a return — no domain a leaf',
    };
    return { family: 'network', data };
  }
  if (rc.family === 'code') {
    const code = (sp.code && sp.code[0]) || '';
    if (!code.trim()) return compData[node.id] ? { family: 'code', data: compData[node.id] } : null;
    return { family: 'code', data: { file: node.path[node.path.length - 1].slice(0, 46), lines: highlight(code) } };
  }
  if (rc.family === 'faceted-grid') {
    const t = parseTable(sp.tables && sp.tables[0]);
    return t ? { family: 'faceted-grid', data: t } : null;
  }
  // bespoke families: use the agent's traced data payload if present
  return compData[node.id] ? { family: rc.family, data: compData[node.id] } : null;
}

// ── assemble content.ts nodes ──
const nodesOut = {};
for (const n of Object.values(manifest.nodes)) {
  // GT/domain ledes fall back to the source's OWN intro span — preservation, not compression
  let raw = bodies[n.id];
  if (!raw && n.level === 1 && answerSec) raw = answerSec.text;
  if (!raw && n.level === 2 && n.source_span && n.source_span.text) raw = n.source_span.text;
  nodesOut[n.id] = {
    id: n.id, level: n.level, parent: n.parent, path: n.path, title: n.title,
    body: mdToHtml(raw || ''),
    finding: n.finding || undefined,
    component: buildComponent(n) || undefined,
    children: n.children || [],
  };
}
const content = {
  meta: { source: manifest.meta.source, governing_thought: manifest.meta.governing_thought,
          title: manifest.meta.title, kicker: manifest.meta.kicker },
  nodes: nodesOut, roots: manifest.roots,
};

writeFileSync(join(appDir, 'src/content.ts'),
  `// GENERATED by build.mjs — do not edit.\nimport { Manifest } from './types';\nexport const manifest: Manifest = ${JSON.stringify(content)};\n`);
writeFileSync(join(appDir, 'src/evidence.ts'),
  `// GENERATED by build.mjs — do not edit.\nexport const EVIDENCE: Record<string,{source:string;text:string}> = ${JSON.stringify(EVIDENCE)};\n`);

// ── bundle ──
execSync('node_modules/.bin/vite build', { cwd: appDir, stdio: 'inherit' });
copyFileSync(join(appDir, 'dist/index.html'), outHtml);
const kb = (readFileSync(outHtml).length / 1024).toFixed(1);
console.log(`[build] assembled ${Object.keys(nodesOut).length} nodes, ${Object.values(nodesOut).filter((n) => n.component).length} components -> ${outHtml} (${kb} KB)`);
