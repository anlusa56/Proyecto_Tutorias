import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Registro from "./pages/Registro";
import AdminMenu from "./components/AdminMenu";
import ProfesorMenu from "./components/ProfesorMenu";
import TutorMenu from "./components/TutorMenu";
import TutoriadoMenu from "./components/TutoriadoMenu";
import './App.css';

// Constantes de roles
const ROLES = {
  ADMIN: "admin",
  PROFESOR: "profesor",
  TUTOR: "estudiante_tutor",
  TUTORIADO: "estudiante_tutoriado"
};

function AppRoutes({ usuario, setUsuario }) {
  const handleLogout = useCallback(() => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Actualizar estado
    setUsuario(null);
    // Redirigir a home
    window.location.href = '/';
  }, [setUsuario]);

  // Si no hay usuario, mostrar rutas públicas
  if (!usuario) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUsuario={setUsuario} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Si hay usuario, mostrar rutas según rol
  return (
    <Routes>
      {/* Ruta raíz redirige según rol */}
      <Route path="/" element={<Navigate to={`/${usuario.rol}`} replace />} />

      {/* Rutas de Admin */}
      <Route path="/admin/*" element={
        usuario?.rol === ROLES.ADMIN ? (
          <AdminMenu usuario={usuario} onLogout={handleLogout} />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      {/* Rutas de Profesor */}
      <Route path="/profesor/*" element={
        usuario.rol === ROLES.PROFESOR ? (
          <ProfesorMenu usuario={usuario} onLogout={handleLogout} />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      {/* Rutas de Tutor */}
      <Route path="/estudiante_tutor/*" element={
        usuario.rol === ROLES.TUTOR ? (
          <TutorMenu usuario={usuario} onLogout={handleLogout} />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      {/* Rutas de Tutoriado */}
      <Route path="/estudiante_tutoriado/*" element={
        usuario.rol === ROLES.TUTORIADO ? (
          <TutoriadoMenu usuario={usuario} onLogout={handleLogout} />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      {/* Ruta fallback */}
      <Route path="*" element={<Navigate to={`/${usuario.rol}`} replace />} />
    </Routes>
  );
}

function App() {
  // Estado del usuario con inicialización desde localStorage
  const [usuario, setUsuario] = useState(() => {
    try {
      const savedUser = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      
      if (!savedUser || !token) {
        return null;
      }
      
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing user:', error);
      localStorage.clear();
      return null;
    }
  });

  // Renderizado principal
  return (
    <BrowserRouter>
      <div className="app-container">
        <AppRoutes usuario={usuario} setUsuario={setUsuario} />
      </div>
    </BrowserRouter>
  );
}

export default App;