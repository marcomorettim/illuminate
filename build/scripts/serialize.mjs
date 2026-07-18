// The II→III seam. Merges the manifest (contract) + source-model (evidence) + the develop agents'
// node outputs into ONE argument-model.json (doc §3): every node carries its developed_content,
// its traces, its word_floor, and its component {family, data, finding, evidence_class}. Stage III
// renders ONLY from this file — it never re-derives content, which is what removes the single-pass
// starvation. Usage: node serialize.mjs <manifest.json> <source-model.json> <nodes-dir> <out.json>
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [manifestPath, modelPath, nodesDir, outPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const model = JSON.parse(readFileSync(modelPath, 'utf8'));

// verbatim source, keyed by trace — the argument-model's `sources` array
const sources = model.sections.filter((s) => s.trace).map((s) => ({ id: s.trace, claim: s.heading, text: s.text.slice(0, 900) }));

// agent outputs — accepts {driver, mechanisms:[…]} or a flat {nodes:[…]}. The agent may also emit a
// `component_family` per node; that choice OVERRIDES the manifest's shape hint (Fix B — component
// choice is the develop agent's judgment, not a keyword table).
const bodies = {}, compData = {}, compFamily = {};
if (existsSync(nodesDir)) for (const f of readdirSync(nodesDir).filter((x) => x.endsWith('.json'))) {
  let o;
  try { o = JSON.parse(readFileSync(join(nodesDir, f), 'utf8')); }
  catch (e) { console.warn(`[serialize] SKIP malformed ${f}: ${e.message} — its nodes fall back to source spans`); continue; }
  const rows = o.driver ? [o.driver, ...(o.mechanisms || [])] : (o.nodes || []);
  for (const r of rows) {
    if (!r || !r.id) continue;
    bodies[r.id] = r.body || '';
    if (r.component_data) compData[r.id] = r.component_data;
    if (r.component_family) compFamily[r.id] = r.component_family;
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function mdToHtml(md) {
  if (!md) return '';
  return md.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    if (lines.every((l) => /^\s*[-*]\s+/.test(l)))
      return '<ul>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*[-*]\s+/, '')) + '</li>').join('') + '</ul>';
    return '<p>' + inline(block.replace(/\n/g, ' ')) + '</p>';
  }).join('');
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(S-[A-Za-z0-9]+)\]/g, '<button class="cite" data-cite="$1">$1</button>');
  }
}

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
function parseTable(rows) {
  if (!rows || !rows.length) return null;
  const cols = rows[0], body = rows.slice(1).map((r) => r.map((c) => c.trim()));
  const negCols = [];
  for (let i = 0; i < cols.length; i++) if (body.some((r) => /−|\(\d/.test(r[i] || ''))) negCols.push(i);
  return { cols: cols.map((c) => c.trim()), rows: body, negCols };
}

// code/faceted-grid/kpi-summary render traced/verbatim data → citation chips; the depicting
// families wear the ILLUSTRATION tag (§2.2).
const EVIDENCE_CLASS = { code: 'evidence', 'faceted-grid': 'evidence', 'kpi-summary': 'evidence' };
const initials = (s) => (s || '').split(/\s+/).map((w) => w[0]).join('').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'GT';
function buildComponent(node) {
  // the develop agent's chosen family wins; the manifest shape-hint is the fallback.
  const family = compFamily[node.id] || (node.required_component && node.required_component.family);
  if (!family) return null;
  const sp = node.source_span || {};
  const wrap = (fam, data) => data ? { family: fam, data, evidence_class: EVIDENCE_CLASS[fam] || 'illustrate', finding: (compData[node.id] || {}).finding } : null;
  if (family === 'network') {
    return wrap('network', compData[node.id] || {
      hub: { label: initials(manifest.meta.title), sub: '' },
      spokes: manifest.roots.map((r) => ({ label: r.toUpperCase(), sub: manifest.nodes[r].path.slice(-1)[0] })),
      caption: manifest.meta.connective_label || '',
    });
  }
  if (family === 'code') {
    const code = (sp.code && sp.code[0]) || '';
    if (!code.trim()) return compData[node.id] ? wrap('code', compData[node.id]) : null;
    return wrap('code', { file: node.path.slice(-1)[0].slice(0, 46), lines: highlight(code) });
  }
  if (family === 'faceted-grid') return wrap('faceted-grid', parseTable(sp.tables && sp.tables[0]));
  return compData[node.id] ? wrap(family, compData[node.id]) : null;
}

const nodesOut = {};
for (const n of Object.values(manifest.nodes)) {
  let raw = bodies[n.id];
  if (!raw && n.source_span && n.source_span.text) raw = n.source_span.text;   // fallback: the node's own span
  nodesOut[n.id] = {
    id: n.id, level: n.level, parent: n.parent, path: n.path, title: n.title,
    developed_content: mdToHtml(raw || ''),
    word_floor: n.word_floor, source_words: n.source_words,
    required_component: n.required_component || null,
    component: buildComponent(n),
    finding: n.finding || null, finding_full: n.finding_full ? mdToHtml(n.finding_full) : null,
    cross_feeds: n.cross_feeds || [], traces: (n.source_span || {}).trace || [],
    children: n.children || [],
  };
}

const argumentModel = {
  governing_thought: manifest.meta.governing_thought,
  meta: { source: manifest.meta.source, title: manifest.meta.title, kicker: manifest.meta.kicker,
          connective_label: manifest.meta.connective_label || '', substantive_words: manifest.meta.substantive_words },
  sources, roots: manifest.roots, nodes: nodesOut,
};
writeFileSync(outPath, JSON.stringify(argumentModel, null, 2));
const comps = Object.values(nodesOut).filter((n) => n.component).length;
console.log(`[serialize] argument-model.json: ${Object.keys(nodesOut).length} nodes, ${comps} components, ${sources.length} sources -> ${outPath}`);
