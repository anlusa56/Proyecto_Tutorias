// src/components/Login.jsx
import { useState } from "react";
import './Login.css';

export default function Login({ setUsuario, setMostrarRegistro }) {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState(""); // Cambia 'password' por 'contraseña'
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/login", { // Usa la ruta /api/login
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }), // Usa 'contraseña'
      });

      if (!res.ok) {
        setError("Credenciales incorrectas");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));

      setUsuario(data.user);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>

        {/* Botón para mostrar el registro */}
        <button
          type="button"
          className="register-btn"
          onClick={() => setMostrarRegistro(true)}
        >
          Registrarse
        </button>

        {/* Mensaje de error */}
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      </div>
    </div>
  );
}