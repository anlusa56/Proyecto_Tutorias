import { useState } from "react";
import UserService from "../services/UserService";

export function UserForm({ onUserCreated }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "estudiante"
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await UserService.createUser(form);
    setForm({ nombre: "", correo: "", rol: "estudiante" });
    onUserCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} />
      <select name="rol" value={form.rol} onChange={handleChange}>
        <option value="administrador">Administrador</option>
        <option value="profesor">Profesor</option>
        <option value="estudiante_tutor">Estudiante Tutor</option>
        <option value="estudiante_tutoriado">Estudiante Tutoriado</option>
      </select>
      <button type="submit">Crear usuario</button>
    </form>
  );
}
