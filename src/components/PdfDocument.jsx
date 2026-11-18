import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfError, PdfLoading } from './PdfMessages';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

// Range loading: with a linearized PDF only the pages being viewed are downloaded.
const options = { disableAutoFetch: true, disableStream: false, rangeChunkSize: 65536 };
const NEAR_VIEWPORT = '800px 0px';

export default function PdfDocument({ src, title, className = '' }) {
  const rootRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [ratio, setRatio] = useState(9 / 16);
  const [nearPages, setNearPages] = useState(() => new Set([1]));

  // Page width follows the container (resize, rotation, breakpoints).
  useEffect(() => {
    const root = rootRef.current;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Only pages near the visible area keep a rendered canvas (limits memory on phones).
  // Each page wrapper registers itself through a ref callback, because react-pdf
  // mounts the pages after the document finishes loading.
  const [observer, setObserver] = useState(null);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      setNearPages((current) => {
        const next = new Set(current);
        for (const entry of entries) {
          const n = Number(entry.target.dataset.pageNumber);
          if (entry.isIntersecting) next.add(n);
          else next.delete(n);
        }
        return next;
      });
    }, { root: rootRef.current, rootMargin: NEAR_VIEWPORT });
    setObserver(io);
    return () => io.disconnect();
  }, []);

  const observePage = useCallback((el) => {
    if (!observer || !el) return undefined;
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [observer]);

  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);

  return (
    <div ref={rootRef} className={`pdf-viewer ${className}`} role="region" aria-label={`${title} — PDF deck`}>
      <Document
        file={src}
        options={options}
        // Effect-based loading so the loading/error props below are used; the default
        // Suspense mode would hide the whole viewer while a page loads and throw on errors.
        suspense={false}
        onLoadSuccess={({ numPages: total }) => setNumPages(total)}
        loading={<PdfLoading src={src} />}
        error={<PdfError src={src} />}
      >
        {width > 0 && Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
          <div key={n} ref={observePage} className="pdf-page" data-page-number={n} style={{ minHeight: Math.round(width * ratio) }}>
            {nearPages.has(n) && (
              <Page
                pageNumber={n}
                width={width}
                devicePixelRatio={pixelRatio}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<p className="pdf-page-status">Loading page {n}…</p>}
                onLoadSuccess={n === 1 ? (page) => setRatio(page.originalHeight / page.originalWidth) : undefined}
              />
            )}
          </div>
        ))}
      </Document>
    </div>
  );
}
