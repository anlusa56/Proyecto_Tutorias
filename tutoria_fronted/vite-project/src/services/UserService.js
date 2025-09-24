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
  try {
    console.log('Enviando datos:', user);
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log('Respuesta del servidor:', data);

    if (!res.ok) {
      throw new Error(data.msg || "Error al crear usuario");
    }

    return data;
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
}

export default {
  getUsers,
  deleteUser,
  createUser,
};

export { getUsers, deleteUser, createUser };
