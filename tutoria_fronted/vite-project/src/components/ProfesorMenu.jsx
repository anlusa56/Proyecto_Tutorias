import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import '../styles/MenuCommon.css';
import './ProfesorMenu.css';

function AsignarTutorias({ onAsignar }) {
  const [formData, setFormData] = useState({
    tutorId: '',
    tutoriadoId: '',
    materia: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
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
    setLoading(true);

    try {
      console.log('Enviando datos:', formData); // Debug log

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/tutorias/asignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log('Respuesta:', data); // Debug log

      if (!res.ok) throw new Error(data.msg || 'Error al crear tutoría');

      setSuccess('Tutoría creada exitosamente');
      setFormData({
        tutorId: '',
        tutoriadoId: '',
        materia: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        observaciones: ''
      });
    } catch (err) {
      console.error('Error:', err);
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
              value={formData.horaInicio}
              onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora Fin:</label>
            <input
              type="time"
              value={formData.horaFin}
              onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
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

  useEffect(() => {
    const cargarTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/api/tutorias/profesor/${usuario.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        setTutorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarTutorias();
  }, [usuario.id]);

  if (loading) return <div className="loading">Cargando tutorías...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="section-container">
      <h2>Seguimiento de Tutorías</h2>
      <div className="tutorias-grid">
        {tutorias.map(tutoria => (
          <div key={tutoria.id} className="tutoria-card">
            <div className="tutoria-header">
              <h3>{tutoria.materia}</h3>
              <span className={`estado ${tutoria.estado}`}>{tutoria.estado}</span>
            </div>
            <div className="tutoria-info">
              <p><strong>Tutor:</strong> {tutoria.tutor?.nombre}</p>
              <p><strong>Estudiante:</strong> {tutoria.tutoriado?.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(tutoria.fecha).toLocaleDateString()}</p>
              <p><strong>Horario:</strong> {tutoria.horaInicio} - {tutoria.horaFin}</p>
              {tutoria.observaciones && (
                <p><strong>Observaciones:</strong> {tutoria.observaciones}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reportes() {
  const [estadisticas, setEstadisticas] = useState({
    totalTutorias: 0,
    tutoriasActivas: 0,
    tutoriasCompletadas: 0,
    tutoriasPorMateria: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/reportes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        setEstadisticas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (loading) return <div className="loading">Cargando estadísticas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="section-container">
      <h2>Reportes y Estadísticas</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tutorías</h3>
          <p className="stat-number">{estadisticas.totalTutorias}</p>
        </div>
        <div className="stat-card">
          <h3>Tutorías Activas</h3>
          <p className="stat-number">{estadisticas.tutoriasActivas}</p>
        </div>
        <div className="stat-card">
          <h3>Tutorías Completadas</h3>
          <p className="stat-number">{estadisticas.tutoriasCompletadas}</p>
        </div>
      </div>

      <div className="materias-section">
        <h3>Tutorías por Materia</h3>
        <div className="materias-grid">
          {estadisticas.tutoriasPorMateria.map(item => (
            <div key={item.materia} className="materia-card">
              <h4>{item.materia}</h4>
              <p>{item.total} tutorías</p>
            </div>
          ))}
        </div>
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
          {/* Usar rutas absolutas agregando /profesor/ al inicio */}
          <li><Link to="/profesor/asignar">Asignar Tutorías</Link></li>
          <li><Link to="/profesor/seguimiento">Seguimiento</Link></li>
          <li><Link to="/profesor/reportes">Reportes</Link></li>
          <li>
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          {/* Remover /profesor/ de las rutas en Routes ya que estas son relativas */}
          <Route path="/" element={<Navigate to="asignar" replace />} />
          <Route path="asignar" element={
            <AsignarTutorias 
              onAsignar={(data) => {
                console.log('Tutoría asignada:', data);
              }} 
            />
          } />
          <Route path="seguimiento" element={<SeguimientoTutorias usuario={usuario} />} />
          <Route path="reportes" element={<Reportes />} />
          {/* Agregar ruta para capturar URLs incorrectas */}
          <Route path="*" element={<Navigate to="/profesor/asignar" replace />} />
        </Routes>
      </div>
    </div>
  );
}
