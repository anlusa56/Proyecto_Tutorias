function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.location.reload(); // Vuelve al login
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
