import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Phones see public/resume.webp, not the PDF. A new PDF without a new picture
// would show them the old CV.
test('the phone preview of the CV matches the current PDF', () => {
  const pdf = createHash('sha256').update(readFileSync('public/resume.pdf')).digest('hex');
  const rendered = readFileSync('src/data/resume-preview.sha256', 'utf8').trim();
  assert.equal(rendered, pdf, 'resume.pdf changed: run scripts/resume-preview.sh');
});
