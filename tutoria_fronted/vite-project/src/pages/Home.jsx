import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Navegando a login");
    navigate('/login');
  };

  const handleRegistro = () => {
    console.log("Navegando a registro");
    navigate('/registro');
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a la Plataforma de Tutorías</h1>
      <p>Conéctate con tutores y recibe apoyo académico fácilmente.</p>

      <div style={{ marginTop: "30px" }}>
        <button onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <button onClick={handleRegistro}>
          Registrarse
        </button>
      </div>
    </div>
  );
}
