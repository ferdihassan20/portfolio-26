import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SiteHeader from './SiteHeader';

function renderHeader() {
  return render(<MemoryRouter><SiteHeader /></MemoryRouter>);
}

test('nav links follow section order', () => {
  renderHeader();
  const nav = screen.getByRole('navigation');
  const labels = within(nav).getAllByRole('link')
    .map((a) => a.textContent.trim())
    .filter((t) => !/download cv/i.test(t));
  expect(labels).toEqual(['ABOUT', 'WORK', 'APPROACH', 'EXPERIENCE', 'CONTACT']);
});

test('nav links point at home sections', () => {
  renderHeader();
  expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '/#about');
  expect(screen.getByRole('link', { name: 'CONTACT' })).toHaveAttribute('href', '/#contact');
});

test('Download CV links to the CV with download attribute, in header and mobile menu', () => {
  renderHeader();
  const links = screen.getAllByRole('link', { name: /download cv/i });
  expect(links).toHaveLength(2);
  for (const cv of links) {
    expect(cv).toHaveAttribute('href', '/cv/ferdi-hassan-cv.pdf');
    expect(cv).toHaveAttribute('download');
  }
});

test('header no longer has the VIEW MY WORK CTA', () => {
  renderHeader();
  expect(screen.queryByText(/view my work/i)).toBeNull();
});
