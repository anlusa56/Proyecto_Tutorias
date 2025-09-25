import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import "./TutoriasPage.css";

export default function TutoriasPage({ usuario }) {
  const [tutorias, setTutorias] = useState([]);
  const [error, setError] = useState("");
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tutorias", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.msg || 'Error al obtener tutorías');
        }

        setTutorias(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    };

    fetchTutorias();
  }, []);

  return (
    <div className="tutorias-container">
      <div className="tutorias-list">
        <h1>Gestión de Tutorías</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="tutorias-grid">
          {tutorias.map(tutoria => (
            <div 
              key={tutoria.id} 
              className="tutoria-card"
              onClick={() => setTutoriaSeleccionada(tutoria)}
            >
              <h3>{tutoria.titulo}</h3>
              <p>Materia: {tutoria.materia}</p>
              <p>Fecha: {new Date(tutoria.fecha).toLocaleString()}</p>
              <p>Estado: {tutoria.estado}</p>
            </div>
          ))}
        </div>
      </div>

      {tutoriaSeleccionada && (
        <div className="chat-section">
          <Chat 
            tutoria={tutoriaSeleccionada} 
            usuario={usuario} 
          />
        </div>
      )}
    </div>
  );
}