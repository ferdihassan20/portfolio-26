import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HomePage from './HomePage';

function renderHome() {
  return render(<MemoryRouter><HomePage /></MemoryRouter>);
}

test('hero shows the portrait photo', () => {
  renderHome();
  const img = screen.getByRole('img', { name: 'Portrait of Ferdi Hassan' });
  expect(img).toHaveAttribute('src', '/images/ferdi-placeholder.svg');
});

test('decorative FH initials are gone from the hero', () => {
  renderHome();
  expect(document.querySelector('.portrait-initials')).toBeNull();
});

test('experience items have no arrow buttons', () => {
  renderHome();
  expect(document.querySelectorAll('.experience-arrow')).toHaveLength(0);
});

test.each([
  ['GitHub', 'https://github.com/'],
  ['LinkedIn', 'https://www.linkedin.com/'],
  ['Instagram', 'https://www.instagram.com/'],
])('contact links to %s in a new tab', (label, href) => {
  renderHome();
  const contact = document.getElementById('contact');
  const link = within(contact).getByRole('link', { name: new RegExp(label, 'i') });
  expect(link).toHaveAttribute('href', href);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('GET IN TOUCH uses site.email', () => {
  renderHome();
  expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', 'mailto:hello@ferdihassan.com');
});
