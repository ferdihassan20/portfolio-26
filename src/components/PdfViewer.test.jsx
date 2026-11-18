import { render, screen } from '@testing-library/react';
import PdfViewer from './PdfViewer';

const { docRendered } = vi.hoisted(() => ({ docRendered: vi.fn() }));
vi.mock('./PdfDocument', () => ({
  default: (props) => {
    docRendered(props);
    return <div data-testid="doc" />;
  },
}));

beforeEach(() => docRendered.mockClear());

test('null src shows Deck coming soon and never renders the document', () => {
  render(<PdfViewer src={null} title="X" />);
  expect(screen.getByText('Deck coming soon')).toBeInTheDocument();
  expect(docRendered).not.toHaveBeenCalled();
});

test('a src renders the lazy document with that src', async () => {
  render(<PdfViewer src="/projects/a.pdf" title="A" />);
  expect(await screen.findByTestId('doc')).toBeInTheDocument();
  expect(docRendered).toHaveBeenCalledWith(expect.objectContaining({ src: '/projects/a.pdf', title: 'A' }));
});
