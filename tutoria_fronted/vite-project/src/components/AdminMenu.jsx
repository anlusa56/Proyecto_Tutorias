import { useState } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from '../pages/UsersPage';
import TutoriasPage from '../pages/TutoriasPage';
import ReportesPage from '../pages/ReportesPage';
import './AdminMenu.css';

export default function AdminMenu({ usuario, onLogout }) {
  return (
    <div className="admin-menu">
      <nav>
        <ul>
          <li><Link to="/admin/usuarios">Gestión de Usuarios</Link></li>
          <li><Link to="/admin/tutorias">Gestión de Tutorías</Link></li>
          <li><Link to="/admin/reportes">Reportes</Link></li>
          <li><button onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>

      <div className="menu-content">
        <Routes>
          <Route path="usuarios" element={<UsersPage usuario={usuario} />} />
          <Route path="tutorias" element={<TutoriasPage usuario={usuario} />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="*" element={<Navigate to="usuarios" />} />
        </Routes>
      </div>
    </div>
  );
}

