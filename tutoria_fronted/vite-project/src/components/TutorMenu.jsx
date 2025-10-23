import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import '../styles/MenuCommon.css';
import './TutorMenu.css';
import Chat from './Chat';

export default function TutorMenu({ usuario, onLogout }) {
  const [tutorias, setTutorias] = useState([]);
  const [tutoriados, setTutoriados] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        // Cargar tutorías
        const resTutorias = await fetch(`http://localhost:4000/api/tutorias/tutor/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const dataTutorias = await resTutorias.json();
        if (!resTutorias.ok) throw new Error(dataTutorias.msg || 'Error al cargar tutorías');
        setTutorias(dataTutorias);

        // Cargar tutoriados
        const resTutoriados = await fetch(`http://localhost:4000/api/tutoriados/tutor/${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dataTutoriados = await resTutoriados.json();
        if (!resTutoriados.ok) {
          if (resTutoriados.status === 404) {
            setTutoriados([]);
          } else {
            throw new Error(dataTutoriados.msg || 'Error al cargar tutoriados');
          }
        } else {
          setTutoriados(dataTutoriados);
        }

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuario.id]);

  if (loading) {
    return (
      <div className="menu-container">
        <nav className="menu-nav">
          <ul>
            <li><Link to="/estudiante_tutor/tutorias">Mis Tutorías</Link></li>
            <li><Link to="/estudiante_tutor/tutoriados">Mis Tutoriados</Link></li>
            <li><Link to="/estudiante_tutor/avances">Registrar Avances</Link></li>
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
          <li><Link to="/estudiante_tutor/tutorias">Mis Tutorías</Link></li>
          <li><Link to="/estudiante_tutor/tutoriados">Mis Tutoriados</Link></li>
          <li><Link to="/estudiante_tutor/avances">Registrar Avances</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/" element={<Navigate to="tutorias" replace />} />
          <Route path="tutorias" element={<MisTutorias tutorias={tutorias} error={error} usuario={usuario} />} />
          <Route path="tutoriados" element={<MisTutoriados tutoriados={tutoriados} error={error} />} />
          <Route path="avances" element={<RegistrarAvances tutoriados={tutoriados} />} />
          <Route path="*" element={<Navigate to="/estudiante_tutor/tutorias" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function MisTutorias({ tutorias, error, usuario }) {
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

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
  const [formData, setFormData] = useState({
    tutoriadoId: '',
    fecha: '',
    tema: '',
    descripcion: '',
    calificacion: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/avances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Error al registrar avance');
      }

      setSuccess(true);
      setFormData({
        tutoriadoId: '',
        fecha: '',
        tema: '',
        descripcion: '',
        calificacion: '',
        observaciones: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Registrar Avances</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Avance registrado exitosamente</div>}

      <form onSubmit={handleSubmit} className="avances-form">
        <div className="form-group">
          <label>Estudiante:</label>
          <select
            value={formData.tutoriadoId}
            onChange={(e) => setFormData({...formData, tutoriadoId: e.target.value})}
            required
          >
            <option value="">Seleccionar estudiante</option>
            {tutoriados.map(tutoriado => (
              <option key={tutoriado.id} value={tutoriado.id}>
                {tutoriado.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Tema:</label>
          <input
            type="text"
            value={formData.tema}
            onChange={(e) => setFormData({...formData, tema: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Calificación:</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.calificacion}
            onChange={(e) => setFormData({...formData, calificacion: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Observaciones:</label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Avance'}
        </button>
      </form>
    </div>
  );
}
