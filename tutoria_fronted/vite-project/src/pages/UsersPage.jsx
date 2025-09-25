import { useState } from "react";
import UserForm from "../components/UserForm";
import { UserList } from "../components/UserList";
import { createUser } from "../services/UserService";
import "./UsersPage.css";

export default function UsersPage() {
  const [reload, setReload] = useState(0);
  const [error, setError] = useState("");

  const handleUserCreated = async (userData) => {
    try {
      await createUser(userData);
      setReload(prev => prev + 1);
      setError("");
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError(err.message || "Error al crear usuario");
    }
  };

  return (
    <div className="users-page">
      <h1>Gestión de Usuarios</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="users-page-content">
        <UserForm onSubmit={handleUserCreated} />
        <UserList reloadTrigger={reload} />
      </div>
    </div>
  );
}

