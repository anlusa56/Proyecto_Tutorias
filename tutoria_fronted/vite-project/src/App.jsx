import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import Registro from "./pages/Registro";
import AdminMenu from "./components/AdminMenu";
import ProfesorMenu from "./components/ProfesorMenu";
import TutorMenu from "./components/TutorMenu";
import TutoriadoMenu from "./components/TutoriadoMenu";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pantalla, setPantalla] = useState("home");

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
      setPantalla("menu");
    }
  }, []);

  // Si el usuario NO ha iniciado sesión
  if (!usuario) {
    switch (pantalla) {
      case "home":
        return <Home setPantalla={setPantalla} />;
      case "login":
        return <Login setUsuario={setUsuario} setPantalla={setPantalla} />;
      case "registro":
        return <Registro setPantalla={setPantalla} />;
      default:
        return <Home setPantalla={setPantalla} />;
    }
  }

  // Si el usuario YA inició sesión → mostrar menú según rol
  switch (usuario.rol) {
    case "admin":
      return <AdminMenu />;
    case "profesor":
      return <ProfesorMenu />;
    case "estudiante_tutor":
      return <TutorMenu />;
    case "estudiante_tutoriado":
      return <TutoriadoMenu />;
    default:
    // Si el rol es inválido, limpiar el usuario y mandar al Home
    localStorage.removeItem("usuario");
    setUsuario(null);
    return <Home setPantalla={setPantalla} />;
}
}

export default App;
