import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Logo Tutorías" />
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/about" className="nav-link">Quiénes Somos</Link>
          <Link to="/contact" className="nav-link">Contáctanos</Link>
          <Link to="/login" className="nav-button">Iniciar Sesión</Link>
          <Link to="/registro" className="nav-button">Registrarse</Link>
        </div>
      </div>
    </nav>
  );
}
