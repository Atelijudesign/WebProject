import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Styles
import '../styles/admin.css';

// ---------------------------------------------------------
// Sortable Row Component
// ---------------------------------------------------------
function SortableRow({ project, onEdit, onDuplicate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    background: isDragging ? 'rgba(56, 189, 248, 0.1)' : undefined,
    position: 'relative',
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? 'sortable-drag' : ''}>
      <td className="drag-handle" title="Arrastrar para reordenar" {...attributes} {...listeners}>
        <i className="fa-solid fa-grip-vertical"></i>≡
      </td>
      <td className="cell-id">{project.project_id}</td>
      <td className="cell-name" title={project.name}>{project.name}</td>
      <td>{project.company}</td>
      <td>{project.client || '–'}</td>
      <td>{project.project_type || ''}</td>
      <td>{project.concrete_volume || '–'}</td>
      <td>{project.steel_weight || '–'}</td>
      <td>
        <span className={`status-badge ${project.status === 'Completado' ? 'completado' : 'en-curso'}`}>
          {project.status}
        </span>
      </td>
      <td className="cell-actions" style={{position: 'relative', zIndex: 1000}}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => onEdit(project.id)} 
          title="Editar"
          onPointerDown={(e) => e.stopPropagation()} // stop DND intercepting
        >
          ✏️
        </button>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => onDuplicate(project.id)} 
          title="Duplicar"
          onPointerDown={(e) => e.stopPropagation()}
        >
          📄
        </button>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={() => onDelete(project.id, project.project_id)} 
          title="Eliminar"
          onPointerDown={(e) => e.stopPropagation()}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------
