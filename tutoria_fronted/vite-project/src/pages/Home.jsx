import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Sistema de Tutorías Académicas</h1>
          <p>Conectando estudiantes de grado 11° con estudiantes de grados 6° a 10° para fortalecer el aprendizaje y mejorar el rendimiento académico</p>
          
          <div className="hero-buttons">
            <div className="dropdown">
              <button className="btn-primary dropdown-toggle">Iniciar Sesión</button>
              <div className="dropdown-content">
                <button onClick={() => navigate('/login?rol=admin')}>Como Rector</button>
                <button onClick={() => navigate('/login?rol=profesor')}>Como Profesor</button>
                <button onClick={() => navigate('/login?rol=estudiante_tutor')}>Como Tutor (Grado 11°)</button>
                <button onClick={() => navigate('/login?rol=estudiante_tutoriado')}>Como Estudiante</button>
              </div>
            </div>
            <div className="dropdown">
              
              <div className="dropdown-content">
                <button onClick={() => navigate('/registro?rol=estudiante_tutor')}>Como Tutor (Grado 11°)</button>
                <button onClick={() => navigate('/registro?rol=estudiante_tutoriado')}>Como Estudiante</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="features-section">
        <h2>¿Cómo Funciona?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-user-graduate"></i>
            <h3>Para Estudiantes (6° - 10°)</h3>
            <p>Recibe apoyo académico personalizado de estudiantes destacados de grado 11° en diferentes materias</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Para Tutores (11°)</h3>
            <p>Comparte tus conocimientos, obtén horas sociales y experiencia en enseñanza</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Supervisión Docente</h3>
            <p>Profesores supervisan las tutorías asegurando calidad académica y seguimiento adecuado</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Beneficios del Programa</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Para Estudiantes</h3>
            <ul>
              <li>Mejora tu rendimiento académico</li>
              <li>Resuelve dudas específicas</li>
              <li>Aprende a tu propio ritmo</li>
              <li>Refuerza temas difíciles</li>
            </ul>
          </div>
          
          <div className="benefit-card">
            <h3>Para Tutores</h3>
            <ul>
              <li>Cumple tus horas sociales</li>
              <li>Desarrolla habilidades de enseñanza</li>
              <li>Refuerza tus conocimientos</li>
              <li>Ayuda a otros a mejorar</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

