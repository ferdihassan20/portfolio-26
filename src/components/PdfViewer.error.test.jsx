import { render, screen } from '@testing-library/react';
import PdfViewer from './PdfViewer';

// Simulates the lazy PdfDocument chunk failing to download (flaky network, stale deploy).
vi.mock('./PdfDocument', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

test('a failed viewer chunk shows the PDF error with a download link, not a blank site', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <div>
      <p>Rest of the page</p>
      <PdfViewer src="/projects/a.pdf" title="A" />
    </div>,
  );
  expect(await screen.findByText("Couldn't load the PDF.")).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/projects/a.pdf');
  expect(screen.getByText('Rest of the page')).toBeInTheDocument();
});
