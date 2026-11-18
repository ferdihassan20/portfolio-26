import { fileURLToPath } from 'node:url';

export const SAMPLE_DECK = '/e2e/sample-deck.pdf';
const fixture = fileURLToPath(new URL('./fixtures/sample-deck.pdf', import.meta.url));

// The e2e build adds a "Sample Deck" project whose PDF is served from the test fixture.
export async function serveSampleDeck(page) {
  await page.route((url) => url.pathname === SAMPLE_DECK, (route) => route.fulfill({ path: fixture, contentType: 'application/pdf' }));
}
