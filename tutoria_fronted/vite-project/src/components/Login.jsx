import { useState } from "react";
import "./Login.css";

export default function Login({ setUsuario, setPantalla }) {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Intentando login con:", { correo: formData.correo });
      
      const res = await fetch("http://localhost:4000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (!res.ok) {
        throw new Error(data.msg || "Error en la autenticación");
      }

      // Guardar datos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      // Actualizar estado
      setUsuario(data.usuario);
      setPantalla("menu");

    } catch (err) {
      console.error("Error de login:", err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            disabled={loading}
            required
          />
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="nav-buttons">
          <button 
            type="button" 
            className="register-btn"
            onClick={() => setPantalla("registro")}
            disabled={loading}
          >
            Crear cuenta nueva
          </button>
          
          <button 
            type="button" 
            className="back-btn"
            onClick={() => setPantalla("home")}
            disabled={loading}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
