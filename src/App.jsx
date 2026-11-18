import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  BrainCircuit,
  ChartNoAxesCombined,
  Check,
  CircleDot,
  ExternalLink,
  FileText,
  Layers3,
  Mail,
  Menu,
  MousePointer2,
  Sparkles,
  X,
} from 'lucide-react';

const projects = [
  {
    id: 'ocean-health',
    type: 'Business Case',
    industry: 'Banking × Healthcare',
    title: 'Ocean Health',
    summary: 'Reframing hospital reimbursement pressure as a liquidity and ecosystem problem — then designing a banking-led solution.',
    year: '2026',
    role: 'Strategy · Market Analysis · Solution Design',
    impact: 'Banking ecosystem strategy',
    accent: 'navy',
    pdf: null,
    slides: [
      { kicker: '01 — Problem', title: 'A reimbursement problem is really a liquidity problem.', body: 'Hospitals face delayed cash conversion while operating expenses keep moving. The strategic question is not simply how to finance the gap — it is how a bank can own the entire financial workflow.', blocks: ['Cash conversion cycle', 'BPJS reimbursement', 'Working capital'] },
      { kicker: '02 — Insight', title: 'Visibility is the missing layer.', body: 'The strongest proposition starts before financing: see the claim, predict the cash gap, prevent avoidable friction, then finance only what remains.', blocks: ['Visibility', 'Prediction', 'Prevention'] },
      { kicker: '03 — Solution', title: 'Ocean Health', body: 'A healthcare layer inside Ocean by BCA connecting claim visibility, financing, supplier flows, and payment reconciliation.', blocks: ['Jernih Cek', 'Jernih Lihat', 'Ocean Financing'] },
      { kicker: '04 — Roadmap', title: 'Start narrow. Build the ecosystem.', body: 'Launch with a lightweight MVP, then integrate hospital systems and extend into suppliers, payroll, and insurance.', blocks: ['MVP', 'SIMRS Integration', 'Ecosystem'] },
    ],
  },
  {
    id: 'telkom-product',
    type: 'Business Development',
    industry: 'Telecommunications',
    title: 'From Product Chaos to Product Clarity',
    summary: 'Standardising product, pricing, and process information for a large enterprise learning ecosystem.',
    year: '2026',
    role: 'Business Development · Process Design · Pricing Research',
    impact: 'Operational clarity',
    accent: 'mint',
    slides: [
      { kicker: '01 — Context', title: 'When every product is documented differently, scaling gets expensive.', body: 'The work started with messy information: inconsistent naming, pricing logic, process definitions, and stakeholder expectations.', blocks: ['Product taxonomy', 'Pricing', 'Process'] },
      { kicker: '02 — Structure', title: 'Standardisation becomes a product capability.', body: 'Rather than fixing documents one by one, the approach was to establish reusable structures, guidelines, and a consistent way to describe products.', blocks: ['Guidelines', 'Templates', 'Governance'] },
      { kicker: '03 — Process', title: 'Make the workflow visible.', body: 'BPMN mapping turns hidden handoffs into something teams can actually discuss, improve, and standardise.', blocks: ['BPMN', 'Stakeholder flow', 'Control points'] },
      { kicker: '04 — Outcome', title: 'A clearer operating model for digital learning products.', body: 'The result is less ambiguity across planning, pricing, and delivery — and a foundation for better internal product management.', blocks: ['Clarity', 'Consistency', 'Scalability'] },
    ],
  },
  {
    id: 'rag-research',
    type: 'Research',
    industry: 'AI × Information Systems',
    title: 'RAG for Business News Q&A',
    summary: 'Comparing large language models in retrieval-augmented business Q&A, with an emphasis on usefulness rather than benchmark theatre.',
    year: '2026',
    role: 'Research · NLP · Evaluation Design',
    impact: 'Business intelligence research',
    accent: 'violet',
    slides: [
      { kicker: '01 — Question', title: 'Can better retrieval make business Q&A actually useful?', body: 'The research explores how retrieval-augmented generation changes answer quality when the information itself is dynamic, contextual, and business-critical.', blocks: ['Retrieval', 'Context', 'Grounding'] },
      { kicker: '02 — System', title: 'Search first. Reason second.', body: 'The pipeline combines document retrieval with an LLM layer so responses can stay connected to source material instead of relying on model memory alone.', blocks: ['Pyserini', 'Embeddings', 'LLM'] },
      { kicker: '03 — Evaluation', title: 'Accuracy is not the only score.', body: 'A useful evaluation considers factuality, relevance, faithfulness, and how well the answer helps someone make sense of a business story.', blocks: ['Factuality', 'Relevance', 'Faithfulness'] },
      { kicker: '04 — Implication', title: 'Good AI systems are information systems.', body: 'The most interesting part is not the model in isolation. It is the architecture around the model — data, retrieval, workflow, and the user decision.', blocks: ['Data', 'Workflow', 'Decision'] },
    ],
  },
  {
    id: 'digital-process',
    type: 'Strategy',
    industry: 'Digital Transformation',
    title: 'AI × Business Process Optimization',
    summary: 'Exploring how AI can improve business process management without turning transformation into a shiny-tech exercise.',
    year: '2025',
    role: 'Research · BPM · Strategy',
    impact: 'Process innovation',
    accent: 'lime',
    slides: [
      { kicker: '01 — Tension', title: 'Automation is not the same as improvement.', body: 'A faster bad process is still a bad process. The work begins by understanding where decisions, delays, and handoffs actually happen.', blocks: ['Process', 'Waste', 'Decisions'] },
      { kicker: '02 — Lens', title: 'Use AI where uncertainty is expensive.', body: 'AI becomes valuable when it can reduce cognitive load, surface patterns, and help people navigate process complexity.', blocks: ['Sense', 'Assist', 'Decide'] },
      { kicker: '03 — Framework', title: 'People + Process + Intelligence.', body: 'The paper proposes a practical lens for thinking about AI adoption within process management and organisational sustainability.', blocks: ['Human', 'Process', 'AI'] },
      { kicker: '04 — Takeaway', title: 'Technology should disappear into the workflow.', body: 'The best transformation is often the one users experience simply as a better way of doing their job.', blocks: ['Adoption', 'Experience', 'Sustainability'] },
    ],
  },
  {
    id: 'consumer-strategy',
    type: 'Business Case',
    industry: 'FMCG',
    title: 'Consumer Strategy Lab',
    summary: 'A consumer-focused case exploring positioning, customer insight, and strategic growth under competitive pressure.',
    year: '2025',
    role: 'Market Research · Consumer Insight · Storytelling',
    impact: 'Growth strategy',
    accent: 'sand',
    pdf: { src: '/projects/kita-ngantuk-gmbcc-semifinal.pdf', pages: 41 },
    slides: [
      { kicker: '01 — Consumer', title: 'The customer is not a demographic.', body: 'The strategic opportunity emerges when you understand the tension behind the purchase, not just the age group attached to it.', blocks: ['Need states', 'Jobs-to-be-done', 'Context'] },
      { kicker: '02 — Opportunity', title: 'Find the gap between what people say and do.', body: 'A sharper consumer insight creates a more defendable positioning — and a better reason to choose the brand.', blocks: ['Behaviour', 'Barrier', 'Motivation'] },
      { kicker: '03 — Strategy', title: 'Make the proposition impossible to misunderstand.', body: 'The recommendation connects audience, message, channel, and execution into one coherent growth story.', blocks: ['Audience', 'Message', 'Channel'] },
      { kicker: '04 — Story', title: 'A good case is not a pile of slides.', body: 'The deck is designed as an argument: tension, proof, choice, and action.', blocks: ['Tension', 'Proof', 'Action'] },
    ],
  },
];

