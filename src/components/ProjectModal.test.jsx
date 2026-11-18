import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import ProjectModal from './ProjectModal';
import { getProjectById } from '../data/projects';

vi.mock('./PdfViewer', () => ({
  default: ({ src }) => <div data-testid="pdf" data-src={String(src)} />,
}));

const ocean = getProjectById('ocean-health');

function renderModal(onClose = vi.fn(), project = ocean) {
  const utils = render(<MemoryRouter><ProjectModal project={project} onClose={onClose} /></MemoryRouter>);
  return { ...utils, onClose };
}

test('shows project info and passes the PDF src (null when absent)', () => {
  renderModal();
  expect(screen.getByRole('dialog', { name: /Ocean Health/ })).toBeInTheDocument();
  expect(screen.getByTestId('pdf')).toHaveAttribute('data-src', 'null');
});

test('passes the deck src for a project with a PDF', () => {
  renderModal(vi.fn(), getProjectById('consumer-strategy'));
  expect(screen.getByTestId('pdf')).toHaveAttribute('data-src', '/projects/kita-ngantuk-gmbcc-semifinal.pdf');
});

test('VIEW FULL CASE links to the detail page', () => {
  renderModal();
  expect(screen.getByRole('link', { name: 'VIEW FULL CASE →' })).toHaveAttribute('href', '/work/ocean-health');
});

test('Escape closes', async () => {
  const { onClose } = renderModal();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('close button closes', async () => {
  const { onClose } = renderModal();
  await userEvent.click(screen.getByRole('button', { name: 'Close project' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('backdrop click closes, clicks inside do not', () => {
  const { onClose } = renderModal();
  fireEvent.mouseDown(screen.getByRole('heading', { name: 'Ocean Health' }));
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.mouseDown(screen.getByRole('dialog'));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('locks body scroll while open and restores on unmount', () => {
  const { unmount } = renderModal();
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('');
});

test('no slide progress or thumbnails remain', () => {
  renderModal();
  expect(screen.queryByText(/SLIDE \d/)).toBeNull();
  expect(document.querySelector('.deck-thumbs')).toBeNull();
});
