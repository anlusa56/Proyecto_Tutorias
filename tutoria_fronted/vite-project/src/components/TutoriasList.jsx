import { useState, useEffect } from 'react';
import axios from 'axios';
import './TutoriasList.css';

export default function TutoriasList() {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tutorias', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTutorias(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorias();
  }, []);

  if (loading) return <div>Cargando tutorías...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tutorias-list">
      <h2>Mis Tutorías</h2>
      <div className="tutorias-grid">
        {tutorias.map(tutoria => (
          <div key={tutoria.id} className="tutoria-card">
            <h3>{tutoria.titulo}</h3>
            <p><strong>Materia:</strong> {tutoria.materia}</p>
            <p><strong>Fecha:</strong> {new Date(tutoria.fecha).toLocaleDateString()}</p>
            <p><strong>Horario:</strong> {tutoria.horaInicio} - {tutoria.horaFin}</p>
            <p><strong>Estado:</strong> {tutoria.estado}</p>
            <p><strong>Costo por hora:</strong> ${tutoria.costoPorHora}</p>
          </div>
        ))}
      </div>
    </div>
  );
}