const filters = ['All', 'Business Case', 'Strategy', 'Business Development', 'Research'];

function ProjectVisual({ project, compact = false }) {
  return (
    <div className={`project-visual visual-${project.accent} ${compact ? 'compact' : ''}`}>
      <div className="visual-grid" />
      <div className="visual-topline">
        <span>{project.type}</span>
        <span>{project.year}</span>
      </div>
      <div className="visual-title">{project.title}</div>
      <div className="visual-chip-row">
        {project.slides.slice(0, 3).map((slide) => <span key={slide.kicker}>{slide.title.split(' ').slice(0, 3).join(' ')}</span>)}
      </div>
      <div className="visual-orbit" />
      <div className="visual-arrow"><ArrowUpRight size={20} /></div>
    </div>
  );
}

function SlidePreview({ slide, index, project }) {
  return (
    <div className={`deck-slide slide-${project.accent}`}>
      <div className="slide-number">0{index + 1}</div>
      <div className="slide-kicker">{slide.kicker}</div>
      <h3>{slide.title}</h3>
      <p>{slide.body}</p>
      <div className="slide-blocks">
        {slide.blocks.map((block, i) => (
          <div className="slide-block" key={block}>
            <span>0{i + 1}</span>
            <strong>{block}</strong>
          </div>
        ))}
      </div>
      <div className="slide-footer">
        <span>FERDI HASSAN</span>
        <span>STRATEGY / INFORMATION SYSTEMS</span>
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProject, setActiveProject] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const activePageCount = activeProject?.pdf?.pages ?? activeProject?.slides.length ?? 0;

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) => project.type === activeFilter);
  }, [activeFilter]);

  const openProject = (project) => {
    setActiveProject(project);
    setSlideIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setActiveProject(null);
    document.body.style.overflow = '';
  };

  const nextSlide = () => {
    setSlideIndex((current) => (current + 1) % activePageCount);
  };

  const prevSlide = () => {
    setSlideIndex((current) => (current - 1 + activePageCount) % activePageCount);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!activeProject) return;
      if (event.key === 'Escape') closeProject();
      if (!activeProject.pdf && event.key === 'ArrowRight') nextSlide();
      if (!activeProject.pdf && event.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="site-shell">
      <div className="page-noise" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ferdi Hassan home">
          <span>FERDI</span>
          <span>HASSAN</span>
        </a>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <a href="#work" onClick={() => setMenuOpen(false)}>WORK</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>APPROACH</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>EXPERIENCE</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
        </nav>

        <a className="header-cta" href="#work">VIEW MY WORK <ArrowRight size={15} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

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
                <div className="portrait-ring ring-a" />
                <div className="portrait-ring ring-b" />
                <div className="portrait-orb orb-a" />
                <div className="portrait-orb orb-b" />
                <div className="portrait-grid" />
                <div className="portrait-initials">FH</div>
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
            <div className="experience-item reveal"><div className="experience-date">2026</div><div className="experience-main"><div className="experience-tag"><BriefcaseBusiness size={15} /> BUSINESS DEVELOPMENT</div><h3>Telkom Corporate University</h3><p>Product and pricing research, process mapping, standardisation, and digital learning ecosystem work inside Solution Management.</p></div><div className="experience-arrow"><ArrowUpRight size={19} /></div></div>
            <div className="experience-item reveal"><div className="experience-date">2025–26</div><div className="experience-main"><div className="experience-tag"><ChartNoAxesCombined size={15} /> STRATEGY / CASE COMPETITIONS</div><h3>Business Case Portfolio</h3><p>Strategy projects spanning banking, healthcare, FMCG, digital transformation, and growth — with a focus on structured problem solving and story-led recommendations.</p></div><div className="experience-arrow"><ArrowUpRight size={19} /></div></div>
            <div className="experience-item reveal"><div className="experience-date">2025–26</div><div className="experience-main"><div className="experience-tag"><BrainCircuit size={15} /> RESEARCH</div><h3>AI, RAG & Business Process Management</h3><p>Research and applied work around retrieval-augmented generation, business news Q&A, and AI-enabled process improvement.</p></div><div className="experience-arrow"><ArrowUpRight size={19} /></div></div>
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
              <a className="button button-primary" href="mailto:hello@ferdihassan.com">GET IN TOUCH <Mail size={17} /></a>
              <a className="button button-outline" href="#work">BROWSE THE WORK <ArrowRight size={17} /></a>
            </div>
            <div className="contact-footer"><span>FERDI HASSAN</span><span>INFORMATION SYSTEMS × STRATEGY × TECHNOLOGY</span><span>© 2026</span></div>
          </div>
        </section>
      </main>

      {activeProject && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${activeProject.title} project viewer`} onMouseDown={(event) => event.target === event.currentTarget && closeProject()}>
          <div className="project-modal">
            <button className="modal-close" onClick={closeProject} aria-label="Close project"><X size={20} /></button>
            <div className="modal-info">
              <div><span className="project-type">{activeProject.type}</span><span className="project-year">{activeProject.year}</span></div>
              <h2>{activeProject.title}</h2>
              <p>{activeProject.summary}</p>
              <div className="modal-tags"><span>{activeProject.industry}</span><span>{activeProject.role}</span></div>
              {!activeProject.pdf && (
                <div className="modal-progress">
                  <span>SLIDE {String(slideIndex + 1).padStart(2, '0')} / {String(activePageCount).padStart(2, '0')}</span>
                  <div><span style={{ width: `${((slideIndex + 1) / activePageCount) * 100}%` }} /></div>
                </div>
              )}
            </div>
            <div className="deck-area">
              {activeProject.pdf ? (
                <iframe
                  className="deck-pdf"
                  title={`${activeProject.title} PDF, page ${slideIndex + 1}`}
                  src={`${activeProject.pdf.src}#page=${slideIndex + 1}&toolbar=0&navpanes=0&view=FitH`}
                />
              ) : (
                <SlidePreview slide={activeProject.slides[slideIndex]} index={slideIndex} project={activeProject} />
              )}
            </div>
            {!activeProject.pdf && (
              <div className="deck-thumbs">
                {activeProject.slides.map((slide, index) => (
                  <button key={slide.kicker} className={slideIndex === index ? 'active' : ''} onClick={() => setSlideIndex(index)}>
                    <span>{`0${index + 1}`}</span>
                    {slide.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
