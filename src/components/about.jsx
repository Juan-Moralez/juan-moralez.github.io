import '../styles/about.css';

function About() {
  return (
    <section className="about container" id="about" aria-labelledby="about-title">
      <div className="about-heading">
        <p className="about-eyebrow">Conóceme</p>
        <h2 id="about-title">Sobre mí</h2>
      </div>

      <div className="about-content">
        <div className="about-copy">
          <p>
            Soy Analista Programador y me interesa el desarrollo de software y
            la creación de soluciones tecnológicas.
          </p>
          <p>
            Trabajo principalmente con Java y bases de datos, y continúo
            ampliando mis conocimientos en desarrollo web.
          </p>
        </div>

        <div className="about-focus">
          <h3>Mi enfoque</h3>
          <ul>
            <li>Desarrollo de software</li>
            <li>Java y bases de datos</li>
            <li>Desarrollo web</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;