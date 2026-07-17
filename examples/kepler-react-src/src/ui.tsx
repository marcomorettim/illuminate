import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getExpandedRowModel, flexRender,
  ColumnDef, SortingState,
} from '@tanstack/react-table';
import { scaleLinear, scaleBand } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { EVIDENCE, Table as TableT, Code } from './data';

// ── evidence master-detail (Radix Dialog as a right Sheet) ──
const EvCtx = React.createContext<(id: string | null) => void>(() => {});
export function useEvidence() { return React.useContext(EvCtx); }

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const ev = id ? EVIDENCE[id] : null;
  return (
    <EvCtx.Provider value={setId}>
      {children}
      <Dialog.Root open={!!id} onOpenChange={(o) => !o && setId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-[fade_.2s]" />
          <Dialog.Content className="fixed top-0 right-0 h-full w-[min(460px,94vw)] bg-paper border-l-2 border-ink z-50 flex flex-col shadow-2xl outline-none data-[state=open]:animate-[slidein_.28s_cubic-bezier(.16,1,.3,1)]">
            <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-ink">
              <span className="font-ft font-bold text-[.62rem] tracking-[.14em] uppercase text-ink-3">Evidence</span>
              {ev && <span className="font-mono text-[.62rem] font-bold text-ink">{id}</span>}
              <Dialog.Close className="ml-auto w-7 h-7 grid place-items-center border border-rule-hi rounded text-ink-2 hover:text-ink">✕</Dialog.Close>
            </div>
            {ev && (
              <div className="overflow-y-auto p-5">
                <div className="font-mono text-[.6rem] text-ink-3 uppercase tracking-wider mb-3">{ev.engine}</div>
                <p className="text-[.92rem] leading-relaxed text-ink-2">{ev.text}</p>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </EvCtx.Provider>
  );
}

export function Cite({ id }: { id: string }) {
  const open = useEvidence();
  if (!EVIDENCE[id]) return null;
  return (
    <button onClick={() => open(id)}
      className="font-mono text-[.58rem] border border-rule-hi rounded px-1.5 text-ink-3 hover:border-ink hover:text-ink align-middle whitespace-nowrap ml-1 transition-colors">
      {id}
    </button>
  );
}

// ── One-Dark code panel ──
export function CodeBlock({ code }: { code: Code }) {
  return (
    <div className="code my-4">
      <div className="ch"><i style={{ width: 8, height: 8, borderRadius: 9, background: '#3a352c' }} /><span className="fn">{code.file}</span></div>
      <pre dangerouslySetInnerHTML={{ __html: code.lines }} />
    </div>
  );
}

// ── TanStack faceted / sortable table (full-bleed, monochrome; loss cols in brick) ──
export function DataTable({ table }: { table: TableT }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = React.useMemo<ColumnDef<any>[]>(() =>
    table.cols.map((c, i) => ({
      accessorKey: String(i), header: c,
      cell: (info) => info.getValue(),
      sortingFn: 'alphanumeric',
    })), [table]);
  const data = React.useMemo(() => table.rows.map((r) => Object.fromEntries(r.map((v, i) => [String(i), v]))), [table]);
  const t = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
  const neg = new Set(table.negCols || []);
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-[.82rem] border-collapse">
        <thead>
          {t.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h, i) => (
                <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                  className={`font-ft font-bold text-[.6rem] tracking-wider uppercase text-ink-3 py-2 px-2.5 border-b border-rule cursor-pointer select-none ${i === 0 ? 'text-left' : 'text-right'}`}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {{ asc: ' ↑', desc: ' ↓' }[h.column.getIsSorted() as string] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {t.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-paper-1/60">
              {row.getVisibleCells().map((cell, i) => {
                const v = String(cell.getValue() ?? '');
                const isNeg = neg.has(i) && v.includes('−');
                return (
                  <td key={cell.id}
                    className={`py-2 px-2.5 border-b border-rule ${i === 0 ? 'text-left text-ink' : 'text-right font-mono tabular-nums'} ${isNeg ? 'text-loss' : i === 0 ? '' : 'text-ink-2'}`}>
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
          {table.foot && (
            <tr className="font-bold">
              {table.foot.map((v, i) => {
                const s = String(v); const isNeg = neg.has(i) && s.includes('−');
                return <td key={i} className={`py-2 px-2.5 border-t-2 border-ink text-ink ${i === 0 ? 'text-left' : 'text-right font-mono tabular-nums'} ${isNeg ? 'text-loss' : ''}`}>{s}</td>;
              })}
            </tr>
          )}
        </tbody>
      </table>
      {table.note && <p className="text-[.76rem] text-ink-3 mt-2 max-w-[68ch]">{table.note}</p>}
    </div>
  );
}

// ── the ONE finding mark (fixed dark ink, never inverts) ──
export function Finding({ children }: { children: React.ReactNode }) {
  return <span className="finding">{children}</span>;
}

// ── nested drill-down accordion (drivers → mechanisms) ──
export function Drill({ items }: { items: { value: string; header: React.ReactNode; body: React.ReactNode }[] }) {
  return (
    <Accordion.Root type="multiple" className="mt-4 border-t border-rule">
      {items.map((it) => (
        <Accordion.Item key={it.value} value={it.value} className="border-b border-rule">
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex items-center gap-3 py-3.5 text-left">
              <span className="font-mono text-[.7rem] text-ink-3 group-data-[state=open]:text-beitar group-data-[state=open]:[color:#141210] transition-transform group-data-[state=open]:rotate-90">▸</span>
              <span className="flex-1">{it.header}</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="acc-content overflow-hidden">
            <div className="pb-5 pl-6">{it.body}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export { Tabs, Tooltip, motion, AnimatePresence, useReducedMotion };

// ── visx: count-up ──
export function CountUp({ to, prefix = '', suffix = '', decimals = 2, className = '' }: { to: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (reduce) { setV(to); return; }
    let raf = 0, done = false; const t0 = performance.now(); const dur = 700;
    const tick = (t: number) => { const p = Math.min((t - t0) / dur, 1); setV(to * (0.5 - Math.cos(p * Math.PI) / 2)); if (p < 1) raf = requestAnimationFrame(tick); else done = true; };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => { if (!done) setV(to); }, dur + 150); // guarantee the endpoint even if rAF is throttled
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [to, reduce]);
  return <span className={className}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

// ── visx: the contribution bridge (waterfall) — monochrome, Beitar marks the +€6.10 terminus ──
export function BridgeChart({ steps }: { steps: { label: string; total: number }[] }) {
  const W = 720, H = 260, mL = 40, mB = 64, mT = 24;
  const totals = steps.map((s) => s.total);
  const y = scaleLinear({ domain: [Math.min(-3.5, ...totals), Math.max(6.5, ...totals)], range: [H - mB, mT] });
  const x = scaleBand({ domain: steps.map((_, i) => String(i)), range: [mL, W - 10], padding: 0.35 });
  const zero = y(0);
  let prev = 0;
  return (
    <div className="my-4 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[560px]" role="img" aria-label="Contribution bridge −€3.20 to +€6.10">
        <line x1={mL} x2={W - 10} y1={zero} y2={zero} stroke="var(--ink-3)" strokeDasharray="4 4" />
        <text x={4} y={zero + 3} className="fill-[color:var(--ink-3)] font-mono text-[9px]">€0</text>
        {steps.map((s, i) => {
          const start = i === 0 ? 0 : prev; const end = s.total;
          const top = y(Math.max(start, end)); const bot = y(Math.min(start, end));
          const isEnd = i === steps.length - 1; const isStart = i === 0;
          prev = end;
          const bx = x(String(i))!; const bw = x.bandwidth();
          const hgt = Math.max(bot - top, isStart ? y(-3.2) - zero : 2);
          const yy = isStart ? zero : top;
          return (
            <g key={i}>
              <rect x={bx} y={yy} width={bw} height={Math.abs(hgt)} rx={2}
                fill={isEnd ? '#FFCC00' : (isStart ? 'var(--ink)' : 'var(--ink-2)')} />
              <text x={bx + bw / 2} y={(isStart ? zero + Math.abs(hgt) : top) - 6} textAnchor="middle"
                className="fill-[color:var(--ink)] font-mono text-[10px] font-bold">
                {(isStart ? -3.2 : s.total >= 0 ? '+' : '') + '€' + Math.abs(s.total).toFixed(2)}
              </text>
              <text x={bx + bw / 2} y={H - mB + 14} textAnchor="middle" className="fill-[color:var(--ink-3)] font-mono text-[8px]">
                {i === 0 ? 'start' : i === 1 ? '+E2' : i === 2 ? '+E1' : i === 3 ? '+E4' : '+E3'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── visx: cohort loss curve — legacy vs target (fill-style diff), Beitar dot on target end ──
export function LossCurve() {
  const W = 520, H = 210, mL = 40, mB = 26, mT = 12;
  const months = [3, 6, 12, 18, 24];
  const legacy = [0.4, 1.1, 2.2, 3.0, 3.4];
  const target = [0.3, 0.8, 1.4, 1.8, 2.1];
  const x = scaleLinear({ domain: [3, 24], range: [mL, W - 12] });
  const y = scaleLinear({ domain: [0, 3.6], range: [H - mB, mT] });
  const pt = (arr: number[]) => months.map((m, i) => ({ x: x(m), y: y(arr[i]) }));
  return (
    <div className="my-4 max-w-[560px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Cumulative loss curve legacy vs target">
        <line x1={mL} x2={mL} y1={mT} y2={H - mB} stroke="var(--ink-3)" />
        <line x1={mL} x2={W - 12} y1={H - mB} y2={H - mB} stroke="var(--ink-3)" />
        <text x={4} y={mT + 8} className="fill-[color:var(--ink-3)] font-mono text-[8px]">€3.6</text>
        <LinePath data={pt(legacy)} x={(d) => d.x} y={(d) => d.y} stroke="var(--ink)" strokeWidth={2} />
        <LinePath data={pt(target)} x={(d) => d.x} y={(d) => d.y} stroke="var(--ink-2)" strokeWidth={2} strokeDasharray="5 4" />
        <circle cx={x(24)} cy={y(3.4)} r={4} fill="var(--ink)" />
        <circle cx={x(24)} cy={y(2.1)} r={5} fill="#FFCC00" stroke="var(--ink)" strokeWidth={1} />
        <text x={x(12)} y={y(2.9)} className="fill-[color:var(--ink)] font-ft text-[9px] font-bold">LEGACY €3.40/€100</text>
        <text x={x(11)} y={y(1.5)} className="fill-[color:var(--ink)] font-ft text-[9px] font-bold">TARGET €2.10 ← finding</text>
        <text x={mL} y={H - 8} className="fill-[color:var(--ink-3)] font-mono text-[8px]">mo 3</text>
        <text x={W - 40} y={H - 8} className="fill-[color:var(--ink-3)] font-mono text-[8px]">mo 24</text>
      </svg>
    </div>
  );
}

// ── the flywheel: D6 hub + five spokes, every edge bidirectional (the coherency centrepiece) ──
export function Flywheel() {
  const cx = 210, cy = 130, R = 95;
  const spokes = ['D1', 'D2', 'D3', 'D4', 'D5'];
  const names = ['Mobility', 'Energy', 'Logistics', 'Payments', 'Devices'];
  const pts = spokes.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  return (
    <div className="my-4 max-w-[440px] mx-auto">
      <svg viewBox="0 0 420 260" className="w-full h-auto" role="img" aria-label="The flywheel — D6 hub feeding and fed by five domains">
        {pts.map((p, i) => (
          <g key={i}>
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--ink-3)" strokeWidth="1.5" />
            {/* bidirectional arrowheads */}
            <circle cx={(cx + p.x) / 2} cy={(cy + p.y) / 2} r="2" fill="var(--red)" />
          </g>
        ))}
        {pts.map((p, i) => (
          <g key={'n' + i} textAnchor="middle" className="font-ft">
            <circle cx={p.x} cy={p.y} r="26" fill="var(--paper-1)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={p.x} y={p.y - 1} className="fill-[color:var(--ink)] text-[10px] font-bold">{spokes[i]}</text>
            <text x={p.x} y={p.y + 9} className="fill-[color:var(--ink-2)] text-[6.5px]">{names[i]}</text>
          </g>
        ))}
        {/* hub */}
        <circle cx={cx} cy={cy} r="34" fill="#FFCC00" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={cx} y={cy - 2} textAnchor="middle" className="font-ft text-[12px] font-bold" fill="#141210">D6</text>
        <text x={cx} y={cy + 9} textAnchor="middle" className="font-ft text-[6.5px]" fill="#141210">Data/AI hub</text>
      </svg>
      <p className="text-center text-[.7rem] text-ink-3 font-mono">every feed is also a return — no domain a leaf</p>
    </div>
  );
}

// ── contribution track: today → prob-weighted → target (monochrome, Beitar on the target) ──
export function ContribBar({ today, weighted, target }: { today: number; weighted: number; target: number }) {
  const W = 620, H = 92, mL = 8, mR = 8;
  const lo = Math.min(today, -0.2), hi = Math.max(target, 0.35);
  const x = scaleLinear({ domain: [lo, hi], range: [mL, W - mR] });
  const zero = x(0), yb = 54;
  const pts: [number, number, string, boolean][] = [
    [today, x(today), '−$0.14 today', false],
    [weighted, x(weighted), '+$0.24 weighted', false],
    [target, x(target), '+$0.31 target', true],
  ];
  return (
    <div className="my-4 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[440px]" role="img" aria-label="Contribution per interaction trajectory">
        <line x1={mL} x2={W - mR} y1={yb} y2={yb} stroke="var(--rule-hi)" strokeWidth="1" />
        <line x1={zero} x2={zero} y1={yb - 22} y2={yb + 8} stroke="var(--ink-3)" strokeDasharray="3 3" />
        <text x={zero} y={yb + 20} textAnchor="middle" className="fill-[color:var(--ink-3)] font-mono text-[8px]">$0</text>
        {pts.map(([v, px, lbl, isT], i) => (
          <g key={i}>
            <circle cx={px} cy={yb} r={isT ? 7 : 5} fill={isT ? '#FFCC00' : (v < 0 ? 'var(--loss)' : 'var(--ink)')} stroke="var(--ink)" strokeWidth={isT ? 1 : 0} />
            <text x={px} y={i % 2 ? yb + 30 : yb - 14} textAnchor="middle" className="fill-[color:var(--ink)] font-mono text-[9px] font-bold">{lbl}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── the couplings web (ink-on-paper) — retained for reference ──
export function CouplingWeb() {
  return (
    <div className="my-4 max-w-[520px] mx-auto">
      <svg viewBox="0 0 420 240" className="w-full h-auto" role="img" aria-label="Four engines and their couplings">
        <line x1="110" y1="60" x2="310" y2="60" stroke="var(--ink-3)" strokeWidth="1.5" />
        <line x1="110" y1="180" x2="310" y2="180" stroke="var(--ink-3)" strokeWidth="1.5" />
        <line x1="110" y1="60" x2="110" y2="180" stroke="var(--ink-3)" strokeWidth="1.5" />
        <line x1="310" y1="60" x2="310" y2="180" stroke="var(--ink-3)" strokeWidth="1.5" />
        <line x1="110" y1="60" x2="310" y2="180" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="310" y1="60" x2="110" y2="180" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 3" />
        {[['110', '60', 'E1', 'Funding'], ['310', '60', 'E2', 'Credit'], ['110', '180', 'E4', 'Monetize'], ['310', '180', 'E3', 'Cost']].map(([cx, cy, a, b], i) => (
          <g key={i} textAnchor="middle" className="font-ft">
            <circle cx={cx} cy={cy} r="34" fill="var(--paper-1)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={cx} y={+cy - 3} className="fill-[color:var(--ink)] text-[11px] font-bold">{a}</text>
            <text x={cx} y={+cy + 10} className="fill-[color:var(--ink-2)] text-[7.5px]">{b}</text>
          </g>
        ))}
        <g className="font-mono fill-[color:var(--ink-3)] text-[7.5px]" textAnchor="middle">
          <text x="210" y="52">funding↔credit</text><text x="210" y="196">cost↔monetize</text>
        </g>
      </svg>
    </div>
  );
}
