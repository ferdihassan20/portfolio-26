import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  FileText,
  Layers3,
  Mail,
  MousePointer2,
  Sparkles,
} from 'lucide-react';
import ProjectVisual from '../components/ProjectVisual';
import SocialIcon from '../components/SocialIcons';
import LegacyProjectModal from '../components/LegacyProjectModal';
import { filters, getPublishedProjects } from '../data/projects';
import { site } from '../data/site';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const visibleProjects = useMemo(() => {
    const published = getPublishedProjects();
    if (activeFilter === 'All') return published;
    return published.filter((project) => project.type === activeFilter);
  }, [activeFilter]);

  const openProject = (project) => setActiveProject(project);
  const closeProject = () => setActiveProject(null);

  return (
    <>
      <main id="top">
          <section className="hero section-pad">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-dot" /> INFORMATION SYSTEMS × STRATEGY</div>
              <h1>BUSINESS<br />THINKING,<br /><span>TECHNOLOGY</span><br />FLUENCY.</h1>
              <p className="hero-lede">I’m Ferdi — an Information Systems student exploring strategy, management consulting, and digital transformation at the intersection of business and technology.</p>
              <div className="hero-actions">
                <a href="#work" className="button button-primary">EXPLORE MY WORK <ArrowDownRight size={18} /></a>
                <a href="#about" className="text-link">MEET FERDI <ArrowRight size={16} /></a>
              </div>
            </div>
  
            <div className="hero-art reveal reveal-delay">
              <div className="hero-art-card">
                <div className="hero-art-header"><span>FERDI / 07</span><span>STUDIO NOTES</span></div>
                <div className="hero-portrait">
                  <img className="hero-photo" src={site.photo.src} alt={site.photo.alt} />
                  <span className="portrait-label label-a">BUSINESS</span>
                  <span className="portrait-label label-b">SYSTEMS</span>
                  <span className="portrait-label label-c">STRATEGY</span>
                </div>
                <div className="hero-note">A curious bridge between<br />business problems and technology.</div>
              </div>
              <div className="scribble scribble-a">↗</div>
              <div className="scribble scribble-b">×</div>
            </div>
  
            <div className="hero-ribbon">
              <div>STRATEGY</div><span>✦</span><div>BUSINESS ANALYSIS</div><span>✦</span><div>DIGITAL TRANSFORMATION</div><span>✦</span><div>AI / INFORMATION SYSTEMS</div><span>✦</span><div>STRATEGY</div>
            </div>
          </section>
  
          <section id="about" className="about section-pad">
            <div className="section-heading reveal"><span className="section-number">01</span><h2>HI, I’M FERDI.<br /><span>I LIKE THE MIDDLE.</span></h2></div>
            <div className="about-grid">
              <div className="about-card about-note reveal">
                <div className="mini-label">THE SHORT VERSION</div>
                <p>Information Systems gave me one strange advantage: I learned to look at the business problem and the system behind it at the same time.</p>
                <p>That naturally pulled me toward strategy, consulting, digital transformation, and the questions that sit between an idea and actually making it work.</p>
                <div className="signature">F.</div>
              </div>
              <div className="about-card capability-card reveal reveal-delay">
                <div className="mini-label">MY THREE LENSES</div>
                <div className="lens-row"><div className="lens-icon"><ChartNoAxesCombined size={22} /></div><div><h3>Business</h3><p>Strategy, markets, customers, economics, and decision-making.</p></div></div>
                <div className="lens-row"><div className="lens-icon"><Layers3 size={22} /></div><div><h3>Technology</h3><p>Information systems, AI, data, process design, and digital products.</p></div></div>
                <div className="lens-row"><div className="lens-icon"><MousePointer2 size={22} /></div><div><h3>Translation</h3><p>Turning technical possibilities into business language and actionable choices.</p></div></div>
              </div>
            </div>
          </section>
  
          <section id="work" className="work section-pad">
            <div className="section-heading section-heading-row reveal"><div><span className="section-number">02</span><h2>SELECTED<br /><span>WORK.</span></h2></div><p className="section-caption">Not a gallery of participation. A library of problems I’ve tried to understand, structure, and solve.</p></div>
            <div className="filters reveal">
              {filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
            </div>
  
            <div className="project-grid">
              {visibleProjects.map((project, index) => (
                <article className={`project-card reveal ${index === 0 ? 'featured' : ''}`} key={project.id} onClick={() => openProject(project)} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && openProject(project)}>
                  <ProjectVisual project={project} />
                  <div className="project-meta">
                    <div><span className="project-type">{project.type}</span><span className="project-year">{project.year}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="project-bottom"><span>{project.industry}</span><span className="circle-arrow"><ArrowUpRight size={18} /></span></div>
                  </div>
                </article>
              ))}
            </div>
          </section>
  
          <section id="approach" className="approach section-pad">
            <div className="section-heading reveal"><span className="section-number">03</span><h2>HOW I<br /><span>THINK.</span></h2></div>
            <div className="approach-layout">
              <div className="approach-intro reveal"><p>Good strategy is not a deck. It’s a sequence of better questions.</p><span>MY DEFAULT LOOP →</span></div>
              <div className="approach-steps">
                {[
                  ['01', 'STRUCTURE', 'Turn a vague problem into a question the team can actually solve.', BrainCircuit],
                  ['02', 'INVESTIGATE', 'Look for the market, customer, process, and data behind the story.', FileText],
                  ['03', 'SYNTHESISE', 'Find the few insights that change the decision — not fifty facts that decorate it.', Sparkles],
                  ['04', 'RECOMMEND', 'Build a solution that connects strategic intent to operational reality.', Check],
                ].map(([number, title, copy, Icon]) => (
                  <div className="approach-step reveal" key={number}>
                    <span className="step-number">{number}</span>
                    <div className="step-icon"><Icon size={21} /></div>
                    <div><h3>{title}</h3><p>{copy}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
  
          <section id="experience" className="experience section-pad">
            <div className="section-heading section-heading-row reveal"><div><span className="section-number">04</span><h2>EXPERIENCE<br /><span>BY THREAD.</span></h2></div><p className="section-caption">The labels change. The thread doesn’t: business questions, systems, and the space between them.</p></div>
            <div className="experience-grid">
              <div className="experience-item reveal"><div className="experience-date">2026</div><div className="experience-main"><div className="experience-tag"><BriefcaseBusiness size={15} /> BUSINESS DEVELOPMENT</div><h3>Telkom Corporate University</h3><p>Product and pricing research, process mapping, standardisation, and digital learning ecosystem work inside Solution Management.</p></div></div>
              <div className="experience-item reveal"><div className="experience-date">2025–26</div><div className="experience-main"><div className="experience-tag"><ChartNoAxesCombined size={15} /> STRATEGY / CASE COMPETITIONS</div><h3>Business Case Portfolio</h3><p>Strategy projects spanning banking, healthcare, FMCG, digital transformation, and growth — with a focus on structured problem solving and story-led recommendations.</p></div></div>
              <div className="experience-item reveal"><div className="experience-date">2025–26</div><div className="experience-main"><div className="experience-tag"><BrainCircuit size={15} /> RESEARCH</div><h3>AI, RAG & Business Process Management</h3><p>Research and applied work around retrieval-augmented generation, business news Q&A, and AI-enabled process improvement.</p></div></div>
            </div>
          </section>
  
          <section className="numbers section-pad">
            <div className="number-card reveal"><span>01</span><strong>IS</strong><small>THE FOUNDATION</small></div>
            <div className="number-card reveal"><span>02</span><strong>STRATEGY</strong><small>THE DIRECTION</small></div>
            <div className="number-card reveal"><span>03</span><strong>TECH</strong><small>THE LEVER</small></div>
            <div className="number-card reveal"><span>04</span><strong>IMPACT</strong><small>THE POINT</small></div>
          </section>
  
          <section id="contact" className="contact section-pad">
            <div className="contact-card reveal">
              <div className="contact-top"><span className="section-number">05</span><span className="mini-label">LET’S TALK</span></div>
              <h2>HAVE A<br /><span>GOOD PROBLEM?</span></h2>
              <p>I’m always interested in conversations about strategy, technology, digital transformation, and the wonderfully messy place where they meet.</p>
              <div className="contact-actions">
                <a className="button button-primary" href={`mailto:${site.email}`}>GET IN TOUCH <Mail size={17} /></a>
                <a className="button button-outline" href="#work">BROWSE THE WORK <ArrowRight size={17} /></a>
              </div>
              <div className="contact-socials">
                {site.socials.map((social) => (
                  <a key={social.id} className="social-link" href={social.href} target="_blank" rel="noopener noreferrer">
                    <SocialIcon id={social.id} /> {social.label}
                  </a>
                ))}
              </div>
              <div className="contact-footer"><span>FERDI HASSAN</span><span>INFORMATION SYSTEMS × STRATEGY × TECHNOLOGY</span><span>© 2026</span></div>
            </div>
          </section>
      </main>

      {activeProject && <LegacyProjectModal project={activeProject} onClose={closeProject} />}
    </>
  );
}
