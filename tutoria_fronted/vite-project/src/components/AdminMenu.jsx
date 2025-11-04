import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import TutoriasPage from '../pages/TutoriasPage';
import ReportesPage from '../pages/ReportesPage';
import SolicitudesRegistro from '../pages/SolicitudesRegistro';
import './AdminMenu.css';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalUsuario, setModalUsuario] = useState({ open: false, usuario: null });
  const [filtroRol, setFiltroRol] = useState('todos');
  const [confirmarEliminar, setConfirmarEliminar] = useState({ show: false, userId: null });

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEstadoUsuario = async (userId, activo) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/usuarios/${userId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ activo })
      });

      if (!res.ok) throw new Error('Error al actualizar usuario');
      cargarUsuarios(); // Recargar lista
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminarUsuario = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Error al eliminar usuario');
      
      // Recargar la lista de usuarios
      await cargarUsuarios();
      setConfirmarEliminar({ show: false, userId: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    filtroRol === 'todos' || usuario.rol === filtroRol
  );

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <div className="filtros">
          <select 
            value={filtroRol} 
            onChange={(e) => setFiltroRol(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos los roles</option>
            <option value="profesor">Profesores</option>
            <option value="estudiante_tutor">Tutores</option>
            <option value="estudiante_tutoriado">Tutoriados</option>
          </select>
          <button 
            onClick={() => setModalUsuario({ open: true, usuario: null })}
            className="add-button"
          >
            Agregar Usuario
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="usuarios-grid">
        {usuariosFiltrados.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <div className="usuario-header">
              <h3>{usuario.nombre}</h3>
              <span className={`estado ${usuario.activo ? 'activo' : 'inactivo'}`}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="usuario-info">
              <p><strong>Email:</strong> {usuario.correo}</p>
              <p><strong>Rol:</strong> {usuario.rol}</p>
            </div>
            <div className="usuario-actions">
              <button
                onClick={() => setModalUsuario({ open: true, usuario })}
                className="edit-button"
              >
                Editar
              </button>
              <button
                onClick={() => handleEstadoUsuario(usuario.id, !usuario.activo)}
                className={usuario.activo ? 'deactivate-button' : 'activate-button'}
              >
                {usuario.activo ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => setConfirmarEliminar({ show: true, userId: usuario.id })}
                className="delete-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación para eliminar */}
      {confirmarEliminar.show && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button
                onClick={() => handleEliminarUsuario(confirmarEliminar.userId)}
                className="delete-button"
              >
                Sí, Eliminar
              </button>
              <button
                onClick={() => setConfirmarEliminar({ show: false, userId: null })}
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalUsuario.open && (
        <ModalUsuario
          usuario={modalUsuario.usuario}
          onClose={() => setModalUsuario({ open: false, usuario: null })}
          onSave={() => {
            cargarUsuarios();
            setModalUsuario({ open: false, usuario: null });
          }}
        />
      )}
    </div>
  );
}

function ModalUsuario({ usuario, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: usuario ? usuario.nombre : '',
    correo: usuario ? usuario.correo : '',
    rol: usuario ? usuario.rol : 'estudiante_tutoriado',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = usuario 
        ? `http://localhost:4000/api/usuarios/${usuario.id}`
        : 'http://localhost:4000/api/usuarios';
      
      const res = await fetch(url, {
        method: usuario ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al guardar usuario');
      onSave();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{usuario ? 'Editar Usuario' : 'Crear Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo:</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
              required
            >
              <option value="estudiante_tutoriado">Estudiante</option>
              <option value="estudiante_tutor">Tutor</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {!usuario && (
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="save-button">
              {usuario ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfiguracionSistema() {
  const [config, setConfig] = useState({
    duracionTutoria: 60,
    limiteEstudiantes: 5,
    horasMinimas: 2,
    diasAntelacion: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/configuracion', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar configuración');
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar duración de la tutoría
    if (config.duracionTutoria < 30) {
      setToast('Una tutoría no puede durar menos de 30 minutos');
      return;
    }

    if (config.duracionTutoria >= 120) {
      setToast('Una tutoría no puede durar 2 horas o más');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/configuracion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error('Error al guardar configuración');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Efecto para limpiar el toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return <div className="loading">Cargando configuración...</div>;

  return (
    <div className="section-container">
      <h2>Configuración del Sistema</h2>
      {error && <div className="error-message">{error}</div>}
      {saved && <div className="success-message">Configuración guardada exitosamente</div>}
      {toast && <div className="toast-message">{toast}</div>}

      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-group">
          <label>Duración predeterminada de tutoría (minutos):</label>
          <input
            type="number"
            value={config.duracionTutoria}
            onChange={(e) => setConfig({...config, duracionTutoria: parseInt(e.target.value)})}
            min="30"
            max="119"
            required
          />
        </div>

        <div className="form-group">
          <label>Límite de estudiantes por tutor:</label>
          <input
            type="number"
            value={config.limiteEstudiantes}
            onChange={(e) => setConfig({...config, limiteEstudiantes: parseInt(e.target.value)})}
            min="1"
            max="10"
            required
          />
        </div>

        <div className="form-group">
          <label>Horas mínimas de antelación para programar:</label>
          <input
            type="number"
            value={config.horasMinimas}
            onChange={(e) => setConfig({...config, horasMinimas: parseInt(e.target.value)})}
            min="1"
            max="48"
            required
          />
        </div>

        <div className="form-group">
          <label>Días de antelación para cancelar:</label>
          <input
            type="number"
            value={config.diasAntelacion}
            onChange={(e) => setConfig({...config, diasAntelacion: parseInt(e.target.value)})}
            min="1"
            max="7"
            required
          />
        </div>

        <button type="submit" className="save-button">
          Guardar Configuración
        </button>
      </form>
    </div>
  );
}

export default function AdminMenu({ usuario, onLogout }) {
  if (!usuario) return <Navigate to="/login" />;

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <ul>
          <li><Link to="/admin/solicitudes">Solicitudes de Registro</Link></li>
          <li><Link to="/admin/usuarios">Gestión de Usuarios</Link></li>
          <li><Link to="/admin/configuracion">Configuración</Link></li>
          <li>
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/solicitudes" replace />} />
          <Route path="/solicitudes" element={<SolicitudesRegistro />} />
          <Route path="/usuarios" element={<GestionUsuarios />} />
          <Route path="/configuracion" element={<ConfiguracionSistema />} />
        </Routes>
      </div>
    </div>
  );
}