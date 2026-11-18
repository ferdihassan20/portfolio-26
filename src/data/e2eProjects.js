// Only used by end-to-end tests (vite build --mode e2e). The PDF is served by the tests
// from e2e/fixtures/sample-deck.pdf, so nothing here ships to the live site.
export const e2eProjects = [
  {
    id: 'e2e-sample-deck',
    type: 'Research',
    industry: 'Test fixture',
    title: 'Sample Deck',
    summary: 'A 35-page sample deck used by the browser tests.',
    year: '2026',
    role: 'Test',
    accent: 'violet',
    tags: ['Sample', 'Deck', 'Fixture'],
    context: 'Sample context.',
    outcome: 'Sample outcome.',
    pdf: { src: '/e2e/sample-deck.pdf' },
    draft: false,
  },
];
