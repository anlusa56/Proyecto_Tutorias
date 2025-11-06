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
        console.log("📦 Tutorías recibidas:", dataTutorias);
        console.log("Ejemplo de una tutoria:", JSON.stringify(dataTutorias[0], null, 2));





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
        console.log("📦 Tutoriados recibidos:", dataTutoriados);


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
          <Route path="tutorias" element={<MisTutorias tutorias={tutorias} error={error} usuario={usuario} setTutorias={setTutorias} />} />
          <Route path="tutoriados" element={<MisTutoriados tutoriados={tutoriados} error={error} />} />
          <Route path="avances" element={<RegistrarAvances tutoriados={tutoriados} />} />
          <Route path="*" element={<Navigate to="/estudiante_tutor/tutorias" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function MisTutorias({ tutorias, error, usuario, setTutorias }) {
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  const cambiarEstadoTutoria = async (tutoria, nuevoEstado) => {
    try {
      // Convertir espacios a guiones bajos para el estado
      const estadoFormateado = nuevoEstado.replace(' ', '_');
      
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/tutorias/${tutoria.id}/estado`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: estadoFormateado }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Error response:', data);
        throw new Error(data.msg || "Error al actualizar estado");
      }

      // Actualizar el estado local con la tutoría actualizada del servidor
      setTutorias(prevTutorias => 
        prevTutorias.map(t => 
          t.id === tutoria.id ? { ...t, estado: estadoFormateado } : t
        )
      );

      alert(`✅ Tutoría marcada como ${nuevoEstado}`);
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      alert(`Error al actualizar estado: ${err.message}`);
    }
  };

  const cancelarTutoria = async (tutoriaId) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta tutoría?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/tutorias/${tutoriaId}/cancelar`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || "Error al cancelar la tutoría");
      }

      // Actualizar estado local
      setTutorias(prevTutorias => 
        prevTutorias.map(t => 
          t.id === tutoriaId ? { ...t, estado: "cancelada" } : t
        )
      );

      alert("✅ Tutoría cancelada exitosamente");
    } catch (err) {
      console.error("❌ Error al cancelar tutoría:", err);
      alert(err.message);
    }
  };

  return (
    <div className="tutorias-list">
      <h2>Mis Tutorías como Tutor</h2>
      {error && <p className="error-message">{error}</p>}

      {tutorias?.length > 0 ? (
        <div className="tutorias-grid">
          {tutorias.map((tutoria) => (
            <div key={tutoria.id} className="tutoria-card">
              <h3>{tutoria.materia}</h3>
              <p>Fecha: {new Date(tutoria.fecha).toLocaleDateString()}</p>
              <p>Estado actual: <strong>{tutoria.estado}</strong></p>
              <p>
                Estudiante:{" "}
                {tutoria.tutoriasComoTutoriado?.[0]?.nombre || "Sin asignar"}
              </p>

              {/* ✅ Botones de acciones */}
              <div className="acciones-tutoria">
                {/* 🔄 Cambiar estado */}
                {tutoria.estado === "programada" && (
                  <button
                    className="estado-button iniciar"
                    onClick={() => cambiarEstadoTutoria(tutoria, "en_curso")}
                  >
                    Iniciar Tutoría
                  </button>
                )}
                {tutoria.estado === "en_curso" && (
                  <button
                    className="estado-button finalizar"
                    onClick={() => cambiarEstadoTutoria(tutoria, "completada")}
                  >
                    Finalizar Tutoría
                  </button>
                )}
                {tutoria.estado === "programada" && (
                  <button
                    className="estado-button cancelar"
                    onClick={() => cancelarTutoria(tutoria.id)}
                  >
                    Cancelar Tutoría
                  </button>
                )}

                {/* 💬 Chat */}
                <button
                  onClick={() =>
                    setTutoriaSeleccionada(
                      tutoriaSeleccionada?.id === tutoria.id ? null : tutoria
                    )
                  }
                  className="chat-button"
                >
                  {tutoriaSeleccionada?.id === tutoria.id
                    ? "Cerrar Chat"
                    : "Ver Chat"}
                </button>
              </div>

              {/* 🗨️ Chat */}
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
  const [avances, setAvances] = useState([]);
  const [tutoriadoSeleccionado, setTutoriadoSeleccionado] = useState(null);

  const cargarAvances = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/avances/tutoriado/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setAvances(data);
      setTutoriadoSeleccionado(id);
    } catch (err) {
      console.error("Error cargando avances:", err);
    }
  };

  return (
    <div className="tutoriados-list">
      <h2>Mis Estudiantes Asignados</h2>
      {error && <p className="error-message">{error}</p>}

      {tutoriados?.length > 0 ? (
        <div className="tutoriados-grid">
          {tutoriados.map(tutoria => {
            const estudiante = tutoria.tutoriados?.[0];
            return (
              <div key={tutoria.id} className="tutoriado-card">
                <h3>{estudiante?.nombre || "Sin estudiante"}</h3>
                <p>Email: {estudiante?.correo || "Sin correo"}</p>

                <button onClick={() => cargarAvances(estudiante?.id)}>
                  Ver avances
                </button>

                {tutoriadoSeleccionado === estudiante?.id && (
                  <div className="avances-list">
                    <h4>Avances registrados:</h4>
                    {avances.length > 0 ? (
                      <ul>
                        {avances.map(av => (
                          <li key={av.id}>
                            <strong>{av.tema}</strong> ({av.fecha}): {av.descripcion}  
                            — Calificación: {av.calificacion}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay avances registrados.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
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
            onChange={(e) => {
              const tutoria = tutoriados.find(t => 
                t.tutoriados?.[0]?.id === Number(e.target.value)
              );
              if (!tutoria) {
                setError('No se encontró la tutoría asociada');
                return;
              }
              setFormData({
                ...formData,
                tutoriadoId: e.target.value,
                tutoria_id: tutoria.id // Asegurarnos de establecer tutoria_id
              });
            }}
            required
          >
            <option value="">Seleccionar estudiante</option>
            {tutoriados.map(tutoria => (
              <option key={tutoria.id} value={tutoria.tutoriados?.[0]?.id}>
                {tutoria.tutoriados?.[0]?.nombre} - {tutoria.materia}
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