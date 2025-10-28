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
      const res = await fetch('http://localhost:4000/api/solicitudes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Error al cargar solicitudes');
      const data = await res.json();
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
      const res = await fetch(`http://localhost:4000/api/solicitudes/${id}/aprobar`, {
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
      alert(err.message);
    }
  };

  const rechazarSolicitud = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/solicitudes/${id}`, {
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
      alert(err.message);
    }
  };

  if (loading) return <div>Cargando solicitudes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="solicitudes-container">
      <h2>Solicitudes de Registro Pendientes</h2>
      
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
              <button onClick={() => aprobarSolicitud(solicitud.id)} className="aprobar-btn">
                Aprobar
              </button>
              <button onClick={() => rechazarSolicitud(solicitud.id)} className="rechazar-btn">
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
