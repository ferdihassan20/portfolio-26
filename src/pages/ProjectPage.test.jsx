import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ProjectPage from './ProjectPage';
import { projects } from '../data/projects';

vi.mock('../components/PdfViewer', () => ({
  default: ({ src }) => <div data-testid="pdf" data-src={String(src)} />,
}));

function renderAt(id) {
  return render(
    <MemoryRouter initialEntries={[`/work/${id}`]}>
      <Routes><Route path="/work/:id" element={<ProjectPage />} /></Routes>
    </MemoryRouter>,
  );
}

test('renders project details in the info panel', () => {
  renderAt('ocean-health');
  expect(screen.getByRole('heading', { level: 1, name: 'Ocean Health' })).toBeInTheDocument();
  for (const text of ['Business Case', '2026', 'Banking × Healthcare', 'Strategy · Market Analysis · Solution Design']) {
    expect(screen.getByText(text)).toBeInTheDocument();
  }
  expect(screen.getByRole('heading', { name: /context/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /outcome/i })).toBeInTheDocument();
  expect(screen.getByTestId('pdf')).toHaveAttribute('data-src', 'null');
});

test('back link goes to the Work section', () => {
  renderAt('ocean-health');
  expect(screen.getByRole('link', { name: '← Back to Work' })).toHaveAttribute('href', '/#work');
});

test('previous / next link to neighbours (wrapping)', () => {
  renderAt('ocean-health');
  expect(screen.getByRole('link', { name: /previous project/i })).toHaveAttribute('href', '/work/consumer-strategy');
  expect(screen.getByRole('link', { name: /next project/i })).toHaveAttribute('href', '/work/telkom-product');
});

test('sets the document title and restores it on leave', () => {
  document.title = 'Home title';
  const { unmount } = renderAt('ocean-health');
  expect(document.title).toBe('Ocean Health — Ferdi Hassan');
  unmount();
  expect(document.title).toBe('Home title');
});

test('Download PDF is absent when the project has no PDF', () => {
  renderAt('ocean-health');
  expect(screen.queryByRole('link', { name: /download pdf/i })).toBeNull();
});

test('Download PDF links to the deck when there is one', () => {
  renderAt('consumer-strategy');
  const link = screen.getByRole('link', { name: /download pdf/i });
  expect(link).toHaveAttribute('href', '/projects/kita-ngantuk-gmbcc-semifinal.pdf');
  expect(link).toHaveAttribute('download');
  expect(screen.getByTestId('pdf')).toHaveAttribute('data-src', '/projects/kita-ngantuk-gmbcc-semifinal.pdf');
});

test.each(['nope', 'hidden-draft'])('unknown or draft id %s shows Project not found', (id) => {
  projects.push({ ...projects[0], id: 'hidden-draft', draft: true });
  try {
    renderAt(id);
    expect(screen.getByText('Project not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Back to Work' })).toHaveAttribute('href', '/#work');
    expect(screen.queryByTestId('pdf')).toBeNull();
  } finally {
    projects.pop();
  }
});
