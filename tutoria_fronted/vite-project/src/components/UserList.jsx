import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/UserService";

export function UserList({ reloadTrigger }) {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getUsers();
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
          <button onClick={() => { deleteUser(user._id); loadUsers(); }}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}
