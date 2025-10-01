import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import '../styles/MenuCommon.css';

// Componentes internos
function MisTutorias({ usuario }) {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [ordenFecha, setOrdenFecha] = useState("proximas");

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `http://localhost:4000/api/tutorias?estudianteId=${usuario.id}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.msg || 'Error al cargar tutorías');
        }

        const data = await res.json();
        setTutorias(data);
      } catch (err) {
        console.error('Error al cargar tutorías:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorias();
  }, [usuario.id]);

  const getTutoriasFiltradas = () => {
    let tutoriasFiltradas = [...tutorias];

    // Aplicar filtro por estado
    if (filtroEstado !== "todas") {
      tutoriasFiltradas = tutoriasFiltradas.filter(
        tutoria => tutoria.estado === filtroEstado
      );
    }

    // Aplicar orden por fecha
    tutoriasFiltradas.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return ordenFecha === "proximas" ? fechaA - fechaB : fechaB - fechaA;
    });

    return tutoriasFiltradas;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoClase = (estado) => {
    const clases = {
      'programada': 'estado-programada',
      'en_curso': 'estado-en-curso',
      'completada': 'estado-completada',
      'cancelada': 'estado-cancelada'
    };
    return `estado-badge ${clases[estado] || ''}`;
  };

  if (loading) {
    return (
      <div className="section-container loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tus tutorías...</p>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Mis Tutorías</h2>
        <div className="filtros-container">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="todas">Todas las tutorías</option>
            <option value="programada">Programadas</option>
            <option value="en_curso">En curso</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>

          <select 
            value={ordenFecha} 
            onChange={(e) => setOrdenFecha(e.target.value)}
            className="orden-select"
          >
            <option value="proximas">Próximas primero</option>
            <option value="pasadas">Pasadas primero</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <div className="tutorias-grid">
          {getTutoriasFiltradas().length === 0 ? (
            <div className="no-tutorias">
              <p>No tienes tutorías {filtroEstado !== "todas" ? `${filtroEstado}s` : ""}</p>
              <button className="solicitar-button">
                Solicitar tutoría
              </button>
            </div>
          ) : (
            getTutoriasFiltradas().map(tutoria => (
              <div key={tutoria.id} className="tutoria-card">
                <div className="tutoria-header">
                  <h3>{tutoria.materia}</h3>
                  <span className={getEstadoClase(tutoria.estado)}>
                    {tutoria.estado}
                  </span>
                </div>
                
                <div className="tutoria-info">
                  <p>
                    <i className="far fa-calendar"></i>
                    {formatearFecha(tutoria.fecha)}
                  </p>
                  <p>
                    <i className="far fa-clock"></i>
                    {tutoria.horaInicio} - {tutoria.horaFin}
                  </p>
                  {tutoria.tutor && (
                    <p>
                      <i className="far fa-user"></i>
                      Tutor: {tutoria.tutor.nombre}
                    </p>
                  )}
                  {tutoria.costoPorHora && (
                    <p>
                      <i className="fas fa-dollar-sign"></i>
                      Costo por hora: ${tutoria.costoPorHora}
                    </p>
                  )}
                </div>

                <div className="tutoria-actions">
                  {tutoria.estado === 'programada' && (
                    <>
                      <button className="action-button iniciar">
                        Unirse a la sesión
                      </button>
                      <button className="action-button cancelar">
                        Cancelar
                      </button>
                    </>
                  )}
                  {tutoria.estado === 'completada' && (
                    <button className="action-button calificar">
                      Calificar tutoría
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SolicitarTutoria({ onClose, onSolicitar }) {
  const [formData, setFormData] = useState({
    materia: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/tutorias/solicitar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg);
      }

      onSolicitar();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Solicitar Tutoría</h2>
        <form onSubmit={handleSubmit}>
          <select 
            name="materia" 
            value={formData.materia}
            onChange={(e) => setFormData({...formData, materia: e.target.value})}
            required
          >
            <option value="">Selecciona una materia</option>
            {/* Opciones de materias */}
          </select>

          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            required
          />

          <input
            type="time"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
            required
          />

          <input
            type="time"
            name="horaFin"
            value={formData.horaFin}
            onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
            required
          />

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            placeholder="Describe lo que necesitas"
            required
          />

          <div className="modal-actions">
            <button type="submit">Solicitar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MiTutor({ usuario }) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `http://localhost:4000/api/tutores/miTutor/${usuario.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!res.ok) throw new Error('Error al cargar información del tutor');
        
        const data = await res.json();
        setTutor(data);
        
        // Cargar mensajes
        const resMensajes = await fetch(
          `http://localhost:4000/api/mensajes?tutorId=${data.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!resMensajes.ok) throw new Error('Error al cargar mensajes');
        
        const mensajesData = await resMensajes.json();
        setMensajes(mensajesData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [usuario.id]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/mensajes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contenido: nuevoMensaje,
          receptorId: tutor.id
        })
      });

      if (!res.ok) throw new Error('Error al enviar mensaje');

      const mensajeEnviado = await res.json();
      setMensajes([...mensajes, mensajeEnviado]);
      setNuevoMensaje('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!tutor) return <div>No tienes un tutor asignado</div>;

  return (
    <div className="tutor-container">
      <div className="tutor-info">
        <h3>{tutor.nombre}</h3>
        <p>Especialidad: {tutor.especialidad}</p>
        <p>Email: {tutor.email}</p>
        <p>Horario: {tutor.horario}</p>
      </div>

      <div className="chat-container">
        <div className="mensajes">
          {mensajes.map(mensaje => (
            <div 
              key={mensaje.id} 
              className={`mensaje ${mensaje.emisorId === usuario.id ? 'enviado' : 'recibido'}`}
            >
              <p>{mensaje.contenido}</p>
              <span>{new Date(mensaje.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        <form onSubmit={enviarMensaje} className="enviar-mensaje">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
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

function Materiales({ usuario }) {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `http://localhost:4000/api/materiales?estudianteId=${usuario.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.msg || 'Error al cargar materiales');
        }

        const data = await res.json();
        setMateriales(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, [usuario.id]);

  const descargarMaterial = async (materialId, nombreArchivo) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:4000/api/materiales/descargar/${materialId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error('Error al descargar el material');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al descargar el material');
    }
  };

  const getMaterialesFiltrados = () => {
    return materiales.filter(material => {
      const matchesMateria = filtroMateria === "todas" || material.materia === filtroMateria;
      const matchesBusqueda = material.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                             material.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return matchesMateria && matchesBusqueda;
    });
  };

  if (loading) {
    return (
      <div className="section-container loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando materiales...</p>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Materiales de Estudio</h2>
        <div className="materiales-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar materiales..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filtroMateria}
            onChange={(e) => setFiltroMateria(e.target.value)}
            className="materia-select"
          >
            <option value="todas">Todas las materias</option>
            {/* Agregar opciones dinámicamente según las materias disponibles */}
          </select>
        </div>
      </div>

      {error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <div className="materiales-grid">
          {getMaterialesFiltrados().length === 0 ? (
            <div className="no-materiales">
              <p>No hay materiales disponibles</p>
            </div>
          ) : (
            getMaterialesFiltrados().map(material => (
              <div key={material.id} className="material-card">
                <div className="material-icon">
                  <i className={`fas fa-${getIconoTipo(material.tipo)}`}></i>
                </div>
                <div className="material-info">
                  <h3>{material.titulo}</h3>
                  <p className="material-descripcion">{material.descripcion}</p>
                  <div className="material-metadata">
                    <span>
                      <i className="fas fa-book"></i>
                      {material.materia}
                    </span>
                    <span>
                      <i className="fas fa-calendar"></i>
                      {new Date(material.fechaSubida).toLocaleDateString()}
                    </span>
                    <span>
                      <i className="fas fa-user"></i>
                      {material.autor}
                    </span>
                  </div>
                </div>
                <div className="material-actions">
                  <button
                    onClick={() => descargarMaterial(material.id, material.nombreArchivo)}
                    className="download-button"
                  >
                    <i className="fas fa-download"></i>
                    Descargar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Función auxiliar para determinar el icono según el tipo de material
function getIconoTipo(tipo) {
  const iconos = {
    'pdf': 'file-pdf',
    'doc': 'file-word',
    'ppt': 'file-powerpoint',
    'video': 'video',
    'imagen': 'image',
    'otro': 'file'
  };
  return iconos[tipo] || 'file';
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
          <Route path="tutor" element={<MiTutor usuario={usuario} />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="materiales" element={<Materiales usuario={usuario} />} />
        </Routes>
      </div>
    </div>
  );
}