import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import '../styles/MenuCommon.css';
import './ProfesorMenu.css';
import Chat from './Chat';


function AsignarTutorias({ onAsignar }) {
  const [formData, setFormData] = useState({
    tutorId: '',
    tutoriadoId: '',
    materia: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    observaciones: ''
  });
  const [tutores, setTutores] = useState([]);
  const [tutoriados, setTutoriados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Cargar solo tutores
        const resTutores = await fetch('http://localhost:4000/api/usuarios?rol=estudiante_tutor', {
          headers
        });
        if (!resTutores.ok) throw new Error('Error al cargar tutores');
        const tutoresData = await resTutores.json();
        setTutores(tutoresData);

        // Cargar solo tutoriados
        const resTutoriados = await fetch('http://localhost:4000/api/usuarios?rol=estudiante_tutoriado', {
          headers
        });
        if (!resTutoriados.ok) throw new Error('Error al cargar tutoriados');
        const tutoriadosData = await resTutoriados.json();
        setTutoriados(tutoriadosData);

      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar usuarios');
      }
    };

    cargarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Convertir IDs a números y asegurar el formato correcto de los datos
      const tutoriaData = {
        tutor_id: Number(formData.tutorId),
        tutoriado_id: Number(formData.tutoriadoId),
        materia: formData.materia.trim(),
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        observaciones: formData.observaciones?.trim() || ''
      };

      const response = await fetch('http://localhost:4000/api/tutorias/asignar', {
        method: 'POST',
        headers,
        body: JSON.stringify(tutoriaData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.msg || 'Error al crear la tutoría');
      }

      setSuccess('Tutoría creada y asignada exitosamente 🎉');
      setFormData({
        tutorId: '',
        tutoriadoId: '',
        materia: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        observaciones: ''
      });

    } catch (err) {
      console.error('❌ Error detallado:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Asignar Nueva Tutoría</h2>
      <form onSubmit={handleSubmit} className="asignar-form">
        <div className="form-group">
          <label>Tutor:</label>
          <select
            value={formData.tutorId}
            onChange={(e) => setFormData({...formData, tutorId: e.target.value})}
            required
          >
            <option value="">Seleccionar Tutor</option>
            {tutores.map(tutor => (
              <option key={tutor.id} value={tutor.id}>{tutor.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Estudiante:</label>
          <select
            value={formData.tutoriadoId}
            onChange={(e) => setFormData({...formData, tutoriadoId: e.target.value})}
            required
          >
            <option value="">Seleccionar Estudiante</option>
            {tutoriados.map(tutoriado => (
              <option key={tutoriado.id} value={tutoriado.id}>{tutoriado.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Materia:</label>
          <input
            type="text"
            value={formData.materia}
            onChange={(e) => setFormData({...formData, materia: e.target.value})}
            required
          />
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

        <div className="form-row">
          <div className="form-group">
            <label>Hora Inicio:</label>
            <input
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora Fin:</label>
            <input
              type="time"
              value={formData.hora_fin}
              onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Observaciones:</label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Asignando...' : 'Asignar Tutoría'}
        </button>
      </form>
    </div>
  );
}

function SeguimientoTutorias({ usuario }) {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  // ✅ Cargar tutorías del profesor
  useEffect(() => {
    const cargarTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/api/tutorias/profesor/${usuario.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Error al obtener tutorías');
        setTutorias(data);
      } catch (err) {
        console.error('❌ Error al cargar tutorías:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarTutorias();
  }, [usuario.id]);

  // ✅ Eliminar tutoría
  const eliminarTutoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tutoría? Se eliminarán también todos los mensajes asociados.")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tutorias/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Error al eliminar:', data);
        throw new Error(data.msg || "Error al eliminar tutoría");
      }

      alert("✅ Tutoría eliminada correctamente");
      setTutorias(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar tutoría:", err);
      alert(`Error al eliminar tutoría: ${err.message}`);
    }
  };

  if (loading) return <div className="loading">Cargando tutorías...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="section-container">
      <h2>Seguimiento de Tutorías Asignadas</h2>
      <div className="tutorias-grid">
        {tutorias.map(tutoria => (
          <div key={tutoria.id} className="tutoria-card">
            <div className="tutoria-header">
              <h3>{tutoria.materia}</h3>
              <span className={`estado ${tutoria.estado}`}>{tutoria.estado}</span>
            </div>

            <div className="tutoria-info">
              <p><strong>Tutor:</strong> {tutoria.tutoriasComoTutor?.[0]?.nombre || '-'}</p>
              <p><strong>Estudiante:</strong> {tutoria.tutoriasComoTutoriado?.[0]?.nombre || '-'}</p>
              <p><strong>Fecha:</strong> {new Date(tutoria.fecha).toLocaleDateString()}</p>
              <p><strong>Horario:</strong> {tutoria.hora_inicio} - {tutoria.hora_fin}</p>
              {tutoria.observaciones && (
                <p><strong>Observaciones:</strong> {tutoria.observaciones}</p>
              )}
            </div>

            <div className="acciones-profesor">
              {/* 👀 Ver Chat */}
              <button
                className="ver-chat-button"
                onClick={() =>
                  setTutoriaSeleccionada(
                    tutoriaSeleccionada?.id === tutoria.id ? null : tutoria
                  )
                }
              >
                {tutoriaSeleccionada?.id === tutoria.id
                  ? "Cerrar Chat"
                  : "Ver Chat"}
              </button>

              {/* 🗑️ Eliminar */}
              <button
                className="eliminar-button"
                onClick={() => eliminarTutoria(tutoria.id)}
              >
                Eliminar
              </button>
            </div>

            {/* 💬 Chat visible */}
            {tutoriaSeleccionada?.id === tutoria.id && (
              <div className="chat-visor">
                <Chat tutoria={tutoria} usuario={usuario} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfesorMenu({ usuario, onLogout }) {
  if (!usuario) return <Navigate to="/login" />;

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <ul>
          <li><Link to="/profesor/asignar">Asignar Tutorías</Link></li>
          <li><Link to="/profesor/seguimiento">Seguimiento</Link></li>
          <li>
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/" element={<Navigate to="asignar" replace />} />
          <Route path="asignar" element={
            <AsignarTutorias 
              onAsignar={(data) => {
                console.log('Tutoría asignada:', data);
              }} 
            />
          } />
          <Route path="seguimiento" element={<SeguimientoTutorias usuario={usuario} />} />
          <Route path="*" element={<Navigate to="/profesor/asignar" replace />} />
        </Routes>
      </div>
    </div>
  );
}
