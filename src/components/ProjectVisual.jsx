import { ArrowUpRight } from 'lucide-react';

export default function ProjectVisual({ project, compact = false }) {
  return (
    <div className={`project-visual visual-${project.accent} ${compact ? 'compact' : ''}`}>
      <div className="visual-grid" />
      <div className="visual-topline">
        <span>{project.type}</span>
        <span>{project.year}</span>
      </div>
      <div className="visual-title">{project.title}</div>
      <div className="visual-chip-row">
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="visual-orbit" />
      <div className="visual-arrow"><ArrowUpRight size={20} /></div>
    </div>
  );
}
