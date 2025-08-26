export default function Home({ setPantalla }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a la Plataforma de Tutorías</h1>
      <p>Conéctate con tutores y recibe apoyo académico fácilmente.</p>

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => setPantalla("login")} style={{ marginRight: "10px" }}>
          Iniciar Sesión
        </button>
        <button onClick={() => setPantalla("registro")}>
          Registrarse
        </button>
      </div>
    </div>
  );
}
