import { useState, useEffect } from 'react';
import './SolicitudesRegistro.css';

export default function SolicitudesRegistro() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/usuarios/solicitudes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setSolicitudes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const aprobarSolicitud = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/usuarios/${id}/aprobar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Error al aprobar solicitud');
      setSolicitudes(prev => prev.filter(s => s.id !== id));
      alert('Solicitud aprobada exitosamente');
    } catch (err) {
      alert('Error al aprobar solicitud');
    }
  };

  const rechazarSolicitud = async (id) => {
    if (!window.confirm('¿Está seguro de rechazar esta solicitud?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Error al rechazar solicitud');
      setSolicitudes(prev => prev.filter(s => s.id !== id));
      alert('Solicitud rechazada exitosamente');
    } catch (err) {
      alert('Error al rechazar solicitud');
    }
  };

  const aprobarTodas = async () => {
    if (!window.confirm('¿Está seguro de aprobar todas las solicitudes?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/usuarios/aprobar-todas', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Error al aprobar solicitudes');
      setSolicitudes([]);
      alert('Todas las solicitudes han sido aprobadas');
    } catch (err) {
      alert('Error al aprobar solicitudes');
    }
  };

  const rechazarTodas = async () => {
    if (!window.confirm('¿Está seguro de rechazar todas las solicitudes?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/usuarios/rechazar-todas', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Error al rechazar solicitudes');
      setSolicitudes([]);
      alert('Todas las solicitudes han sido rechazadas');
    } catch (err) {
      alert('Error al rechazar solicitudes');
    }
  };

  if (loading) return <div className="loading">Cargando solicitudes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="solicitudes-container">
      <div className="solicitudes-header">
        <h2>Solicitudes de Registro Pendientes</h2>
        <div className="acciones-masivas">
          <button onClick={aprobarTodas} className="aprobar-todas">
            Aprobar Todas
          </button>
          <button onClick={rechazarTodas} className="rechazar-todas">
            Rechazar Todas
          </button>
        </div>
      </div>

      {solicitudes.length === 0 ? (
        <p className="no-solicitudes">No hay solicitudes pendientes</p>
      ) : (
        <div className="solicitudes-grid">
          {solicitudes.map(solicitud => (
            <div key={solicitud.id} className="solicitud-card">
              <div className="solicitud-info">
                <h3>{solicitud.nombre}</h3>
                <p><strong>Email:</strong> {solicitud.correo}</p>
                <p><strong>Rol:</strong> {solicitud.rol}</p>
                <p><strong>Fecha:</strong> {new Date(solicitud.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="solicitud-actions">
                <button
                  onClick={() => aprobarSolicitud(solicitud.id)}
                  className="aprobar-btn"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  className="rechazar-btn"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
