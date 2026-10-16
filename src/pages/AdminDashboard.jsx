import { useEffect } from 'react';
import { databaseAdminUrl } from '../services/projectsApi';

/** Compatibilidad para enlaces antiguos: el administrador oficial ahora es el CRUD SQLite. */
export default function AdminDashboard() {
  useEffect(() => {
    window.location.replace(databaseAdminUrl());
  }, []);

  return null;
}
