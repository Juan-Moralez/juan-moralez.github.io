
import { BriefcaseBusiness, CodeXml } from 'lucide-react';
import cvFile from '../assets/CVJuanMoralez.pdf_2026_5_5.pdf';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-container container">

        <a href="#home" className="navbar-logo">
          <span className="logo-bracket">&lt;</span>
          Portfolio
          <span className="logo-bracket">/&gt;</span>
        </a>

        <div className="navbar-links">
          <a href="#home">Inicio</a>
          <a href="#about">Sobre mí</a>
          <a href="#projects">Proyectos</a>
          <a href="#contact">Contacto</a>
          <a className="navbar-cv" href={cvFile} download="CV-Juan-Moralez.pdf">
            CV
          </a>
        </div>

        <div className="navbar-socials">
          <a
            href="https://github.com/Juan-Moralez"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <CodeXml size={22} />
          </a>

          <a
            href="https://linkedin.com/in/juan-matias-moralez-092445302"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <BriefcaseBusiness size={22} />
          </a>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;