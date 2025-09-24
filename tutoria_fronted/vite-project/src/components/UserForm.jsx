import { useState } from 'react';

export default function UserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'estudiante_tutoriado'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Enviando formulario:', formData);
      await onSubmit(formData);
      // Limpiar formulario
      setFormData({
        nombre: '',
        correo: '',
        contraseña: '',
        rol: 'estudiante_tutoriado'
      });
    } catch (err) {
      setError(err.message);
      console.error('Error en formulario:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="contraseña">Contraseña:</label>
        <input
          type="password"
          id="contraseña"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="rol">Rol:</label>
        <select
          id="rol"
          name="rol"
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="admin">Administrador</option>
          <option value="profesor">Profesor</option>
          <option value="estudiante_tutor">Tutor</option>
          <option value="estudiante_tutoriado">Tutoriado</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <button type="submit" className="submit-button">
        Crear Usuario
      </button>
    </form>
  );
}
