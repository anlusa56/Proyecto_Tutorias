import { useState, useEffect } from 'react';
import './AsignarTutorForm.css';

export default function AsignarTutorForm({ onAsignar }) {
  const [tutores, setTutores] = useState([]);
  const [tutoriados, setTutoriados] = useState([]);
  const [formData, setFormData] = useState({
    tutorId: '',
    tutoriadoId: '',
    materia: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    observaciones: '',
    costoPorHora: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Obtener tutores
        const resTutores = await fetch('http://localhost:4000/api/usuarios?rol=estudiante_tutor', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const tutoresData = await resTutores.json();

        // Obtener tutoriados
        const resTutoriados = await fetch('http://localhost:4000/api/usuarios?rol=estudiante', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const tutoriadosData = await resTutoriados.json();

        setTutores(tutoresData);
        setTutoriados(tutoriadosData);
      } catch (err) {
        setError('Error al cargar usuarios');
        console.error(err);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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
      if (!res.ok) throw new Error(data.msg || 'Error al asignar tutoría');

      onAsignar(data);
      setFormData({
        tutorId: '',
        tutoriadoId: '',
        materia: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        observaciones: '',
        costoPorHora: ''
      });
    } catch (err) {
      setError(err.message);
      console.error('Error al asignar tutoría:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="asignar-tutor-form">
      <h2>Asignar Tutor</h2>

      <div className="form-group">
        <label htmlFor="tutorId">Tutor:</label>
        <select
          id="tutorId"
          name="tutorId"
          value={formData.tutorId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un tutor</option>
          {tutores.map(tutor => (
            <option key={tutor.id} value={tutor.id}>
              {tutor.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tutoriadoId">Estudiante:</label>
        <select
          id="tutoriadoId"
          name="tutoriadoId"
          value={formData.tutoriadoId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un estudiante</option>
          {tutoriados.map(tutoriado => (
            <option key={tutoriado.id} value={tutoriado.id}>
              {tutoriado.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="materia">Materia:</label>
        <input
          type="text"
          id="materia"
          name="materia"
          value={formData.materia}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="fecha">Fecha:</label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="horaInicio">Hora de inicio:</label>
        <input
          type="time"
          id="horaInicio"
          name="hora_inicio"
          value={formData.hora_inicio}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="horaFin">Hora de fin:</label>
        <input
          type="time"
          id="horaFin"
          name="hora_fin"
          value={formData.hora_fin}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="observaciones">Observaciones:</label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="costoPorHora">Costo por hora:</label>
        <input
          type="number"
          id="costoPorHora"
          name="costoPorHora"
          value={formData.costoPorHora}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Asignando...' : 'Asignar Tutor'}
      </button>
    </form>
  );
}