import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import "./TutoriasList.css";

export default function TutoriasList() {
  const [tutorias, setTutorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tutorias', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTutorias(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error al cargar las tutorías');
        console.error('Error:', err);
      }
    };

    fetchTutorias();
  }, []);

  return (
    <div className="tutorias-list">
      <h2>Mis Tutorías</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <Link to="/estudiante_tutoriado/calendario">Ver Calendario</Link>

      <div className="tutorias-grid">
        {tutorias.map(tutoria => (
          <div key={tutoria.id} className="tutoria-card">
            <h3>{tutoria.titulo}</h3>
            <p>Materia: {tutoria.materia}</p>
            <p>Fecha: {new Date(tutoria.fecha).toLocaleDateString()}</p>
            <p>Hora: {tutoria.hora_inicio} - {tutoria.hora_fin}</p>
            <p>Estado: {tutoria.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
}