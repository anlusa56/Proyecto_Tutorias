import UserService from "../services/UserService";
import React, { useState, useEffect } from "react";

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
      <div className="user-list-container">
        <div className="user-list-box">
          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id} className="user-item">
                {user.nombre} - {user.correo} - {user.rol}
                <button
                  className="delete-btn"
                  onClick={async () => {
                    await UserService.deleteUser(user._id);
                    loadUsers();
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
        
  );
}

