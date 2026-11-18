import { Component, lazy, Suspense } from 'react';
import { PdfError, PdfLoading } from './PdfMessages';

// react-pdf / pdf.js is only downloaded when a deck is actually shown.
const PdfDocument = lazy(() => import('./PdfDocument'));

// If the viewer code itself fails to download (flaky network, stale deploy),
// show the PDF error instead of letting the whole page unmount.
class PdfErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function PdfViewer({ src, title, className = '' }) {
  if (!src) {
    return <div className={`pdf-viewer pdf-empty ${className}`}>Deck coming soon</div>;
  }

  return (
    <PdfErrorBoundary key={src} fallback={<div className={`pdf-viewer ${className}`}><PdfError src={src} /></div>}>
      <Suspense fallback={<div className={`pdf-viewer ${className}`}><PdfLoading src={src} /></div>}>
        <PdfDocument key={src} src={src} title={title} className={className} />
      </Suspense>
    </PdfErrorBoundary>
  );
}
