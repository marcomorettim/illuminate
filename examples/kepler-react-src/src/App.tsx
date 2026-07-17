import React, { useEffect, useState } from 'react';
import { ENGINES, IDENTITY, SEQ, SCENARIOS, CONTRIB, Engine, Driver } from './data';
import {
  EvidenceProvider, Cite, CodeBlock, DataTable, Finding, Drill, CountUp,
  Flywheel, ContribBar, Tabs, motion, AnimatePresence, useReducedMotion,
} from './ui';

const VIEWS = ['overview', ...ENGINES.map((e) => e.id), 'synthesis'];
const LABEL: Record<string, string> = {
  overview: 'Overview', synthesis: 'Synthesis',
  mobility: '01 Mobility', energy: '02 Energy', logistics: '03 Logistics',
  payments: '04 Payments', devices: '05 Devices', data: '06 Data/AI',
};

function useRoute() {
  const [v, setV] = useState(() => (location.hash.replace('#/', '') || 'overview'));
  useEffect(() => {
    const on = () => setV(location.hash.replace('#/', '') || 'overview');
    addEventListener('hashchange', on);
    const key = (e: KeyboardEvent) => {
      if (/input|textarea/i.test((e.target as HTMLElement).tagName)) return;
      const i = VIEWS.indexOf(location.hash.replace('#/', '') || 'overview');
      if ((e.key === 'j' || e.key === 'ArrowDown') && i < VIEWS.length - 1) location.hash = '#/' + VIEWS[i + 1];
      if ((e.key === 'k' || e.key === 'ArrowUp') && i > 0) location.hash = '#/' + VIEWS[i - 1];
    };
    addEventListener('keydown', key);
    return () => { removeEventListener('hashchange', on); removeEventListener('keydown', key); };
  }, []);
  return v;
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-[.9rem] leading-relaxed text-ink-2 max-w-[70ch] my-3 [&_b]:text-ink [&_b]:font-bold">{children}</p>;
}
function SubRow({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2.5 flex-wrap mb-2 pb-2 border-b border-rule mt-9">
      <span className="font-ft font-bold text-[.62rem] tracking-[.1em] uppercase text-ink-3">{tag}</span>
      <h3 className="text-[1.05rem] font-bold tracking-tight text-ink">{children}</h3>
    </div>
  );
}

function DriverBody({ d }: { d: Driver }) {
  return (
    <>
      <Prose>{d.body} {d.cite && <Cite id={d.cite} />}</Prose>
      {d.table && <DataTable table={d.table} />}
      <Drill items={d.mechanisms.map((m) => ({
        value: m.id,
        header: <span className="text-[.9rem] font-bold text-ink">{m.title} {m.cite && <Cite id={m.cite} />}</span>,
        body: <><Prose>{m.body}</Prose>{m.table && <DataTable table={m.table} />}{m.code && <CodeBlock code={m.code} />}</>,
      }))} />
    </>
  );
}

