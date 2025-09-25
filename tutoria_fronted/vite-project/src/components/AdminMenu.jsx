import { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import UsersPage from '../pages/UsersPage';
import TutoriasPage from '../pages/TutoriasPage';
import ReportesPage from '../pages/ReportesPage';
import './AdminMenu.css';

export default function AdminMenu({ usuario, onLogout }) {
  return (
    <div className="admin-menu">
      <nav>
        <ul>
          <li><Link to="/usuarios">Gestión de Usuarios</Link></li>
          <li><Link to="/tutorias">Gestión de Tutorías</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/tutorias" element={<TutoriasPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
      </Routes>
    </div>
  );
}

