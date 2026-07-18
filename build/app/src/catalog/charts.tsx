import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, ReferenceDot, LabelList, ResponsiveContainer,
} from 'recharts';
import { INK, INK2, CEN, RULE, BEITAR, LOSS, axis } from './tokens';

/* ── TimeSeries — monochrome lines; lightness + dash differentiate; Beitar dot on the finding ── */
export type TimeSeriesData = {
  unit?: string;
  series: { name: string; dash?: boolean; pts: [number | string, number][] }[];
  mark?: { name: string; x: number | string; y: number };
};
export function TimeSeries({ data }: { data: TimeSeriesData }) {
  const xs = Array.from(new Set(data.series.flatMap((s) => s.pts.map((p) => p[0]))));
  const rows = xs.map((x) => {
    const r: Record<string, number | string> = { x };
    data.series.forEach((s, i) => { const pt = s.pts.find((p) => p[0] === x); if (pt) r['s' + i] = pt[1]; });
    return r;
  });
  return (
    <figure className="my-5" data-component="time-series">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={rows} margin={{ top: 16, right: 24, bottom: 4, left: -4 }}>
          <CartesianGrid stroke={RULE} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="x" tick={axis} axisLine={{ stroke: CEN }} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={40}
            label={data.unit ? { value: data.unit, position: 'insideTopLeft', fontSize: 9, fill: 'var(--cenere)' } : undefined} />
          {data.series.map((s, i) => (
            <Line key={i} type="monotone" dataKey={'s' + i} name={s.name} stroke={i === 0 ? INK : INK2}
              strokeWidth={2.25} strokeDasharray={s.dash ? '5 4' : undefined} dot={false} isAnimationActive={false} />
          ))}
          {data.mark && <ReferenceDot x={data.mark.x} y={data.mark.y} r={5.5} fill={BEITAR} stroke={INK} strokeWidth={1.25} isFront />}
        </LineChart>
      </ResponsiveContainer>
      <figcaption className="flex gap-4 flex-wrap font-ft text-[11px] text-cenere mt-1 pl-2">
        {data.series.map((s, i) => <span key={i}>{i === 0 ? '━' : '╌'} {s.name}</span>)}
        {data.mark && <span className="text-ink font-bold">● {data.mark.name}</span>}
      </figcaption>
    </figure>
  );
}

/* ── AreaTrend — a single filled series (load, utilization) ── */
export function AreaTrend({ data }: { data: { unit?: string; pts: [number | string, number][]; mark?: { x: number | string; y: number } } }) {
  const rows = data.pts.map(([x, y]) => ({ x, y }));
  return (
    <figure className="my-5" data-component="time-series">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={rows} margin={{ top: 16, right: 24, bottom: 4, left: -4 }}>
          <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={INK} stopOpacity={0.18} /><stop offset="100%" stopColor={INK} stopOpacity={0.02} /></linearGradient></defs>
          <CartesianGrid stroke={RULE} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="x" tick={axis} axisLine={{ stroke: CEN }} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={40} label={data.unit ? { value: data.unit, position: 'insideTopLeft', fontSize: 9, fill: 'var(--cenere)' } : undefined} />
          <Area type="monotone" dataKey="y" stroke={INK} strokeWidth={2} fill="url(#ar)" isAnimationActive={false} />
          {data.mark && <ReferenceDot x={data.mark.x} y={data.mark.y} r={5.5} fill={BEITAR} stroke={INK} strokeWidth={1.25} isFront />}
        </AreaChart>
      </ResponsiveContainer>
    </figure>
  );
}

/* ── Waterfall / bridge — floating bars; Beitar on the terminal (target) bar ── */
export function Waterfall({ data }: { data: { unit?: string; steps: { label: string; value: number }[] } }) {
  const cum = data.steps.map((s) => s.value);
  const rows = data.steps.map((s, i) => {
    const prev = i === 0 ? 0 : cum[i - 1];
    return { label: s.label, range: [Math.min(prev, cum[i]), Math.max(prev, cum[i])] as [number, number], v: cum[i], last: i === data.steps.length - 1 };
  });
  return (
    <figure className="my-5" data-component="waterfall">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows} margin={{ top: 20, right: 16, bottom: 4, left: -4 }}>
          <CartesianGrid stroke={RULE} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="label" tick={{ ...axis, fontSize: 9 }} axisLine={{ stroke: CEN }} tickLine={false} interval={0} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={44} label={data.unit ? { value: data.unit, position: 'insideTopLeft', fontSize: 9, fill: 'var(--cenere)' } : undefined} />
          <Bar dataKey="range" isAnimationActive={false} radius={2}>
            {rows.map((r, i) => <Cell key={i} fill={r.last ? BEITAR : (r.v < 0 ? LOSS : INK2)} />)}
            <LabelList dataKey="v" position="top" fontSize={10} fontFamily="var(--mono)" fill="var(--ink)" formatter={(v: number) => (v >= 0 ? '+' : '') + v} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}

/* ── Funnel — horizontal decreasing bars; Beitar marks the drop-off (cliff) row ── */
function FunnelBars({ rows, cliff, name }: { rows: [string, number, string?][]; cliff?: number; name?: string }) {
  const d = rows.map(([stage, pct, count], i) => ({ stage, pct, count: count ?? '', cliff: i === cliff }));
  return (
    <div className="flex-1 min-w-[220px]">
      {name && <div className="font-ft font-bold text-[11px] tracking-[.1em] uppercase text-cenere mb-1">{name}</div>}
      <ResponsiveContainer width="100%" height={Math.max(150, rows.length * 34)}>
        <BarChart data={d} layout="vertical" margin={{ top: 2, right: 48, bottom: 2, left: 2 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="stage" tick={{ ...axis, fontSize: 9 }} axisLine={false} tickLine={false} width={100} />
          <Bar dataKey="pct" isAnimationActive={false} radius={2} barSize={16}>
            {d.map((r, i) => <Cell key={i} fill={r.cliff ? BEITAR : INK2} />)}
            <LabelList dataKey="count" position="right" fontSize={9} fontFamily="var(--mono)" fill="var(--ink-2)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function Funnel({ data }: { data: { rows: [string, number, string?][]; cliff_index?: number } }) {
  return <figure className="my-5" data-component="funnel"><FunnelBars rows={data.rows} cliff={data.cliff_index} /></figure>;
}
export function TwoSidedFunnel({ data }: { data: { left: { name: string; rows: [string, number, string?][] }; right: { name: string; rows: [string, number, string?][] }; cliff_index?: number } }) {
  return (
    <figure className="my-5 flex gap-6 flex-wrap" data-component="two-sided-funnel">
      <FunnelBars rows={data.left.rows} cliff={data.cliff_index} name={data.left.name} />
      <FunnelBars rows={data.right.rows} cliff={data.cliff_index} name={data.right.name} />
    </figure>
  );
}

/* ── Sparkline — inline micro-trend for KPI tiles ── */
export function Sparkline({ pts }: { pts: number[] }) {
  const rows = pts.map((y, x) => ({ x, y }));
  return (
    <ResponsiveContainer width="100%" height={34}>
      <LineChart data={rows} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="y" stroke={INK2} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
