// src/App.jsx
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Registro from "./pages/Registro";
import AdminMenu from "./components/AdminMenu";
import ProfesorMenu from "./components/ProfesorMenu";
import TutorMenu from "./components/TutorMenu";
import TutoriadoMenu from "./components/TutoriadoMenu";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    // Puedes quitar este console.log si ya no lo necesitas
    // console.log("usuario actualizado:", usuario);
  }, [usuario]);

  if (!usuario) {
    return (
      <div>
        {mostrarRegistro ? (
          <>
            <Registro />
            <p>
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => setMostrarRegistro(false)}>
                Iniciar sesión
              </button>
            </p>
          </>
        ) : (
          <>
            <Login setUsuario={setUsuario} />
            <p>
              ¿No tienes cuenta?{" "}
              <button onClick={() => setMostrarRegistro(true)}>
                Registrarse
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

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
      return <div>Rol no válido</div>;
  }
}

export default App;

