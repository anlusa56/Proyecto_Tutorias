// src/services/userService.js
const API_URL = "http://localhost:4000/api/usuarios"; // cambia según tu backend

async function getUsers() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
}

async function deleteUser(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return await res.json();
}

async function createUser(user) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:4000/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return await res.json();
}

// Agrega esta exportación por defecto:
export default {
  getUsers,
  deleteUser,
  createUser,
};

// Agrega esta línea:
export { getUsers, deleteUser, createUser };
