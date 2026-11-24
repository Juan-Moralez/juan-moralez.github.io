import { BriefcaseBusiness, Mail, Phone } from 'lucide-react';
import cvFile from '../assets/CVJuanMoralez.pdf_2026_5_5.pdf';
import '../styles/Contact.css';

const CONTACT_DETAILS = [
  {
    label: 'Correo electrónico',
    value: 'juanmatiasmoralez@gmail.com',
    href: 'mailto:juanmatiasmoralez@gmail.com',
    Icon: Mail,
  },
  {
    label: 'Celular',
    value: '+54 9 263 437-8378',
    href: 'tel:+5492634378378',
    Icon: Phone,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/juan-matias-moralez-092445302',
    href: 'https://linkedin.com/in/juan-matias-moralez-092445302',
    Icon: BriefcaseBusiness,
    external: true,
  },
];

function Contact() {
  return (
    <section
      className="contact container"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-heading">
        <p className="contact-eyebrow">Hablemos</p>
        <h2 id="contact-title">Contacto</h2>
        <p className="contact-intro">
          Estoy abierto a nuevas oportunidades y desafíos. Puedes comunicarte
          conmigo por cualquiera de estos medios.
        </p>
      </div>

      <div className="contact-grid">
        {CONTACT_DETAILS.map(({ label, value, href, Icon, external }) => (
          <a
            className="contact-card"
            href={href}
            key={label}
            {...(external
              ? { target: '_blank', rel: 'noreferrer' }
              : {})}
          >
            <span className="contact-icon">
              <Icon size={21} aria-hidden="true" />
            </span>
            <span className="contact-card-content">
              <span className="contact-label">{label}</span>
              <span className="contact-value">{value}</span>
            </span>
          </a>
        ))}
      </div>
      <a className="contact-cv" href={cvFile} download="CV-Juan-Moralez.pdf">
        Descargar CV
      </a>
    </section>
  );
}

export default Contact;
