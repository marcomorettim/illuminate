import { useState, useEffect } from 'react';
import model from './model.json';
import { RenderComponent } from './catalog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';

// The generic, agnostic renderer: a deterministic walk of argument-model.json. Every label comes
// from the model; nothing here is keyed to any document. It also exposes the render gate's DOM
// contract — data-node-body/data-level per node, <main>, data-component (via catalog), hash nav,
// and a data-theme toggle — so the executed gate can measure it.
type Node = {
  id: string; level: number; parent: string | null; path: string[]; title: string;
  developed_content?: string; finding?: string | null; finding_full?: string | null;
  component?: { family: string; data: any } | null; children: string[];
};
const M = model as any;
const N: Record<string, Node> = M.nodes;
const roots: string[] = M.roots;

// adapter: an older code component may carry {lines} instead of the catalogue's {code}
function norm(spec: Node['component']) {
  if (!spec) return null;
  if (spec.family === 'code' && spec.data && !spec.data.code && spec.data.lines)
    return { family: 'code', data: { file: spec.data.file, code: spec.data.lines, finding: spec.data.finding } };
  return spec;
}
const Html = ({ html }: { html?: string | null }) =>
  html ? <div className="prose-illuminate" dangerouslySetInnerHTML={{ __html: html }} /> : null;

// every node's developed prose (reading-width) + its chosen component (full-width, fills the canvas)
function NodeBody({ node }: { node: Node }) {
  return (
    <div data-node-body={node.id} data-level={node.level}>
      <div className="max-w-[74ch]"><Html html={node.developed_content} /></div>
      {node.component && <RenderComponent spec={norm(node.component) as any} />}
    </div>
  );
}

function Mechanism({ node }: { node: Node }) {
  return (
    <div className="mt-6 pt-4 border-t border-dashed border-rule">
      <div className="font-ft text-[11px] tracking-[.12em] uppercase text-cenere mb-2">{node.title}</div>
      <NodeBody node={node} />
    </div>
  );
}

function DomainView({ node }: { node: Node }) {
  const drivers = node.children.map((c) => N[c]).filter(Boolean);
  return (
    <div>
      <div className="font-ft text-[12px] tracking-[.16em] uppercase text-cenere mb-3">{node.path.slice(0, -1).join(' · ')}</div>
      <h1 className="font-bold text-[40px] leading-[1.05] tracking-tight mb-5 max-w-[22ch]">{node.title}</h1>
      {node.finding && (
        <div className="inline-block mb-5 font-ft text-[13px] font-bold px-2 py-0.5 rounded" style={{ background: '#FFCC00', color: '#141210' }}>{node.finding}</div>
      )}
      <div data-node-body={node.id} data-level={node.level} className="grid md:grid-cols-[1fr_300px] gap-10 items-start">
        <div className="max-w-[70ch]"><Html html={node.developed_content} /></div>
        {node.component && <aside>{<RenderComponent spec={norm(node.component) as any} />}</aside>}
      </div>
      <Accordion type="multiple" defaultValue={[]} className="mt-8">
        {drivers.map((d) => {
          const mechs = d.children.map((c) => N[c]).filter(Boolean);
          return (
            <AccordionItem key={d.id} value={d.id}>
              <AccordionTrigger><span className="font-bold text-[22px] tracking-tight text-left">{d.title}</span></AccordionTrigger>
              <AccordionContent>
                <NodeBody node={d} />
                {mechs.map((mn) => <Mechanism key={mn.id} node={mn} />)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function Overview() {
  const gt = Object.values(N).find((n) => n.level === 1);
  return (
    <div>
      <div className="font-ft text-[12px] tracking-[.16em] uppercase text-cenere mb-3">{M.meta?.kicker || M.meta?.title}</div>
      <h1 className="font-bold text-[46px] leading-[1.03] tracking-tight mb-6 max-w-[24ch]">{M.meta?.title}</h1>
      <div data-node-body={gt?.id || 'GT'} data-level={1} className="grid md:grid-cols-[1fr_360px] gap-12 items-start">
        <div>
          <p className="text-[19px] leading-[1.55] max-w-[62ch] mb-5 font-medium">{M.governing_thought}</p>
          {gt && <Html html={gt.developed_content} />}
        </div>
        {gt?.component && <aside>{<RenderComponent spec={norm(gt.component) as any} />}</aside>}
      </div>
    </div>
  );
}

function useHashView() {
  const read = () => { const h = location.hash.replace(/^#\//, ''); return h && N[h] ? h : 'overview'; };
  const [view, setView] = useState(read);
  useEffect(() => {
    const on = () => setView(read());
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return view;
}

export default function App() {
  const view = useHashView();
  const go = (v: string) => { location.hash = '#/' + v; };
  const toggleTheme = () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('illum-theme', next); } catch {}
  };
  return (
    <div className="min-h-screen bg-paper text-ink font-hn">
      <div className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur">
        <div className="mx-auto px-8 h-14 flex items-center gap-6" style={{ maxWidth: 1440 }}>
          <span className="font-ft font-bold tracking-[.16em] text-[13px] uppercase">{(M.meta?.title || 'illuminate').split('—')[0].trim()}</span>
          <button onClick={toggleTheme} className="ml-auto font-ft text-[11px] uppercase tracking-wider border border-rule px-3 py-1.5 rounded hover:border-ink">Theme</button>
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr]" style={{ maxWidth: 1440 }}>
        <aside className="hidden lg:block border-r border-rule">
          <nav className="sticky top-[56px] px-6 py-8 space-y-1">
            <button onClick={() => go('overview')} className={`block w-full text-left py-1.5 text-[13.5px] ${view === 'overview' ? 'text-ink font-semibold' : 'text-ink-2'} hover:text-ink`}>Overview</button>
            {roots.map((r, i) => (
              <button key={r} onClick={() => go(r)} className={`flex gap-3 w-full text-left py-1.5 ${view === r ? 'text-ink font-semibold' : 'text-ink-2'} hover:text-ink`}>
                <span className="font-mono text-[11px] text-cenere w-5">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[13.5px] leading-tight">{N[r].path.slice(-1)[0]}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="px-8 lg:px-14 py-12 min-w-0">
          {view === 'overview' ? <Overview /> : N[view] ? <DomainView node={N[view]} /> : <Overview />}
        </main>
      </div>
    </div>
  );
}
