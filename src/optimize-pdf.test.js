import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let hasTools = true;
try { execFileSync('which', ['gs', 'qpdf']); } catch { hasTools = false; }

test.skipIf(!hasTools)('optimize-pdf reports a clear error for a file Ghostscript cannot read', () => {
  const dir = mkdtempSync(join(tmpdir(), 'opt-test-'));
  const bad = join(dir, 'not-a.pdf');
  writeFileSync(bad, 'this is not a pdf');
  let stderr = '';
  try {
    execFileSync('scripts/optimize-pdf.sh', [bad, join(dir, 'out.pdf')], { stdio: 'pipe' });
  } catch (error) {
    stderr = error.stderr.toString();
  }
  expect(stderr).toContain('Ghostscript failed');
});
