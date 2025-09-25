import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import '../styles/MenuCommon.css';

export default function TutoriadoMenu({ usuario, onLogout }) {
  const [tutorias, setTutorias] = useState([]);
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar tutorías
        const resTutorias = await fetch(`http://localhost:4000/api/tutorias?estudianteId=${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const dataTutorias = await resTutorias.json();
        if (!resTutorias.ok) throw new Error(dataTutorias.msg);
        setTutorias(dataTutorias);

        // Cargar información del tutor
        const resTutor = await fetch(`http://localhost:4000/api/tutores/asignado/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataTutor = await resTutor.json();
        if (!resTutor.ok) throw new Error(dataTutor.msg);
        setTutor(dataTutor);

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
          <li><Link to="/tutoriado/tutorias">Mis Tutorías</Link></li>
          <li><Link to="/tutoriado/tutor">Mi Tutor</Link></li>
          <li><Link to="/tutoriado/calendario">Calendario</Link></li>
          <li><Link to="/tutoriado/materiales">Materiales</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/tutoriado/tutorias" element={<MisTutorias tutorias={tutorias} error={error} />} />
          <Route path="/tutoriado/tutor" element={<MiTutor tutor={tutor} error={error} />} />
          <Route path="/tutoriado/calendario" element={<Calendario tutorias={tutorias} />} />
          <Route path="/tutoriado/materiales" element={<Materiales />} />
        </Routes>
      </div>
    </div>
  );
}

function MisTutorias({ tutorias, error }) {
  return (
    <div className="tutorias-list">
      <h3>Mis Tutorías</h3>
      {error && <p className="error-message">{error}</p>}
      
      {tutorias && tutorias.length > 0 ? (
        <ul>
          {tutorias.map(tutoria => (
            <li key={tutoria.id}>
              <p>Materia: {tutoria.materia}</p>
              <p>Fecha: {new Date(tutoria.fecha).toLocaleString()}</p>
              <p>Tutor: {tutoria.Tutor?.nombre}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes tutorías programadas</p>
      )}
    </div>
  );
}

function MiTutor({ tutor, error }) {
  return (
    <div className="mi-tutor">
      <h3>Mi Tutor</h3>
      {error && <p className="error-message">{error}</p>}
      {tutor ? (
        <div>
          <p>Nombre: {tutor.nombre}</p>
          <p>Email: {tutor.email}</p>
        </div>
      ) : (
        <p>No tienes un tutor asignado</p>
      )}
    </div>
  );
}

function Calendario({ tutorias }) {
  return <div>Calendario</div>;
}

function Materiales() {
  return <div>Materiales</div>;
}
