import React, { useEffect, useState } from 'react';
import { ENGINES, IDENTITY, BRIDGE, SCENARIOS, Engine, Driver } from './data';
import {
  EvidenceProvider, Cite, CodeBlock, DataTable, Finding, Drill, CountUp,
  BridgeChart, LossCurve, CouplingWeb, Tabs, motion, AnimatePresence, useReducedMotion,
} from './ui';

const VIEWS = ['overview', ...ENGINES.map((e) => e.id), 'synthesis'];
const LABEL: Record<string, string> = { overview: 'Overview', synthesis: 'Synthesis', funding: '01 Funding', credit: '02 Credit', cost: '03 Cost-to-serve', monetization: '04 Monetization' };

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

// A driver → its prose, table, code, and its mechanisms as a nested drill-down (every mechanism a peer).
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
          <span>{e.term} · {e.today} → {e.target} · {e.swing}</span>
          <span className="flex-1 h-px bg-rule-hi max-w-[220px]" />
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

        {e.id === 'credit' && <><SubRow tag="Scoreboard">The cohort loss curve</SubRow><LossCurve /></>}

        <SubRow tag="What counts">The one decisive lever</SubRow>
        <p className="text-[.9rem] leading-relaxed text-ink-2 max-w-[70ch] [&_b]:text-ink [&_b]:font-bold">{e.findingBody} <Finding>{e.finding}</Finding></p>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="max-w-[68ch] xl:max-w-none">
      <div className="font-ft font-bold text-[.7rem] tracking-[.16em] uppercase text-ink-2 flex items-center gap-3">
        <span>Board &amp; Investment Committee · Series-E readiness · Office of the CFO</span><span className="flex-1 h-px bg-rule-hi max-w-[220px]" />
      </div>
      <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold tracking-tight text-ink mt-5 max-w-[19ch]">
        The path to profit is not a growth problem — it is an <b className="text-ink">architecture problem.</b>
      </h1>
      <p className="text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-ink-2 max-w-[64ch] mt-5 [&_b]:text-ink [&_b]:font-bold">
        Kestrel has proven it can grow: 6.8m customers, €14.2bn deposits, won in eight years. What it has not proven is that a Kestrel customer is worth having — today the average active customer <b>loses the bank €3.20 a month</b>, and growth multiplies that loss. Each of the four economic engines was built to maximise scale and is structurally loss-making at the unit level. <b>You cannot optimise your way out of a machine built for the wrong objective — you rebuild the machine.</b> <Cite id="S-001" />
      </p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
        {[
          { k: 'Today', v: <CountUp to={3.2} prefix="−€" decimals={2} className="text-loss" />, p: 'contribution / customer / mo', c: 'S-002' },
          { k: 'Target · 24 mo', v: <CountUp to={6.1} prefix="+€" decimals={2} />, p: 'a €9.30 swing — loss → structural profit' },
          { k: 'The move', v: '4 engines', p: 're-architected, not four dials turned' },
          { k: 'Prob-weighted', v: <CountUp to={5.6} prefix="+€" decimals={2} />, p: 'every scenario lands positive', c: 'S-0sc' },
        ].map((s, i) => (
          <div key={i} className="border border-rule rounded-lg p-4 bg-paper-1">
            <div className="text-[.92rem] font-bold text-ink mb-1">{s.k}</div>
            <div className="font-mono text-[1.4rem] text-ink tracking-tight">{s.v}</div>
            <p className="text-[.8rem] text-ink-2 mt-1">{s.p} {s.c && <Cite id={s.c} />}</p>
          </div>
        ))}
      </div>

      {/* segmented multi-view over the same identity dataset */}
      <SubRow tag="The spine">One identity, four engines — three views of the same numbers</SubRow>
      <Tabs.Root defaultValue="table" className="mt-3">
        <Tabs.List className="flex gap-1 border border-rule-hi rounded-md w-fit overflow-hidden mb-2">
          {[['table', 'Identity table'], ['bridge', 'Contribution bridge'], ['scen', 'Scenarios']].map(([v, l]) => (
            <Tabs.Trigger key={v} value={v} className="font-ft font-bold text-[.62rem] tracking-wider uppercase px-3 py-1.5 text-ink-3 data-[state=active]:bg-beitar data-[state=active]:[color:#141210]">{l}</Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="table"><DataTable table={IDENTITY} /></Tabs.Content>
        <Tabs.Content value="bridge"><BridgeChart steps={BRIDGE} /><p className="text-[.8rem] text-ink-3 max-w-[68ch]">The bridge crosses zero at step 1 — fixing credit alone reaches breakeven. <Cite id="S-syn" /></p></Tabs.Content>
        <Tabs.Content value="scen">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {SCENARIOS.map((s) => (
              <div key={s.k} className="border border-rule rounded-lg p-4 bg-paper-1">
                <div className="font-mono text-[.62rem] text-ink-3">{s.k}</div>
                <div className={`font-mono text-[1.4rem] my-1 ${s.k.includes('BEAR') ? 'text-ink-2' : 'text-ink'}`}>{s.v}</div>
                <p className="text-[.78rem] text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-[.86rem] text-ink-2 max-w-[68ch] mt-3">Probability-weighted <b className="text-ink">+€5.60</b>, and every scenario positive — the difference between an architecture fix and a dial-turn. <Finding>+€5.60 · all positive</Finding></p>
        </Tabs.Content>
      </Tabs.Root>

      <p className="text-[.9rem] leading-relaxed text-ink-2 max-w-[70ch] mt-4 [&_b]:text-ink [&_b]:font-bold">No single engine delivers the swing; each moves its own term, and the engines are <b>coupled</b> — cheaper funding (E1) lets Kestrel hold safer loans (E2), automated collections (E3) cut credit loss (E2), the subscription that earns (E4) funds the support it reduces (E3). The path to +€6.10 runs <b>through</b> the couplings, not around them. <Finding>a web, not a checklist</Finding></p>

      <SubRow tag="How to read this">Top-down, then drilled into — a summary would lie by omission</SubRow>
      <Prose><b>L1</b> the answer, above · <b>L2</b> the four engines · <b>L3</b> each engine's four drivers · <b>L4</b> the mechanisms + data + models + trade-offs. Descend into whichever engine you most doubt via the tree at left or the drill-downs within each engine; the claim on top is only as good as the mechanisms four levels down. Every figure is an internal measured fact; the only uncertain inputs are the two exogenous scenario drivers, shown as a distribution. <Cite id="S-ver" /></Prose>
    </div>
  );
}

function Synthesis() {
  return (
    <div className="max-w-[68ch] xl:max-w-none">
      <div className="font-ft font-bold text-[.7rem] tracking-[.16em] uppercase text-ink-2 flex items-center gap-3"><span>Synthesis · how four engines sum to a bank that works</span><span className="flex-1 h-px bg-rule-hi max-w-[220px]" /></div>
      <h2 className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold tracking-tight text-ink mt-4 max-w-[22ch]">Four disciplined moves, sequenced so the couplings help.</h2>
      <p className="text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-ink-2 max-w-[64ch] mt-4">The engines were argued separately; they do not act separately. The €9.30 swing is assembled from the four terms in an order that matters — each engine's gain partly depends on another's.</p>

      <SubRow tag="The bridge">−€3.20 → +€6.10 — and it crosses zero at step 1</SubRow>
      <BridgeChart steps={BRIDGE} />
      <Prose>Fixing credit alone reaches breakeven — the single most important fact in the document, and why credit is sequenced first despite being hardest. The dependencies are the web: the credit gain is partly manufactured by E3's collections automation; the funding gain permits the credit gain; E3 is paid for by E4's Metal tier. Run them as four silos and each underdelivers by ~a third. <Cite id="S-syn" /></Prose>

      <SubRow tag="The couplings">A web, not four projects</SubRow>
      <CouplingWeb />

      <SubRow tag="Scenarios">The world does not have to cooperate — every case is positive</SubRow>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
        {SCENARIOS.map((s) => (
          <div key={s.k} className="border border-rule rounded-lg p-4 bg-paper-1">
            <div className="font-mono text-[.62rem] text-ink-3">{s.k}</div>
            <div className={`font-mono text-[1.4rem] my-1 ${s.k.includes('BEAR') ? 'text-ink-2' : 'text-ink'}`}>{s.v}</div>
            <p className="text-[.78rem] text-ink-2">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="text-[.9rem] text-ink-2 max-w-[70ch] mt-3 [&_b]:text-ink [&_b]:font-bold">Probability-weighted <b>+€5.60</b>, every scenario positive — dials reverse when the environment does; architecture holds. <Finding>+€5.60 · all positive</Finding> <Cite id="S-0sc" /></p>

      <SubRow tag="The one dependency">What the whole plan hangs on</SubRow>
      <Prose>Sequence: <b>Credit (E2) first</b> — it crosses zero and can't be parallelised away. Funding (E1) second (unlocks E2's safer book). Monetization (E4) third (funds E3). Cost-to-serve (E3) fourth in the P&amp;L but started in parallel — because its <b>collections-automation platform must be live before E2's re-underwriting can hit its loss target.</b> Sequence that wrong and E2 delivers two-thirds of its number while collections overrun and breakeven fails. Everything else can slip a quarter; this cannot. The one decision that determines the outcome: fund this as one <b>architecture programme</b> — four coupled engines rebuilt together — or as four cost-cutting projects. The first reaches +€6.10 and holds; the second turns dials and leaves the machine as loss-making as today. <Cite id="S-dep" /></Prose>
    </div>
  );
}

// ── left rail: the pyramid as a navigable tree (GT → engines → drivers) ──
function TreeRail({ view }: { view: string }) {
  return (
    <nav className="text-[.8rem] sticky top-[64px] self-start hidden lg:block">
      <a href="#/overview" className={`block py-1 font-ft font-bold text-[.66rem] tracking-wider uppercase ${view === 'overview' ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}>◆ Governing thought</a>
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
  const toggle = () => { const n = (document.documentElement.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark'; setTheme(n); document.documentElement.setAttribute('data-theme', n); localStorage.setItem('ks-theme', n); };
  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const body = view === 'overview' ? <Overview /> : view === 'synthesis' ? <Synthesis /> : <EngineView e={ENGINES.find((e) => e.id === view)!} />;

  return (
    <EvidenceProvider>
      <nav className="sticky top-0 z-40 flex items-center gap-0 flex-wrap min-h-[52px] px-[clamp(1rem,4vw,3rem)] border-b-2 border-ink" style={{ background: 'color-mix(in srgb, var(--paper) 90%, transparent)', backdropFilter: 'blur(12px)' }}>
        <span className="font-ft font-bold text-[.72rem] tracking-[.14em] uppercase text-ink mr-6 whitespace-nowrap">Kestrel · Path to Profit</span>
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
        <span>/illuminate · Kestrel — The Path to Profit</span>
        <span>React + shadcn/Radix + TanStack + visx + Framer · single-file offline</span>
        <span>Beitar system · every sibling developed · drill-down</span>
      </footer>
    </EvidenceProvider>
  );
}
