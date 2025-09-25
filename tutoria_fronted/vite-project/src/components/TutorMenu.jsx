import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import '../styles/MenuCommon.css';

export default function TutorMenu({ usuario, onLogout }) {
  const [tutorias, setTutorias] = useState([]);
  const [tutoriados, setTutoriados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar tutorías
        const resTutorias = await fetch(`http://localhost:4000/api/tutorias/tutor/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const dataTutorias = await resTutorias.json();
        if (!resTutorias.ok) throw new Error(dataTutorias.msg);
        setTutorias(dataTutorias);

        // Cargar tutoriados
        const resTutoriados = await fetch(`http://localhost:4000/api/tutoriados/tutor/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataTutoriados = await resTutoriados.json();
        if (!resTutoriados.ok) throw new Error(dataTutoriados.msg);
        setTutoriados(dataTutoriados);

      } catch (err) {
        setError(err.message);
      }
    };

    cargarDatos();
  }, [usuario.id]);

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <ul>
          <li><Link to="/tutor/tutorias">Mis Tutorías</Link></li>
          <li><Link to="/tutor/tutoriados">Mis Tutoriados</Link></li>
          <li><Link to="/tutor/avances">Registrar Avances</Link></li>
          <li><Link to="/tutor/feedback">Retroalimentación</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/tutor/tutorias" element={<MisTutorias tutorias={tutorias} error={error} />} />
          <Route path="/tutor/tutoriados" element={<MisTutoriados tutoriados={tutoriados} error={error} />} />
          <Route path="/tutor/avances" element={<RegistrarAvances tutoriados={tutoriados} />} />
          <Route path="/tutor/feedback" element={<Retroalimentacion />} />
        </Routes>
      </div>
    </div>
  );
}

function MisTutorias({ tutorias, error }) {
  return (
    <div className="tutorias-list">
      <h2>Mis Tutorías como Tutor</h2>
      {error && <p className="error-message">{error}</p>}
      
      {tutorias?.length > 0 ? (
        <div className="tutorias-grid">
          {tutorias.map(tutoria => (
            <div key={tutoria.id} className="tutoria-card">
              <h3>{tutoria.materia}</h3>
              <p>Fecha: {new Date(tutoria.fecha).toLocaleString()}</p>
              <p>Estado: {tutoria.estado}</p>
              <p>Estudiantes: {tutoria.tutoriados?.length || 0}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes tutorías asignadas</p>
      )}
    </div>
  );
}

function MisTutoriados({ tutoriados, error }) {
  return (
    <div className="tutoriados-list">
      <h2>Mis Estudiantes Asignados</h2>
      {error && <p className="error-message">{error}</p>}
      
      {tutoriados?.length > 0 ? (
        <div className="tutoriados-grid">
          {tutoriados.map(tutoriado => (
            <div key={tutoriado.id} className="tutoriado-card">
              <h3>{tutoriado.nombre}</h3>
              <p>Email: {tutoriado.correo}</p>
              <p>Progreso: {tutoriado.progreso || 'Sin registros'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes estudiantes asignados</p>
      )}
    </div>
  );
}

function RegistrarAvances({ tutoriados }) {
  return (
    <div className="avances-container">
      <h2>Registrar Avances</h2>
      {/* Implementar formulario de avances */}
    </div>
  );
}

function Retroalimentacion() {
  return (
    <div className="feedback-container">
      <h2>Retroalimentación del Profesor</h2>
      {/* Implementar vista de retroalimentación */}
    </div>
  );
}
