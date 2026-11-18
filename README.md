# Ferdi Hassan — Portfolio

A Vite + React portfolio frontend designed around the positioning:

**Information Systems × Strategy × Technology**

The visual direction is inspired by playful editorial portfolio sites — bold type, rounded cards, paper-like surfaces, graphic shapes, and a strong case-study library — but uses a completely different palette and identity.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Where to customise

Most portfolio content lives in `src/App.jsx` inside the `projects` array. Each project includes:

- title / year / type / industry
- summary and role
- either sample deck slides, or a PDF file and its page count

To show a PDF in a project, put the file in `public/projects/` and set its `pdf` property, for example:

```js
pdf: { src: '/projects/ocean-health.pdf', pages: 12 },
```

Set `pages` to the PDF's page count. The project viewer uses the browser's built-in PDF viewer and its previous/next buttons, thumbnails, and keyboard arrows navigate pages. If `pdf` is `null`, the current sample slides are shown instead. The browser must support embedded PDF viewing.

The visual system is in `src/styles.css`.

The viewer supports keyboard navigation, previous/next controls, page thumbnails, modal viewing, and project filtering.
