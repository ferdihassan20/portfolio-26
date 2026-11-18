import { lazy, Suspense } from 'react';

// react-pdf / pdf.js is only downloaded when a deck is actually shown.
const PdfDocument = lazy(() => import('./PdfDocument'));

export default function PdfViewer({ src, title, className = '' }) {
  if (!src) {
    return <div className={`pdf-viewer pdf-empty ${className}`}>Deck coming soon</div>;
  }

  return (
    <Suspense fallback={<div className={`pdf-viewer ${className}`}><p className="pdf-status">Loading deck…</p></div>}>
      <PdfDocument key={src} src={src} title={title} className={className} />
    </Suspense>
  );
}
