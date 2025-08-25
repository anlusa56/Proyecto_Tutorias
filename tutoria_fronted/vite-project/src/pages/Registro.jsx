import React, { useState } from "react";

export default function Registro({ setMostrarRegistro }) {
  const [formData, setFormData] = useState({ name: "", email: "", conraseña: "" });
  const [error, setError] = useState("");

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
      setMostrarRegistro(false); // vuelve al login

    } catch (err) {
      console.error(err);
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
            placeholder="Nombre completo"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={e => setFormData({...formData, contraseña: e.target.value})}
            required
          />
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