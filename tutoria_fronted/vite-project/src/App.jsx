import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import Registro from "./pages/Registro";
import AdminMenu from "./components/AdminMenu";
import ProfesorMenu from "./components/ProfesorMenu";
import TutorMenu from "./components/TutorMenu";
import TutoriadoMenu from "./components/TutoriadoMenu";
import ErrorBoundary from "./components/ErrorBoundary";

const ROLES = {
  ADMIN: "admin",
  PROFESOR: "profesor",
  TUTOR: "estudiante_tutor",
  TUTORIADO: "estudiante_tutoriado"
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pantalla, setPantalla] = useState("home");

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setPantalla("home");
  };

  const handleError = (error) => {
    console.error('Error en la aplicación:', error);
    cerrarSesion();
  };

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.rol || !parsedUser.id) {
          throw new Error("Datos de usuario inválidos");
        }
        setUsuario(parsedUser);
        setPantalla("menu");
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      {!usuario ? (
        <>
          {pantalla === "home" && <Home setPantalla={setPantalla} />}
          {pantalla === "login" && <Login setUsuario={setUsuario} setPantalla={setPantalla} />}
          {pantalla === "registro" && <Registro setPantalla={setPantalla} />}
        </>
      ) : (
        <>
          {usuario.rol === ROLES.ADMIN && <AdminMenu onLogout={cerrarSesion} usuario={usuario} />}
          {usuario.rol === ROLES.PROFESOR && <ProfesorMenu onLogout={cerrarSesion} usuario={usuario} />}
          {usuario.rol === ROLES.TUTOR && <TutorMenu onLogout={cerrarSesion} usuario={usuario} />}
          {usuario.rol === ROLES.TUTORIADO && <TutoriadoMenu onLogout={cerrarSesion} usuario={usuario} />}
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;
