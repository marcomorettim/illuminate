import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, flexRender,
  ColumnDef, SortingState,
} from '@tanstack/react-table';
import { EVIDENCE } from './evidence';
import { TableT, Code } from './types';

// ── evidence master-detail (Radix Dialog as a right Sheet). Source-agnostic. ──
const EvCtx = React.createContext<(id: string | null) => void>(() => {});
export function useEvidence() { return React.useContext(EvCtx); }

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const ev = id ? EVIDENCE[id] : null;
  // ONE delegated handler serves every <button class="cite" data-cite> inside md bodies.
  const onClick = (e: React.MouseEvent) => {
    const t = (e.target as HTMLElement).closest('[data-cite]') as HTMLElement | null;
    if (t) { e.preventDefault(); setId(t.getAttribute('data-cite')); }
  };
  return (
    <EvCtx.Provider value={setId}>
      <div onClick={onClick}>{children}</div>
      <Dialog.Root open={!!id} onOpenChange={(o) => !o && setId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-[fade_.2s]" />
          <Dialog.Content className="fixed top-0 right-0 h-full w-[min(460px,94vw)] bg-paper border-l-2 border-ink z-50 flex flex-col shadow-2xl outline-none data-[state=open]:animate-[slidein_.28s_cubic-bezier(.16,1,.3,1)]">
            <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-ink">
              <span className="font-ft font-bold text-[.62rem] tracking-[.14em] uppercase text-ink-3">Evidence</span>
              {ev && <span className="font-mono text-[.62rem] font-bold text-ink">{id}</span>}
              <Dialog.Close className="ml-auto w-7 h-7 grid place-items-center border border-rule-hi rounded text-ink-2 hover:text-ink">✕</Dialog.Close>
            </div>
            {ev ? (
              <div className="overflow-y-auto p-5">
                <div className="font-mono text-[.6rem] text-ink-3 uppercase tracking-wider mb-3">{ev.source}</div>
                <p className="text-[.92rem] leading-relaxed text-ink-2">{ev.text}</p>
              </div>
            ) : id ? (
              <div className="p-5 text-[.85rem] text-ink-3">No evidence entry for <span className="font-mono text-ink">{id}</span>.</div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </EvCtx.Provider>
  );
}

export function Cite({ id }: { id: string }) {
  const open = useEvidence();
  return (
    <button onClick={() => open(id)}
      className="cite font-mono text-[.58rem] border border-rule-hi rounded px-1.5 text-ink-3 hover:border-ink hover:text-ink align-middle whitespace-nowrap ml-1 transition-colors">
      {id}
    </button>
  );
}

// ── One-Dark code panel (always-dark, both themes) ──
export function CodeBlock({ code }: { code: Code }) {
  return (
    <div className="code my-4">
      <div className="ch"><i style={{ width: 8, height: 8, borderRadius: 9, background: '#3a352c' }} /><span className="fn">{code.file}</span></div>
      <pre dangerouslySetInnerHTML={{ __html: code.lines }} />
    </div>
  );
}

// ── TanStack sortable table (monochrome; financial-negative cols in brick) ──
export function DataTable({ table }: { table: TableT }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = React.useMemo<ColumnDef<any>[]>(() =>
    table.cols.map((c, i) => ({ accessorKey: String(i), header: c, cell: (info) => info.getValue(), sortingFn: 'alphanumeric' })), [table]);
  const data = React.useMemo(() => table.rows.map((r) => Object.fromEntries(r.map((v, i) => [String(i), v]))), [table]);
  const t = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
  const neg = new Set(table.negCols || []);
  return (
    <div className="my-4 overflow-x-auto" data-tanstack>
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
                  <td key={cell.id} className={`py-2 px-2.5 border-b border-rule ${i === 0 ? 'text-left text-ink' : 'text-right font-mono tabular-nums'} ${isNeg ? 'text-loss' : i === 0 ? '' : 'text-ink-2'}`}>{v}</td>
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

// ── the ONE finding mark (fixed dark ink #141210, never inverts — §3.1a) ──
export function Finding({ children }: { children: React.ReactNode }) {
  return <span className="finding">{children}</span>;
}

// ── nested drill-down accordion — the manifest tree made interactive ──
export function Drill({ items }: { items: { value: string; header: React.ReactNode; body: React.ReactNode }[] }) {
  return (
    <Accordion.Root type="multiple" className="mt-4 border-t border-rule">
      {items.map((it) => (
        <Accordion.Item key={it.value} value={it.value} className="border-b border-rule">
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex items-center gap-3 py-3.5 text-left" data-drill-trigger>
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

// ── count-up (endpoint-guaranteed under throttled rAF; reduced-motion aware) ──
export function CountUp({ to, prefix = '', suffix = '', decimals = 2, className = '' }: { to: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (reduce) { setV(to); return; }
    let raf = 0, done = false; const t0 = performance.now(); const dur = 700;
    const tick = (t: number) => { const p = Math.min((t - t0) / dur, 1); setV(to * (0.5 - Math.cos(p * Math.PI) / 2)); if (p < 1) raf = requestAnimationFrame(tick); else done = true; };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => { if (!done) setV(to); }, dur + 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [to, reduce]);
  return <span className={className}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

export { Tabs, Tooltip, motion, AnimatePresence, useReducedMotion };
