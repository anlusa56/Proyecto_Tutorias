// src/App.jsx
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminMenu from "./components/AdminMenu";
import ProfesorMenu from "./components/ProfesorMenu";
import TutorMenu from "./components/TutorMenu";
import TutoriadoMenu from "./components/TutoriadoMenu";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    console.log("userData en localStorage:", userData);
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    console.log("usuario actualizado:", usuario);
  }, [usuario]);

  if (!usuario) return <Login setUsuario={setUsuario} />;

  switch (usuario.rol) {
    case "administrador":
      return <AdminMenu />;
    case "profesor":
      return <ProfesorMenu />;
    case "tutor":
      return <TutorMenu />;
    case "tutoriado":
      return <TutoriadoMenu />;
    default:
      return <div>Rol no válido</div>;
  }
}

export default App;

