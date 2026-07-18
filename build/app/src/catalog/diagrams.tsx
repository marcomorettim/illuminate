import { useMemo } from 'react';
import { sankey as d3sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { ReactFlow, Background, Handle, Position, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { INK, INK2, INK3, CEN, RULE, BEITAR, BEITAR_FG } from './tokens';

/* ── Sankey — source→use volume flows (d3-sankey); band ∝ value; Beitar marks the finding flow ── */
export function Sankey({ data }: { data: { nodes: { id: string; label: string }[]; links: { source: number; target: number; value: number; finding?: boolean }[]; unit?: string } }) {
  const W = 560, H = 300;
  const { nodes, links } = useMemo(() => {
    const gen = d3sankey<any, any>().nodeWidth(12).nodePadding(16).extent([[4, 8], [W - 4, H - 8]]);
    const g = gen({ nodes: data.nodes.map((n) => ({ ...n })), links: data.links.map((l) => ({ ...l })) });
    return { nodes: g.nodes, links: g.links };
  }, [data]);
  const path = sankeyLinkHorizontal();
  return (
    <figure className="my-5" data-component="sankey">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="flow diagram">
        {links.map((l: any, i: number) => (
          <path key={i} d={path(l) || ''} fill="none" stroke={l.finding ? BEITAR : INK3}
            strokeOpacity={l.finding ? 0.85 : 0.32} strokeWidth={Math.max(1, l.width)} />
        ))}
        {nodes.map((n: any, i: number) => (
          <g key={i}>
            <rect x={n.x0} y={n.y0} width={n.x1 - n.x0} height={Math.max(2, n.y1 - n.y0)} fill={INK} rx={1.5} />
            <text x={n.x0 < W / 2 ? n.x1 + 6 : n.x0 - 6} y={(n.y0 + n.y1) / 2} dy="0.35em"
              textAnchor={n.x0 < W / 2 ? 'start' : 'end'} className="font-ft fill-[color:var(--ink)] text-[10px] font-semibold">{n.label}</text>
          </g>
        ))}
      </svg>
      {data.unit && <figcaption className="text-[11px] text-cenere font-mono mt-1">flows in {data.unit}</figcaption>}
    </figure>
  );
}

/* ── FlowDiagram — a process / journey / architecture (react-flow); the finding node in Beitar ── */
function FlowNode({ data }: { data: { label: string; sub?: string; finding?: boolean } }) {
  return (
    <div className="rounded-md border px-3 py-2 text-center min-w-[110px]" style={{ borderColor: 'var(--ink)', background: data.finding ? BEITAR : 'var(--paper-1)', color: data.finding ? BEITAR_FG : 'var(--ink)' }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="font-ft text-[11px] font-bold leading-tight">{data.label}</div>
      {data.sub && <div className="text-[9px] mt-0.5" style={{ color: data.finding ? BEITAR_FG : 'var(--ink-2)' }}>{data.sub}</div>}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
const flowTypes = { fnode: FlowNode };
export function FlowDiagram({ data }: { data: { steps: { id: string; label: string; sub?: string; finding?: boolean }[]; edges: [string, string, string?][] } }) {
  const nodes: Node[] = data.steps.map((s, i) => ({ id: s.id, type: 'fnode', position: { x: i * 190, y: (i % 2) * 96 }, data: s }));
  const edges: Edge[] = data.edges.map(([s, t, label], i) => ({ id: 'e' + i, source: s, target: t, label, animated: false, style: { stroke: INK3 }, labelStyle: { fontSize: 9, fill: CEN } }));
  return (
    <figure className="my-5 h-[280px] border border-rule rounded-lg bg-paper-1" data-component="flow">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={flowTypes} fitView proOptions={{ hideAttribution: true }} nodesDraggable={false} zoomOnScroll={false} panOnDrag={false}>
        <Background gap={18} color="var(--rule)" />
      </ReactFlow>
    </figure>
  );
}

/* ── Network — hub + spokes (a centre fed by / feeding its parts); Beitar hub is the finding ── */
export function Network({ data }: { data: { hub: { label: string; sub?: string }; spokes: { label: string; sub?: string }[]; caption?: string } }) {
  const cx = 210, cy = 140, R = 100, n = data.spokes.length || 1;
  const pts = data.spokes.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  return (
    <figure className="my-5 max-w-[460px] mx-auto" data-component="network">
      <svg viewBox="0 0 420 290" className="w-full h-auto" role="img" aria-label="network graph">
        {pts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={INK3} strokeWidth="1.25" />)}
        {pts.map((p, i) => (
          <g key={'n' + i} textAnchor="middle" className="font-ft">
            <circle cx={p.x} cy={p.y} r="28" fill="var(--paper-1)" stroke={INK} strokeWidth="1.25" />
            <text x={p.x} y={p.y - 1} className="fill-[color:var(--ink)] text-[10px] font-bold">{data.spokes[i].label}</text>
            {data.spokes[i].sub && <text x={p.x} y={p.y + 9} className="fill-[color:var(--ink-2)] text-[6px]">{data.spokes[i].sub}</text>}
          </g>
        ))}
        <circle cx={cx} cy={cy} r="36" fill={BEITAR} stroke={INK} strokeWidth="1.5" />
        <text x={cx} y={cy - 1} textAnchor="middle" className="font-ft text-[12px] font-bold" fill={BEITAR_FG}>{data.hub.label}</text>
        {data.hub.sub && <text x={cx} y={cy + 10} textAnchor="middle" className="font-ft text-[6px]" fill={BEITAR_FG}>{data.hub.sub}</text>}
      </svg>
      {data.caption && <figcaption className="text-center text-[11px] text-cenere font-mono">{data.caption}</figcaption>}
    </figure>
  );
}

/* ── ScenarioTree — root → weighted branches; Beitar marks the load-bearing branch ── */
export function ScenarioTree({ data }: { data: { root: string; branches: { label: string; prob?: string; value?: string; note?: string }[] } }) {
  return (
    <figure className="my-5" data-component="scenario-tree">
      <div className="font-ft font-bold text-[12px] uppercase tracking-wider text-cenere mb-2">{data.root}</div>
      <div className="grid gap-2">
        {data.branches.map((b, i) => (
          <div key={i} className="flex items-baseline gap-3 border-l-2 pl-3 py-1" style={{ borderColor: i === 0 ? BEITAR : 'var(--rule)' }}>
            <span className="font-mono text-[12px] text-cenere w-12 shrink-0">{b.prob ?? ''}</span>
            <span className="text-[14px] text-ink font-bold shrink-0">{b.label}</span>
            {b.value && <span className="font-mono text-[13px] text-ink-2">{b.value}</span>}
            {b.note && <span className="text-[13px] text-cenere">{b.note}</span>}
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ── Timeline — phases/events on a time axis (Gantt-ish); Beitar marks the critical span ── */
export function Timeline({ data }: { data: { phases: { label: string; start: number; end: number; finding?: boolean; status?: string }[]; axis?: [number, number]; unit?: string } }) {
  const [lo, hi] = data.axis ?? [Math.min(...data.phases.map((p) => p.start)), Math.max(...data.phases.map((p) => p.end))];
  const W = 620, rowH = 30, padL = 8, padR = 8, top = 22;
  const H = top + data.phases.length * rowH + 8;
  const x = (v: number) => padL + ((v - lo) / (hi - lo || 1)) * (W - padL - padR);
  const ticks = Array.from({ length: 6 }, (_, i) => lo + ((hi - lo) * i) / 5);
  return (
    <figure className="my-5" data-component="timeline">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="timeline">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={x(t)} y1={top - 6} x2={x(t)} y2={H - 6} stroke={RULE} strokeWidth="1" />
            <text x={x(t)} y={top - 10} textAnchor="middle" className="font-mono fill-[color:var(--cenere)] text-[9px]">{Math.round(t)}{data.unit ?? ''}</text>
          </g>
        ))}
        {data.phases.map((p, i) => {
          const y = top + i * rowH;
          return (
            <g key={i}>
              <rect x={x(p.start)} y={y + 4} width={Math.max(3, x(p.end) - x(p.start))} height={rowH - 12} rx={3}
                fill={p.finding ? BEITAR : INK2} />
              <text x={x(p.start) + 4} y={y + rowH - 12} className="font-ft fill-[color:var(--ink)] text-[10px] font-semibold"
                style={{ fill: p.finding ? BEITAR_FG : 'var(--paper)' }}>{p.label}</text>
              {p.status && <text x={x(p.end) + 6} y={y + rowH - 12} className="font-mono fill-[color:var(--cenere)] text-[8px]">{p.status}</text>}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/* ── GeoMap — schematic spatial layout (zones / network / supply chain); Beitar = the finding place ── */
export function GeoMap({ data }: { data: { places: { label: string; sub?: string; x: number; y: number; value?: string; finding?: boolean }[]; links?: [number, number][]; caption?: string } }) {
  const W = 420, H = 270;
  const px = (v: number) => 22 + (v / 100) * (W - 44), py = (v: number) => 18 + (v / 100) * (H - 40);
  return (
    <figure className="my-5 max-w-[560px]" data-component="map">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="schematic map">
        <rect x="1" y="1" width={W - 2} height={H - 2} rx="8" fill="var(--paper-1)" stroke={RULE} strokeWidth="1" />
        {(data.links ?? []).map(([a, b], i) => {
          const pa = data.places[a], pb = data.places[b]; if (!pa || !pb) return null;
          return <line key={i} x1={px(pa.x)} y1={py(pa.y)} x2={px(pb.x)} y2={py(pb.y)} stroke={INK3} strokeWidth="1" strokeOpacity="0.4" />;
        })}
        {data.places.map((p, i) => (
          <g key={i} textAnchor="middle" className="font-ft">
            <circle cx={px(p.x)} cy={py(p.y)} r={p.finding ? 8 : 5.5} fill={p.finding ? BEITAR : INK2} stroke={INK} strokeWidth="1" />
            <text x={px(p.x)} y={py(p.y) - 11} className="fill-[color:var(--ink)] text-[8.5px] font-bold">{p.label}</text>
            {p.value && <text x={px(p.x)} y={py(p.y) + 15} className="fill-[color:var(--ink-2)] text-[7.5px] font-mono">{p.value}</text>}
          </g>
        ))}
      </svg>
      {data.caption && <figcaption className="text-[11px] text-cenere font-mono mt-1">{data.caption}</figcaption>}
    </figure>
  );
}
