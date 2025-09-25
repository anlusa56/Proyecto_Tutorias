import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Registro from "./pages/Registro";
import AdminMenu from "./components/AdminMenu";
import ProfesorMenu from "./components/ProfesorMenu";
import TutorMenu from "./components/TutorMenu";
import TutoriadoMenu from "./components/TutoriadoMenu";

const ROLES = {
  ADMIN: "admin",
  PROFESOR: "profesor",
  TUTOR: "estudiante_tutor",
  TUTORIADO: "estudiante_tutoriado"
};

const getRutaBase = (rol) => {
  switch (rol) {
    case ROLES.ADMIN: return '/admin';
    case ROLES.PROFESOR: return '/profesor';
    case ROLES.TUTOR: return '/tutor';
    case ROLES.TUTORIADO: return '/tutoriado';
    default: return '/';
  }
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pantalla, setPantalla] = useState("home");

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            !usuario ? <Home setPantalla={setPantalla} /> : 
            <Navigate to={getRutaBase(usuario.rol)} replace />
          } />
          <Route path="/login" element={
            !usuario ? <Login setUsuario={setUsuario} setPantalla={setPantalla} /> :
            <Navigate to={getRutaBase(usuario.rol)} replace />
          } />

          {/* Rutas protegidas */}
          <Route path="/admin/*" element={
            usuario?.rol === ROLES.ADMIN ? 
              <AdminMenu usuario={usuario} onLogout={() => setUsuario(null)} /> :
              <Navigate to="/login" replace />
          } />
          <Route path="/profesor/*" element={
            usuario?.rol === ROLES.PROFESOR ? 
              <ProfesorMenu usuario={usuario} onLogout={() => setUsuario(null)} /> :
              <Navigate to="/login" replace />
          } />
          <Route path="/tutor/*" element={
            usuario?.rol === ROLES.TUTOR ? 
              <TutorMenu usuario={usuario} onLogout={() => setUsuario(null)} /> :
              <Navigate to="/login" replace />
          } />
          <Route path="/tutoriado/*" element={
            usuario?.rol === ROLES.TUTORIADO ? 
              <TutoriadoMenu usuario={usuario} onLogout={() => setUsuario(null)} /> :
              <Navigate to="/login" replace />
          } />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