function EngineView({ e }: { e: Engine }) {
  return (
    <div className="grid grid-cols-[clamp(48px,6vw,90px)_1fr] gap-x-6 lg:gap-x-10">
      <div>
        <div className="font-ft font-bold text-[clamp(2.4rem,5vw,4.4rem)] leading-[.8] tracking-tighter text-ink">{e.n}</div>
        <div className="font-ft font-bold text-[.56rem] tracking-[.12em] uppercase text-ink-3 mt-2">{e.name}</div>
      </div>
      <div className="min-w-0">
        <div className="font-ft font-bold text-[.7rem] tracking-[.14em] uppercase text-ink-2 flex items-center gap-3">
          <span>Owns {e.term} · standalone: {e.today} · in the flywheel: {e.target}</span>
          <span className="flex-1 h-px bg-rule-hi max-w-[180px]" />
        </div>
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-tight text-ink mt-3 max-w-[26ch]">{e.headline}</h2>
        <p className="text-[clamp(1rem,1.3vw,1.18rem)] leading-relaxed text-ink-2 max-w-[64ch] mt-4 [&_b]:text-ink [&_b]:font-bold">{e.lede} {e.cite && <Cite id={e.cite} />}</p>

        <SubRow tag="The four drivers">Every driver developed to the mechanism level</SubRow>
        <p className="text-[.78rem] text-ink-3 max-w-[70ch]">Expand each driver, then each mechanism — the argument descends four levels, and every sibling is developed to the same depth.</p>
        <Drill items={e.drivers.map((d) => ({
          value: d.id,
          header: <span className="text-[.98rem] font-bold text-ink">{d.title}</span>,
          body: <DriverBody d={d} />,
        }))} />

        <SubRow tag="What counts">Standalone it trails — in the flywheel it is decisive</SubRow>
        <p className="text-[.9rem] leading-relaxed text-ink-2 max-w-[70ch] [&_b]:text-ink [&_b]:font-bold">{e.findingBody} <Finding>{e.finding}</Finding></p>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="max-w-[68ch] xl:max-w-none">
      <div className="font-ft font-bold text-[.7rem] tracking-[.16em] uppercase text-ink-2 flex items-center gap-3">
        <span>Board &amp; Strategy Committee · dual-listing readiness · Office of the CEO</span><span className="flex-1 h-px bg-rule-hi max-w-[220px]" />
      </div>
      <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold tracking-tight text-ink mt-5 max-w-[20ch]">
        Kepler is one flywheel — <b className="text-ink">not six businesses.</b>
      </h1>
      <p className="text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-ink-2 max-w-[64ch] mt-5 [&_b]:text-ink [&_b]:font-bold">
        The market sees a conglomerate — six physical-world businesses stapled together, each trailing a focused specialist, the whole at a ~35% discount to the sum of its parts — and says: break it up. That reading is wrong. Every interaction Kepler touches produces data and network effects no single-vertical rival can assemble, because none touches the physical world across all six surfaces at once. <b>That shared data-and-network moat is the actual asset; the six businesses are the organs that feed it. Break Kepler up and you don’t unlock value — you destroy the only thing that was ever defensible.</b> <Cite id="S-001" />
      </p>

      <div className="border border-rule-hi rounded-lg bg-paper-1 p-4 mt-6 font-mono text-[.86rem] text-ink overflow-x-auto">
        Moat strength &nbsp;<b className="text-ink">M</b>&nbsp; = &nbsp;Interaction density <b className="text-ink">(D)</b>&nbsp; × &nbsp;Data breadth <b className="text-ink">(B)</b>&nbsp; × &nbsp;Network liquidity <b className="text-ink">(L)</b>&nbsp; × &nbsp;Trust <b className="text-ink">(T)</b>
      </div>
      <p className="text-[.82rem] text-ink-2 max-w-[70ch] mt-2">A <b className="text-ink">product</b>, not a sum — the entire strategic point. A conglomerate adds four mediocre terms and gets mediocrity; a flywheel multiplies them, so the weakest term caps the moat and each domain that lifts one term lifts the whole product. <Cite id="S-002" /></p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
        {[
          { k: 'Today', v: <CountUp to={0.14} prefix="−$" decimals={2} className="text-loss" />, p: 'blended contribution / interaction', c: 'S-002' },
          { k: 'Target · 10 yr', v: <CountUp to={0.31} prefix="+$" decimals={2} />, p: 'driven by the moat, not any domain’s margin' },
          { k: 'The discount', v: '~35%', p: 'conglomerate discount the flywheel inverts' },
          { k: 'Prob-weighted', v: <CountUp to={0.24} prefix="+$" decimals={2} />, p: 'a near-free option on the compounding', c: 'S-0sc' },
        ].map((s, i) => (
          <div key={i} className="border border-rule rounded-lg p-4 bg-paper-1">
            <div className="text-[.92rem] font-bold text-ink mb-1">{s.k}</div>
            <div className="font-mono text-[1.4rem] text-ink tracking-tight">{s.v}</div>
            <p className="text-[.8rem] text-ink-2 mt-1">{s.p} {s.c && <Cite id={s.c} />}</p>
          </div>
        ))}
      </div>

      <div className="mt-9">
        <div className="flex items-baseline gap-2.5 flex-wrap mb-2 pb-2 border-b border-rule">
          <span className="font-ft font-bold text-[.62rem] tracking-[.1em] uppercase text-ink-3">The spine</span>
          <h3 className="text-[1.05rem] font-bold tracking-tight text-ink">One moat, four terms, six feeders — three views</h3>
        </div>
      </div>
      <Tabs.Root defaultValue="table" className="mt-3">
        <Tabs.List className="flex gap-1 border border-rule-hi rounded-md w-fit overflow-hidden mb-2 flex-wrap">
          {[['table', 'Cross-feed map'], ['flywheel', 'The flywheel'], ['scen', 'Scenarios']].map(([v, l]) => (
            <Tabs.Trigger key={v} value={v} className="font-ft font-bold text-[.62rem] tracking-wider uppercase px-3 py-1.5 text-ink-3 data-[state=active]:bg-beitar data-[state=active]:[color:#141210]">{l}</Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="table"><DataTable table={IDENTITY} /></Tabs.Content>
        <Tabs.Content value="flywheel"><Flywheel /><p className="text-[.8rem] text-ink-3 max-w-[68ch]">Six nodes, D6 the hub — every feed is also a return. Where a Sankey shows how much each domain feeds the moat, the graph shows the moat feeding each back. <Cite id="S-606" /></p></Tabs.Content>
        <Tabs.Content value="scen">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {SCENARIOS.map((s) => (
              <div key={s.k} className="border border-rule rounded-lg p-4 bg-paper-1">
                <div className="font-mono text-[.62rem] text-ink-3">{s.k}</div>
                <div className={`font-mono text-[1.4rem] my-1 ${s.k.includes('BEAR') ? 'text-loss' : 'text-ink'}`}>{s.v}</div>
                <p className="text-[.78rem] text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-[.86rem] text-ink-2 max-w-[68ch] mt-3">Probability-weighted <b className="text-ink">+$0.24</b>; the asymmetry is the point — upside is a platform premium, downside is the conglomerate Kepler is already priced as. <Finding>a free option on the flywheel</Finding> <Cite id="S-0sc" /></p>
        </Tabs.Content>
      </Tabs.Root>

      <SubRow tag="How to read this">Top-down, then drilled into, then reassembled</SubRow>
      <Prose><b>L1</b> the answer, above — one flywheel; sequencing is the game; M = D×B×L×T · <b>L2</b> the six domains, one page each, naming the term(s) each owns and its cross-links · <b>L3</b> each domain’s four drivers · <b>L4</b> the mechanisms + maps + models + code that prove the compounding. Two instructions: the <b>couplings are the argument</b> — read the six as standalone chapters and you have missed the thesis, which is the wiring between them; and the claim on top is only as strong as the mechanisms four levels down, so descend into whichever domain you most suspect is a story, via the tree at left or the drill-downs within each domain.</Prose>
    </div>
  );
}

function Synthesis() {
  return (
    <div className="max-w-[68ch] xl:max-w-none">
      <div className="font-ft font-bold text-[.7rem] tracking-[.16em] uppercase text-ink-2 flex items-center gap-3"><span>Synthesis · the flywheel reassembled</span><span className="flex-1 h-px bg-rule-hi max-w-[220px]" /></div>
      <h2 className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold tracking-tight text-ink mt-4 max-w-[24ch]">Six feeders, one moat — and the order is the strategy.</h2>
      <p className="text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-ink-2 max-w-[64ch] mt-4">The six domains were argued separately; the thesis is that they do not act separately. The moat is not in any domain — it is in the wiring.</p>

      <SubRow tag="The flywheel">How six feeders compound one moat</SubRow>
      <Flywheel />
      <Prose>Read M = D×B×L×T as a wiring diagram, not an equation to admire. Mobility drives Density and hands its exhaust to everyone; Devices drive Breadth into the models; Logistics drives Liquidity, routed by mobility and cleared by payments; Energy and Payments own Trust from two directions; Data/AI is the hub that ingests all five and serves models back that make all five cheaper, safer, stickier. Spin the domains apart and the cross-feeds sever, the terms stop multiplying, and each orphan reverts to the mediocre specialist it always was. <Cite id="S-606" /></Prose>

      <SubRow tag="Sequencing">The order is the strategy — build the hub before the spokes</SubRow>
      <DataTable table={SEQ} />
      <Prose>The load-bearing decision is Phase I: build the Data/AI platform <b>first</b>, as infrastructure, even at −$420m/yr with no P&amp;L. Sequence it last — the intuitive "prove the businesses, then connect them" — and every domain spends years hoarding data that never compounds, the terms only add, and Kepler is the mediocre conglomerate the market already prices. The counter-intuitive order is the whole thesis. <Cite id="S-seq" /></Prose>

      <SubRow tag="Scenarios">Does the flywheel spin if the world resists?</SubRow>
      <ContribBar today={CONTRIB.today} weighted={CONTRIB.weighted} target={CONTRIB.target} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
        {SCENARIOS.map((s) => (
          <div key={s.k} className="border border-rule rounded-lg p-4 bg-paper-1">
            <div className="font-mono text-[.62rem] text-ink-3">{s.k}</div>
            <div className={`font-mono text-[1.4rem] my-1 ${s.k.includes('BEAR') ? 'text-loss' : 'text-ink'}`}>{s.v}</div>
            <p className="text-[.78rem] text-ink-2">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="text-[.9rem] text-ink-2 max-w-[70ch] mt-3 [&_b]:text-ink [&_b]:font-bold">Probability-weighted <b>+$0.24</b>, and the asymmetry is the point: the fragile part is the flywheel’s <b>legality</b>, not its engineering. <Finding>manage the regulatory risk</Finding> <Cite id="S-0sc" /></p>

      <SubRow tag="The one dependency">What the whole decade hangs on</SubRow>
      <Prose>Everything hangs on one thing the sequencing already named: the Data/AI platform (D6) must be built first and funded through its loss-making years before any cross-feed can flow. It is the hub; without it, the spokes never connect, the terms only add, and the flywheel thesis collapses into the conglomerate it was meant to escape. Every other decision can slip a year; this one cannot — and it is the one an impatient board staring at a −$420m cost centre will most want to cut. <b>Cutting it is not a cost saving. It is choosing to be a conglomerate.</b> <Cite id="S-dep" /></Prose>
    </div>
  );
}

function TreeRail({ view }: { view: string }) {
  return (
    <nav className="text-[.8rem] sticky top-[64px] self-start hidden lg:block">
      <a href="#/overview" className={`block py-1 font-ft font-bold text-[.66rem] tracking-wider uppercase ${view === 'overview' ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}>◆ The flywheel thesis</a>
      <div className="mt-2 border-l border-rule pl-3 flex flex-col gap-0.5">
        {ENGINES.map((e) => (
          <div key={e.id}>
            <a href={'#/' + e.id} className={`block py-1 ${view === e.id ? 'text-ink font-bold' : 'text-ink-2 hover:text-ink'}`}>{e.n} · {e.name}</a>
            {view === e.id && (
              <div className="pl-3 border-l border-rule mb-1">
                {e.drivers.map((d) => <div key={d.id} className="py-0.5 text-[.72rem] text-ink-3">{d.title.replace('Driver ', 'D')}</div>)}
              </div>
            )}
          </div>
        ))}
        <a href="#/synthesis" className={`block py-1 mt-1 font-ft font-bold text-[.66rem] tracking-wider uppercase ${view === 'synthesis' ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}>◆ Synthesis</a>
      </div>
    </nav>
  );
}

export default function App() {
  const view = useRoute();
  const reduce = useReducedMotion();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const toggle = () => { const n = (document.documentElement.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark'; setTheme(n); document.documentElement.setAttribute('data-theme', n); localStorage.setItem('kp-theme', n); };
  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const body = view === 'overview' ? <Overview /> : view === 'synthesis' ? <Synthesis /> : <EngineView e={ENGINES.find((e) => e.id === view)!} />;

  return (
    <EvidenceProvider>
      <nav className="sticky top-0 z-40 flex items-center gap-0 flex-wrap min-h-[52px] px-[clamp(1rem,4vw,3rem)] border-b-2 border-ink" style={{ background: 'color-mix(in srgb, var(--paper) 90%, transparent)', backdropFilter: 'blur(12px)' }}>
        <span className="font-ft font-bold text-[.72rem] tracking-[.14em] uppercase text-ink mr-6 whitespace-nowrap">Kepler · Flywheel Decade</span>
        {VIEWS.map((v) => (
          <a key={v} href={'#/' + v} aria-current={view === v ? 'page' : undefined}
            className={`font-ft font-bold text-[.74rem] tracking-wide uppercase px-2.5 py-3.5 whitespace-nowrap border-b-2 -mb-0.5 ${view === v ? 'text-ink border-beitar' : 'text-ink-2 border-transparent hover:text-ink'}`}>{LABEL[v]}</a>
        ))}
        <button id="th" onClick={toggle} title="Theme" className="ml-auto w-7 h-7 grid place-items-center border border-rule-hi rounded text-ink-2 font-mono text-[.8rem] hover:text-ink">◐</button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-x-8 xl:gap-x-14 max-w-canvas mx-auto px-[clamp(1rem,4vw,3rem)] py-[clamp(1.6rem,4vw,3.4rem)]">
        <TreeRail view={view} />
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={view}
              initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}>
              {body}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="border-t-2 border-ink mt-12 px-[clamp(1rem,4vw,3rem)] py-5 font-mono text-[.6rem] text-ink-3 tracking-wide flex flex-wrap gap-x-6 gap-y-2 max-w-canvas mx-auto">
        <span>/illuminate · Kepler — The Flywheel Decade</span>
        <span>React + shadcn/Radix + TanStack + visx + Framer · single-file offline</span>
        <span>Beitar system · every sibling developed · drill-down</span>
      </footer>
    </EvidenceProvider>
  );
}
