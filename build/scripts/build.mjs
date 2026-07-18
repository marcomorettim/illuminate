// Stages 5-6 — Assemble & bundle. Writes the argument-model straight to app/src/model.json (the
// generic renderer imports it) and vite-builds + singlefile-inlines to one offline HTML.
// Usage: node build.mjs <argument-model.json> <app-dir> <out.html>
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const [modelPath, appDir, outHtml] = process.argv.slice(2);
const M = JSON.parse(readFileSync(modelPath, 'utf8'));

// the renderer reads this verbatim; it is the II→III seam, nothing is re-derived here
writeFileSync(join(appDir, 'src/model.json'), JSON.stringify(M));

execSync('node_modules/.bin/vite build', { cwd: appDir, stdio: 'inherit' });
copyFileSync(join(appDir, 'dist/index.html'), outHtml);
const nodes = Object.values(M.nodes);
const kb = (readFileSync(outHtml).length / 1024).toFixed(1);
console.log(`[build] rendered ${nodes.length} nodes, ${nodes.filter((n) => n.component).length} components -> ${outHtml} (${kb} KB)`);
