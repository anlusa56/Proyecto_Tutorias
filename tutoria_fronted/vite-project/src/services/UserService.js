// src/services/userService.js
const API_URL = "http://localhost:3000/api/usuarios"; // cambia según tu backend

export async function getUsuarios() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
}
export async function eliminarUsuario(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}
