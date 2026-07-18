// The assemble contract. Stage 5 drops generated evidence.ts / content.ts / registry.ts
// that conform to these shapes; App.tsx walks them. Nothing here is source-specific.

export type TableT = {
  cols: string[];
  rows: (string | number)[][];
  foot?: (string | number)[];
  negCols?: number[]; // column indices that render financial-negative in brick
  note?: string;
};

export type Code = { file: string; lines: string }; // lines = pre-highlighted One-Dark HTML

// A node's rendered component: a family + its traced data, plus the evidence discipline fields.
// code/faceted-grid come verbatim from the source span; the bespoke families carry data the
// develop agent extracted (traced). `evidence_class` governs the ILLUSTRATION tag vs citation chips.
type ComponentBase = { finding?: string; evidence_class?: 'illustrate' | 'evidence' };
export type ComponentSpec = ComponentBase & (
  | { family: 'code'; data: Code }
  | { family: 'faceted-grid'; data: TableT }
  | { family: 'network'; data: { hub: { label: string; sub: string }; spokes: { label: string; sub: string }[]; caption?: string } }
  | { family: 'kpi-summary'; data: { tiles: { k: string; v: string; p: string; cite?: string }[] } }
  | { family: 'time-series'; data: { unit?: string; mark?: { name: string; x: number; y: number }; series: { name: string; dash?: boolean; pts: [number, number][] }[] } }
  | { family: 'scenario-tree'; data: { root: string; branches: { label: string; prob?: string; value?: string; note?: string }[] } }
  | { family: 'waterfall'; data: { unit?: string; steps: { label: string; value: number }[] } }
  | { family: 'two-sided-funnel'; data: { left: { name: string; rows: [string, number, string][] }; right: { name: string; rows: [string, number, string][] }; cliff_index?: number } }
  | { family: 'funnel'; data: { rows: [string, number, string][] } }
  | { family: 'mockup'; data: { kind: string; title: string; lines: string[]; meta?: string } }
);

// One node of the argument tree — the manifest record, now carrying its developed body.
export type NodeContent = {
  id: string;
  level: 1 | 2 | 3 | 4;          // 1 GT · 2 domain · 3 driver · 4 mechanism
  parent: string | null;
  path: string[];
  title: string;
  body: string;                   // developed HTML fragment (md→html at assemble); cites = <button class="cite" data-cite="S-NNN">
  finding?: string;               // the ONE Beitar mark (short lever) for a view (level-2 domains)
  finding_full?: string;          // the domain's full synthesis prose (rendered ink, not washed)
  component?: ComponentSpec;      // this node's required component + its traced data
  children: string[];
};

export type Manifest = {
  meta: { source: string; governing_thought: string; title: string; kicker: string };
  nodes: Record<string, NodeContent>;
  roots: string[];                // level-2 domain ids, in order (level-1 GT is meta.governing_thought)
};
