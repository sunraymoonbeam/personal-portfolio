import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitEmphasis } from '../src/lib/text.ts';

test('emphasis changes no words and handles more than one marked phrase', () => {
  const runs = splitEmphasis('Built **12** tools for **3** teams.');
  assert.equal(runs.map((run) => run.text).join(''), 'Built 12 tools for 3 teams.');
  assert.deepEqual(runs.filter((run) => run.em).map((run) => run.text), ['12', '3']);
});

test('unclosed emphasis remains literal', () => {
  assert.deepEqual(splitEmphasis('A **literal marker'), [{ text: 'A **literal marker' }]);
});

test('ordinary text is never interpreted as HTML', () => {
  assert.deepEqual(splitEmphasis('<script>example</script>'), [{ text: '<script>example</script>' }]);
});

test('empty text has no runs', () => {
  assert.deepEqual(splitEmphasis(''), []);
});
