import { Outlet } from 'react-router-dom';
import EstudianteTutoriadoNav from './EstudianteTutoriadoNav';

export default function EstudianteTutoriadoLayout({ setUsuario }) {
  return (
    <div className="estudiante-tutoriado-layout">
      <EstudianteTutoriadoNav setUsuario={setUsuario} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}