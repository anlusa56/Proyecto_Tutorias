import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "estudiante_tutoriado" // Valor por defecto válido
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Enviando datos:", formData);

      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          password: formData.contraseña, // Cambiado a password para coincidir con el backend
          rol: formData.rol
        })
      });

      const data = await res.json();
      console.log("Respuesta completa del servidor:", data);

      if (!res.ok) {
        throw new Error(data.error || data.msg || "Error al crear usuario");
      }

      alert("Usuario creado exitosamente!");
      navigate("/login");
    } catch (err) {
      console.error("Error detallado:", err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="login-card">
        <h1>Registrarse</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
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
          <select 
            name="rol" 
            value={formData.rol} 
            onChange={handleChange}
            required
          >
            <option value="estudiante_tutoriado">Estudiante (Tutoriado)</option>
            <option value="estudiante_tutor">Estudiante (Tutor)</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Creando usuario..." : "Crear cuenta"}
          </button>
        </form>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="nav-buttons">
          <button 
            type="button" 
            onClick={() => navigate("/login")}
          >
            Ya tengo cuenta
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}