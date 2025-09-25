// src/services/userService.js
const API_URL = "http://localhost:4000/api/usuarios";

async function getUsers() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.msg || "Error al obtener usuarios");
  }
  return await res.json();
}

async function createUser(user) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(user)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error al crear usuario");
  return data;
}

async function deleteUser(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error al eliminar usuario");
  return data;
}

export { getUsers, createUser, deleteUser };
export default { getUsers, createUser, deleteUser };
