/**
 * Transfer-size budget for the built site, run last in `npm run verify`.
 * Counts every emitted .js file plus each distinct inline script, all CSS,
 * and the home page's HTML, gzipped at level 9 like the Docker image serves
 * them. The ceilings are this site's own headroom, not industry numbers: if
 * honest growth crosses one, raise it in a commit that says why.
 */
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : [full];
  }))).flat();
}
const gzipBytes = (value) => gzipSync(value, { level: 9 }).length;
const paths = await files(root);
let js = 0;
let css = 0;
const inline = new Set();
for (const file of paths) {
  if (!/\.(?:js|css|html)$/.test(file)) continue;
  const source = await readFile(file, 'utf8');
  if (file.endsWith('.js')) js += gzipBytes(source);
  if (file.endsWith('.css')) css += gzipBytes(source);
  if (file.endsWith('.html')) {
    for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const [, attrs, code] = match;
      if (/\bsrc\s*=|\btype\s*=\s*["']application\/(?:ld\+)?json["']/i.test(attrs)) continue;
      if (code.trim()) inline.add(code);
    }
  }
}
for (const code of inline) js += gzipBytes(code);
const home = gzipBytes(await readFile(path.join(root, 'index.html')));
const measurements = { uniqueJavaScriptGzip: js, allCssGzip: css, homeHtmlGzip: home };
console.log(JSON.stringify(measurements, null, 2));
// A small margin for editorial growth. These are transfer-size checks, not CWV scores.
assert.ok(js <= 16 * 1024, `JavaScript exceeds 16 KiB: ${js}`);
assert.ok(css <= 24 * 1024, `Stylesheets exceed 24 KiB: ${css}`);
assert.ok(home <= 24 * 1024, `Home HTML exceeds 24 KiB: ${home}`);
