import { useState, useEffect } from 'react';

export default function TutorProfile() {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    // Aquí puedes agregar la lógica para cargar los datos del tutor
  }, []);

  return (
    <div className="tutor-profile">
      <h2>Perfil del Tutor</h2>
      {tutor ? (
        <div className="tutor-info">
          <p>Nombre: {tutor.nombre}</p>
          <p>Materias: {tutor.materias}</p>
          <p>Horario disponible: {tutor.horario}</p>
        </div>
      ) : (
        <p>Cargando información del tutor...</p>
      )}
    </div>
  );
}