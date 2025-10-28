import './ContactPage.css';

export default function ContactPage() {
  return (
    <div className="contact-container">
      <h1>Contáctanos</h1>

      <div className="contact-info">
        <div className="contact-card">
          <i className="fas fa-phone"></i>
          <h3>Teléfono</h3>
          <p>+57 123 456 7890</p>
          <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
        </div>

        <div className="contact-card">
          <i className="fas fa-envelope"></i>
          <h3>Correo Electrónico</h3>
          <p>info@tutorias.com</p>
          <p>soporte@tutorias.com</p>
        </div>

        <div className="contact-card">
          <i className="fas fa-map-marker-alt"></i>
          <h3>Ubicación</h3>
          <p>Calle Principal #123</p>
          <p>Ciudad, País</p>
        </div>
      </div>

      <form className="contact-form">
        <h2>Envíanos un mensaje</h2>
        
        <div className="form-group">
          <input type="text" placeholder="Nombre completo" required />
        </div>

        <div className="form-group">
          <input type="email" placeholder="Correo electrónico" required />
        </div>

        <div className="form-group">
          <textarea placeholder="Tu mensaje" rows="5" required></textarea>
        </div>

        <button type="submit" className="submit-button">
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}
