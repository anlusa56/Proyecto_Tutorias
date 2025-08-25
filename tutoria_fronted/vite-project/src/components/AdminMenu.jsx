// src/components/AdminMenu.jsx
import { UsersPage } from "../pages/UsersPage";

function AdminMenu() {
  return (
    <div>
      <h2>Panel del Administrador</h2>
      <UsersPage />
      {/* Ejemplo para cualquier menú */}
      <button
        onClick={() => {
          localStorage.removeItem("usuario");
          localStorage.removeItem("token");
          window.location.reload(); // Recarga la app y vuelve al login
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default AdminMenu;
