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
            Soy Analista Programador y estoy dando mis primeros pasos en el ámbito profesional del desarrollo de software. Busco nuevos desafíos que me permitan aplicar mis conocimientos, seguir aprendiendo y crecer como desarrollador. Me motiva aprender nuevas tecnologías, asumir desafíos y crecer profesionalmente dentro de un equipo de desarrollo.
          </p>
          <p>
            Tengo experiencia en desarrollo de software con Java y bases de datos, y continúo ampliando mis conocimientos en desarrollo web.
          </p>
        </div>

        <div className="about-focus">
          <h3>Mi enfoque</h3>
          <ul>
            <li>Desarrollo de software</li>
            <li>Java y bases de datos</li>
            <li>Desarrollo web</li>
            <li>Programación Orientada a Objetos</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;