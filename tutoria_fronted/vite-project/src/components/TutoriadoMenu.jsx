import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import './TutoriadoMenu.css';
import '../styles/MenuCommon.css';
import Chat from './Chat';

export default function TutoriadoMenu({ usuario, onLogout }) {
  const [tutorias, setTutorias] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTutorias = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/api/tutorias/tutoriado/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Error al cargar tutorías');
        setTutorias(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarTutorias();
  }, [usuario.id]);

  if (loading) {
    return (
      <div className="menu-container">
        <nav className="menu-nav">
          <ul>
            <li><Link to="/estudiante_tutoriado/tutorias">Mis Tutorías</Link></li>
            <li><Link to="/estudiante_tutoriado/avances">Mis Avances</Link></li>
            <li><button onClick={onLogout}>Cerrar Sesión</button></li>
          </ul>
        </nav>
        <div className="menu-content loading">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <ul>
          <li><Link to="/estudiante_tutoriado/tutorias">Mis Tutorías</Link></li>
          <li><Link to="/estudiante_tutoriado/avances">Mis Avances</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/" element={<Navigate to="tutorias" replace />} />
          <Route path="tutorias" element={<MisTutorias tutorias={tutorias} error={error} usuario={usuario} />} />
          <Route path="avances" element={<MisAvances usuario={usuario} />} />
          <Route path="*" element={<Navigate to="/estudiante_tutoriado/tutorias" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function MisTutorias({ tutorias, error, usuario }) {
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  return (
    <div className="tutorias-list">
      <h2>Mis Tutorías</h2>
      {error && <p className="error-message">{error}</p>}
      
      {tutorias?.length > 0 ? (
        <div className="tutorias-grid">
          {tutorias.map(tutoria => (
            <div key={tutoria.id} className="tutoria-card">
              <h3>{tutoria.materia}</h3>
              <p>Fecha: {new Date(tutoria.fecha).toLocaleString()}</p>
              <p>Estado: {tutoria.estado}</p>
              <p>Tutor: {tutoria.tutores?.[0]?.nombre || 'Sin asignar'}</p>
              <button 
                onClick={() => setTutoriaSeleccionada(tutoriaSeleccionada?.id === tutoria.id ? null : tutoria)}
                className="chat-button"
              >
                {tutoriaSeleccionada?.id === tutoria.id ? 'Cerrar Chat' : 'Abrir Chat'}
              </button>
              {tutoriaSeleccionada?.id === tutoria.id && (
                <Chat tutoria={tutoria} usuario={usuario} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes tutorías asignadas</p>
      )}
    </div>
  );
}

function MisAvances({ usuario }) {
  const [avances, setAvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarAvances = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/api/avances/tutoriado`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.msg || 'Error al cargar avances');
        }

        const data = await res.json();
        setAvances(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarAvances();
  }, [usuario.id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando avances...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="avances-section">
      <h2>Mis Avances</h2>
      {avances.length > 0 ? (
        <div className="avances-grid">
          {avances.map(avance => (
            <div key={avance.id} className="avance-card">
              <div className="avance-header">
                <h3>{avance.tema}</h3>
                <span className="fecha">{new Date(avance.fecha).toLocaleDateString()}</span>
              </div>
              <p className="tutor">Tutor: {avance.tutor?.nombre}</p>
              <div className="avance-content">
                <p><strong>Descripción:</strong></p>
                <p>{avance.descripcion}</p>
                {avance.observaciones && (
                  <>
                    <p><strong>Observaciones:</strong></p>
                    <p>{avance.observaciones}</p>
                  </>
                )}
              </div>
              <div className="calificacion">
                <span>Calificación:</span>
                <strong>{avance.calificacion}/10</strong>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay avances registrados</p>
      )}
    </div>
  );
}