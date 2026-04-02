/* =====================================================
   ADMIN PANEL — Logic
   Auth + CRUD via Supabase
   ===================================================== */

// ── Supabase Config ── (same as app.js)
const SUPABASE_URL = 'https://lhorekdbwnrrjtgzipgs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kfHl7UUtWD4REHOuiWdpqA_wdHWdl62';

let supabaseClient = null;
let currentUser = null;
let projects = [];
let editingId = null; // UUID of project being edited

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  if (!SUPABASE_URL.startsWith('https://')) {
    showToast('⚠️ Supabase no está configurado. Edita admin.js y app.js', 'error');
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  checkAuth();
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
  showToast('✓ Sesión iniciada', 'success');
}

async function handleLogout() {
  await supabaseClient.auth.signOut();
  currentUser = null;
  showLogin();
  showToast('Sesión cerrada', 'info');
}

// ═══════════════════════════════════════
// CRUD — READ
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
  renderAdminTable();
  updateStats();
}

function updateStats() {
  document.getElementById('stat-total').textContent = projects.length;
  document.getElementById('stat-completed').textContent = projects.filter(p => p.status === 'Completado').length;
  document.getElementById('stat-active').textContent = projects.filter(p => p.status === 'En Curso').length;
  const companies = new Set(projects.map(p => p.company));
  document.getElementById('stat-companies').textContent = companies.size;
}

function renderAdminTable(filter = '') {
  const tbody = document.getElementById('admin-tbody');
  const filtered = filter
    ? projects.filter(p => {
        const q = filter.toLowerCase();
        return [p.project_id, p.name, p.company, p.client, p.project_type, p.software]
          .join(' ').toLowerCase().includes(q);
      })
    : projects;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">Sin resultados</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td class="cell-id">${p.project_id}</td>
      <td class="cell-name" title="${p.name}">${p.name}</td>
      <td>${p.company}</td>
      <td>${p.client || '–'}</td>
      <td>${p.project_type || ''}</td>
      <td>${p.period || ''}</td>
      <td><span class="status-badge ${p.status === 'Completado' ? 'completado' : 'en-curso'}">${p.status}</span></td>
      <td class="cell-actions">
        <button class="btn btn-secondary btn-sm" onclick="editProject('${p.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('${p.id}', '${p.project_id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════
// CRUD — CREATE / UPDATE
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
  document.getElementById('f-period').value = p.period || '';
  document.getElementById('f-year-start').value = p.year_start || '';
  document.getElementById('f-year-end').value = p.year_end || '';
  document.getElementById('f-type').value = p.project_type || '';
  document.getElementById('f-material').value = p.material || '';
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
    client: document.getElementById('f-client').value.trim() || '–',
    company: document.getElementById('f-company').value.trim(),
    country: document.getElementById('f-country').value.trim(),
    city: document.getElementById('f-city').value.trim(),
    period: document.getElementById('f-period').value.trim(),
    year_start: parseInt(document.getElementById('f-year-start').value) || null,
    year_end: parseInt(document.getElementById('f-year-end').value) || null,
    project_type: document.getElementById('f-type').value.trim(),
    material: document.getElementById('f-material').value.trim(),
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

  showToast(editingId ? '✓ Proyecto actualizado' : '✓ Proyecto creado', 'success');
  closeFormModal();
  loadProjects();
}

// ═══════════════════════════════════════
// CRUD — DELETE
// ═══════════════════════════════════════

let deletingId = null;

function confirmDelete(uuid, projectId) {
  deletingId = uuid;
  document.getElementById('delete-project-id').textContent = projectId;
  document.getElementById('confirm-overlay').classList.add('active');
}

async function handleDelete() {
  if (!deletingId) return;

  const { error } = await supabaseClient.from('proyectos').delete().eq('id', deletingId);

  document.getElementById('confirm-overlay').classList.remove('active');

  if (error) {
    showToast('Error al eliminar', 'error');
    console.error(error);
    return;
  }

  showToast('✓ Proyecto eliminado', 'success');
  deletingId = null;
  loadProjects();
}

function cancelDelete() {
  deletingId = null;
  document.getElementById('confirm-overlay').classList.remove('active');
}

// ═══════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════

function openFormModal() {
  document.getElementById('form-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFormModal() {
  document.getElementById('form-overlay').classList.remove('active');
  document.body.style.overflow = '';
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

// ── Toast ──
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
