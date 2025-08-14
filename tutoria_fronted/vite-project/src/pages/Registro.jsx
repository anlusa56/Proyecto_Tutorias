import { useState } from "react";
import UserService from "../services/UserService";

function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "tutoriado", // valor por defecto
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.registrarUsuario(form);
      alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      // Aquí puedes redirigir al login si usas react-router
      // navigate("/login");
    } catch (error) {
      alert("Error al registrar usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <input
        name="correo"
        placeholder="Correo"
        type="email"
        value={form.correo}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Contraseña"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <select name="rol" value={form.rol} onChange={handleChange}>
        <option value="admin">Administrador</option>
        <option value="profesor">Profesor</option>
        <option value="estudiante_tutor">Tutor</option>
        <option value="estudiante_tutoriado">Tutoriado</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Registro;