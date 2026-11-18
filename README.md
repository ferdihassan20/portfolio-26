# Ferdi Hassan — Portfolio

A Vite + React portfolio for Ferdi Hassan:

**Information Systems × Strategy × Technology**

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal (usually http://localhost:5173).

## Test

```bash
npx playwright install chromium webkit   # once, downloads the test browsers
npm test                                 # component and data tests (Vitest)
npm run test:e2e                         # browser tests on desktop, iPad and iPhone sizes (Playwright)
```

## Build and deploy

```bash
npm run build      # outputs dist/
```

The site is deployed on **Vercel** at the root of a domain. Import the repository in Vercel, which detects Vite automatically. `vercel.json` rewrites every page URL (for example `/work/ocean-health`) to `index.html`, so project pages also work when someone refreshes or opens a shared link. Real files (PDFs, images, CV) are still served as files.

## Replacing content

All editable content lives in two files plus the `public/` folder. The current values are **placeholders**.

| What | Where |
|---|---|
| Portrait photo | Put the image in `public/images/` and set `photo.src` (and `photo.alt`) in `src/data/site.js`. A portrait (4:5) image works best. |
| CV | Put the PDF in `public/cv/` and set `cvUrl` in `src/data/site.js`. The navbar's **Download CV** button uses it. |
| Email | `email` in `src/data/site.js` |
| GitHub / LinkedIn / Instagram | `socials` in `src/data/site.js` — replace each `href` with the full profile URL. |
| Projects | `src/data/projects.js` (see below) |

### Projects

Each project in `src/data/projects.js` appears as a card in **Work**. It opens a preview popup and has its own page at `/work/<id>`.

| Field | Meaning |
|---|---|
| `id` | Used in the URL. Lowercase letters, numbers and dashes only, and unique. |
| `type` | One of the Work filters: `Business Case`, `Strategy`, `Business Development`, `Research`. |
| `title`, `summary`, `year`, `industry`, `role` | Shown on the card, popup and project page. |
| `tags` | Three short labels shown on the card artwork. |
| `context`, `outcome` | The **Context** and **Outcome** text on the project page. |
| `pdf` | `{ src: '/projects/<file>.pdf' }` to show the deck, or `null` to show "Deck coming soon". |
| `draft` | `true` hides the project from the site until it is ready. |
| `accent` | Card colour: `navy`, `mint`, `violet`, `lime` or `sand`. |

> **To do:** the project "Consumer Strategy Lab" uses the Kita Ngantuk (GMBCC semifinal) deck. Update its title and summary to match.

### Adding a project PDF

1. Shrink it for the web first (this needs `brew install ghostscript qpdf` once):

   ```bash
   scripts/optimize-pdf.sh path/to/deck.pdf public/projects/my-deck.pdf
   ```

   The script keeps text and charts sharp. It compresses images and **linearizes** the file, so browsers can load it page by page instead of downloading all of it first.
2. **Keep each PDF under 25 MB.** If a deck is still bigger, export it again from Canva or PowerPoint with "compress images" or a lower image quality, then run the script again.
3. Use lowercase file names without spaces, for example `my-deck.pdf`.
4. Set the project's `pdf` to `{ src: '/projects/my-deck.pdf' }`.

The viewer draws pages with PDF.js, so decks also work on iPhone and Android, where browsers can't show PDFs inside a page on their own. Only the pages near the screen are drawn.

## Project structure

- `src/data/` — editable content (site details, projects)
- `src/pages/` — the home page and the project page
- `src/components/` — header, PDF viewer, project popup, icons
- `src/styles.css` — the visual system (colours, type, layout)
