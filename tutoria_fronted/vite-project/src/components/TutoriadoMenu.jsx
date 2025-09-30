import { useState } from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import '../styles/MenuCommon.css';

// Componentes internos
function MisTutorias({ usuario }) {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/api/tutorias`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTutorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorias();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="section-container">
      <h2>Mis Tutorías</h2>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="tutorias-grid">
          {tutorias.length === 0 ? (
            <p>No tienes tutorías programadas</p>
          ) : (
            tutorias.map(tutoria => (
              <div key={tutoria.id} className="tutoria-card">
                <h3>{tutoria.materia}</h3>
                <p>Fecha: {new Date(tutoria.fecha).toLocaleDateString()}</p>
                <p>Estado: {tutoria.estado}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MiTutor() {
  return (
    <div className="section-container">
      <h2>Mi Tutor</h2>
      <p>Información del tutor asignado</p>
    </div>
  );
}

function Calendario() {
  return (
    <div className="section-container">
      <h2>Calendario</h2>
      <p>Calendario de tutorías programadas</p>
    </div>
  );
}

function Materiales() {
  return (
    <div className="section-container">
      <h2>Materiales</h2>
      <p>Materiales de estudio compartidos</p>
    </div>
  );
}

// Componente principal
export default function TutoriadoMenu({ usuario, onLogout }) {
  const navigate = useNavigate();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <ul>
          <li><Link to="tutorias">Mis Tutorías</Link></li>
          <li><Link to="tutor">Mi Tutor</Link></li>
          <li><Link to="calendario">Calendario</Link></li>
          <li><Link to="materiales">Materiales</Link></li>
          <li>
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route index element={<Navigate to="tutorias" />} />
          <Route path="tutorias" element={<MisTutorias usuario={usuario} />} />
          <Route path="tutor" element={<MiTutor />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="materiales" element={<Materiales />} />
        </Routes>
      </div>
    </div>
  );
}