import { useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { BEITAR, BEITAR_FG } from './tokens';
import { Sparkline } from './charts';

/* ── DataGrid — sortable TanStack table; a flagged row/cell carries the Beitar finding ── */
export type GridData = { cols: string[]; rows: (string | number)[][]; findingRow?: number; numericFrom?: number };
export function DataGrid({ data }: { data: GridData }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns: ColumnDef<(string | number)[]>[] = data.cols.map((c, i) => ({
    id: 'c' + i, header: c, accessorFn: (r) => r[i],
    cell: (info) => info.getValue() as string,
  }));
  const table = useReactTable({ data: data.rows, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
  const numFrom = data.numericFrom ?? 1;
  return (
    <figure className="my-5 overflow-x-auto" data-component="faceted-grid">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-rule">
              {hg.headers.map((h, i) => (
                <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                  className={`font-ft text-[11px] uppercase tracking-wider text-cenere font-semibold pb-3 px-3 cursor-pointer select-none ${i >= numFrom ? 'text-right' : 'text-left'}`}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {{ asc: ' ↑', desc: ' ↓' }[h.column.getIsSorted() as string] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isFinding = row.index === data.findingRow;
            return (
              <tr key={row.id} className="border-b border-rule hover:bg-muted" style={isFinding ? { background: 'color-mix(in srgb, #FFCC00 12%, transparent)' } : undefined}>
                {row.getVisibleCells().map((cell, i) => (
                  <td key={cell.id} className={`py-3 px-3 ${i >= numFrom ? 'text-right font-mono' : 'text-left font-hn font-semibold'}`}>
                    {isFinding && i >= numFrom ? <span className="font-bold rounded px-1.5 py-0.5" style={{ background: BEITAR, color: BEITAR_FG }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span> : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}

/* ── KPIRow — headline metric tiles + optional sparkline; the finding tile carries a Beitar mark ── */
export function KPIRow({ data }: { data: { tiles: { k: string; v: string; p?: string; cite?: string; spark?: number[]; finding?: boolean }[] } }) {
  return (
    <figure className="grid grid-cols-2 xl:grid-cols-4 gap-3 my-5" data-component="kpi-summary">
      {data.tiles.map((t, i) => (
        <div key={i} className={`border rounded-lg p-3.5 ${t.finding ? 'border-ink' : 'border-rule bg-paper-1'}`}>
          <div className="font-ft font-bold text-[11px] tracking-[.1em] uppercase text-cenere flex items-center gap-1.5">
            {t.k}{t.finding && <span className="inline-block w-2 h-2 rounded-sm" style={{ background: BEITAR }} />}
          </div>
          <div className="font-ft font-bold text-[26px] text-ink tracking-tight mt-1 tabular-nums">{t.v}</div>
          {t.spark && <Sparkline pts={t.spark} />}
          {t.p && <p className="text-[12px] text-ink-2 mt-0.5">{t.p}{t.cite && <span className="cite ml-1" data-cite={t.cite}>{t.cite}</span>}</p>}
        </div>
      ))}
    </figure>
  );
}

/* ── Gauge — a value against a target/range; Beitar arc from origin to value ── */
export function Gauge({ data }: { data: { value: number; max: number; label: string; unit?: string; target?: number } }) {
  const R = 66, cx = 80, cy = 80, C = Math.PI * R; // half circle
  const frac = Math.max(0, Math.min(1, data.value / data.max));
  const arc = (f: number) => {
    const a = Math.PI - f * Math.PI; return `${cx + R * Math.cos(a)},${cy - R * Math.sin(a)}`;
  };
  return (
    <figure className="my-5 inline-block text-center" data-component="gauge">
      <svg viewBox="0 0 160 96" className="w-[200px] h-auto" role="img" aria-label={`${data.label} gauge`}>
        <path d={`M14,80 A${R},${R} 0 0 1 146,80`} fill="none" stroke="var(--rule)" strokeWidth="12" strokeLinecap="round" />
        <path d={`M14,80 A${R},${R} 0 0 1 ${arc(frac)}`} fill="none" stroke={BEITAR} strokeWidth="12" strokeLinecap="round" />
        {data.target !== undefined && <line x1={cx + R * Math.cos(Math.PI - (data.target / data.max) * Math.PI)} y1={cy - R * Math.sin(Math.PI - (data.target / data.max) * Math.PI)} x2={cx + (R - 14) * Math.cos(Math.PI - (data.target / data.max) * Math.PI)} y2={cy - (R - 14) * Math.sin(Math.PI - (data.target / data.max) * Math.PI)} stroke="var(--ink)" strokeWidth="2" />}
        <text x={cx} y={72} textAnchor="middle" className="font-ft font-bold fill-[color:var(--ink)] text-[22px] tabular-nums">{data.value}{data.unit ?? ''}</text>
      </svg>
      <figcaption className="font-ft text-[11px] uppercase tracking-wider text-cenere -mt-1">{data.label}</figcaption>
    </figure>
  );
}
