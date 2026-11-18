# Portfolio Client Revisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the client's seven revisions to Ferdi Hassan's portfolio — reordered navbar with CV download, hero photo, smaller About copy, PDF-based Work preview plus `/work/:id` detail pages, no Experience arrows, social links in Contact — responsive on phone, tablet and desktop.

**Architecture:** Split the single `App.jsx` into data modules (`src/data/`), shared components (`src/components/`) and two routed pages (`src/pages/`) under React Router. PDFs are rendered with `react-pdf` (PDF.js) inside one lazily-loaded `PdfViewer` component shared by the popup and the detail page; pages render only when near the viewport. Vercel serves the SPA with a rewrite so deep links work.

**Tech Stack:** Vite 8.3.8, React 19.2.8, react-router 8.5.1, react-pdf 11.1.0 (pdfjs-dist 6.5.438), lucide-react 1.32.0; tests with Vitest 5.1.1 + Testing Library + jsdom, and Playwright 1.65.1 for browser/responsive checks.

**Spec:** `docs/superpowers/specs/2026-11-18-portfolio-client-revisions-design.md`

## Global Constraints

- All dependency versions pinned exact (no `^`, no `latest`). Build tools and test tools go in `devDependencies`.
- Keep the existing visual system in `src/styles.css` (palette tokens, Space Grotesk / DM Mono, rounded cards). New CSS uses the existing tokens.
- All new UI copy is **English**. Exact strings: `DOWNLOAD CV`, `VIEW FULL CASE →`, `← Back to Work`, `Deck coming soon`, `Loading deck…`, `Couldn't load the PDF.`, `Download PDF`, `Project not found`, `Previous project`, `Next project`.
- Navbar order exactly: `ABOUT`, `WORK`, `APPROACH`, `EXPERIENCE`, `CONTACT`.
- All client-replaceable content (photo, CV path, social URLs, email, project text, PDF paths) lives only in `src/data/site.js` and `src/data/projects.js`.
- `react-pdf` must not be in the initial JS bundle — loaded via dynamic import only when a `PdfViewer` mounts.
- Responsive at the existing breakpoints 980px and 680px; e2e checks run at desktop (1440×900), tablet (iPad Mini) and phone (iPhone 13, WebKit).
- Hosting is Vercel at domain root; asset paths stay absolute (`/projects/…`, `/cv/…`, `/images/…`).
- Commits: author is the user only — **no `Co-Authored-By` or any Claude attribution** in commit messages.

## Review Focus

