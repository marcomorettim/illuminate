// The bridge: a node's { family, data } → its catalogue component. The generic renderer walks the
// argument-model and calls this per node. ILLUSTRATE surfaces wear a tag; evidence surfaces don't.
import { TimeSeries, AreaTrend, Waterfall, Funnel, TwoSidedFunnel } from './charts';
import { Sankey, FlowDiagram, Network, ScenarioTree, Timeline, GeoMap } from './diagrams';
import { DataGrid, KPIRow, Gauge } from './data';
import { Mockup, CodePanel } from './media';

const MAP: Record<string, (p: { data: any }) => JSX.Element> = {
  'time-series': TimeSeries, 'area-trend': AreaTrend, 'waterfall': Waterfall, 'funnel': Funnel,
  'two-sided-funnel': TwoSidedFunnel, 'sankey': Sankey, 'flow': FlowDiagram, 'network': Network,
  'scenario-tree': ScenarioTree, 'timeline': Timeline, 'map': GeoMap, 'faceted-grid': DataGrid,
  'kpi-summary': KPIRow, 'gauge': Gauge, 'mockup': Mockup, 'code': CodePanel,
};

export function RenderComponent({ spec }: { spec: { family: string; data: any } | null | undefined }) {
  if (!spec) return null;
  const C = MAP[spec.family];
  if (!C) return null;
  // data-component: the gate's coverage + canvas-fill hook (families that render <div>, not <svg>).
  return <div data-component={spec.family} className="my-4"><C data={spec.data} /></div>;
}
export const CATALOG_FAMILIES = Object.keys(MAP);
