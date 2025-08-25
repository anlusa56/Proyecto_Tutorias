import UserService from "../services/UserService";
import React, { useState, useEffect} from "react";

export function UserList({ reloadTrigger }) {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await UserService.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, [reloadTrigger]);

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {user.nombre} - {user.correo} - {user.rol}
          <button onClick={async () => {
            await UserService.deleteUser(user._id);
            loadUsers();
          }}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}