// Main Admin Dashboard Component
// ---------------------------------------------------------
export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data State
  const [projects, setProjects] = useState([]);
  const [toasts, setToasts] = useState([]);
  
  // Filtering & Sorting
  const [searchQ, setSearchQ] = useState('');
  const [selEmp, setSelEmp] = useState('');
  const [selCli, setSelCli] = useState('');
  const [selTipo, setSelTipo] = useState('');
  const [selEst, setSelEst] = useState('');
  
  // Order logic
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // -- INIT
  useEffect(() => {
    checkAuth();
    supabase.auth.onAuthStateChange((_event, curSession) => {
      setSession(curSession);
    });
    
    // Keyboard Escape for Modals
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isConfirmOpen) cancelDelete();
        else if (isFormOpen) closeFormModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConfirmOpen, isFormOpen]);

  useEffect(() => {
    if (session) loadProjects();
  }, [session]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // -- AUTH LOGIC
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setLoadingCheck(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError('Credenciales incorrectas');
    } else {
      setSession(data.session);
      showToast('✓ Sesión iniciada', 'success');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    showToast('Sesión cerrada', 'info');
  };

  // -- DB LOAD
  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('project_id', { ascending: false });
      
    if (error) {
      showToast(`Error al cargar: ${error.message}`, 'error');
      console.error(error);
      return;
    }
    
    setProjects(data);
    setHasUnsavedOrder(false); // Reset on load
  };

  // -- FILTERING
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = searchQ.toLowerCase();
      const pId = String(p.project_id || '');
      const pName = String(p.name || '');
      const pCompany = String(p.company || '').trim().toLowerCase();
      const pClient = String(p.client || '').trim().toLowerCase();
      const pType = String(p.project_type || '').trim().toLowerCase();
      const pStatus = String(p.status || '').trim().toLowerCase();
      const pSoftware = String(p.software || '').trim().toLowerCase();
      
      const matchesSearch = !q || [pId, pName, pCompany, pClient, pType, pSoftware].join(' ').toLowerCase().includes(q);
      const matchEmp = !selEmp || pCompany === String(selEmp).trim().toLowerCase();
      const matchCli = !selCli || pClient === String(selCli).trim().toLowerCase();
      const matchTipo = !selTipo || pType === String(selTipo).trim().toLowerCase();
      const matchEst = !selEst || pStatus === String(selEst).trim().toLowerCase();
      
      return matchesSearch && matchEmp && matchCli && matchTipo && matchEst;
    });
  }, [projects, searchQ, selEmp, selCli, selTipo, selEst]);

  // Derived Selection options
  const getUnique = (field) => [...new Set(projects.map(p => p[field]).filter(v => !!v && v !== '–'))].sort();
  const companies = getUnique('company');
  const clients = getUnique('client');
  const types = getUnique('project_type');

  // Stats
  const targetForStats = filteredProjects;
  const completedCount = targetForStats.filter(p => (p.status || '').trim().toLowerCase().includes('completado')).length;
  const activeCount = targetForStats.filter(p => {
    const s = (p.status || '').trim().toLowerCase();
    return s.includes('curso') || s.includes('progreso');
  }).length;
  const uniqCompanies = new Set(targetForStats.map(p => (p.company || '').trim().toLowerCase()).filter(v => !!v)).size;
  const totalConcrete = targetForStats.reduce((sum, p) => sum + (parseFloat(p.concrete_volume) || 0), 0);
  const totalSteel = targetForStats.reduce((sum, p) => sum + (parseFloat(p.steel_weight) || 0), 0);

  // -- DRAG & DROP
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Reorder array
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      const newArray = arrayMove(projects, oldIndex, newIndex);
      setProjects(newArray);
      setHasUnsavedOrder(true);
    }
  };

  const saveNewOrder = async () => {
    // Similar sequence logic to admin.js
    if (filteredProjects.length !== projects.length) {
      showToast('No puedes reordenar mientras hay filtros activos', 'error');
      return;
    }
    
    setIsSavingOrder(true);
    const n = projects.length;
    const tempUpdates = [];
    const finalUpdates = [];
    
    projects.forEach((proj, index) => {
      tempUpdates.push({ ...proj, project_id: `TEMP-${proj.id.substring(0, 8)}` });
      const newNum = n - index;
      const finalIdStr = `P-${String(newNum).padStart(3, '0')}`;
      finalUpdates.push({ ...proj, project_id: finalIdStr });
    });

    try {
      const { error: err1 } = await supabase.from('proyectos').upsert(tempUpdates);
      if (err1) throw err1;
      const { error: err2 } = await supabase.from('proyectos').upsert(finalUpdates);
      if (err2) throw err2;
      
      showToast('✓ Orden guardado exitosamente', 'success');
      setHasUnsavedOrder(false);
      await loadProjects();
    } catch (error) {
      console.error(error);
      showToast('Error al guardar el nuevo orden', 'error');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const autoResequenceIds = async (currentArray) => {
    const n = currentArray.length;
    const tempUpdates = [];
    const finalUpdates = [];
    currentArray.forEach((proj, index) => {
      tempUpdates.push({ ...proj, project_id: `TEMP-${proj.id.substring(0, 8)}` });
      const newNum = n - index;
      const finalIdStr = `P-${String(newNum).padStart(3, '0')}`;
      finalUpdates.push({ ...proj, project_id: finalIdStr });
    });
    try {
      await supabase.from('proyectos').upsert(tempUpdates);
      await supabase.from('proyectos').upsert(finalUpdates);
      await loadProjects();
    } catch (error) {
      console.error('Error auto-resequencing', error);
    }
  };

  // -- CRUD LOGIC
  const openNewProject = () => {
    setEditingId(null);
    const maxId = Math.max(...projects.map(p => parseInt(p.project_id.replace('P-', '')) || 0), 0);
    setFormData({
      project_id: `P-${String(maxId + 1).padStart(3, '0')}`,
      status: 'Completado',
      country: 'Chile',
      role: 'Proyectista Estructural'
    });
    setIsFormOpen(true);
  };

  const editProject = (uuid) => {
    const p = projects.find(x => x.id === uuid);
    if (!p) return;
    setEditingId(uuid);
    setFormData({ ...p });
    setIsFormOpen(true);
  };

  const duplicateProject = (uuid) => {
    const p = projects.find(x => x.id === uuid);
    if (!p) return;
    setEditingId(null);
    const maxId = Math.max(...projects.map(prod => parseInt(prod.project_id.replace('P-', '')) || 0), 0);
    setFormData({
      ...p,
      id: undefined, // ensure it's not trying to update
      project_id: `P-${String(maxId + 1).padStart(3, '0')}`,
      name: p.name + ' (Copia)'
    });
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setIsSavingRecord(true);

    const record = {
      project_id: (formData.project_id || '').trim(),
      name: (formData.name || '').trim(),
      client: (formData.client || '').trim() || '–',
      company: (formData.company || '').trim(),
      country: (formData.country || '').trim(),
      city: (formData.city || '').trim(),
      year_start: parseInt(formData.year_start) || null,
      year_end: parseInt(formData.year_end) || null,
      project_type: (formData.project_type || '').trim(),
      phase: (formData.phase || '').trim(),
      material: (formData.material || '').trim(),
      concrete_volume: parseFloat(formData.concrete_volume) || null,
      steel_weight: parseFloat(formData.steel_weight) || null,
      role: (formData.role || '').trim(),
      software: (formData.software || '').trim(),
      status: formData.status || 'Completado',
      description: (formData.description || '').trim(),
      activities: (formData.activities || '').trim()
    };

    if (!record.project_id || !record.name || !record.company) {
      showToast('ID, Nombre y Empresa son obligatorios', 'error');
      setIsSavingRecord(false);
      return;
    }

    let error;
    if (editingId) {
      ({ error } = await supabase.from('proyectos').update(record).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('proyectos').insert(record));
    }

    setIsSavingRecord(false);

    if (error) {
      console.error(error);
      showToast(`Error: ${error.message}`, 'error');
      return;
    }

    showToast(editingId ? '✓ Proyecto actualizado' : '✓ Proyecto creado', 'success');
    closeFormModal();
    loadProjects();
  };

  const startDelete = (uuid, projectId) => {
    setDeletingId(uuid);
    setDeletingProjectId(projectId);
    setIsConfirmOpen(true);
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setDeletingProjectId(null);
    setIsConfirmOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const { error } = await supabase.from('proyectos').delete().eq('id', deletingId);
    
    setIsConfirmOpen(false);
    
    if (error) {
      showToast('Error al eliminar', 'error');
      console.error(error);
      return;
    }
    
    showToast('✓ Proyecto eliminado. Reordenando IDs...', 'info');
    
    // Auto resequence immediately after delete
    const remaining = projects.filter(p => p.id !== deletingId);
    setDeletingId(null);
    await autoResequenceIds(remaining);
  };

  // -- EXPORTS
  const getExportData = () => {
    return filteredProjects.map(p => ({
      "ID": p.project_id,
      "Nombre": p.name,
      "Empresa": p.company,
      "Cliente": p.client || '',
      "Industria": p.project_type || '',
      "Fase": p.phase || '',
      "Hormigón (m³)": p.concrete_volume || '–',
      "Acero (Ton.)": p.steel_weight || '–',
      "Material": p.material || '',
      "Software": p.software || '',
      "Estado": p.status
    }));
  };

  const exportExcel = async () => {
    showToast('Generando Excel premium...', 'info');
    const data = getExportData();
    if (data.length === 0) return showToast('No hay datos para exportar', 'error');
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Proyectos BIM Admin';
    const sheet = workbook.addWorksheet('Proyectos');
    sheet.views = [{ showGridLines: false }];
    
    const headers = Object.keys(data[0]);
    sheet.columns = headers.map(h => ({ key: h, width: 20 }));
    
    // Title
    sheet.mergeCells('A1:L1');
    const title = sheet.getCell('A1');
    title.value = `REPORTE DE PROYECTOS BIM`;
    title.font = { size: 14, bold: true, color: { argb: 'FF0F172A' }, name: 'Segoe UI' };
    title.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(1).height = 30;
    
    // Subtitle
    sheet.mergeCells('A2:L2');
    const subtitle = sheet.getCell('A2');
    subtitle.value = `Andrés Gallo P. — BIM Developer — Generado: ${new Date().toLocaleDateString()}`;
    subtitle.font = { size: 9, italic: true, color: { argb: 'FF64748B' }, name: 'Segoe UI' };
    subtitle.alignment = { vertical: 'middle', horizontal: 'left' };
    subtitle.border = { bottom: { style: 'medium', color: { argb: 'FF3B82F6' } } };
    sheet.getRow(2).height = 25;
    
    // Headers
    const headerRow = sheet.getRow(3);
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10, name: 'Segoe UI' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 30;
    
    // Data
    data.forEach((item, index) => {
      const row = sheet.getRow(4 + index);
      headers.forEach((h, i) => {
        row.getCell(i + 1).value = item[h];
      });
      const isEven = index % 2 === 0;
      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern', pattern: 'solid',
          fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF1F5F9' }
        };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
        cell.alignment = { vertical: 'middle', wrapText: true };
        
        if (headers[colNumber - 1] === 'Estado') {
          const val = cell.value || '';
          if (val.toLowerCase().includes('completado')) {
            cell.font = { color: { argb: 'FF16A34A' }, bold: true, name: 'Segoe UI' };
          } else if (val.toLowerCase().includes('curso') || val.toLowerCase().includes('progreso')) {
            cell.font = { color: { argb: 'FF2563EB' }, bold: true, name: 'Segoe UI' };
          } else {
             cell.font = { name: 'Segoe UI' };
          }
        } else {
          cell.font = { name: 'Segoe UI' };
        }
      });
    });
    
    sheet.autoFilter = { from: 'A3', to: 'L3' };
    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNum) => {
        if (rowNum > 2) {
          const length = cell.value ? cell.value.toString().length : 0;
          if (length > maxLength) maxLength = length;
        }
      });
      column.width = Math.min(Math.max(maxLength + 4, 15), 55);
    });
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proyectos_BIM_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Descarga Excel completada', 'success');
  };

  const exportPDF = () => {
    showToast('Generando PDF corporativo...', 'info');
    const doc = new jsPDF('landscape');
    const data = getExportData();
    if (data.length === 0) return showToast('No hay datos para exportar', 'error');
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => Object.values(obj));
    
    // Header styling
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 300, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    // Use standard fonts to avoid loading custom ones dynamically in the PDF (built in jspdf standard 'helvetica')
    doc.setFont("helvetica", "bold");
    doc.text(`REPORTE DE PROYECTOS BIM`, 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184); 
    doc.text(`Andrés Gallo P. — BIM Developer`, 14, 25);
    doc.text(`${new Date().toLocaleDateString()}`, 265, 25);
    
    // Autotable extension is attached to doc obj
    doc.autoTable({
      startY: 38,
      head: [headers],
      body: rows,
      theme: 'striped',
      styles: { 
        fontSize: 7.5, 
        cellPadding: 3.5,
        font: 'helvetica',
        textColor: [51, 65, 85], 
        lineColor: [226, 232, 240], 
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: function (dataInfo) {
         if (dataInfo.section === 'body' && headers[dataInfo.column.index] === 'Estado') {
             const val = String(dataInfo.cell.raw).toLowerCase();
             if (val.includes('completado')) {
                 dataInfo.cell.styles.textColor = [22, 163, 74]; 
                 dataInfo.cell.styles.fontStyle = 'bold';
             } else if (val.includes('curso') || val.includes('progreso')) {
                 dataInfo.cell.styles.textColor = [37, 99, 235]; 
                 dataInfo.cell.styles.fontStyle = 'bold';
             }
         }
      }
    });
    
    doc.save(`Proyectos_BIM_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('✓ Descarga PDF completada', 'success');
  };

  if (loadingCheck) return null;

  // -- RENDER LOGIN
  if (!session) {
    return (
      <div className="login-screen font-sans">
        {/* Render Toasts */}
        <div className="toast-container" aria-live="polite">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
               <span className="toast-icon">
                 {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
               </span> 
               {t.message}
            </div>
          ))}
        </div>
        
        <div className="login-card">
          <div className="login-logo" aria-label="Andrés Gallo P.BIM">
            <span>Andrés Gallo <span className="brand-accent">P.BIM</span></span>
          </div>
          <h1 className="login-title">Admin Panel</h1>
          <p className="login-subtitle">Proyectos BIM · Andrés Gallo Parra</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="tu@email.com" required value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" placeholder="••••••••" required value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            {loginError && <div className="form-error">{loginError}</div>}
            <button type="submit" className="btn btn-primary btn-full mt-4" disabled={isLoggingIn}>
              {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p className="mt-8 text-xs text-slate-500">
            <a href="/" className="text-bim-blue no-underline">← Volver a Proyectos</a>
          </p>
        </div>
      </div>
    );
  }

  // -- RENDER ADMIN 
  const isDndEnabled = projects.length === filteredProjects.length;

  return (
    <div className="font-sans min-h-screen bg-[#0a0e17] text-slate-200">
      
      {/* Toast Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
             <span className="toast-icon">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span> 
             {t.message}
          </div>
        ))}
      </div>

      <div className="admin-container pb-12">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <a href="/" className="admin-logo" aria-label="Andrés Gallo P.BIM">
              <span>Andrés Gallo <span className="brand-accent">P.BIM</span></span>
            </a>
            <span className="admin-badge">Admin</span>
          </div>
          <div className="admin-actions">
            <span className="text-xs text-slate-500 mr-2">{session.user.email}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </header>
        
        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-value">{targetForStats.length}</div>
            <div className="admin-stat-label">Total Proyectos</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{completedCount}</div>
            <div className="admin-stat-label">Completados</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{activeCount}</div>
            <div className="admin-stat-label">En Curso</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{uniqCompanies}</div>
            <div className="admin-stat-label">Empresas</div>
          </div>
          <div className="admin-stat !border-l-2 !border-l-bim-blue">
            <div className="admin-stat-value">{totalConcrete.toLocaleString()}</div>
            <div className="admin-stat-label">Hormigón (m³)</div>
          </div>
          <div className="admin-stat !border-l-2 !border-l-[#818cf8]">
            <div className="admin-stat-value">{totalSteel.toLocaleString()}</div>
            <div className="admin-stat-label">Acero (Ton.)</div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="admin-filters-container">
          <div className="admin-toolbar">
            <div className="admin-search">
              <input type="text" placeholder="Buscar proyectos..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} />
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-xs text-slate-500 whitespace-nowrap mr-2">
                Mostrando <strong>{filteredProjects.length}</strong> de <strong>{projects.length}</strong>
              </span>
              <button className="btn btn-secondary" title="Exportar a Excel" onClick={exportExcel}>📑 Excel</button>
              <button className="btn btn-secondary" title="Exportar a PDF" onClick={exportPDF}>📄 PDF</button>
              <button className="btn btn-primary" onClick={openNewProject}>➕ Nuevo</button>
              <a href="/" className="btn btn-secondary" target="_blank">👁️ Ver</a>
            </div>
          </div>
          
          <div className="admin-advanced-filters">
            <select className="form-select btn-sm" value={selEmp} onChange={e=>setSelEmp(e.target.value)}>
              <option value="">Todas las Empresas</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select btn-sm" value={selCli} onChange={e=>setSelCli(e.target.value)}>
              <option value="">Todos los Clientes</option>
              {clients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select btn-sm" value={selTipo} onChange={e=>setSelTipo(e.target.value)}>
              <option value="">Todos los Tipos</option>
              {types.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select btn-sm" value={selEst} onChange={e=>setSelEst(e.target.value)}>
              <option value="">Todos los Estados</option>
              <option value="completado">Completado</option>
              <option value="en curso">En Curso</option>
            </select>
            <button className="btn btn-clear btn-sm" onClick={() => { setSearchQ(''); setSelEmp(''); setSelCli(''); setSelTipo(''); setSelEst(''); }}>Limpiar</button>
          </div>
        </div>

        {/* Reorder Notification */}
        <div className="flex justify-between items-center mb-4 bg-blue-500/5 px-4 py-2 rounded-lg border border-blue-500/10">
          <span className="text-sm text-slate-400">
            <i className="fa-solid fa-arrows-up-down text-bim-blue mr-2"></i> Puedes arrastrar las filas usando el icono (≡) para reordenar los proyectos.
          </span>
          {hasUnsavedOrder && (
            <button className="btn btn-primary btn-sm gap-2 animate-pulse" onClick={saveNewOrder} disabled={isSavingOrder}>
              {isSavingOrder ? '⏳ Guardando...' : '💾 Guardar Nuevo Orden'}
            </button>
          )}
        </div>

        {/* Dynamic Table */}
        <div className="admin-table-wrap">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th style={{width: '40px', textAlign: 'center'}}></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Hormigón (m³)</th>
                <th>Acero (Ton.)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-slate-500">Sin resultados</td>
                </tr>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {filteredProjects.map(p => (
                      <SortableRow key={p.id} project={p} onEdit={editProject} onDuplicate={duplicateProject} onDelete={startDelete} />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OVERLAY MAPS (Modals) */}
      
      {/* Form Modal */}
      <div className={`admin-modal-overlay ${isFormOpen ? 'active' : ''}`} onMouseDown={(e) => {if(e.target===e.currentTarget) closeFormModal()}}>
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">{editingId ? '✏️ Editar Proyecto' : formData.name?.includes('(Copia)') ? '📄 Duplicar Proyecto' : '➕ Nuevo Proyecto'}</h3>
            <button className="btn btn-secondary btn-sm" type="button" onClick={closeFormModal}>✕</button>
          </div>
          <form onSubmit={handleSaveForm}>
            <div className="admin-modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ID del Proyecto *</label>
                  <input className="form-input" required value={formData.project_id || ''} onChange={e=>setFormData({...formData, project_id: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado *</label>
                  <select className="form-select" value={formData.status || 'Completado'} onChange={e=>setFormData({...formData, status: e.target.value})}>
                    <option value="Completado">Completado</option>
                    <option value="En Curso">En Curso</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Nombre del Proyecto *</label>
                <input className="form-input" required value={formData.name || ''} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cliente</label>
                  <input className="form-input" list="list-clients" value={formData.client || ''} onChange={e=>setFormData({...formData, client: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa *</label>
                  <input className="form-input" required list="list-companies" value={formData.company || ''} onChange={e=>setFormData({...formData, company: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">País</label>
                  <input className="form-input" value={formData.country || ''} onChange={e=>setFormData({...formData, country: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input className="form-input" value={formData.city || ''} onChange={e=>setFormData({...formData, city: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Año Inicio</label>
                  <input className="form-input" type="number" value={formData.year_start || ''} onChange={e=>setFormData({...formData, year_start: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Año Término</label>
                  <input className="form-input" type="number" value={formData.year_end || ''} onChange={e=>setFormData({...formData, year_end: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sector / Industria</label>
                  <input className="form-input" list="list-types" value={formData.project_type || ''} onChange={e=>setFormData({...formData, project_type: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Etapa de Ingeniería</label>
                  <input className="form-input" value={formData.phase || ''} onChange={e=>setFormData({...formData, phase: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Material</label>
                  <input className="form-input" value={formData.material || ''} onChange={e=>setFormData({...formData, material: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rol</label>
                  <input className="form-input" value={formData.role || ''} onChange={e=>setFormData({...formData, role: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Volumen m³ Hormigón Total</label>
                  <input className="form-input" type="number" step="0.1" value={formData.concrete_volume || ''} onChange={e=>setFormData({...formData, concrete_volume: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Toneladas Acero Estructural</label>
                  <input className="form-input" type="number" step="0.1" value={formData.steel_weight || ''} onChange={e=>setFormData({...formData, steel_weight: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Software</label>
                <input className="form-input" value={formData.software || ''} onChange={e=>setFormData({...formData, software: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Actividades Clave</label>
                <input className="form-input" value={formData.activities || ''} onChange={e=>setFormData({...formData, activities: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-textarea" value={formData.description || ''} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              {/* Autocomplete Datalists mapping from old DOM methodology */}
              <datalist id="list-clients">{clients.map(c=><option key={c} value={c} />)}</datalist>
              <datalist id="list-companies">{companies.map(c=><option key={c} value={c} />)}</datalist>
              <datalist id="list-types">{types.map(c=><option key={c} value={c} />)}</datalist>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeFormModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={isSavingRecord}>
                {isSavingRecord ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <div className={`admin-modal-overlay ${isConfirmOpen ? 'active' : ''}`} onMouseDown={(e) => {if(e.target===e.currentTarget) cancelDelete()}}>
        <div className="admin-modal confirm-dialog !max-w-md my-auto">
          <div className="p-10">
            <div className="text-5xl mb-4">⚠️</div>
            <div className="text-xl font-bold mb-2 text-white">¿Eliminar proyecto?</div>
            <div className="text-sm text-slate-400 mb-6">
              Estás a punto de eliminar el proyecto <strong className="text-white">{deletingProjectId}</strong>.<br/>
              Esta acción no se puede deshacer.
            </div>
            <div className="flex justify-center gap-3">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
