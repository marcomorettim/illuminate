// Orchestrator for the DETERMINISTIC stages (0-2, 5-8). The two agent stages (3 develop,
// 4 componentize-data) are dispatched by the skill's Stage III via the Task tool — a pure Node
// script cannot spawn subagents — so this runner prepares their inputs, then (once node outputs
// exist under .work/nodes) assembles, bundles, and gates, returning the gate verdict. Stage 9
// (repair) = the skill re-dispatches only the agents named in gate-report.failing_nodes, then
// re-runs `assemble`. Usage:
//   node pipeline.mjs prepare <source.docx>      # stages 0-2 + bible/records  → then dispatch agents
//   node pipeline.mjs assemble                   # stages 5-8: build + gate    → gate-report.json
import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const HERE = resolve(import.meta.dirname, '..');           // build/
const W = resolve(HERE, '.work');
const run = (cmd) => execSync(cmd, { cwd: HERE, stdio: 'inherit' });
const [cmd, arg] = process.argv.slice(2);

if (cmd === 'prepare') {
  if (!arg) throw new Error('usage: pipeline.mjs prepare <source.docx>');
  run(`python3 scripts/ingest.py "${arg}" .work/source-model.json`);        // Stage 0
  run(`python3 scripts/manifest.py .work/source-model.json .work/manifest.json`); // Stages 1-2
  run(`python3 scripts/prepare.py .work/source-model.json .work/manifest.json .work`); // bible + records
  const drivers = readdirSync(resolve(W, 'drivers')).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  console.log(`\n[pipeline] ready. Now dispatch one develop-node agent per driver (${drivers.length}):`);
  console.log('  ' + drivers.join(', '));
  console.log('  each: read agents/develop-node.md + .work/bible.md + .work/drivers/<id>.json → write .work/nodes/<id>.json');
  console.log('Then: node pipeline.mjs assemble');
} else if (cmd === 'assemble') {
  const n = existsSync(resolve(W, 'nodes')) ? readdirSync(resolve(W, 'nodes')).filter((f) => f.endsWith('.json')).length : 0;
  if (!n) throw new Error('no node outputs in .work/nodes — dispatch the develop agents first');
  run('node scripts/build.mjs .work/manifest.json .work/source-model.json .work/nodes app dist/illuminate.html'); // Stages 5-7
  try {
    run('node gate/gate.mjs dist/illuminate.html .work/manifest.json gate/thresholds.json dist/gate-report.json'); // Stage 8
    console.log('[pipeline] GATE PASS — dist/illuminate.html is shippable.');
  } catch {
    console.log('[pipeline] GATE FAIL — see dist/gate-report.json. Stage 9: re-dispatch the failing nodes\' agents, then re-run assemble.');
    process.exit(1);
  }
} else {
  console.log('usage: node pipeline.mjs prepare <source.docx> | assemble');
}
