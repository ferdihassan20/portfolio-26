import { render, screen } from '@testing-library/react';
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
