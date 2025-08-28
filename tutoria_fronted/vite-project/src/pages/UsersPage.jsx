import { useState } from "react";
import { UserForm } from "../components/UserForm";
import { UserList } from "../components/UserList";
import "./UsersPage.css";

export function UsersPage() {
  const [reload, setReload] = useState(0);

  const handleUserCreated = () => {
    setReload(reload + 1);
  };

  return (
    <div className="users-pagen">
    <div className="users-page">
      <h1>Gestión de Usuarios</h1>
      <div className="users-page-content">
        <UserForm onUserCreated={handleUserCreated} />
        <UserList reloadTrigger={reload} />
      </div>
    </div>
    </div>
  );
}

