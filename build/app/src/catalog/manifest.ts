// CATALOG — the machine-readable menu the builder agent reads to choose a component for a node.
// Choice is by WHAT THE DATA IS (structure), never by a document's vocabulary. Every family is a
// self-contained, Beitar-themed, single-file-bundleable component. `data` is the prop shape.
export const CATALOG = [
  // ── quantities over time / composition ──
  { family: 'time-series', component: 'TimeSeries', lib: 'recharts', whenToUse: 'a metric tracked across time/periods/cohorts; ≥1 series with an ordered x-axis', evidence: 'evidence',
    data: '{ unit?, series:[{name, dash?, pts:[[x,y]]}], mark?:{name,x,y} }' },
  { family: 'area-trend', component: 'AreaTrend', lib: 'recharts', whenToUse: 'a single load/utilisation/level series where magnitude under the curve matters', evidence: 'evidence',
    data: '{ unit?, pts:[[x,y]], mark?:{x,y} }' },
  { family: 'waterfall', component: 'Waterfall', lib: 'recharts', whenToUse: 'a build-up or bridge to a total (a start value, +/- steps, an end); values are running totals', evidence: 'evidence',
    data: '{ unit?, steps:[{label, value}] }  // value = running total; last step = terminus/finding' },
  { family: 'funnel', component: 'Funnel', lib: 'recharts', whenToUse: 'a single-sided stage drop-off / conversion', evidence: 'evidence',
    data: '{ rows:[[stage, pct, count?]], cliff_index? }' },
  { family: 'two-sided-funnel', component: 'TwoSidedFunnel', lib: 'recharts', whenToUse: 'two coupled conversion pipelines (supply & demand); the shared drop-off is the finding', evidence: 'evidence',
    data: '{ left:{name, rows:[[stage,pct,count?]]}, right:{...}, cliff_index? }' },
  // ── flows / relationships / geography ──
  { family: 'sankey', component: 'Sankey', lib: 'd3-sankey', whenToUse: 'source→use volume flows that split and recombine (a balance, a data/energy/material flow)', evidence: 'illustrate',
    data: '{ nodes:[{id,label}], links:[{source(idx), target(idx), value, finding?}], unit? }' },
  { family: 'flow', component: 'FlowDiagram', lib: 'react-flow', whenToUse: 'a directed process / journey / lifecycle / architecture with labelled steps and edges', evidence: 'illustrate',
    data: '{ steps:[{id,label,sub?,finding?}], edges:[[fromId,toId,label?]] }' },
  { family: 'network', component: 'Network', lib: 'svg', whenToUse: 'a hub-and-spoke structure where a centre is fed by / feeds several parts (an ecosystem, a platform)', evidence: 'illustrate',
    data: '{ hub:{label,sub?}, spokes:[{label,sub?}], caption? }' },
  { family: 'map', component: 'GeoMap', lib: 'svg', whenToUse: 'named places/sites/zones/regions with values and optional links; a fleet, network, or supply chain', evidence: 'illustrate',
    data: '{ places:[{label,sub?,x(0-100),y(0-100),value?,finding?}], links?:[[i,j]], caption? }' },
  { family: 'timeline', component: 'Timeline', lib: 'svg', whenToUse: 'phases/events/workstreams along a time axis (a schedule, a Gantt, an incident sequence)', evidence: 'evidence',
    data: '{ phases:[{label,start,end,finding?,status?}], axis?:[lo,hi], unit? }' },
  { family: 'scenario-tree', component: 'ScenarioTree', lib: 'svg', whenToUse: 'a set of cases/branches (bull/base/bear, wet/dry) with weights and outcomes; the load-bearing branch is the finding', evidence: 'evidence',
    data: '{ root, branches:[{label, prob?, value?, note?}] }  // load-bearing branch first' },
  // ── metrics / tables ──
  { family: 'kpi-summary', component: 'KPIRow', lib: 'recharts', whenToUse: 'a row of headline metrics; the decisive one carries the Beitar mark; optional sparkline', evidence: 'evidence',
    data: '{ tiles:[{k, v, p?, cite?, spark?:[n], finding?}] }' },
  { family: 'gauge', component: 'Gauge', lib: 'svg', whenToUse: 'a single value against a capacity/target (utilisation, headroom)', evidence: 'evidence',
    data: '{ value, max, label, unit?, target? }' },
  { family: 'faceted-grid', component: 'DataGrid', lib: 'tanstack', whenToUse: 'a dense multi-column cross-tab best read as sortable rows; a flagged row is the finding', evidence: 'evidence',
    data: '{ cols:[str], rows:[[cell]], findingRow?, numericFrom? }' },
  // ── depicted surfaces / code ──
  { family: 'mockup', component: 'Mockup', lib: 'html', whenToUse: 'a depicted artifact — an email, push, SMS, app screen, card/statement, dashboard', evidence: 'illustrate',
    data: '{ kind, title?, lines:[str], meta?, highlight? }' },
  { family: 'code', component: 'CodePanel', lib: 'html', whenToUse: 'an algorithm, query, config, or pseudocode carried verbatim from the source', evidence: 'evidence',
    data: '{ file, code, finding? }' },
] as const;
export type CatalogFamily = (typeof CATALOG)[number]['family'];
