import { useEffect, useState } from "react";

export default function TutorMenu() {
  const [tutorias, setTutorias] = useState([]);

  useEffect(() => {
    // Aquí deberías hacer una petición a tu backend para obtener las tutorías del tutor
    // Ejemplo con fetch (ajusta la URL según tu API):
    fetch("http://localhost:3000/api/tutorias")
      .then((res) => res.json())
      .then((data) => setTutorias(data))
      .catch((err) => console.error("Error al cargar tutorías:", err));
  }, []);

  return (
    <div>
      <h2>Menú del Tutor</h2>
      <ul>
        {tutorias.length === 0 ? (
          <li>No hay tutorías asignadas.</li>
        ) : (
          tutorias.map((tutoria) => (
            <li key={tutoria.id}>
              {tutoria.tema} - {tutoria.fecha}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}