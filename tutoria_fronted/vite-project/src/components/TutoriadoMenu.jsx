import { useState, useEffect } from "react";

export default function TutoriadoMenu({ usuario, onLogout }) {
  const [tutorias, setTutorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerTutorias = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/tutorias?estudianteId=${usuario.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.msg || 'Error al obtener tutorías');
        }
        
        setTutorias(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    };

    obtenerTutorias();
  }, [usuario.id]);

  return (
    <div className="tutoriado-menu">
      <h2>Bienvenido, {usuario.nombre}</h2>
      
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

      <button onClick={onLogout} className="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
}
