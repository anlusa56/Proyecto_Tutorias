import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import '../styles/MenuCommon.css';

export default function ProfesorMenu({ usuario, onLogout }) {
  const [tutorias, setTutorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerTutorias = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/tutorias/profesor/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        setTutorias(data);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerTutorias();
  }, [usuario.id]);

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <ul>
          <li><Link to="/profesor/tutorias">Mis Tutorías</Link></li>
          <li><Link to="/profesor/asignar">Asignar Tutores</Link></li>
          <li><Link to="/profesor/progreso">Progreso Estudiantes</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/profesor/tutorias" element={<MisTutorias tutorias={tutorias} error={error} />} />
          <Route path="/profesor/asignar" element={<AsignarTutores />} />
          <Route path="/profesor/progreso" element={<ProgresoEstudiantes />} />
        </Routes>
      </div>
    </div>
  );
}

function MisTutorias({ tutorias, error }) {
  return (
    <div className="tutorias-list">
      <h2>Mis Tutorías Asignadas</h2>
      {error && <p className="error-message">{error}</p>}
      
      {tutorias?.length > 0 ? (
        <div className="tutorias-grid">
          {tutorias.map(tutoria => (
            <div key={tutoria.id} className="tutoria-card">
              <h3>{tutoria.materia}</h3>
              <p>Fecha: {new Date(tutoria.fecha).toLocaleString()}</p>
              <p>Estado: {tutoria.estado}</p>
              <p>Tutores: {tutoria.tutores?.length || 0}</p>
              <p>Estudiantes: {tutoria.tutoriados?.length || 0}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay tutorías asignadas</p>
      )}
    </div>
  );
}

function AsignarTutores() {
  return (
    <div className="asignar-container">
      <h2>Asignar Tutores a Estudiantes</h2>
      {/* Implementar formulario de asignación */}
    </div>
  );
}

function ProgresoEstudiantes() {
  return (
    <div className="progreso-container">
      <h2>Progreso de Estudiantes</h2>
      {/* Implementar vista de progreso */}
    </div>
  );
}
