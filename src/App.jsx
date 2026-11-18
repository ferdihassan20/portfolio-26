import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import ScrollToHash from './components/ScrollToHash';
import SiteHeader from './components/SiteHeader';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';

const PdfHarness = import.meta.env.MODE === 'test' ? lazy(() => import('./components/PdfHarness')) : null;

export default function App() {
  return (
    <div className="site-shell">
      <div className="page-noise" />
      <ScrollToHash />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:id" element={<ProjectPage />} />
        {PdfHarness && <Route path="/__pdf-test" element={<Suspense><PdfHarness /></Suspense>} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
