import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-container">
      <h1>Quiénes Somos</h1>
      
      <section className="about-section">
        <h2>Nuestra Misión</h2>
        <p>
          Somos una plataforma educativa dedicada a conectar estudiantes con tutores 
          calificados para potenciar el aprendizaje personalizado y el éxito académico.
        </p>
      </section>

      <section className="about-section">
        <h2>Nuestros Objetivos</h2>
        <ul className="objectives-list">
          <li>Facilitar el acceso a tutorías personalizadas de calidad</li>
          <li>Mejorar el rendimiento académico de los estudiantes</li>
          <li>Crear oportunidades de desarrollo para tutores</li>
          <li>Fomentar un ambiente de aprendizaje colaborativo</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Nuestra Visión</h2>
        <p>
          Ser la plataforma líder en conexión educativa, transformando la manera 
          en que los estudiantes acceden al apoyo académico personalizado.
        </p>
      </section>
    </div>
  );
}
