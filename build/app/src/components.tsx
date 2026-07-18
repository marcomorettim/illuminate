import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceDot, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList,
} from 'recharts';
import { CodeBlock, DataTable } from './ui';
import { ComponentSpec } from './types';

// Generic, data-driven renderers keyed by family. §3.4: monochrome (ink + cenere tints), Beitar
// (#FFCC00) marks only the finding element. Charts are Recharts; network/scenario/mockup are
// bespoke (not cartesian). code/faceted-grid carry verbatim source artifacts.
const INK = 'var(--ink)', INK2 = 'var(--ink-2)', INK3 = 'var(--ink-3)', RULE = 'var(--rule-hi)', BEITAR = '#FFCC00';
const axis = { stroke: INK3, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' };

// ── network: the flywheel — hub + spokes, every edge bidirectional (Beitar hub = the finding) ──
function Network({ data }: { data: Extract<ComponentSpec, { family: 'network' }>['data'] }) {
  const cx = 210, cy = 135, R = 96, n = data.spokes.length || 1;
  const pts = data.spokes.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  return (
    <div className="my-4 max-w-[460px] mx-auto">
      <svg viewBox="0 0 420 280" className="w-full h-auto" role="img" aria-label={`${data.hub.label} feeding and fed by ${n} domains`}>
        {pts.map((p, i) => (
          <g key={i}>
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={INK3} strokeWidth="1.5" />
            <circle cx={(cx + p.x) / 2} cy={(cy + p.y) / 2} r="2" fill="var(--red)" />
          </g>
        ))}
        {pts.map((p, i) => (
          <g key={'n' + i} textAnchor="middle" className="font-ft">
            <circle cx={p.x} cy={p.y} r="27" fill="var(--paper-1)" stroke={INK} strokeWidth="1.5" />
            <text x={p.x} y={p.y - 1} className="fill-[color:var(--ink)] text-[10px] font-bold">{data.spokes[i].label}</text>
            <text x={p.x} y={p.y + 9} className="fill-[color:var(--ink-2)] text-[6.2px]">{data.spokes[i].sub}</text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r="34" fill={BEITAR} stroke={INK} strokeWidth="1.5" />
        <text x={cx} y={cy - 2} textAnchor="middle" className="font-ft text-[12px] font-bold" fill="#141210">{data.hub.label}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" className="font-ft text-[6.2px]" fill="#141210">{data.hub.sub}</text>
      </svg>
      {data.caption && <p className="text-center text-[.7rem] text-ink-3 font-mono">{data.caption}</p>}
    </div>
  );
}

// ── kpi-summary: tiles (the target tile carries the Beitar mark) ──
function KPISummary({ data }: { data: Extract<ComponentSpec, { family: 'kpi-summary' }>['data'] }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 my-4">
      {data.tiles.map((t, i) => {
        const isFinding = /target|profit|swing/i.test(t.k);
        return (
          <div key={i} className={`border rounded-lg p-3.5 ${isFinding ? 'border-ink' : 'border-rule bg-paper-1'}`}>
            <div className="font-ft font-bold text-[.55rem] tracking-[.1em] uppercase text-ink-3 flex items-center gap-1.5">
              {t.k}{isFinding && <span className="inline-block w-2 h-2 rounded-sm bg-beitar" />}
            </div>
            <div className="font-mono text-[1.35rem] text-ink tracking-tight mt-1">{t.v}</div>
            <p className="text-[.72rem] text-ink-2 mt-0.5">{t.p}{t.cite && <span className="cite ml-1" data-cite={t.cite}>{t.cite}</span>}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── time-series: Recharts monochrome lines (lightness + dash differentiate), Beitar dot on mark ──
function TimeSeries({ data }: { data: Extract<ComponentSpec, { family: 'time-series' }>['data'] }) {
  const xs = Array.from(new Set(data.series.flatMap((s) => s.pts.map((p) => p[0])))).sort((a, b) => a - b);
  const rows = xs.map((x) => {
    const r: any = { x };
    data.series.forEach((s, i) => { const pt = s.pts.find((p) => p[0] === x); r['s' + i] = pt ? pt[1] : null; });
    return r;
  });
  return (
    <div className="my-4 w-full max-w-[940px]" data-component="time-series">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={rows} margin={{ top: 14, right: 18, bottom: 4, left: -6 }}>
          <CartesianGrid stroke={RULE} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="x" tick={axis} axisLine={{ stroke: INK3 }} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={38} label={data.unit ? { value: data.unit, position: 'insideTopLeft', fontSize: 8, fill: 'var(--ink-3)' } : undefined} />
          {data.series.map((s, i) => (
            <Line key={i} type="monotone" dataKey={'s' + i} name={s.name} stroke={i === 0 ? INK : INK2}
              strokeWidth={2} strokeDasharray={s.dash ? '5 4' : undefined} dot={false} isAnimationActive={false} />
          ))}
          {data.mark && <ReferenceDot x={data.mark.x} y={data.mark.y} r={5} fill={BEITAR} stroke={INK} strokeWidth={1} isFront />}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 flex-wrap font-ft text-[.62rem] text-ink-2 mt-1 pl-2">
        {data.series.map((s, i) => <span key={i}>{i === 0 ? '━' : '╌'} {s.name}</span>)}
        {data.mark && <span className="text-ink font-bold">● {data.mark.name} ← finding</span>}
      </div>
    </div>
  );
}

// ── scenario-tree: root → branches, Beitar marks the load-bearing branch ──
function ScenarioTree({ data }: { data: Extract<ComponentSpec, { family: 'scenario-tree' }>['data'] }) {
  return (
    <div className="my-4">
      <div className="font-ft font-bold text-[.66rem] uppercase tracking-wider text-ink-2 mb-2">{data.root}</div>
      <div className="grid gap-2">
        {data.branches.map((b, i) => (
          <div key={i} className={`flex items-baseline gap-3 border-l-2 pl-3 py-1 ${i === 0 ? 'border-beitar' : 'border-rule-hi'}`}>
            <span className="font-mono text-[.7rem] text-ink-3 w-12 shrink-0">{b.prob ?? ''}</span>
            <span className="text-[.86rem] text-ink font-bold shrink-0">{b.label}</span>
            {b.value && <span className="font-mono text-[.8rem] text-ink-2">{b.value}</span>}
            {b.note && <span className="text-[.78rem] text-ink-3">{b.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── waterfall / bridge: Recharts floating bars, Beitar on the terminal (target) bar ──
function Waterfall({ data }: { data: Extract<ComponentSpec, { family: 'waterfall' }>['data'] }) {
  const cum = data.steps.map((s) => s.value);
  const rows = data.steps.map((s, i) => {
    const prev = i === 0 ? 0 : cum[i - 1];
    return { label: s.label, range: [Math.min(prev, cum[i]), Math.max(prev, cum[i])] as [number, number], v: cum[i], last: i === data.steps.length - 1 };
  });
  return (
    <div className="my-4 w-full max-w-[940px]" data-component="waterfall">
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={rows} margin={{ top: 18, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid stroke={RULE} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="label" tick={{ ...axis, fontSize: 8 }} axisLine={{ stroke: INK3 }} tickLine={false} interval={0} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={40} label={data.unit ? { value: data.unit, position: 'insideTopLeft', fontSize: 8, fill: 'var(--ink-3)' } : undefined} />
          <Bar dataKey="range" isAnimationActive={false} radius={2}>
            {rows.map((r, i) => <Cell key={i} fill={r.last ? BEITAR : (r.v < 0 ? 'var(--loss)' : INK2)} />)}
            <LabelList dataKey="v" position="top" fontSize={9} fontFamily="JetBrains Mono" fill="var(--ink)" formatter={(v: number) => (v >= 0 ? '+' : '') + v} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── funnel: horizontal Recharts bars, decreasing; Beitar marks the drop-off (cliff) row ──
function FunnelBars({ rows, cliff, name }: { rows: [string, number, string][]; cliff?: number; name?: string }) {
  const d = rows.map(([stage, pct, count], i) => ({ stage, pct, count, cliff: i === cliff }));
  return (
    <div className="flex-1 min-w-[220px]">
      {name && <div className="font-ft font-bold text-[.58rem] tracking-[.1em] uppercase text-ink-3 mb-1">{name}</div>}
      <ResponsiveContainer width="100%" height={Math.max(140, rows.length * 34)}>
        <BarChart data={d} layout="vertical" margin={{ top: 2, right: 44, bottom: 2, left: 2 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="stage" tick={{ ...axis, fontSize: 8.5 }} axisLine={false} tickLine={false} width={92} />
          <Bar dataKey="pct" isAnimationActive={false} radius={2} barSize={16}>
            {d.map((r, i) => <Cell key={i} fill={r.cliff ? BEITAR : INK2} />)}
            <LabelList dataKey="count" position="right" fontSize={8.5} fontFamily="JetBrains Mono" fill="var(--ink-2)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
function TwoSidedFunnel({ data }: { data: Extract<ComponentSpec, { family: 'two-sided-funnel' }>['data'] }) {
  return (
    <div className="my-4 flex gap-6 flex-wrap" data-component="two-sided-funnel">
      <FunnelBars rows={data.left.rows} cliff={data.cliff_index} name={data.left.name} />
      <FunnelBars rows={data.right.rows} cliff={data.cliff_index} name={data.right.name} />
    </div>
  );
}
function Funnel({ data }: { data: Extract<ComponentSpec, { family: 'funnel' }>['data'] }) {
  return <div className="my-4" data-component="funnel"><FunnelBars rows={data.rows} /></div>;
}

// ── mockup: a device/surface frame (ILLUSTRATION surface — make the abstract concrete) ──
// Phone-class surfaces stay device-narrow; ledger/statement/card/email surfaces are wide slabs.
function Mockup({ data }: { data: Extract<ComponentSpec, { family: 'mockup' }>['data'] }) {
  const wide = /ledger|statement|card|email|dashboard|table/i.test(data.kind);
  return (
    <div className={`my-4 ${wide ? 'w-full max-w-[940px]' : 'max-w-[420px]'} border border-rule-hi rounded-xl overflow-hidden bg-paper-1`} data-component="mockup">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-rule bg-paper-2">
        <span className="w-2 h-2 rounded-full bg-ink-3" /><span className="w-2 h-2 rounded-full bg-ink-3" />
        <span className="font-ft text-[.58rem] tracking-wide uppercase text-ink-3 ml-2">{data.kind}</span>
        {data.meta && <span className="font-mono text-[.56rem] text-ink-3 ml-auto">{data.meta}</span>}
      </div>
      <div className="p-4">
        <div className="text-[.9rem] font-bold text-ink mb-2">{data.title}</div>
        {data.lines.map((l, i) => <p key={i} className="text-[.8rem] text-ink-2 leading-snug my-1">{l}</p>)}
      </div>
    </div>
  );
}

// ── map: schematic spatial layout (fleet / network / supply chain); Beitar marks the finding node ──
function GeoMap({ data }: { data: Extract<ComponentSpec, { family: 'map' }>['data'] }) {
  return (
    <div className="my-4 max-w-[560px]" data-component="map">
      <svg viewBox="0 0 400 260" className="w-full h-auto" role="img" aria-label="schematic map">
        <rect x="1" y="1" width="398" height="258" rx="6" fill="var(--paper-1)" stroke={RULE} strokeWidth="1" />
        {data.places.map((p, i) => {
          const x = 22 + (p.x / 100) * 356, y = 20 + (p.y / 100) * 220;
          return (
            <g key={i} textAnchor="middle" className="font-ft">
              <circle cx={x} cy={y} r={p.finding ? 8 : 5.5} fill={p.finding ? BEITAR : INK2} stroke={INK} strokeWidth="1" />
              <text x={x} y={y - 11} className="fill-[color:var(--ink)] text-[8.5px] font-bold">{p.label}</text>
              {p.value && <text x={x} y={y + 15} className="fill-[color:var(--ink-2)] text-[7.5px] font-mono">{p.value}</text>}
              {p.sub && <text x={x} y={y + 24} className="fill-[color:var(--ink-3)] text-[6.5px]">{p.sub}</text>}
            </g>
          );
        })}
      </svg>
      {data.caption && <p className="text-[.7rem] text-ink-3 font-mono mt-1">{data.caption}</p>}
    </div>
  );
}
// ── sankey: staged left→right flow, band width ∝ value; Beitar marks the finding flow ──
function Sankey({ data }: { data: Extract<ComponentSpec, { family: 'sankey' }>['data'] }) {
  const W = 480, H = 260, PAD = 18;
  const cols = Math.max(1, ...data.nodes.map((n) => n.col)) + 1;
  const byCol: Record<number, typeof data.nodes> = {};
  data.nodes.forEach((n) => { (byCol[n.col] ||= []).push(n); });
  const total = Math.max(1, data.links.reduce((s, l) => s + l.value, 0));
  const pos: Record<string, { x: number; y: number }> = {};
  Object.entries(byCol).forEach(([c, ns]) => {
    const x = PAD + 24 + (cols > 1 ? (+c / (cols - 1)) * (W - 2 * PAD - 48) : 0);
    const step = (H - 2 * PAD) / ns.length;
    ns.forEach((n, i) => { pos[n.id] = { x, y: PAD + step * (i + 0.5) }; });
  });
  return (
    <div className="my-4 max-w-[560px]" data-component="sankey">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="flow diagram">
        {data.links.map((l, i) => {
          const a = pos[l.source], b = pos[l.target]; if (!a || !b) return null;
          const w = Math.max(1.5, (l.value / total) * 88), mx = (a.x + b.x) / 2;
          return <path key={i} d={`M${a.x} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`} fill="none"
            stroke={l.finding ? BEITAR : INK3} strokeWidth={w} strokeOpacity={l.finding ? 0.9 : 0.32} />;
        })}
        {data.nodes.map((n, i) => {
          const p = pos[n.id];
          return (
            <g key={i} className="font-ft">
              <circle cx={p.x} cy={p.y} r="3" fill={INK} />
              <text x={p.x} y={p.y - 7} textAnchor="middle" className="fill-[color:var(--ink)] text-[7.5px] font-bold">{n.label}</text>
            </g>
          );
        })}
      </svg>
      {data.unit && <p className="text-[.66rem] text-ink-3 font-mono mt-1">flows in {data.unit}</p>}
    </div>
  );
}

function inner(spec: ComponentSpec) {
  switch (spec.family) {
    case 'code': return <CodeBlock code={spec.data} />;
    case 'faceted-grid': return <DataTable table={spec.data} />;
    case 'network': return <Network data={spec.data} />;
    case 'kpi-summary': return <KPISummary data={spec.data} />;
    case 'time-series': return <TimeSeries data={spec.data} />;
    case 'scenario-tree': return <ScenarioTree data={spec.data} />;
    case 'waterfall': return <Waterfall data={spec.data} />;
    case 'two-sided-funnel': return <TwoSidedFunnel data={spec.data} />;
    case 'funnel': return <Funnel data={spec.data} />;
    case 'mockup': return <Mockup data={spec.data} />;
    case 'map': return <GeoMap data={spec.data} />;
    case 'sankey': return <Sankey data={spec.data} />;
    default: return null;
  }
}

export function RenderComponent({ spec }: { spec: ComponentSpec }) {
  const body = inner(spec);
  if (!body) return null;
  // ILLUSTRATE surfaces wear a persistent tag; evidence surfaces carry their citation chips (§2.2).
  const illustrate = spec.evidence_class === 'illustrate';
  return (
    <div data-component={spec.family} className="relative">
      {illustrate && (
        <span className="mock-tag absolute -top-2 right-0 z-10 font-ft text-[.5rem] tracking-[.12em] uppercase text-ink-3 border border-rule-hi rounded px-1.5 py-0.5 bg-paper">
          Illustration
        </span>
      )}
      {body}
    </div>
  );
}
