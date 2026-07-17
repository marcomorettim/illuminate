import React from 'react';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { CodeBlock, DataTable } from './ui';
import { ComponentSpec } from './types';

// Generic, data-driven renderers keyed by family. code/faceted-grid carry verbatim source
// artifacts; the rest carry the develop-agent's traced data. §3.4: monochrome (ink + cenere
// tints), Beitar (#FFCC00) marks only the finding element. All have static (no-JS) fallbacks.

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
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--ink-3)" strokeWidth="1.5" />
            <circle cx={(cx + p.x) / 2} cy={(cy + p.y) / 2} r="2" fill="var(--red)" />
          </g>
        ))}
        {pts.map((p, i) => (
          <g key={'n' + i} textAnchor="middle" className="font-ft">
            <circle cx={p.x} cy={p.y} r="27" fill="var(--paper-1)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={p.x} y={p.y - 1} className="fill-[color:var(--ink)] text-[10px] font-bold">{data.spokes[i].label}</text>
            <text x={p.x} y={p.y + 9} className="fill-[color:var(--ink-2)] text-[6.2px]">{data.spokes[i].sub}</text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r="34" fill="#FFCC00" stroke="var(--ink)" strokeWidth="1.5" />
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

// ── time-series: monochrome lines (lightness + dash differentiate), Beitar dot on the mark ──
function TimeSeries({ data }: { data: Extract<ComponentSpec, { family: 'time-series' }>['data'] }) {
  const W = 540, H = 220, mL = 40, mB = 26, mT = 14, mR = 12;
  const all = data.series.flatMap((s) => s.pts);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const x = scaleLinear({ domain: [Math.min(...xs), Math.max(...xs)], range: [mL, W - mR] });
  const y = scaleLinear({ domain: [Math.min(0, ...ys), Math.max(...ys) * 1.05], range: [H - mB, mT] });
  return (
    <div className="my-4 max-w-[560px] overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[440px]" role="img" aria-label="time series">
        <line x1={mL} x2={mL} y1={mT} y2={H - mB} stroke="var(--ink-3)" />
        <line x1={mL} x2={W - mR} y1={H - mB} y2={H - mB} stroke="var(--ink-3)" />
        {data.series.map((s, i) => (
          <g key={i}>
            <LinePath data={s.pts} x={(d) => x(d[0])} y={(d) => y(d[1])}
              stroke={i === 0 ? 'var(--ink)' : 'var(--ink-2)'} strokeWidth={2} strokeDasharray={s.dash ? '5 4' : undefined} />
            <text x={x(s.pts[s.pts.length - 1][0])} y={y(s.pts[s.pts.length - 1][1]) - 5} textAnchor="end"
              className="fill-[color:var(--ink)] font-ft text-[9px] font-bold">{s.name}</text>
          </g>
        ))}
        {data.mark && <>
          <circle cx={x(data.mark.x)} cy={y(data.mark.y)} r={5} fill="#FFCC00" stroke="var(--ink)" strokeWidth={1} />
          <text x={x(data.mark.x)} y={y(data.mark.y) + 15} textAnchor="middle" className="fill-[color:var(--ink)] font-ft text-[8px] font-bold">{data.mark.name}</text>
        </>}
        {data.unit && <text x={4} y={mT + 6} className="fill-[color:var(--ink-3)] font-mono text-[8px]">{data.unit}</text>}
      </svg>
    </div>
  );
}

// ── scenario-tree: root → branches, Beitar marks the load-bearing branch ──
function ScenarioTree({ data }: { data: Extract<ComponentSpec, { family: 'scenario-tree' }>['data'] }) {
  return (
    <div className="my-4">
      <div className="font-ft font-bold text-[.66rem] uppercase tracking-wider text-ink-2 mb-2">{data.root}</div>
      <div className="grid gap-2">
        {data.branches.map((b, i) => {
          const isKey = i === 0;
          return (
            <div key={i} className={`flex items-baseline gap-3 border-l-2 pl-3 py-1 ${isKey ? 'border-beitar' : 'border-rule-hi'}`}>
              <span className="font-mono text-[.7rem] text-ink-3 w-12 shrink-0">{b.prob ?? ''}</span>
              <span className="text-[.86rem] text-ink font-bold shrink-0">{b.label}</span>
              {b.value && <span className="font-mono text-[.8rem] text-ink-2">{b.value}</span>}
              {b.note && <span className="text-[.78rem] text-ink-3">{b.note}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RenderComponent({ spec }: { spec: ComponentSpec }) {
  const inner = (() => {
    switch (spec.family) {
      case 'code': return <CodeBlock code={spec.data} />;
      case 'faceted-grid': return <DataTable table={spec.data} />;
      case 'network': return <Network data={spec.data} />;
      case 'kpi-summary': return <KPISummary data={spec.data} />;
      case 'time-series': return <TimeSeries data={spec.data} />;
      case 'scenario-tree': return <ScenarioTree data={spec.data} />;
      default: return null;
    }
  })();
  if (!inner) return null;
  return <div data-component={spec.family}>{inner}</div>;
}
