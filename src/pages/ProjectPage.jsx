import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Download } from 'lucide-react';
import PdfViewer from '../components/PdfViewer';
import { getAdjacentProjects, getProjectById } from '../data/projects';
import { site } from '../data/site';

function BackToWork() {
  return <Link className="back-link" to="/#work">← Back to Work</Link>;
}

export default function ProjectPage() {
  const { id } = useParams();
  const project = getProjectById(id);

  useEffect(() => {
    if (!project) return undefined;
    const previous = document.title;
    document.title = `${project.title} — ${site.name}`;
    return () => { document.title = previous; };
  }, [project]);

  if (!project) {
    return (
      <main className="project-page section-pad project-missing">
        <BackToWork />
        <h1>Project not found</h1>
        <p>This project doesn’t exist or isn’t published yet.</p>
      </main>
    );
  }

  const { prev, next } = getAdjacentProjects(project.id);

  return (
    <main className="project-page section-pad">
      <BackToWork />
      <div className="project-layout">
        <aside className="project-info">
          <div className="project-kicker"><span className="project-type">{project.type}</span><span className="project-year">{project.year}</span></div>
          <h1>{project.title}</h1>
          <p className="project-summary">{project.summary}</p>
          <dl className="project-facts">
            <div><dt>Industry</dt><dd>{project.industry}</dd></div>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
          </dl>
          <section className="project-story">
            <h2>Context</h2>
            <p>{project.context}</p>
          </section>
          <section className="project-story">
            <h2>Outcome</h2>
            <p>{project.outcome}</p>
          </section>
        </aside>

        <section className="project-deck" aria-label={`${project.title} deck`}>
          <div className="project-deck-bar">
            <span>FULL DECK</span>
            {project.pdf && (
              <a className="deck-download" href={project.pdf.src} download>Download PDF <Download size={15} /></a>
            )}
          </div>
          <PdfViewer src={project.pdf?.src ?? null} title={project.title} className="detail-pdf" />
        </section>
      </div>

      <nav className="project-pager" aria-label="More projects">
        <Link to={`/work/${prev.id}`} aria-label={`Previous project: ${prev.title}`}>
          <span>← PREVIOUS PROJECT</span>
          <strong>{prev.title}</strong>
        </Link>
        <Link className="pager-next" to={`/work/${next.id}`} aria-label={`Next project: ${next.title}`}>
          <span>NEXT PROJECT →</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </main>
  );
}
