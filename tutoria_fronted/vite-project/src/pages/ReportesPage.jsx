import { useState, useEffect } from 'react';
import "./ReportesPage.css";

export default function ReportesPage() {
  const [stats, setStats] = useState({
    totalTutorias: 0,
    tutoriasActivas: 0,
    totalUsuarios: 0,
    tutoresPorMateria: []
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/reportes", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Error al obtener estadísticas');
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON válido');
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reportes-page">
      <h1>Reportes y Estadísticas</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tutorías</h3>
          <p className="stat-number">{stats.totalTutorias}</p>
        </div>

        <div className="stat-card">
          <h3>Tutorías Activas</h3>
          <p className="stat-number">{stats.tutoriasActivas}</p>
        </div>

        <div className="stat-card">
          <h3>Total Usuarios</h3>
          <p className="stat-number">{stats.totalUsuarios}</p>
        </div>
      </div>

      <div className="tutores-materias">
        <h3>Tutores por Materia</h3>
        <div className="materias-grid">
          {stats.tutoresPorMateria.map(item => (
            <div key={item.materia} className="materia-card">
              <h4>{item.materia}</h4>
              <p>{item.total} tutores</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}