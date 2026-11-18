import { useParams } from 'react-router';
import { getProjectById } from '../data/projects';

export default function ProjectPage() {
  const { id } = useParams();
  const project = getProjectById(id);
  return (
    <main className="project-page section-pad">
      <h1>{project ? project.title : 'Project not found'}</h1>
    </main>
  );
}
