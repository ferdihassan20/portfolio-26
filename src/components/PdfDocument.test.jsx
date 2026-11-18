import { render, screen } from '@testing-library/react';
import PdfDocument from './PdfDocument';

// Document stays in its loading state, as on a stalled connection.
vi.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: ({ loading }) => loading,
  Page: () => null,
}));

test('while the deck is loading, visitors can still download the PDF', () => {
  render(<PdfDocument src="/projects/a.pdf" title="A" />);
  expect(screen.getByText('Loading deck…')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/projects/a.pdf');
});
