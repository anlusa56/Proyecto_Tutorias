import { UsersPage } from "../pages/UsersPage";

function AdminMenu() {
  return (
    <div className="panel-container">
      <div className="panel">
        <h2>Panel del Administrador</h2>

        {/* UsersPage centrado */}
        <div className="users-page-container">
          <UsersPage />
        </div>

        {/* Botón de cerrar sesión */}
        <div style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => {
              localStorage.removeItem("usuario");
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;

