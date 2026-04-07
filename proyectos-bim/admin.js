/* =====================================================
   ADMIN PANEL �” Logic
   Auth + CRUD via Supabase
   ===================================================== */
// �”��”� Supabase Config �”��”� (same as app.js)
const SUPABASE_URL = 'https://lhorekdbwnrrjtgzipgs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kfHl7UUtWD4REHOuiWdpqA_wdHWdl62';
let supabaseClient = null;
let currentUser = null;
let projects = [];
let currentFilteredProjects = [];
let editingId = null; // UUID of project being edited
let sortableInstance = null;
let lastFocusedElement = null;
// �”��”� Init �”��”�
document.addEventListener('DOMContentLoaded', () => {
  console.log("%c[ADMIN LOGIC] v1.7 BULLETPROOF ACTIVE", "color: #3b82f6; font-weight: bold; font-size: 14px;");
  const badge = document.getElementById('version-badge');
  if (badge) badge.style.color = '#10b981'; // Confirm script is running
  
  if (!SUPABASE_URL.startsWith('https://')) {
    showToast('⚠️ Supabase no está configurado. Edita admin.js y app.js', 'error');
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  checkAuth();

  // Keyboard close support for modal overlays
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const confirmOverlay = document.getElementById('confirm-overlay');
    const formOverlay = document.getElementById('form-overlay');
    if (confirmOverlay?.classList.contains('active')) {
      cancelDelete();
      return;
    }
    if (formOverlay?.classList.contains('active')) {
      closeFormModal();
    }
  });
});
// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    currentUser = session.user;
    showAdmin();
  } else {
    showLogin();
  }
}
function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-screen').classList.add('hidden');
}
function showAdmin() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-screen').classList.remove('hidden');
  document.getElementById('user-email').textContent = currentUser.email;
  loadProjects();
}
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Ingresando...';
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    errorEl.textContent = 'Credenciales incorrectas';
    btn.disabled = false;
    btn.textContent = 'Ingresar';
    return;
  }
  currentUser = data.user;
  btn.textContent = 'Ingresar';
  btn.disabled = false;
  showAdmin();
  showToast('�“ Sesión iniciada', 'success');
}
async function handleLogout() {
  await supabaseClient.auth.signOut();
  currentUser = null;
  showLogin();
  showToast('Sesión cerrada', 'info');
}
// ═══════════════════════════════════════
// CRUD �” READ
// ═══════════════════════════════════════
async function loadProjects() {
  const { data, error } = await supabaseClient
    .from('proyectos')
    .select('*')
    .order('project_id', { ascending: false });
  if (error) {
    showToast('Error al cargar proyectos', 'error');
    console.error(error);
    return;
  }
  projects = data;
  currentFilteredProjects = [...projects]; // Init active set
  populateDatalists();
  populateFiltersSelects();
  applyAdminFilters(); // This already calls updateStats(filtered)
}
function populateDatalists() {
  const fields = {
    client: 'list-clients',
    company: 'list-companies',
    country: 'list-countries',
    city: 'list-cities',
    project_type: 'list-types',
    material: 'list-materials',
    role: 'list-roles',
    software: 'list-softwares',
    activities: 'list-activities',
    phase: 'list-phases'
  };
  for (const [key, listId] of Object.entries(fields)) {
    const listEl = document.getElementById(listId);
    if (!listEl) continue;
    
    // Multiple comma-separated software entries might exist, but datalist handles full strings well too.
    // However, splitting software by comma could be too complex, let's keep it simple.
    const uniqueValues = [...new Set(projects.map(p => p[key]).filter(v => v && v !== '�“'))].sort();
    
    listEl.innerHTML = uniqueValues.map(v => `<option value="${v}">`).join('');
  }
}
function updateStats(data) {
  // STRICT DATA SOURCE: Avoid falling back to global currentFilteredProjects 
  // to prevent "stuck" stats when selecting a new filter.
  const target = data || []; 
  
  // Update UI elements
  const statTotal = document.getElementById('stat-total');
  if (statTotal) statTotal.textContent = target.length;
  
  const completedCount = target.filter(p => {
    const s = (p.status || '').trim().toLowerCase();
    return s.includes('completado');
  }).length;
  
  const activeCount = target.filter(p => {
    const s = (p.status || '').trim().toLowerCase();
    return s.includes('curso') || s.includes('progreso');
  }).length;
  const statCompleted = document.getElementById('stat-completed');
  if (statCompleted) statCompleted.textContent = completedCount;
  const statActive = document.getElementById('stat-active');
  if (statActive) statActive.textContent = activeCount;
  
  const companies = new Set(target.map(p => (p.company || '').trim().toLowerCase()).filter(v => !!v));
  const statCompanies = document.getElementById('stat-companies');
  if (statCompanies) statCompanies.textContent = companies.size;
  // NUEVOS TOTALES (m³ y Ton.)
  const totalConcrete = target.reduce((sum, p) => sum + (parseFloat(p.concrete_volume) || 0), 0);
  const totalSteel = target.reduce((sum, p) => sum + (parseFloat(p.steel_weight) || 0), 0);
  
  const statConcrete = document.getElementById('stat-concrete');
  if (statConcrete) statConcrete.textContent = totalConcrete.toLocaleString();
  const statSteel = document.getElementById('stat-steel');
  if (statSteel) statSteel.textContent = totalSteel.toLocaleString();
}
function populateFiltersSelects() {
  const populate = (id, field) => {
    const el = document.getElementById(id);
    if (!el) return;
    const unique = [...new Set(projects.map(p => p[field]).filter(v => !!v && v !== '�“'))].sort();
    const firstOption = el.options[0].outerHTML;
    el.innerHTML = firstOption + unique.map(v => `<option value="${v}">${v}</option>`).join('');
  };
  populate('filter-empresa', 'company');
  populate('filter-cliente', 'client');
  populate('filter-tipo', 'project_type');
}
function applyAdminFilters() {
  const searchQ = document.getElementById('admin-search-input').value.toLowerCase();
  const selEmp = document.getElementById('filter-empresa').value;
  const selCli = document.getElementById('filter-cliente').value;
  const selTipo = document.getElementById('filter-tipo').value;
  const selEst = document.getElementById('filter-estado').value;
  const filtered = projects.filter(p => {
    // Bulletproof guards to prevent crashes if Supabase has null/missing data
    const pId = String(p.project_id || '');
    const pName = String(p.name || '');
    const pCompany = String(p.company || '').trim().toLowerCase();
    const pClient = String(p.client || '').trim().toLowerCase();
    const pType = String(p.project_type || '').trim().toLowerCase();
    const pStatus = String(p.status || '').trim().toLowerCase();
    const pSoftware = String(p.software || '').trim().toLowerCase();
    
    // Check search term
    const matchesSearch = !searchQ || 
      [pId, pName, pCompany, pClient, pType, pSoftware].join(' ').toLowerCase().includes(searchQ);
      
    // Check select filters
    const matchEmp = !selEmp || pCompany === String(selEmp).trim().toLowerCase();
    const matchCli = !selCli || pClient === String(selCli).trim().toLowerCase();
    const matchTipo = !selTipo || pType === String(selTipo).trim().toLowerCase();
    const matchEst = !selEst || pStatus === String(selEst).trim().toLowerCase();
    return matchesSearch && matchEmp && matchCli && matchTipo && matchEst;
  });
  // Sync state & UI
  currentFilteredProjects = [...filtered];
  renderAdminTable(currentFilteredProjects);
}
function clearAdminFilters() {
  document.getElementById('admin-search-input').value = '';
  document.getElementById('filter-empresa').value = '';
  document.getElementById('filter-cliente').value = '';
  document.getElementById('filter-tipo').value = '';
  document.getElementById('filter-estado').value = '';
  applyAdminFilters();
}
function renderAdminTable(dataArray = projects) {
  const tbody = document.getElementById('admin-tbody');
  const filtered = dataArray;
  // Actualizar estadísticas cada vez que se renderiza la tabla
  updateStats(filtered);
  // Actualizar contador de resultados en la toolbar
  const countEl = document.getElementById('admin-results-count');
  if (countEl) {
    countEl.innerHTML = `Mostrando <strong>${filtered.length}</strong> de <strong>${projects.length}</strong>`;
  }
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted);">Sin resultados</td></tr>';
    if (sortableInstance) sortableInstance.destroy();
    return;
  }
  tbody.innerHTML = filtered.map(p => `
    <tr data-id="${p.id}">
      <td class="drag-handle" title="Arrastrar para reordenar">
        <i class="fa-solid fa-grip-vertical"></i>≡
      </td>
      <td class="cell-id">${p.project_id}</td>
      <td class="cell-name" title="${p.name}">${p.name}</td>
      <td>${p.company}</td>
      <td>${p.client || '�“'}</td>
      <td>${p.project_type || ''}</td>
      <td>${p.concrete_volume || '�“'}</td>
      <td>${p.steel_weight || '�“'}</td>
      <td><span class="status-badge ${p.status === 'Completado' ? 'completado' : 'en-curso'}">${p.status}</span></td>
      <td class="cell-actions">
        <button class="btn btn-secondary btn-sm" onclick="editProject('${p.id}')" title="Editar" aria-label="Editar proyecto ${p.project_id}">✏️</button>
        <button class="btn btn-secondary btn-sm" onclick="duplicateProject('${p.id}')" title="Duplicar" aria-label="Duplicar proyecto ${p.project_id}">�“�</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('${p.id}', '${p.project_id}')" title="Eliminar" aria-label="Eliminar proyecto ${p.project_id}">��”‘️</button>
      </td>
    </tr>
  `).join('');
  if (sortableInstance) sortableInstance.destroy();
  
  // Only enable drag drop if not filtered (we want to reorder the entire dataset)
  if (dataArray.length === projects.length && typeof Sortable !== 'undefined') {
    sortableInstance = new Sortable(tbody, {
      handle: '.drag-handle',
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: function () {
        document.getElementById('btn-save-order').style.display = 'flex';
      }
    });
  }
}
// ═══════════════════════════════════════
// REORDER �” DRAG & DROP & AUTO-SEQUENCE
// ═══════════════════════════════════════
async function autoResequenceIds() {
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
    const { error: err1 } = await supabaseClient.from('proyectos').upsert(tempUpdates);
    if (err1) throw err1;
    const { error: err2 } = await supabaseClient.from('proyectos').upsert(finalUpdates);
    if (err2) throw err2;
    await loadProjects();
  } catch (error) {
    console.error('Error auto-resequencing', error);
  }
}
async function saveNewOrder() {
  const btn = document.getElementById('btn-save-order');
  const tbody = document.getElementById('admin-tbody');
  const rows = Array.from(tbody.querySelectorAll('tr[data-id]'));
  
  if (rows.length !== projects.length) {
    showToast('No puedes reordenar mientras hay filtros activos', 'error');
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '⏳ Guardando...';
  // Build the new order based on UUIDs in DOM
  const orderedIds = rows.map(r => r.getAttribute('data-id'));
  
  // Construct new objects identical to old ones but with updated project_ids.
  // Sequential numbering: if length is N, the top one gets P-{N}, bottom gets P-001. 
  // Wait, or does the user want top to be latest? Usually highest number is at top. 
  // Let's assume highest number at top.
  const n = orderedIds.length;
  
  const tempUpdates = [];
  const finalUpdates = [];
  orderedIds.forEach((uuid, index) => {
    const proj = projects.find(p => p.id === uuid);
    if (!proj) return;
    
    // Step 1: Temp ID
    tempUpdates.push({ ...proj, project_id: `TEMP-${uuid.substring(0, 8)}` });
    
    // Step 2: Final ID (Descending order: P-046 down to P-001)
    const newNum = n - index;
    const finalIdStr = `P-${String(newNum).padStart(3, '0')}`;
    finalUpdates.push({ ...proj, project_id: finalIdStr });
  });
  try {
    // 1. Send all temp updates
    const { error: err1 } = await supabaseClient.from('proyectos').upsert(tempUpdates);
    if (err1) throw err1;
    // 2. Send all final updates
    const { error: err2 } = await supabaseClient.from('proyectos').upsert(finalUpdates);
    if (err2) throw err2;
    showToast('�… Orden guardado exitosamente', 'success');
    btn.style.display = 'none';
    
    // Reload projects to get the clean fresh state from DB
    await loadProjects();
  } catch (error) {
    console.error('Error in reordering', error);
    showToast('Error al guardar el nuevo orden', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '�’� Guardar Nuevo Orden';
  }
}
// ═══════════════════════════════════════
// CRUD �” CREATE / UPDATE
// ═══════════════════════════════════════
function openNewProject() {
  editingId = null;
  document.getElementById('form-modal-title').textContent = '➕ Nuevo Proyecto';
  clearForm();
  // Suggest next project ID
  const maxId = Math.max(...projects.map(p => parseInt(p.project_id.replace('P-', '')) || 0));
  document.getElementById('f-project-id').value = `P-${String(maxId + 1).padStart(3, '0')}`;
  openFormModal();
}
function editProject(uuid) {
  const p = projects.find(x => x.id === uuid);
  if (!p) return;
  editingId = uuid;
  document.getElementById('form-modal-title').textContent = '✏️ Editar Proyecto';
  document.getElementById('f-project-id').value = p.project_id;
  document.getElementById('f-name').value = p.name;
  document.getElementById('f-client').value = p.client || '';
  document.getElementById('f-company').value = p.company;
  document.getElementById('f-country').value = p.country || '';
  document.getElementById('f-city').value = p.city || '';
  document.getElementById('f-year-start').value = p.year_start || '';
  document.getElementById('f-year-end').value = p.year_end || '';
  document.getElementById('f-type').value = p.project_type || '';
  document.getElementById('f-phase').value = p.phase || '';
  document.getElementById('f-material').value = p.material || '';
  document.getElementById('f-concrete').value = p.concrete_volume || '';
  document.getElementById('f-steel').value = p.steel_weight || '';
  document.getElementById('f-role').value = p.role || '';
  document.getElementById('f-software').value = p.software || '';
  document.getElementById('f-status').value = p.status || 'Completado';
  document.getElementById('f-description').value = p.description || '';
  document.getElementById('f-activities').value = p.activities || '';
  openFormModal();
}
function duplicateProject(uuid) {
  const p = projects.find(x => x.id === uuid);
  if (!p) return;
  // We act exactly like a "New Project" but pre-filled
  editingId = null;
  document.getElementById('form-modal-title').textContent = '�“� Duplicar Proyecto';
  // Calculate next available ID
  const maxId = Math.max(...projects.map(prod => parseInt(prod.project_id.replace('P-', '')) || 0));
  document.getElementById('f-project-id').value = `P-${String(maxId + 1).padStart(3, '0')}`;
  document.getElementById('f-name').value = p.name + ' (Copia)';
  document.getElementById('f-client').value = p.client || '';
  document.getElementById('f-company').value = p.company;
  document.getElementById('f-country').value = p.country || '';
  document.getElementById('f-city').value = p.city || '';
  document.getElementById('f-year-start').value = p.year_start || '';
  document.getElementById('f-year-end').value = p.year_end || '';
  document.getElementById('f-type').value = p.project_type || '';
  document.getElementById('f-phase').value = p.phase || '';
  document.getElementById('f-material').value = p.material || '';
  document.getElementById('f-concrete').value = p.concrete_volume || '';
  document.getElementById('f-steel').value = p.steel_weight || '';
  document.getElementById('f-role').value = p.role || '';
  document.getElementById('f-software').value = p.software || '';
  document.getElementById('f-status').value = p.status || 'Completado';
  document.getElementById('f-description').value = p.description || '';
  document.getElementById('f-activities').value = p.activities || '';
  openFormModal();
}
async function handleSave(e) {
  e.preventDefault();
  const btn = document.getElementById('save-btn');
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  const record = {
    project_id: document.getElementById('f-project-id').value.trim(),
    name: document.getElementById('f-name').value.trim(),
    client: document.getElementById('f-client').value.trim() || '�“',
    company: document.getElementById('f-company').value.trim(),
    country: document.getElementById('f-country').value.trim(),
    city: document.getElementById('f-city').value.trim(),
    year_start: parseInt(document.getElementById('f-year-start').value) || null,
    year_end: parseInt(document.getElementById('f-year-end').value) || null,
    project_type: document.getElementById('f-type').value.trim(),
    phase: document.getElementById('f-phase').value.trim(),
    material: document.getElementById('f-material').value.trim(),
    concrete_volume: parseFloat(document.getElementById('f-concrete').value) || null,
    steel_weight: parseFloat(document.getElementById('f-steel').value) || null,
    role: document.getElementById('f-role').value.trim(),
    software: document.getElementById('f-software').value.trim(),
    status: document.getElementById('f-status').value,
    description: document.getElementById('f-description').value.trim(),
    activities: document.getElementById('f-activities').value.trim()
  };
  // Validation
  if (!record.project_id || !record.name || !record.company) {
    showToast('ID, Nombre y Empresa son obligatorios', 'error');
    btn.disabled = false;
    btn.textContent = 'Guardar';
    return;
  }
  let error;
  if (editingId) {
    // UPDATE
    ({ error } = await supabaseClient.from('proyectos').update(record).eq('id', editingId));
  } else {
    // INSERT
    ({ error } = await supabaseClient.from('proyectos').insert(record));
  }
  btn.disabled = false;
  btn.textContent = 'Guardar';
  if (error) {
    console.error(error);
    showToast(`Error: ${error.message}`, 'error');
    return;
  }
  showToast(editingId ? '�“ Proyecto actualizado' : '�“ Proyecto creado', 'success');
  closeFormModal();
  loadProjects();
}
// ═══════════════════════════════════════
// CRUD �” DELETE
// ═══════════════════════════════════════
let deletingId = null;
function confirmDelete(uuid, projectId) {
  lastFocusedElement = document.activeElement;
  deletingId = uuid;
  document.getElementById('delete-project-id').textContent = projectId;
  const overlay = document.getElementById('confirm-overlay');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.getElementById('confirm-cancel-btn')?.focus();
}
async function handleDelete() {
  if (!deletingId) return;
  const { error } = await supabaseClient.from('proyectos').delete().eq('id', deletingId);
  const overlay = document.getElementById('confirm-overlay');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  if (error) {
    showToast('Error al eliminar', 'error');
    console.error(error);
    return;
  }
  showToast('�“ Proyecto eliminado. Reordenando IDs...', 'info');
  deletingId = null;
  
  // Reload to get the list without the deleted item
  await loadProjects();
  
  // Automatically close the numbering gap
  await autoResequenceIds();
}
function cancelDelete() {
  deletingId = null;
  const overlay = document.getElementById('confirm-overlay');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}
// ═══════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════
function openFormModal() {
  lastFocusedElement = document.activeElement;
  const overlay = document.getElementById('form-overlay');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('f-project-id')?.focus();
}
function closeFormModal() {
  const overlay = document.getElementById('form-overlay');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}
function clearForm() {
  document.querySelectorAll('#project-form input, #project-form textarea, #project-form select').forEach(el => {
    if (el.type === 'select-one') {
      el.selectedIndex = 0;
    } else {
      el.value = '';
    }
  });
}
// �”��”� Toast �”��”�
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '�…', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
// ═══════════════════════════════════════
// EXPORTING
// ═══════════════════════════════════════
function getExportData() {
  return currentFilteredProjects.map(p => ({
    "ID": p.project_id,
    "Nombre": p.name,
    "Empresa": p.company,
    "Cliente": p.client || '',
    "Industria": p.project_type || '',
    "Fase": p.phase || '',
    "Hormigón (m³)": p.concrete_volume || '�“',
    "Acero (Ton.)": p.steel_weight || '�“',
    "Material": p.material || '',
    "Software": p.software || '',
    "Estado": p.status
  }));
}
async function exportExcel() {
  if (typeof window.ExcelJS === 'undefined') {
    showToast('Esperando librería de Excel...', 'error');
    return;
  }
  
  showToast('Generando Excel premium...', 'info');
  const data = getExportData();
  if (data.length === 0) return showToast('No hay datos para exportar', 'error');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Proyectos BIM Admin';
  const sheet = workbook.addWorksheet('Proyectos');
  // Remueve las grillas para dar aspecto de reporte limpio
  sheet.views = [{ showGridLines: false }];
  const headers = Object.keys(data[0]);
  // Se dejan listas las columnas base para widths
  sheet.columns = headers.map(h => ({ key: h, width: 20 }));
  // Fila 1: Título Principal
  sheet.mergeCells('A1:L1');
  const title = sheet.getCell('A1');
  title.value = `REPORTE DE PROYECTOS BIM`;
  title.font = { size: 14, bold: true, color: { argb: 'FF0F172A' }, name: 'Segoe UI' };
  title.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(1).height = 30;
  // Fila 2: Firma Profesional y Fecha (Estilo ICHA)
  sheet.mergeCells('A2:L2');
  const subtitle = sheet.getCell('A2');
  subtitle.value = `Andrés Gallo P. �” BIM Developer �” Generado: ${new Date().toLocaleDateString()}`;
  subtitle.font = { size: 9, italic: true, color: { argb: 'FF64748B' }, name: 'Segoe UI' };
  subtitle.alignment = { vertical: 'middle', horizontal: 'left' };
  subtitle.border = { bottom: { style: 'medium', color: { argb: 'FF3B82F6' } } };
  sheet.getRow(2).height = 25;
  // Fila 3: Cabeceras de Tabla
  const headerRow = sheet.getRow(3);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Dark Slate
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10, name: 'Segoe UI' };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  headerRow.height = 30;
  // Llenado de Datos
  data.forEach((item, index) => {
    const row = sheet.getRow(4 + index);
    
    headers.forEach((h, i) => {
      row.getCell(i + 1).value = item[h];
    });
    const isEven = index % 2 === 0;
    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        // Efecto Zebra Moderno
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF1F5F9' } 
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
      
      // Color dinámico de estado
      if (headers[colNumber - 1] === 'Estado') {
        const val = cell.value || '';
        if (val.toLowerCase().includes('completado')) {
          cell.font = { color: { argb: 'FF16A34A' }, bold: true, name: 'Segoe UI' }; // Verde
        } else if (val.toLowerCase().includes('curso') || val.toLowerCase().includes('progreso')) {
          cell.font = { color: { argb: 'FF2563EB' }, bold: true, name: 'Segoe UI' }; // Azul
        } else {
           cell.font = { name: 'Segoe UI' }; // Normal
        }
      } else {
        cell.font = { name: 'Segoe UI' };
      }
    });
  });
  // Autofiltrado elegante en la fila de títulos
  sheet.autoFilter = {
    from: 'A3',
    to: 'L3',
  };
  // Ajuste inteligente de columnas
  sheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell, rowNum) => {
      if (rowNum > 2) {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      }
    });
    // Añadimos +6 de margen para que respire, con máximo ancho 55
    column.width = Math.min(Math.max(maxLength + 4, 15), 55);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `Proyectos_BIM_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('�“ Descarga Excel Premium completada', 'success');
}
function exportPDF() {
  if (typeof window.jspdf === 'undefined') {
    showToast('Esperando librerías de PDF...', 'error');
    return;
  }
  
  showToast('Generando PDF corporativo...', 'info');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');
  
  const data = getExportData();
  if (data.length === 0) return showToast('No hay datos para exportar', 'error');
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));
  // Diseño Cabecera de Página Completa
  doc.setFillColor(15, 23, 42); // Web Dark Slate
  doc.rect(0, 0, 300, 32, 'F');
  
  // Título Principal (Texto Blanco) �” Estilo ICHA
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`REPORTE DE PROYECTOS BIM`, 14, 18);
  
  // Firma Profesional y Fecha (Subcabecera)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); 
  doc.text(`Andrés Gallo P. �” BIM Developer`, 14, 25);
  
  // Fecha a la derecha (x = 280 aprox para landscape)
  doc.text(`${new Date().toLocaleDateString()}`, 265, 25);
  doc.autoTable({
    startY: 38,
    head: [headers],
    body: rows,
    theme: 'striped', // Striped es mucho más minimalista
    styles: { 
      fontSize: 7.5, 
      cellPadding: 3.5,
      font: 'helvetica',
      textColor: [51, 65, 85], // Slate 700 text color
      lineColor: [226, 232, 240], // Light gray lines
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: [30, 41, 59], // Un tono más claro que la cabecera para los títulos
      textColor: [255, 255, 255],
      halign: 'center',
      valign: 'middle',
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Gris ultra claro (Slate 50)
    },
    didParseCell: function (data) {
       // Colores dinámicos en la columna Estado
       if (data.section === 'body' && headers[data.column.index] === 'Estado') {
           const val = String(data.cell.raw).toLowerCase();
           if (val.includes('completado')) {
               data.cell.styles.textColor = [22, 163, 74]; // Verde Green 600
               data.cell.styles.fontStyle = 'bold';
           } else if (val.includes('curso') || val.includes('progreso')) {
               data.cell.styles.textColor = [37, 99, 235]; // Azul Blue 600
               data.cell.styles.fontStyle = 'bold';
           }
       }
    }
  });
  doc.save(`Proyectos_BIM_${new Date().toISOString().split('T')[0]}.pdf`);
  showToast('�“ Descarga PDF completada', 'success');
}