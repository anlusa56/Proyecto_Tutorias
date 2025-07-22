import { useState } from "react";
import { UserForm } from "../components/UserForm";
import { UserList } from "../components/UserList";

export function UsersPage() {
  const [reload, setReload] = useState(0);

  const handleUserCreated = () => {
    setReload(reload + 1);
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserForm onUserCreated={handleUserCreated} />
      <UserList reloadTrigger={reload} />
    </div>
  );
}
