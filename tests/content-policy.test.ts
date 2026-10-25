import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'astro/zod';
import { selectFeatured, getAdjacent, keyOf, type ArticleLink } from '../src/lib/select.ts';
import { formatMonth, formatRange, formatDuration, monthKey, yearOf } from '../src/lib/date.ts';
import { readFileSync } from 'node:fs';

// ── the schema behaviour the whole content contract rests on ────────────────

test('nested objects need their own .strict() — an outer one does not propagate', () => {
  const loose = z.object({
    title: z.string(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })),
  }).strict();
  const bad = { title: 'x', metrics: [{ value: '12', label: 'agents', contex: 'typo' }] };

  // This is the trap: the outer .strict() accepts it and drops the typo.
  const loosely = loose.safeParse(bad);
  assert.equal(loosely.success, true);
  assert.deepEqual(Object.keys((loosely as any).data.metrics[0]), ['value', 'label']);

  // Which is why every nested object in content.config.ts is .strict() too.
  const strict = z.object({
    title: z.string(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() }).strict()),
  }).strict();
  assert.equal(strict.safeParse(bad).success, false);
});

test('a misspelled top-level key fails', () => {
  const s = z.object({ title: z.string(), summary: z.string().optional() }).strict();
  assert.equal(s.safeParse({ title: 'x', sumary: 'typo' }).success, false);
});

// ── selection policy ────────────────────────────────────────────────────────

const entry = (id: string, featuredOrder?: number) => ({ id, data: { featuredOrder } });

test('selectFeatured honours featuredOrder and ignores unfeatured entries', () => {
  const got = selectFeatured([entry('c', 3), entry('a', 1), entry('x'), entry('b', 2)], 2);
  assert.deepEqual(got.map((e) => e.id), ['a', 'b']);
});

test('selectFeatured returns nothing when nothing is featured', () => {
  assert.deepEqual(selectFeatured([entry('a'), entry('b')], 3), []);
});

test('getAdjacent follows listing order and stops at the ends', () => {
  const links: ArticleLink[] = [
    { key: keyOf('work', 'new'), href: '/work/new', title: 'New' },
    { key: keyOf('work', 'mid'), href: '/work/mid', title: 'Mid' },
    { key: keyOf('work', 'old'), href: '/work/old', title: 'Old' },
  ];
  const mid = getAdjacent(links, keyOf('work', 'mid'));
  assert.equal(mid.prev?.title, 'New');
  assert.equal(mid.next?.title, 'Old');

  assert.equal(getAdjacent(links, keyOf('work', 'new')).prev, undefined);
  assert.equal(getAdjacent(links, keyOf('work', 'old')).next, undefined);
});

test('keys are collection-qualified so ids cannot collide across collections', () => {
  assert.notEqual(keyOf('projects', 'homelab'), keyOf('hobbies', 'homelab'));
});

// ── dates: never constructed as a Date ──────────────────────────────────────

test('months format without inventing a day or shifting a timezone', () => {
  assert.equal(formatMonth('2025-07'), 'Jul 2025');
  assert.equal(formatMonth('2025-01'), 'Jan 2025');
  assert.equal(formatMonth('2025-12'), 'Dec 2025');
  assert.equal(yearOf('2025-07'), '2025');
});

test('an open-ended range reads as Present', () => {
  assert.equal(formatRange('2025-07'), 'Jul 2025 – Present');
  assert.equal(formatRange('2023-09', '2024-01'), 'Sep 2023 – Jan 2024');
});

test('durations are inclusive of both endpoints', () => {
  assert.equal(formatDuration('2023-09', '2024-01'), '5 mos');
  assert.equal(formatDuration('2022-07', '2023-02'), '8 mos');
  assert.equal(formatDuration('2024-06', '2025-04'), '11 mos');
  assert.equal(formatDuration('2024-01', '2025-03'), '1 yr 3 mos');
});

test('monthKey sorts chronologically', () => {
  assert.ok(monthKey('2025-07') > monthKey('2025-06'));
  assert.ok(monthKey('2025-01') > monthKey('2024-12'));
});

/*
 * A chevron with only `grid-column: 3` and no `grid-row` sat before .body in
 * the DOM, so auto-placement pushed .body onto row 2 column 1 and every role
 * rendered in a 190px ribbon above 800px. Nothing below 801px could see it,
 * because the mobile branch collapses to one column. Pin all three children.
 */
test('every work row child is placed explicitly, so auto-placement cannot move it', () => {
  const css = readFileSync(
    new URL('../src/components/work/WorkList.astro', import.meta.url), 'utf8');
  for (const sel of ['.rail', '.body', '.open']) {
    const rule = new RegExp(`\\${sel}[^{]*\\{[^}]*grid-column:\\s*\\d+;\\s*grid-row:\\s*1`);
    assert.ok(rule.test(css), `${sel} needs an explicit grid-column and grid-row: 1`);
  }
});


// ── wide tables stack on a phone ─────────────────────────────────────────────

test('a wide table is labelled for stacking; narrow tables and group rows are left alone', async () => {
  const { labelTableHtml, STACK_FROM, WORDY_CELL } = await import('../src/lib/table-labels.ts');
  const head = (n: number) => `<thead><tr>${Array.from({ length: n }, (_, i) => `<th>H<em>${i}</em> &amp; co</th>`).join('')}</tr></thead>`;
  const row = (n: number) => `<tr>${Array.from({ length: n }, (_, i) => `<td>v${i}</td>`).join('')}</tr>`;

  const wide = labelTableHtml(`${head(STACK_FROM)}<tbody><tr><th colspan="4">Group</th></tr>${row(STACK_FROM)}</tbody>`);
  assert.equal(wide.stack, true);
  assert.match(wide.html, /<th colspan="4">Group<\/th>/); // group row untouched
  assert.deepEqual([...wide.html.matchAll(/data-label="([^"]*)"/g)].map((m) => m[1]),
    ['H0 &amp; co', 'H1 &amp; co', 'H2 &amp; co', 'H3 &amp; co']);

  const narrow = labelTableHtml(`${head(STACK_FROM - 1)}<tbody>${row(STACK_FROM - 1)}</tbody>`);
  assert.equal(narrow.stack, false);
  assert.doesNotMatch(narrow.html, /data-label/);

  // Three columns stack only once a cell runs to a sentence.
  const sentence = 'x'.repeat(WORDY_CELL + 1);
  const wordy = labelTableHtml(`${head(3)}<tbody><tr><td>a</td><td>b</td><td>${sentence}</td></tr></tbody>`);
  assert.equal(wordy.stack, true);
  assert.equal(labelTableHtml(`${head(2)}<tbody><tr><td>a</td><td>${sentence}</td></tr></tbody>`).stack, false);
});
