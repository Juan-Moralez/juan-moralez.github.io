
import { CodeXml, Mail, ArrowUpRight } from 'lucide-react';
import '../styles/Hero.css';

function Hero() {
  return (
    <section className="hero container" id="home">

      <div className="hero-content">

        <span className="hero-status">
          <span className="status-dot"></span>
          Disponible para oportunidades laborales
        </span>

        <p className="hero-greeting">
          Hola, soy
        </p>

        <h1>
          Juan Moralez
          <span>.</span>
        </h1>

        <h2>
          Analista Programador
          <br />
          <span>Desarrollador de Software</span>
        </h2>

        <p className="hero-description">
          Me interesa el desarrollo de software y la creación
          de soluciones tecnológicas. Trabajo principalmente
          con Java, bases de datos, y continúo
          ampliando mis conocimientos en desarrollo web.
        </p>

        <div className="hero-buttons">

          <a href="#projects" className="btn-primary">
            Ver proyectos
            <ArrowUpRight size={18} />
          </a>

          <a
            href="https://github.com/TU_USUARIO"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <CodeXml size={18} />
            GitHub
          </a>

          <a href="#contact" className="btn-secondary">
            <Mail size={18} />
            Contacto
          </a>

        </div>

      </div>

      <div className="hero-decoration">
        <div className="decoration-circle">
          <span>&lt;/&gt;</span>
        </div>
      </div>

    </section>
  );
}

export default Hero;  
