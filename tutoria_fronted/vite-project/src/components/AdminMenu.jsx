// src/components/AdminMenu.jsx
import { useEffect, useState } from "react";
import { getUsuarios } from "../services/UserService";

function AdminMenu() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h2>Panel del Administrador</h2>
      <h3>Usuarios Registrados</h3>
      <ul>
        {usuarios.map((u) => (
          <li key={u._id}>{u.nombre} - {u.rol}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminMenu;
