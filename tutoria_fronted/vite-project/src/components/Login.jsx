import { useState } from "react";
import "./Login.css";

export default function Login({ setUsuario, setPantalla }) {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Enviando datos:", {
        correo: formData.correo,
        // No mostramos la contraseña por seguridad
      });

      const res = await fetch("http://localhost:4000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("Respuesta:", data);

      if (!res.ok) {
        setError(data.msg || "Error al iniciar sesión");
        if (data.debug) console.log("Debug:", data.debug);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      setPantalla("menu");

    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
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
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="nav-buttons">
          <button 
            type="button" 
            className="register-btn"
            onClick={() => setPantalla("registro")}
          >
            Crear cuenta nueva
          </button>
          
          <button 
            type="button" 
            className="back-btn"
            onClick={() => setPantalla("home")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
