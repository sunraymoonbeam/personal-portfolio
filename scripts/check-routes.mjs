import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Exercise the actual Astro loaders and getStaticPaths, not a duplicate schema.
// The fixture checkout is disposable; no test entry can reach the real build.
const root = fileURLToPath(new URL('../', import.meta.url));
const scratch = realpathSync(mkdtempSync(path.join(tmpdir(), 'portfolio-route-test-')));
const fields = {
  projects: 'claim: Route policy fixture\npublished: 2099-01\ntags: [Test]',
  work: 'employer: carro\nrole: Test role\nkind: Full-time\nlocation: Test\nstart: 2099-01',
  play: 'caption: Route policy fixture\npublished: 2099-01',
};
function fixture(collection, id, flags) {
  const folder = path.join(scratch, 'src/content', collection, id);
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, 'index.mdx'), `---\ntitle: ${id}\nsummary: Route policy fixture.\n${fields[collection]}\n${flags}\n---\n\nTest body.\n`);
}
const html = route => readFileSync(path.join(scratch, 'dist', route, 'index.html'), 'utf8');
try {
  for (const file of ['src', 'astro.config.mjs', 'package.json', 'tsconfig.json']) {
    cpSync(path.join(root, file), path.join(scratch, file), { recursive: true });
  }
  symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
  for (const collection of Object.keys(fields)) {
    fixture(collection, 'qa-draft', 'draft: true\nfeaturedOrder: 99');
    fixture(collection, 'qa-listing', 'writeup: false\nfeaturedOrder: 98');
  }
  fixture('work', 'qa-unlisted', 'showInWork: false');
  fixture('projects', 'qa-shared', 'showInPlay: true');
  fixture('play', 'qa-shared', '');
  execFileSync(process.execPath, [path.join(root, 'node_modules/.bin/astro'), 'build', '--root', scratch], {
    cwd: scratch, stdio: 'pipe', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  for (const collection of Object.keys(fields)) {
    for (const id of ['qa-draft', 'qa-listing']) {
      assert.equal(existsSync(path.join(scratch, 'dist', collection, id, 'index.html')), false, `${collection}/${id} generated a route`);
    }
    const index = html(collection);
    assert.ok(!index.includes('qa-draft'), `${collection} index exposed a draft`);
    assert.ok(index.includes('qa-listing'), `${collection} omitted its listing-only entry`);
    assert.ok(!index.includes(`href="/${collection}/qa-listing`), `${collection} linked to a missing article`);
  }
  assert.ok(!html('work').includes('qa-unlisted'), 'Unlisted role appeared in ledger');
  assert.ok(html('work/qa-unlisted').includes('Test body.'), 'Unlisted article was not generated');
  assert.ok(html('projects/qa-shared').includes('Test body.'));
  assert.ok(html('play/qa-shared').includes('Test body.'));
  assert.ok(html('play').includes('href="/projects/qa-shared"'), 'Cross-listed project lost its canonical route');
  const sitemap = readFileSync(path.join(scratch, 'dist/sitemap-0.xml'), 'utf8');
  assert.ok(!sitemap.includes('qa-draft') && !sitemap.includes('qa-listing'));
  console.log('Route integration checks passed: drafts, listing-only entries, unlisted roles, cross-collection IDs and sitemap.');
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
  throw error;
} finally {
  // Only the unique directory created above, never a user checkout.
  rmSync(scratch, { recursive: true, force: true });
}
