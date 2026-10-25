import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchItems } from '../src/lib/search.ts';

const inputs = {
  nav: [{ label: 'Projects', href: '/projects/' }],
  projects: [
    { id: 'echo', title: 'Echo', claim: 'A model on my messages.', writeup: true },
    { id: 'stub', title: 'Stub', claim: 'No page yet.', writeup: false },
  ],
  work: [{ id: 'carro', title: 'AI Engineer · Carro', sub: 'Ticketing agents', writeup: true }],
  hobbies: [
    { title: 'Climbing', caption: 'Up.', href: '/hobbies/climbing/' },
    { title: 'Echo', caption: 'Cross-listed.', href: '/projects/echo/' },
    { title: 'Listing only', caption: '', href: '' },
  ],
};

test('search lists pages first, then only entries that have a page', () => {
  const items = buildSearchItems(inputs);
  assert.deepEqual(items.map((i) => i.href),
    ['/projects/', '/cv/', '/contact/', '/projects/echo/', '/work/carro/', '/hobbies/climbing/']);
});

test('a project cross-listed under Hobbies appears once, as a project', () => {
  const echo = buildSearchItems(inputs).filter((i) => i.href === '/projects/echo/');
  assert.equal(echo.length, 1);
  assert.equal(echo[0]!.group, 'Projects');
});
