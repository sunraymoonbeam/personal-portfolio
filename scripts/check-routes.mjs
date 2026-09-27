import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Exercise the actual Astro loaders and getStaticPaths, not a duplicate schema.
// The fixture checkout is disposable; no test entry can reach the real build.
const root = fileURLToPath(new URL('../', import.meta.url));

// The fixture checkout lives INSIDE the repo, not in /tmp.
//
// It used to sit in the system temp directory with `node_modules` symlinked
// back here. That broke the moment the site started importing an .astro
// component from a package (astro's own ClientRouter): resolving through the
// symlink gave Astro's compiler two different paths for the same file, so its
// metadata lookup missed and the build died with "No cached compile metadata
// found". Placing the fixture under the repo means Node finds the real
// node_modules by walking up, with no symlink and no second path.
const scratch = realpathSync(mkdtempSync(path.join(root, '.route-fixture-')));
// The id has to reach the rendered page, or "did this entry get listed?" is
// unanswerable. Project and play rows print the title, but a work row prints
// the ROLE, so the work fixture carries its id there. This assertion was
// failing silently before, because the fixture's role was a fixed string.
const fields = {
  projects: () => 'claim: Route policy fixture\npublished: 2099-01\ntags: [Test]',
  work: (id) => `employer: carro\nrole: ${id}\nkind: Full-time\nlocation: Test\nstart: 2099-01`,
  play: () => 'caption: Route policy fixture\npublished: 2099-01',
};
function fixture(collection, id, flags) {
  const folder = path.join(scratch, 'src/content', collection, id);
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, 'index.mdx'), `---\ntitle: ${id}\nsummary: Route policy fixture.\n${fields[collection](id)}\n${flags}\n---\n\nTest body.\n`);
}
const html = route => readFileSync(path.join(scratch, 'dist', route, 'index.html'), 'utf8');

// The collection name is not the URL segment: `play` is served at /hobbies.
// Keep this in step with ROUTE_SEGMENT in src/lib/select.ts.
const segment = { projects: 'projects', work: 'work', play: 'hobbies' };
try {
  for (const file of ['src', 'astro.config.mjs', 'package.json', 'tsconfig.json']) {
    cpSync(path.join(root, file), path.join(scratch, file), { recursive: true });
  }
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
      assert.equal(existsSync(path.join(scratch, 'dist', segment[collection], id, 'index.html')), false, `${collection}/${id} generated a route`);
    }
    const index = html(segment[collection]);
    assert.ok(!index.includes('qa-draft'), `${collection} index exposed a draft`);
    assert.ok(index.includes('qa-listing'), `${collection} omitted its listing-only entry`);
    assert.ok(!index.includes(`href="/${segment[collection]}/qa-listing`), `${collection} linked to a missing article`);
  }
  assert.ok(!html('work').includes('qa-unlisted'), 'Unlisted role appeared in ledger');
  assert.ok(html('work/qa-unlisted').includes('Test body.'), 'Unlisted article was not generated');
  assert.ok(html('projects/qa-shared').includes('Test body.'));
  assert.ok(html('hobbies/qa-shared').includes('Test body.'));
  assert.ok(html('hobbies').includes('href="/projects/qa-shared"'), 'Cross-listed project lost its canonical route');
  const sitemap = readFileSync(path.join(scratch, 'dist/sitemap-0.xml'), 'utf8');
  assert.ok(!sitemap.includes('qa-draft') && !sitemap.includes('qa-listing'));
  console.log('Route integration checks passed: drafts, listing-only entries, unlisted roles, cross-collection IDs and sitemap.');
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
  throw error;
} finally {
  // Only the unique directory created above, never a user checkout.
  // It is inside the repo, so leaving it behind would be visible in git status.
  rmSync(scratch, { recursive: true, force: true });
}
