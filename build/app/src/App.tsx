import React, { useEffect, useState } from 'react';
import { EvidenceProvider, Finding, Drill } from './ui';
import { RenderComponent } from './components';
import { manifest } from './content';
import { NodeContent } from './types';

const N = manifest.nodes;
const VIEWS = ['overview', ...manifest.roots];

// ── generated md-body HTML (cites are delegated to EvidenceProvider) ──
function Body({ html }: { html: string }) {
  if (!html) return null;
  return <div className="prose-illum max-w-[74ch]" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ── a node's required component, rendered from its {family, data} spec ──
function NodeComponent({ node }: { node: NodeContent }) {
  if (!node.component) return null;
  return <RenderComponent spec={node.component} />;
}

// a node's OWN developed content (body + component), tagged so the gate counts per-node words
// without double-counting descendants. data-word-floor lets the gate report against the contract.
function NodeBody({ node }: { node: NodeContent }) {
  return (
    <div data-node-body={node.id} data-level={node.level}>
      <Body html={node.body} />
      <NodeComponent node={node} />
    </div>
  );
}

// mechanism (L4) — the leaf: its own developed body + component
function Mechanism({ node }: { node: NodeContent }) {
  return <NodeBody node={node} />;
}

// driver (L3) — own body + component + mechanisms as a nested drill (every mechanism a peer)
function DriverBody({ node }: { node: NodeContent }) {
  const mechs = node.children.map((id) => N[id]).filter(Boolean);
  return (
    <>
      <NodeBody node={node} />
      {mechs.length > 0 && (
        <Drill items={mechs.map((m) => ({
          value: m.id,
          header: <span className="text-[.9rem] font-bold text-ink">{m.title}</span>,
          body: <Mechanism node={m} />,
        }))} />
      )}
    </>
  );
}

// domain (L2) — the view: kicker, headline, lede body, its component, drivers drill, ONE finding
function DomainView({ node }: { node: NodeContent }) {
  const drivers = node.children.map((id) => N[id]).filter(Boolean);
  const n = manifest.roots.indexOf(node.id) + 1;
  return (
    <div className="grid grid-cols-[clamp(48px,6vw,90px)_1fr] gap-x-6 lg:gap-x-10">
      <div>
        <div className="font-ft font-bold text-[clamp(2.4rem,5vw,4.4rem)] leading-[.8] tracking-tighter text-ink">{String(n).padStart(2, '0')}</div>
        <div className="font-ft font-bold text-[.56rem] tracking-[.12em] uppercase text-ink-3 mt-2">{node.path[node.path.length - 1]}</div>
      </div>
      <div className="min-w-0">
        <div className="font-ft font-bold text-[.7rem] tracking-[.14em] uppercase text-ink-2 flex items-center gap-3">
          <span>{node.path.join(' · ')}</span>
          <span className="flex-1 h-px bg-rule-hi max-w-[220px]" />
        </div>
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-tight text-ink mt-3 max-w-[26ch]">{node.title}</h2>
        <NodeBody node={node} />

        <div className="flex items-baseline gap-2.5 flex-wrap mb-2 pb-2 border-b border-rule mt-9">
          <span className="font-ft font-bold text-[.62rem] tracking-[.1em] uppercase text-ink-3">The drivers</span>
          <h3 className="text-[1.05rem] font-bold tracking-tight text-ink">Every driver developed to the mechanism level</h3>
        </div>
        <p className="text-[.78rem] text-ink-3 max-w-[70ch]">Expand each driver, then each mechanism — the argument descends four levels, and every sibling is developed to the same depth.</p>
        <Drill items={drivers.map((d) => ({
          value: d.id,
          header: <span className="text-[.98rem] font-bold text-ink">{d.title}</span>,
          body: <DriverBody node={d} />,
        }))} />

        {(node.finding || node.finding_full) && (
          <>
            <div className="flex items-baseline gap-2.5 flex-wrap mb-2 pb-2 border-b border-rule mt-9">
              <span className="font-ft font-bold text-[.62rem] tracking-[.1em] uppercase text-ink-3">What's true vs what counts</span>
            </div>
            {node.finding_full && <div className="prose-illum max-w-[74ch]" dangerouslySetInnerHTML={{ __html: node.finding_full }} />}
            {node.finding && <p className="text-[.9rem] text-ink-2 max-w-[70ch] mt-3">The decisive lever — <Finding>{node.finding}</Finding></p>}
          </>
        )}
      </div>
    </div>
  );
}

function Overview() {
  const gt = N['GT'];
  return (
    <div>
      <div className="font-ft font-bold text-[.7rem] tracking-[.16em] uppercase text-ink-2 flex items-center gap-3">
        <span>{manifest.meta.kicker}</span><span className="flex-1 h-px bg-rule-hi max-w-[420px]" />
      </div>
      {/* canvas-filling two-column: GT reading measure + the flywheel/marginalia aside (§4) */}
      <div data-node-body="GT" data-level={1} className="grid xl:grid-cols-[1.45fr_1fr] gap-8 xl:gap-14 mt-6 items-start">
        <div>
          <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold tracking-tight text-ink max-w-[20ch]">{manifest.meta.governing_thought}</h1>
          {gt && <div className="prose-illum max-w-[68ch] mt-4" dangerouslySetInnerHTML={{ __html: gt.body }} />}
        </div>
        <div className="xl:sticky xl:top-8 border border-rule rounded-lg p-5 bg-paper-1">
          <div className="font-ft font-bold text-[.56rem] tracking-[.14em] uppercase text-ink-3 mb-1">The one moat, six feeders</div>
          {gt && gt.component && <RenderComponent spec={gt.component} />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-12">
        {manifest.roots.map((id, i) => {
          const d = N[id];
          return (
            <a key={id} href={'#/' + id} className="border border-rule rounded-lg p-4 bg-paper-1 hover:border-ink transition-colors block">
              <div className="font-ft font-bold text-[.56rem] tracking-[.12em] uppercase text-ink-3">{String(i + 1).padStart(2, '0')} · {d.path[d.path.length - 1]}</div>
              <div className="text-[.98rem] font-bold text-ink mt-1 leading-snug">{d.title}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function useRoute() {
  const [v, setV] = useState(() => location.hash.replace('#/', '') || 'overview');
  useEffect(() => {
    const on = () => setV(location.hash.replace('#/', '') || 'overview');
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return VIEWS.includes(v) ? v : 'overview';
}

// ── self-contained download: rebuild the ORIGINAL bootable doc from inline style + IIFE script ──
function buildStandalone(): string {
  const style = [...document.querySelectorAll('style')].map((s) => s.outerHTML).join('\n');
  const scripts = [...document.querySelectorAll('script')];
  const boot = scripts.find((s) => /data-theme/.test(s.textContent || ''));
  const app = scripts.filter((s) => s !== boot).sort((a, b) => (b.textContent || '').length - (a.textContent || '').length)[0];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<title>${manifest.meta.title}</title>${style}</head><body><div id="root"></div>`
    + (boot ? `<script>${boot.textContent}</script>` : '')
    + `<script>${app?.textContent || ''}</script></body></html>`;
}
function saveSelf(toast: (m: string) => void) {
  try {
    const blob = new Blob([buildStandalone()], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = manifest.meta.source.replace(/\.\w+$/, '') + '.html';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Downloaded — offline HTML saved.');
  } catch {
    const w = window.open('', '_blank');
    if (w) { w.document.write(buildStandalone()); w.document.close(); toast('Opened in a new tab — use ⌘S to save.'); }
    else toast('Download blocked by the sandbox.');
  }
}

export default function App() {
  const v = useRoute();
  const [msg, setMsg] = useState('');
  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3200); };
  const toggle = () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('illum-theme', next); } catch {}
  };
  return (
    <EvidenceProvider>
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] min-h-screen">
        <nav className="lg:sticky lg:top-0 lg:h-screen border-b lg:border-b-0 lg:border-r border-rule p-4 lg:py-8 flex lg:flex-col gap-1 overflow-x-auto">
          <a href="#/overview" className="font-ft font-bold text-[.66rem] tracking-[.12em] uppercase text-ink mb-2 shrink-0">{manifest.meta.title}</a>
          {VIEWS.map((id) => {
            const label = id === 'overview' ? 'Overview' : (manifest.roots.indexOf(id) + 1).toString().padStart(2, '0') + ' ' + (N[id]?.path.slice(-1)[0] ?? id);
            return <a key={id} href={'#/' + id} className={`font-ft text-[.68rem] tracking-wide py-1 px-2 rounded shrink-0 ${v === id ? 'bg-beitar [color:#141210] font-bold' : 'text-ink-2 hover:text-ink'}`}>{label}</a>;
          })}
          <div className="lg:mt-auto flex lg:flex-col gap-1 shrink-0">
            <button onClick={() => saveSelf(toast)} title="Download offline HTML" className="font-ft text-[.68rem] tracking-wide py-1 px-2 rounded text-ink-2 hover:text-ink border border-rule-hi text-left">↓ Download</button>
            <button onClick={toggle} title="Toggle theme" className="font-ft text-[.68rem] tracking-wide py-1 px-2 rounded text-ink-2 hover:text-ink border border-rule-hi text-left">◑ Theme</button>
          </div>
        </nav>
        <main className="p-6 md:p-10 xl:p-16 min-w-0 max-w-[1500px]">
          {v === 'overview' ? <Overview /> : N[v] ? <DomainView node={N[v]} /> : <Overview />}
        </main>
      </div>
      {msg && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-ink text-paper text-[.8rem] font-ft px-4 py-2 rounded-md shadow-lg">{msg}</div>}
    </EvidenceProvider>
  );
}
