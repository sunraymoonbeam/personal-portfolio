import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Phones see public/resume.webp, not the PDF. A new PDF without a new picture
// would show them the old CV.
test('the phone preview of the CV matches the current PDF', () => {
  const sha = (f: string) => createHash('sha256').update(readFileSync(f)).digest('hex');
  const [pdf, webp] = readFileSync('src/data/resume-preview.sha256', 'utf8').trim().split('\n');
  // Both, so a hand-edited hash without a new picture cannot pass.
  assert.equal(pdf, sha('public/resume.pdf'), 'resume.pdf changed: run npm run resume:preview');
  assert.equal(webp, sha('public/resume.webp'), 'resume.webp changed by hand: run npm run resume:preview');
});
