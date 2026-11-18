import { useSearchParams } from 'react-router';
import PdfViewer from './PdfViewer';

// Test-only page (built with --mode test) for exercising PdfViewer in a real browser.
export default function PdfHarness() {
  const [params] = useSearchParams();
  return (
    <main className="section-pad">
      <div style={{ height: '80vh' }}>
        <PdfViewer src={params.get('src')} title="Test deck" />
      </div>
    </main>
  );
}
