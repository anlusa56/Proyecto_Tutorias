import { NavLink, useNavigate } from 'react-router-dom';
import './EstudianteTutoriadoNav.css';

export default function EstudianteTutoriadoNav({ setUsuario }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.clear(); // Limpia todo el localStorage
    
    // Actualizar el estado global
    setUsuario(null);
    
    // Forzar recarga y redirección
    window.location.href = '/';
  };

  return (
    <nav className="estudiante-nav">
      <NavLink to="/estudiante_tutoriado" end className={({ isActive }) => 
        `nav-link ${isActive ? 'active' : ''}`
      }>
        <i className="fas fa-home"></i> Inicio
      </NavLink>
      
      <div className="nav-separator" />
      
      <NavLink to="/estudiante_tutoriado/tutorias" className={({ isActive }) => 
        `nav-link ${isActive ? 'active' : ''}`
      }>
        <i className="fas fa-book"></i> Mis Tutorías
      </NavLink>
      
      <NavLink to="/estudiante_tutoriado/calendario" className={({ isActive }) => 
        `nav-link ${isActive ? 'active' : ''}`
      }>
        <i className="fas fa-calendar"></i> Calendario
      </NavLink>
      
      <NavLink to="/estudiante_tutoriado/materiales" className={({ isActive }) => 
        `nav-link ${isActive ? 'active' : ''}`
      }>
        <i className="fas fa-file-alt"></i> Materiales
      </NavLink>

      <div className="nav-separator" />
      
      <button 
        className="nav-link logout-button" 
        onClick={handleLogout}
      >
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </nav>
  );
}