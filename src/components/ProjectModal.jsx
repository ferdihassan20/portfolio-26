import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';
import PdfViewer from './PdfViewer';

export default function ProjectModal({ project, onClose }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Lock page scroll while open; the cleanup restores it however the modal unmounts
  // (close, Escape, or navigating to the detail page).
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project preview`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="project-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close project"><X size={20} /></button>
        <div className="modal-info">
          <div><span className="project-type">{project.type}</span><span className="project-year">{project.year}</span></div>
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
          <div className="modal-tags"><span>{project.industry}</span><span>{project.role}</span></div>
          <Link className="button button-primary modal-cta" to={`/work/${project.id}`}>VIEW FULL CASE →</Link>
        </div>
        <div className="deck-area">
          <PdfViewer src={project.pdf?.src ?? null} title={project.title} className="modal-pdf" />
        </div>
      </div>
    </div>
  );
}
