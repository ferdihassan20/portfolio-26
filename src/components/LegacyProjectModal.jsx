import { useEffect } from 'react';
import { X } from 'lucide-react';

// Temporary popup kept working during the router refactor; replaced by ProjectModal.
export default function LegacyProjectModal({ project, onClose }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${project.title} project viewer`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="project-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close project"><X size={20} /></button>
        <div className="modal-info">
          <div><span className="project-type">{project.type}</span><span className="project-year">{project.year}</span></div>
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
          <div className="modal-tags"><span>{project.industry}</span><span>{project.role}</span></div>
        </div>
        <div className="deck-area">
          {project.pdf
            ? <iframe className="deck-pdf" title={`${project.title} PDF`} src={project.pdf.src} />
            : <div className="pdf-empty">Deck coming soon</div>}
        </div>
      </div>
    </div>
  );
}