1. **Deep link / refresh on `/work/:id` in production** — Vercel must rewrite to `index.html` but still serve real files (`/projects/*.pdf`). Pinned by `vercel.json` test in Task 2.
2. **Navbar clicked while on a detail page** — `ABOUT` on `/work/ocean-health` must land on the home page scrolled to `#about`, not do nothing. Pinned by e2e in Task 2.
3. **Body scroll lock leaking** — opening the popup sets `body.style.overflow = 'hidden'`; following `VIEW FULL CASE →` must leave the detail page scrollable. Pinned in Task 6.
4. **PDF fails to load (404, bad file, flaky mobile network)** — viewer shows `Couldn't load the PDF.` with a working `Download PDF` link instead of spinning forever. Pinned by e2e in Task 5.
5. **Unknown or draft project id** (`/work/nope`, or a project with `draft: true`) — shows `Project not found` with a link back, never a crash or blank page. Pinned in Task 7.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/data/site.js` (create) | Site-wide client content: name, email, CV path, photo, social links |
| `src/data/projects.js` (create) | Project records + query helpers |
| `src/components/SiteHeader.jsx` (create) | Navbar, mobile menu, Download CV |
| `src/components/ScrollToHash.jsx` (create) | Scroll to `location.hash` / top on route change |
| `src/components/SocialIcons.jsx` (create) | Inline SVG GitHub / LinkedIn / Instagram icons (lucide 1.x has no brand icons) |
| `src/components/ProjectVisual.jsx` (create) | Card artwork (moved from `App.jsx`) |
| `src/components/PdfViewer.jsx` (create) | Public viewer: empty state + lazy boundary |
| `src/components/PdfDocument.jsx` (create) | react-pdf rendering, lazy pages, resize, error |
| `src/components/ProjectModal.jsx` (create) | Popup preview |
| `src/pages/HomePage.jsx` (create) | All home sections (moved from `App.jsx`) |
| `src/pages/ProjectPage.jsx` (create) | `/work/:id` split layout |
| `src/App.jsx` (rewrite) | Layout shell + routes |
| `src/main.jsx` (modify) | Wrap in `BrowserRouter` |
| `src/styles.css` (modify) | New/changed styles; remove slide/thumb styles |
| `vercel.json` (create) | SPA rewrite |
| `vite.config.js` (modify) | Vitest config |
| `playwright.config.js`, `e2e/*.spec.js` (create) | Browser tests |
| `src/test/setup.js`, `src/**/*.test.jsx` (create) | Unit/component tests |
| `public/images/ferdi-placeholder.svg`, `public/cv/ferdi-hassan-cv.pdf` (create) | Placeholders |
| `README.md` (modify) | How the client swaps content |

---

### Task 1: Test tooling + data modules

**Files:**
- Modify: `package.json`, `vite.config.js`, `.gitignore`
- Create: `src/test/setup.js`, `playwright.config.js`, `e2e/smoke.spec.js`, `src/data/site.js`, `src/data/projects.js`, `src/data/projects.test.js`

**Interfaces:**
- Produces:
  - `site` (named export of `src/data/site.js`): `{ name: string, email: string, cvUrl: string, photo: { src: string, alt: string }, socials: Array<{ id: 'github'|'linkedin'|'instagram', label: string, href: string }> }`
  - `projects` (named export): `Array<Project>` where `Project = { id, type, industry, title, summary, year, role, accent, tags: string[], context: string, outcome: string, pdf: { src: string } | null, draft: boolean }`
  - `getPublishedProjects(): Project[]` — non-draft, original order
  - `getProjectById(id: string): Project | undefined` — published only
  - `getAdjacentProjects(id: string): { prev: Project, next: Project }` — among published, wrapping around
  - `filters: string[]` — `['All', 'Business Case', 'Strategy', 'Business Development', 'Research']`
  - npm scripts: `test` → `vitest run`, `test:e2e` → `playwright test`

- [ ] **Step 1: Install test tooling (pinned)**

```bash
npm install -D -E vitest@5.1.1 jsdom@31.0.1 @testing-library/react@16.3.3 @testing-library/jest-dom@7.0.1 @testing-library/user-event@14.6.12 @playwright/test@1.65.1
npx playwright install chromium webkit
```

Add scripts `"test": "vitest run"`, `"test:e2e": "playwright test"`. Add `test-results/`, `playwright-report/` to `.gitignore`.

- [ ] **Step 2: Configure**

`vite.config.js` gets `test: { environment: 'jsdom', setupFiles: './src/test/setup.js', include: ['src/**/*.test.{js,jsx}'] }`. `src/test/setup.js` imports `@testing-library/jest-dom/vitest` and stubs `window.scrollTo` and `IntersectionObserver`/`ResizeObserver` (jsdom lacks them).

`playwright.config.js`: `testDir: 'e2e'`, `webServer: { command: 'npm run build && npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI }`, `use.baseURL: 'http://localhost:4173'`, projects: `desktop` (Desktop Chrome, viewport 1440×900), `tablet` (`devices['iPad Mini']`), `phone` (`devices['iPhone 13']`, WebKit).

- [ ] **Step 3: Write smoke e2e and failing data tests**

`e2e/smoke.spec.js`: home loads, `<title>` contains `Ferdi Hassan`, no horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`).

`src/data/projects.test.js`:
```js
import { projects, getPublishedProjects, getProjectById, getAdjacentProjects } from './projects';

test('every project has the detail fields and no slides', () => {
  for (const p of projects) {
    expect(p).toEqual(expect.objectContaining({ id: expect.any(String), context: expect.any(String), outcome: expect.any(String), draft: expect.any(Boolean), tags: expect.any(Array) }));
    expect(p).not.toHaveProperty('slides');
  }
});
test('ids are unique and URL-safe', () => {
  const ids = projects.map((p) => p.id);
  expect(new Set(ids).size).toBe(ids.length);
  ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
});
test('consumer-strategy uses the Kita Ngantuk deck', () => {
  expect(getProjectById('consumer-strategy').pdf.src).toBe('/projects/kita-ngantuk-gmbcc-semifinal.pdf');
});
test('draft projects are hidden', () => {
  const draft = { ...projects[0], id: 'hidden-one', draft: true };
  projects.push(draft);
  expect(getPublishedProjects()).not.toContain(draft);
  expect(getProjectById('hidden-one')).toBeUndefined();
  projects.pop();
});
test('unknown id returns undefined', () => expect(getProjectById('nope')).toBeUndefined());
test('adjacent projects wrap around', () => {
  const list = getPublishedProjects();
  expect(getAdjacentProjects(list[0].id).prev).toBe(list.at(-1));
  expect(getAdjacentProjects(list.at(-1).id).next).toBe(list[0]);
});
```

- [ ] **Step 4: Run, verify the data tests fail**

Run: `npm test` — Expected: FAIL, cannot resolve `./projects`.

- [ ] **Step 5: Create `src/data/projects.js` and `src/data/site.js`**

Move the five projects from `src/App.jsx:21-109` verbatim (ids unchanged), drop `slides`, add `tags` (3 short strings each — take the first slide's `blocks` of each project), `context` and `outcome` as clearly-marked placeholder sentences (e.g. `'[Placeholder] Describe the problem and background of this project.'`), `draft: false`. Only `consumer-strategy` keeps `pdf`; others `pdf: null`. Remove the `pages` field. Move `filters` here.

`site.js` placeholders: `email: 'hello@ferdihassan.com'`, `cvUrl: '/cv/ferdi-hassan-cv.pdf'`, `photo: { src: '/images/ferdi-placeholder.svg', alt: 'Portrait of Ferdi Hassan' }`, socials `https://github.com/`, `https://www.linkedin.com/`, `https://www.instagram.com/` (client replaces).

- [ ] **Step 6: Run tests**

Run: `npm test` — Expected: data tests PASS. (`App.jsx` still has its own copy; it is rewired in Task 2.)
Run: `npm run test:e2e -- e2e/smoke.spec.js` — Expected: PASS on desktop, tablet, phone.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "test: add vitest + playwright; extract project and site data"
```

---

### Task 2: Router, page split, navbar order, Download CV, Vercel rewrite

**Files:**
- Install: `react-router@8.5.1` (dependency, `-E`)
- Modify: `src/main.jsx`, `src/App.jsx`, `src/styles.css`
- Create: `src/pages/HomePage.jsx`, `src/pages/ProjectPage.jsx` (stub), `src/components/SiteHeader.jsx`, `src/components/ScrollToHash.jsx`, `src/components/ProjectVisual.jsx`, `vercel.json`, `public/cv/ferdi-hassan-cv.pdf`, `src/components/SiteHeader.test.jsx`, `src/vercel.test.js`, `e2e/navigation.spec.js`

**Interfaces:**
- Consumes: `site`, `getPublishedProjects`, `filters` (Task 1)
- Produces:
  - Routes: `/` → `HomePage`, `/work/:id` → `ProjectPage`, `*` → redirect to `/`
  - `SiteHeader()` — no props; nav links are `<Link to="/#about">` etc.
  - `ScrollToHash()` — on location change: if hash, scroll element into view (retry next frame if not yet mounted); else `window.scrollTo(0, 0)`
  - `ProjectVisual({ project, compact? })` — chips from `project.tags`
  - `HomePage` owns `activeProject` state and passes it to `ProjectModal` (Task 6); until then keep the existing inline modal working.

- [ ] **Step 1: Write failing tests**

`src/components/SiteHeader.test.jsx` (render in `MemoryRouter`):
```js
test('nav links follow section order', () => {
  const labels = within(screen.getByRole('navigation')).getAllByRole('link').map((a) => a.textContent.trim());
  expect(labels).toEqual(['ABOUT', 'WORK', 'APPROACH', 'EXPERIENCE', 'CONTACT']);
});
test('Download CV links to the CV with download attribute', () => {
  const cv = screen.getAllByRole('link', { name: /download cv/i })[0];
  expect(cv).toHaveAttribute('href', '/cv/ferdi-hassan-cv.pdf');
  expect(cv).toHaveAttribute('download');
});
test('header no longer has the VIEW MY WORK CTA', () => {
  expect(screen.queryByText(/view my work/i)).toBeNull();
});
```
Mobile menu must contain a second `DOWNLOAD CV` link (visible ≤980px).

`src/vercel.test.js`:
```js
import config from '../vercel.json';
test('rewrites app routes to index.html but not static files', () => {
  const rule = config.rewrites.find((r) => r.destination === '/index.html');
  const re = new RegExp(`^${rule.source}$`);
  expect(re.test('/work/ocean-health')).toBe(true);
  expect(re.test('/projects/kita-ngantuk-gmbcc-semifinal.pdf')).toBe(false);
  expect(re.test('/cv/ferdi-hassan-cv.pdf')).toBe(false);
});
```
Use `{ "rewrites": [{ "source": "/((?!.*\\.).*)", "destination": "/index.html" }] }` (any path without a dot).

`e2e/navigation.spec.js`:
- Visiting `/work/ocean-health` directly returns the app (not a 404 page).
- On `/work/ocean-health`, clicking `ABOUT` (open the hamburger first on tablet/phone) lands on `/` with `#about` in view (`expect(page.locator('#about')).toBeInViewport()`).
- Download CV link responds 200 with `application/pdf`.

- [ ] **Step 2: Run, verify they fail**

Run: `npm test` — Expected: FAIL (SiteHeader / vercel.json missing).

- [ ] **Step 3: Implement**

Move hero → contact sections into `HomePage.jsx` unchanged except for nav-related bits; header into `SiteHeader.jsx` (CTA becomes `DOWNLOAD CV` with lucide `Download` icon, same `.header-cta` style; mobile menu gets the same link). `App.jsx` renders `ScrollToHash`, `SiteHeader`, `<Routes>`, and the `.page-noise` div. `ProjectPage.jsx` is a stub showing the project title (filled in Task 7). Placeholder CV: a one-page PDF reading "CV placeholder — replace with Ferdi's CV". Mobile menu closes on link click.

- [ ] **Step 4: Run tests**

Run: `npm test && npm run test:e2e` — Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add routing, reorder navbar, add Download CV and Vercel rewrite"
```

---

### Task 3: Hero photo + smaller About copy

**Files:**
- Modify: `src/pages/HomePage.jsx`, `src/styles.css`
- Create: `public/images/ferdi-placeholder.svg`, `src/pages/HomePage.test.jsx`

**Interfaces:**
- Consumes: `site.photo`

- [ ] **Step 1: Failing test**

```js
test('hero shows the portrait photo', () => {
  const img = screen.getByRole('img', { name: 'Portrait of Ferdi Hassan' });
  expect(img).toHaveAttribute('src', '/images/ferdi-placeholder.svg');
});
test('decorative FH initials are gone from the hero', () => {
  expect(document.querySelector('.portrait-initials')).toBeNull();
});
```

- [ ] **Step 2: Run, verify fail** — `npm test`, Expected FAIL.

- [ ] **Step 3: Implement**

Replace rings/orbs/grid/initials inside `.hero-portrait` with `<img className="hero-photo">` (`width:100%; height:100%; object-fit:cover; object-position: center top`). Keep the card, its header, the three labels and `.hero-note`. Remove now-unused `.portrait-ring/orb/grid/initials` CSS including their 680px overrides. Placeholder SVG: portrait-ratio (4:5) silhouette on `--navy` with "PHOTO PLACEHOLDER" text — obviously a placeholder.

`.about-note p`: `29px → 22px` desktop, `24px → 18px` at ≤680px; line-height 1.35.

- [ ] **Step 4: Run tests + visual check**

Run: `npm test` — PASS. Add to `e2e/smoke.spec.js`: hero photo `toBeVisible()` and its bounding box fits inside the viewport width on every project. Run `npm run test:e2e` — PASS.

- [ ] **Step 5: Commit** — `git commit -am "feat: hero photo placeholder and smaller About copy"` (add the new SVG first).

---

### Task 4: Remove Experience arrows + Contact social links

**Files:**
- Modify: `src/pages/HomePage.jsx`, `src/styles.css`, `src/pages/HomePage.test.jsx`
- Create: `src/components/SocialIcons.jsx`

**Interfaces:**
- Consumes: `site.socials`, `site.email`
- Produces: `SocialIcon({ id: 'github'|'linkedin'|'instagram', size?: number })` — inline SVG, `aria-hidden="true"`, `fill="currentColor"`

- [ ] **Step 1: Failing tests**

```js
test('experience items have no arrow buttons', () => {
  expect(document.querySelectorAll('.experience-arrow')).toHaveLength(0);
});
test.each([['GitHub', 'https://github.com/'], ['LinkedIn', 'https://www.linkedin.com/'], ['Instagram', 'https://www.instagram.com/']])(
  'contact links to %s in a new tab', (label, href) => {
    const link = within(document.getElementById('contact')).getByRole('link', { name: new RegExp(label, 'i') });
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
test('GET IN TOUCH uses site.email', () => {
  expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', 'mailto:hello@ferdihassan.com');
});
```

- [ ] **Step 2: Run, verify fail** — `npm test`.

- [ ] **Step 3: Implement**

Delete `.experience-arrow` elements and CSS; `.experience-item` grid becomes `110px 1fr` (desktop) and `1fr` (≤680px). Contact: a `.contact-socials` row under `.contact-actions` — pill links in the `.button-outline` style with icon + label; wraps on small screens. Icons: standard simple-icons GitHub / LinkedIn / Instagram paths in a 24×24 viewBox.

- [ ] **Step 4: Run** — `npm test && npm run test:e2e`, Expected PASS (smoke no-horizontal-scroll covers the new row on phone).

- [ ] **Step 5: Commit** — `git commit -m "feat: remove experience arrows, add social links to contact"`.

---

### Task 5: PdfViewer (react-pdf, lazy, responsive)

**Files:**
- Install: `react-pdf@11.1.0` (dependency, `-E`)
- Create: `src/components/PdfViewer.jsx`, `src/components/PdfDocument.jsx`, `src/components/PdfViewer.test.jsx`, `e2e/pdf.spec.js`, `e2e/pdf-harness` route (see Step 1)
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `PdfViewer({ src: string | null, title: string, className?: string })` (default export)
  - `src === null` → `<div className="pdf-empty">Deck coming soon</div>` without loading react-pdf
  - otherwise `React.lazy(() => import('./PdfDocument'))` inside `<Suspense fallback={<p className="pdf-status">Loading deck…</p>}>`
  - DOM contract for tests: root `.pdf-viewer`; each page wrapper `.pdf-page[data-page-number="N"]`; a rendered page contains a `canvas`; error state `.pdf-error` with text `Couldn't load the PDF.` and `<a href={src} download>Download PDF</a>`
- `PdfDocument({ src, title })` (default export) — internal

- [ ] **Step 1: Failing tests**

`src/components/PdfViewer.test.jsx`:
```js
const { docRendered } = vi.hoisted(() => ({ docRendered: vi.fn() }));
vi.mock('./PdfDocument', () => ({ default: (props) => { docRendered(props); return <div data-testid="doc" />; } }));

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
```

`e2e/pdf.spec.js` — open the Consumer Strategy Lab popup from the home page (Task 6 wires it; until then target `/work/consumer-strategy` once Task 7 exists — **for this task, mount the viewer via a dev-only route `/__pdf-test?src=…`** registered only when `import.meta.env.DEV || import.meta.env.MODE === 'test'`; remove it in Task 7 Step 5 once real pages cover it):
```js
test('renders first page as canvas on every device', async ({ page }) => {
  await page.goto('/__pdf-test?src=/projects/kita-ngantuk-gmbcc-semifinal.pdf');
  await expect(page.locator('.pdf-page[data-page-number="1"] canvas')).toBeVisible({ timeout: 20000 });
});
test('later pages render only after scrolling near them', async ({ page }) => {
  await page.goto('/__pdf-test?src=/projects/kita-ngantuk-gmbcc-semifinal.pdf');
  await expect(page.locator('.pdf-page[data-page-number="1"] canvas')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('.pdf-page[data-page-number="30"] canvas')).toHaveCount(0);
  await page.locator('.pdf-page[data-page-number="30"]').scrollIntoViewIfNeeded();
  await expect(page.locator('.pdf-page[data-page-number="30"] canvas')).toBeVisible({ timeout: 20000 });
});
test('page width follows the container on resize', async ({ page }) => { /* desktop only: read canvas CSS width, setViewportSize narrower, expect smaller width */ });
test('broken PDF shows error with download link', async ({ page }) => {
  await page.goto('/__pdf-test?src=/projects/missing.pdf');
  await expect(page.getByText("Couldn't load the PDF.")).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/projects/missing.pdf');
});
```
Note: the e2e `webServer` uses `vite preview` (production build), so the harness route must be enabled by a build flag: run e2e builds with `--mode test`, i.e. change the webServer command to `npm run build -- --mode test && npx vite preview --port 4173 --strictPort`.

- [ ] **Step 2: Run, verify fail** — `npm test` and `npm run test:e2e -- e2e/pdf.spec.js`.

- [ ] **Step 3: Implement**

In `PdfDocument.jsx`:
- Worker: `pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()`.
- `options` memoized at module scope: `{ disableAutoFetch: true, disableStream: false, rangeChunkSize: 65536 }` so a linearized PDF loads by range.
- `<Document file={src} onLoadSuccess={({ numPages }) => …} error={…} loading={…}>`; pages rendered with `renderTextLayer={false} renderAnnotationLayer={false}`.
- Width: `ResizeObserver` on the root, `width = Math.floor(contentRect.width)`; pass to each `<Page width={width}>`.
- Lazy pages: every page gets a placeholder wrapper sized by the first page's aspect ratio; one `IntersectionObserver` (`rootMargin: '800px 0px'`) marks pages visible; only visible-or-previously-visible pages mount `<Page>`. Use `devicePixelRatio` capped at 2 (`devicePixelRatio={Math.min(2, window.devicePixelRatio)}`) to limit iOS memory.
- Root is a vertical scroll container whose height is set by the parent (popup / detail page decide).

- [ ] **Step 4: Run** — `npm test && npm run test:e2e`, Expected PASS on desktop, tablet, phone. Also `npm run build` and confirm `react-pdf`/`pdfjs` code is in a separate chunk, not in the main `index-*.js` (grep the main chunk for `GlobalWorkerOptions` → no match).

- [ ] **Step 5: Commit** — `git commit -m "feat: add lazy responsive PdfViewer using react-pdf"`.

---

### Task 6: Popup preview with PDF + VIEW FULL CASE

**Files:**
- Create: `src/components/ProjectModal.jsx`, `src/components/ProjectModal.test.jsx`, `e2e/work.spec.js`
- Modify: `src/pages/HomePage.jsx` (remove inline modal, slide state, `SlidePreview`), `src/styles.css` (remove `.deck-slide*`, `.slide-*`, `.deck-thumbs*`, `.modal-progress*`, `.deck-pdf`)

**Interfaces:**
- Consumes: `PdfViewer` (Task 5), `Project` (Task 1)
- Produces: `ProjectModal({ project: Project, onClose: () => void })` — sets `document.body.style.overflow = 'hidden'` on mount and restores the previous value on unmount (effect cleanup, so any unmount — close, Escape, navigation — restores it)

- [ ] **Step 1: Failing tests** (mock `./PdfViewer` to `({ src }) => <div data-testid="pdf" data-src={String(src)} />`; render in `MemoryRouter`)

```js
test('shows project info and passes the PDF src (null when absent)', () => {
  expect(screen.getByRole('dialog', { name: /Ocean Health/ })).toBeInTheDocument();
  expect(screen.getByTestId('pdf')).toHaveAttribute('data-src', 'null');   // ocean-health has pdf: null
});
test('VIEW FULL CASE links to the detail page', () => {
  expect(screen.getByRole('link', { name: 'VIEW FULL CASE →' })).toHaveAttribute('href', '/work/ocean-health');
});
test('Escape, close button and backdrop call onClose', async () => { /* three assertions, onClose called once each */ });
test('locks body scroll while open and restores on unmount', () => {
  const { unmount } = render(/* modal */);
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('');
});
test('no slide progress or thumbnails remain', () => {
  expect(screen.queryByText(/SLIDE \d/)).toBeNull();
});
```

`e2e/work.spec.js`:
- Click the Consumer Strategy Lab card → dialog visible, first PDF page canvas visible.
- Click `VIEW FULL CASE →` → URL `/work/consumer-strategy`, dialog gone, and `await page.mouse.wheel(0, 2000)` changes `window.scrollY` or the PDF container scroll (page is scrollable — Review Focus 3).
- On phone: dialog fits the viewport width (no horizontal scroll inside the modal).

- [ ] **Step 2: Run, verify fail.**

- [ ] **Step 3: Implement**

Layout: keep `.project-modal` two-column (`.34fr .66fr`) on desktop; left `.modal-info` (type/year, title, summary, tags, then `VIEW FULL CASE →` as `.button-primary` pinned to the bottom); right `.deck-area` holds `PdfViewer` at height `min(72vh, 680px)`. ≤980px: single column, viewer height `60vh`. ≤680px: modal full-width with `max-height: 96vh`, viewer `55vh`. Escape listener with proper effect dependencies (replace the dependency-less `useEffect` in old `App.jsx`).

- [ ] **Step 4: Run** — `npm test && npm run test:e2e` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat: PDF preview popup with link to full case"`.

---

### Task 7: Project detail page `/work/:id`

**Files:**
- Modify: `src/pages/ProjectPage.jsx` (replace stub), `src/styles.css`, `src/App.jsx` (remove `/__pdf-test` harness route), `e2e/pdf.spec.js` (point at `/work/consumer-strategy`; the broken-PDF test instead uses `page.route('**/kita-ngantuk-gmbcc-semifinal.pdf', (r) => r.fulfill({ status: 404 }))` and expects the error + `Download PDF` href `/projects/kita-ngantuk-gmbcc-semifinal.pdf`)
- Create: `src/pages/ProjectPage.test.jsx`, `e2e/project-page.spec.js`

**Interfaces:**
- Consumes: `getProjectById`, `getAdjacentProjects`, `PdfViewer`, `site.name`
- Produces: `ProjectPage()` reading `useParams().id`

- [ ] **Step 1: Failing tests** (`MemoryRouter initialEntries={['/work/ocean-health']}` + `<Route path="/work/:id">`, PdfViewer mocked)

```js
test('renders project details in the info panel', () => {
  for (const text of ['Ocean Health', 'Business Case', '2026', 'Banking × Healthcare', 'Strategy · Market Analysis · Solution Design']) {
    expect(screen.getByText(text)).toBeInTheDocument();
  }
  expect(screen.getByRole('heading', { name: /context/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /outcome/i })).toBeInTheDocument();
});
test('back link goes to the Work section', () => {
  expect(screen.getByRole('link', { name: '← Back to Work' })).toHaveAttribute('href', '/#work');
});
test('previous / next link to neighbours (wrapping)', () => {
  // ocean-health is first → prev is the last published project
  expect(screen.getByRole('link', { name: /previous project/i })).toHaveAttribute('href', '/work/consumer-strategy');
  expect(screen.getByRole('link', { name: /next project/i })).toHaveAttribute('href', '/work/telkom-product');
});
test('sets document title', () => expect(document.title).toBe('Ocean Health — Ferdi Hassan'));
test('Download PDF shown only when the project has a PDF', () => { /* absent for ocean-health; present with download attr for consumer-strategy */ });
test.each(['nope', 'hidden-draft'])('unknown or draft id %s shows Project not found', (id) => {
  // push a draft project with id 'hidden-draft' for the second case
  expect(screen.getByText('Project not found')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '← Back to Work' })).toBeInTheDocument();
});
```
Restore `document.title` to the original home title when leaving the page (effect cleanup).

`e2e/project-page.spec.js`:
- desktop: info panel and PDF side by side (panel `boundingBox().x` < viewer `x`); after scrolling 1500px the panel is still in the viewport (sticky).
- tablet & phone: panel above viewer (panel `y` < viewer `y`), no horizontal scroll.
- Navigating next → previous scrolls to top (`window.scrollY === 0`).

- [ ] **Step 2: Run, verify fail.**

- [ ] **Step 3: Implement**

`.project-page` grid `minmax(280px, 360px) 1fr`, gap 32px, page padding as `.section-pad`. Left `.project-info` `position: sticky; top: 104px` (80px header + 24px). Right: header row `FULL DECK` + `Download PDF` (only if `pdf`), then `PdfViewer` at `height: calc(100vh - 140px)`. ≤980px: single column, info not sticky, viewer `height: 75vh`. Footer row with `Previous project` / `Next project` (show neighbour titles). Not-found state uses the same shell. Scroll-to-top on id change is handled by `ScrollToHash` (Task 2).

- [ ] **Step 4: Run** — `npm test && npm run test:e2e` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat: project detail page with split layout"`.

---

### Task 8: Compress the Kita Ngantuk PDF + README

**Files:**
- Modify: `public/projects/kita-ngantuk-gmbcc-semifinal.pdf`, `README.md`
- Create: `scripts/optimize-pdf.sh`

**Interfaces:**
- Produces: `scripts/optimize-pdf.sh <input.pdf> [output.pdf]` — Ghostscript downsample then `qpdf --linearize`, prints before/after size

- [ ] **Step 1: Install tools**

```bash
brew install qpdf ghostscript
```

- [ ] **Step 2: Write the script and run it on a copy**

Ghostscript: `-sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dDownsampleColorImages=true -dColorImageResolution=150 -dCompatibilityLevel=1.6 -dNOPAUSE -dBATCH -dQUIET`, then `qpdf --linearize`. Output to the scratchpad, not over the original yet.

- [ ] **Step 3: Verify**

- `qpdf --check out.pdf` → "No syntax or stream encoding errors".
- `qpdf --show-npages out.pdf` → `41`.
- File size < 10 MB (`ls -lh`). If above, retry with `-dColorImageResolution=120`; stop and report to the user if quality must drop further.
- `head -c 1024 out.pdf | grep -c Linearized` → `1`.
- Render pages 1, 10, 41 of before and after to PNG (`gs -sDEVICE=png16m -r60 -dFirstPage=N -dLastPage=N`) and show them to the user side by side; **the user approves the quality before the file is replaced.**

- [ ] **Step 4: Replace the file and re-run e2e**

Copy over `public/projects/kita-ngantuk-gmbcc-semifinal.pdf`. Run `npm run test:e2e` — PASS (phone first-page render should now be noticeably faster).

- [ ] **Step 5: Rewrite README**

Sections: Run locally / Test (`npm test`, `npm run test:e2e`, `npx playwright install chromium webkit` once) / Deploy (Vercel, `vercel.json` explained) / **Replacing content** — table mapping each placeholder to its file: photo → `public/images/` + `site.photo`; CV → `public/cv/` + `site.cvUrl`; socials/email → `src/data/site.js`; projects → `src/data/projects.js` (fields explained, `draft: true` hides a project, `pdf: null` shows "Deck coming soon", note that "Consumer Strategy Lab" title/summary should be updated to match the Kita Ngantuk deck); **PDF size rule: keep each PDF under 10 MB — run `scripts/optimize-pdf.sh file.pdf` before adding it.** Remove the old claims about slide navigation and `pages`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "perf: compress and linearize project PDF; document content updates"
```

---

### Task 9: Final verification

- [ ] **Step 1:** `npm test` — all PASS.
- [ ] **Step 2:** `npm run test:e2e` — all PASS on desktop, tablet, phone.
- [ ] **Step 3:** `npm run build` — succeeds; main chunk contains no pdf.js code.
- [ ] **Step 4:** `npm audit` — only the known picomatch advisory (no patched version exists); anything new is reported to the user.
- [ ] **Step 5:** Screenshot home, popup, and detail page at the three sizes; show them to the user.
- [ ] **Step 6:** `git log` — confirm no commit contains `Co-Authored-By`.
