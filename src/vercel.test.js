import config from '../vercel.json';

test('rewrites app routes to index.html but not static files', () => {
  const rule = config.rewrites.find((r) => r.destination === '/index.html');
  const re = new RegExp(`^${rule.source}$`);
  expect(re.test('/work/ocean-health')).toBe(true);
  expect(re.test('/')).toBe(true);
  expect(re.test('/projects/kita-ngantuk-gmbcc-semifinal.pdf')).toBe(false);
  expect(re.test('/cv/ferdi-hassan-cv.pdf')).toBe(false);
  expect(re.test('/assets/index-abc.js')).toBe(false);
});
