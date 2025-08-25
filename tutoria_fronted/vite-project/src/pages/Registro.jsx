import React, { useState } from "react";

export default function Registro({ setMostrarRegistro }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "tutoriado", // valor por defecto
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "No se pudo crear el usuario");
        return;
      }

      alert("Usuario creado exitosamente!");
      setMostrarRegistro(false);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
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
          <select name="rol" value={formData.rol} onChange={handleChange}>
            <option value="admin">Administrador</option>
            <option value="profesor">Profesor</option>
            <option value="estudiante_tutor">Tutor</option>
            <option value="estudiante_tutoriado">Tutoriado</option>
          </select>
          <button type="submit">Crear cuenta</button>
        </form>
        {error && <p>{error}</p>}
        <button
          type="button"
          className="register-btn"
          onClick={() => setMostrarRegistro(false)}
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
}