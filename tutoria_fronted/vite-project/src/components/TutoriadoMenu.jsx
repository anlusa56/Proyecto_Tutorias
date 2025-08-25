import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function TutoriadoMenu() {
  const [tutorias, setTutorias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/tutorias/tutoriado", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTutorias(data))
      .catch((err) => console.error("Error al cargar tutorías:", err));
  }, []);

  return (
    <div>
      <h2>Panel del Tutoriado</h2>
      <h3>Mis Tutorías</h3>
      <ul>
        {tutorias.length === 0 ? (
          <li>No tienes tutorías asignadas.</li>
        ) : (
          tutorias.map((tutoria) => (
            <li key={tutoria.id}>
              {tutoria.tema} - {tutoria.fecha}
            </li>
          ))
        )}
      </ul>
      <LogoutButton />
    </div>
  );
}
