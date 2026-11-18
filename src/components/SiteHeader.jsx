import { useState } from 'react';
import { Link } from 'react-router';
import { Download, Menu, X } from 'lucide-react';
import { site } from '../data/site';

const sections = [
  ['about', 'ABOUT'],
  ['work', 'WORK'],
  ['approach', 'APPROACH'],
  ['experience', 'EXPERIENCE'],
  ['contact', 'CONTACT'],
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Link className="brand" to="/#top" aria-label="Ferdi Hassan home" onClick={close}>
        <span>FERDI</span>
        <span>HASSAN</span>
      </Link>

      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        {sections.map(([id, label]) => (
          <Link key={id} to={`/#${id}`} onClick={close}>{label}</Link>
        ))}
        <a className="nav-cv" href={site.cvUrl} download onClick={close}>DOWNLOAD CV <Download size={15} /></a>
      </nav>

      <a className="header-cta" href={site.cvUrl} download>DOWNLOAD CV <Download size={15} /></a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
