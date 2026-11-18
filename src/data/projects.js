// Portfolio projects. Each project gets a detail page at /work/<id>.
//
// - pdf: { src: '/projects/<file>.pdf' } shows the deck; null shows "Deck coming soon".
// - draft: true hides the project everywhere until it is ready.
// - context / outcome: shown on the detail page.
export const projects = [
  {
    id: 'ocean-health',
    type: 'Business Case',
    industry: 'Banking × Healthcare',
    title: 'Ocean Health',
    summary: 'Reframing hospital reimbursement pressure as a liquidity and ecosystem problem — then designing a banking-led solution.',
    year: '2026',
    role: 'Strategy · Market Analysis · Solution Design',
    accent: 'navy',
    tags: ['Cash conversion cycle', 'BPJS reimbursement', 'Working capital'],
    context: '[Placeholder] Describe the problem and background of this project.',
    outcome: '[Placeholder] Describe the result, key insight, or achievement.',
    pdf: null,
    draft: false,
  },
  {
    id: 'telkom-product',
    type: 'Business Development',
    industry: 'Telecommunications',
    title: 'From Product Chaos to Product Clarity',
    summary: 'Standardising product, pricing, and process information for a large enterprise learning ecosystem.',
    year: '2026',
    role: 'Business Development · Process Design · Pricing Research',
    accent: 'mint',
    tags: ['Product taxonomy', 'Pricing', 'Process'],
    context: '[Placeholder] Describe the problem and background of this project.',
    outcome: '[Placeholder] Describe the result, key insight, or achievement.',
    pdf: null,
    draft: false,
  },
  {
    id: 'rag-research',
    type: 'Research',
    industry: 'AI × Information Systems',
    title: 'RAG for Business News Q&A',
    summary: 'Comparing large language models in retrieval-augmented business Q&A, with an emphasis on usefulness rather than benchmark theatre.',
    year: '2026',
    role: 'Research · NLP · Evaluation Design',
    accent: 'violet',
    tags: ['Retrieval', 'Context', 'Grounding'],
    context: '[Placeholder] Describe the problem and background of this project.',
    outcome: '[Placeholder] Describe the result, key insight, or achievement.',
    pdf: null,
    draft: false,
  },
  {
    id: 'digital-process',
    type: 'Strategy',
    industry: 'Digital Transformation',
    title: 'AI × Business Process Optimization',
    summary: 'Exploring how AI can improve business process management without turning transformation into a shiny-tech exercise.',
    year: '2025',
    role: 'Research · BPM · Strategy',
    accent: 'lime',
    tags: ['Process', 'Waste', 'Decisions'],
    context: '[Placeholder] Describe the problem and background of this project.',
    outcome: '[Placeholder] Describe the result, key insight, or achievement.',
    pdf: null,
    draft: false,
  },
  {
    id: 'consumer-strategy',
    type: 'Business Case',
    industry: 'FMCG',
    // TODO(client): rename title/summary to match the Kita Ngantuk (GMBCC semifinal) deck.
    title: 'Consumer Strategy Lab',
    summary: 'A consumer-focused case exploring positioning, customer insight, and strategic growth under competitive pressure.',
    year: '2025',
    role: 'Market Research · Consumer Insight · Storytelling',
    accent: 'sand',
    tags: ['Need states', 'Jobs-to-be-done', 'Context'],
    context: '[Placeholder] Describe the problem and background of this project.',
    outcome: '[Placeholder] Describe the result, key insight, or achievement.',
    pdf: { src: '/projects/kita-ngantuk-gmbcc-semifinal.pdf' },
    draft: false,
  },
];

export const filters = ['All', 'Business Case', 'Strategy', 'Business Development', 'Research'];

export function getPublishedProjects() {
  return projects.filter((project) => !project.draft);
}

export function getProjectById(id) {
  return getPublishedProjects().find((project) => project.id === id);
}

export function getAdjacentProjects(id) {
  const list = getPublishedProjects();
  const index = list.findIndex((project) => project.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}
