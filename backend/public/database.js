const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const state = {
  section: 'overview',
  summary: null,
  projects: [],
  leads: [],
  calculations: [],
  search: '',
  filter: '',
  page: 1,
  pageSize: 10,
  analyticsTab: 'overview',
  editing: null,
  pendingDelete: null,
};

let chartInstances = [];

const sectionTitles = {
  overview: 'Dashboard', projects: 'Proyectos', leads: 'Leads', calculations: 'Registros de cálculo', system: 'Base de datos',
};

const projectSections = [
  {
    title: 'Identificación', columns: 3, fields: [
      { name: 'project_id', label: 'ID de proyecto', placeholder: 'P-053' },
      { name: 'name', label: 'Nombre', required: true },
      { name: 'slug', label: 'Slug' },
      { name: 'name_en', label: 'Nombre en inglés', span: 'full' },
    ],
  },
  {
    title: 'Cliente y ubicación', columns: 3, fields: [
      { name: 'client', label: 'Cliente' }, { name: 'company', label: 'Empresa' },
      { name: 'country', label: 'País' }, { name: 'city', label: 'Ciudad' },
      { name: 'period', label: 'Periodo' }, { name: 'year_start', label: 'Año inicio', type: 'number' },
      { name: 'year_end', label: 'Año término', type: 'number' },
    ],
  },
  {
    title: 'Clasificación técnica', columns: 2, fields: [
      { name: 'project_type', label: 'Tipo de proyecto' }, { name: 'project_type_en', label: 'Tipo (EN)' },
      { name: 'material', label: 'Material' }, { name: 'material_en', label: 'Material (EN)' },
      { name: 'role', label: 'Rol' }, { name: 'role_en', label: 'Rol (EN)' },
      { name: 'phase', label: 'Fase' }, { name: 'phase_en', label: 'Fase (EN)' },
      { name: 'status', label: 'Estado' }, { name: 'status_en', label: 'Estado (EN)' },
      { name: 'software', label: 'Software', span: 'full' },
    ],
  },
  {
    title: 'Descripción', columns: 2, fields: [
      { name: 'description', label: 'Descripción', type: 'textarea' }, { name: 'description_en', label: 'Descripción (EN)', type: 'textarea' },
      { name: 'activities', label: 'Actividades', type: 'textarea' }, { name: 'activities_en', label: 'Actividades (EN)', type: 'textarea' },
    ],
  },
  {
    title: 'Contenido avanzado', columns: 2, fields: [
      { name: 'description_paragraphs', label: 'Párrafos de detalle', type: 'textarea', hint: 'Un párrafo por línea.' },
      { name: 'description_paragraphs_en', label: 'Párrafos de detalle (EN)', type: 'textarea', hint: 'Un párrafo por línea.' },
      { name: 'technologies', label: 'Tecnologías', type: 'textarea', hint: 'Una tecnología por línea o separadas por coma.' },
      { name: 'specs', label: 'Especificaciones', type: 'textarea', hint: 'JSON: [{"label":"...","value":"..."}]' },
      { name: 'specs_en', label: 'Especificaciones (EN)', type: 'textarea', hint: 'JSON: [{"label":"...","value":"..."}]' },
    ],
  },
  {
    title: 'Métricas y multimedia', columns: 3, fields: [
      { name: 'concrete_volume', label: 'Hormigón (m³)', type: 'number', step: 'any' },
      { name: 'steel_weight', label: 'Acero (t)', type: 'number', step: 'any' },
      { name: 'rebar_weight', label: 'Armadura (t)', type: 'number', step: 'any' },
      { name: 'image_url', label: 'Imagen principal', span: 'full' },
      { name: 'gallery_images', label: 'Galería', type: 'textarea', span: 'full', hint: 'Una ruta por línea o separadas por coma.' },
      { name: 'featured', label: 'Mostrar como proyecto destacado', type: 'checkbox', span: 'full' },
    ],
  },
];

const leadSections = [{ title: 'Información del contacto', columns: 2, fields: [
  { name: 'name', label: 'Nombre', required: true }, { name: 'email', label: 'Correo', type: 'email', required: true },
  { name: 'company', label: 'Empresa' }, { name: 'project_type', label: 'Tipo de proyecto' },
  { name: 'source', label: 'Origen' }, { name: 'status', label: 'Estado', type: 'select', options: ['new', 'contacted', 'qualified', 'closed', 'discarded'] },
  { name: 'message', label: 'Mensaje', type: 'textarea', span: 'full' },
]}];

const calculationSections = [{ title: 'Datos del cálculo', columns: 1, fields: [
  { name: 'tool_name', label: 'Herramienta', required: true },
  { name: 'inputs', label: 'Entradas', type: 'textarea', required: true, hint: 'Texto o JSON serializado.' },
  { name: 'results', label: 'Resultados', type: 'textarea', required: true, hint: 'Texto o JSON serializado.' },
]}];

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Error HTTP ${response.status}`);
  return data;
}

async function loadData(showMessage = false) {
  try {
    const [summary, projects, leads, calculations] = await Promise.all([
      api('/api/database'), api('/api/projects'),
      api('/api/database/tables/leads?limit=500'),
      api('/api/database/tables/calculation_logs?limit=500'),
    ]);
    state.summary = summary;
    state.projects = projects.value;
    state.leads = leads.rows;
    state.calculations = calculations.rows;
    updateNavigation();
    render();
    if (showMessage) toast('Datos actualizados', 'success');
  } catch (error) {
    $('#content').innerHTML = `<div class="empty-state"><strong>No se pudo abrir la base de datos</strong><span>${escapeHtml(error.message)}</span></div>`;
    toast(error.message, 'error');
  }
}

function updateNavigation() {
  $('#nav-projects').textContent = state.projects.length;
  $('#nav-leads').textContent = state.leads.length;
  $('#nav-calculations').textContent = state.calculations.length;
  const healthy = state.summary?.integrity === 'ok';
  $('#side-integrity').textContent = healthy ? 'Integridad verificada' : 'Revisar integridad';
  $('.sidebar-status .pulse').style.background = healthy ? 'var(--green)' : 'var(--red)';
}

function render() {
  destroyCharts();
  $('#page-title').textContent = sectionTitles[state.section];
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.section === state.section));
  const renderers = { overview: renderOverview, projects: renderProjects, leads: renderLeads, calculations: renderCalculations, system: renderSystem };
  renderers[state.section]();
}

function destroyCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
}

function statCard(label, value, note, icon, color) {
  return `<article class="stat-card" style="--card-accent:${color}"><span class="stat-icon">${icon}</span><span class="stat-label">${label}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`;
}

const chartColors = ['#22d3ee', '#8b5cf6', '#fbbf24', '#34d399', '#fb7185', '#60a5fa', '#f472b6', '#a3e635'];

function groupedCounts(rows, getter, limit = 8) {
  return Object.entries(rows.reduce((result, row) => {
    const label = getter(row) || 'Sin clasificar';
    result[label] = (result[label] || 0) + 1;
    return result;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function timelineData() {
  const years = [...new Set(state.projects.map((project) => Number(project.year_end || project.year_start)).filter((year) => year > 1900))].sort((a, b) => a - b).slice(-10);
  return years.map((year) => {
    const projects = state.projects.filter((project) => Number(project.year_end || project.year_start) === year);
    return {
      label: year,
      total: projects.length,
      completed: projects.filter((project) => /complet/i.test(project.status || '')).length,
      featured: projects.filter((project) => project.featured).length,
    };
  });
}

function trendChart(points) {
  if (!points.length) return '<div class="chart-empty">Sin datos temporales</div>';
  const width = 760; const height = 245; const left = 42; const right = 18; const top = 18; const bottom = 34;
  const chartWidth = width - left - right; const chartHeight = height - top - bottom;
  const series = [
    { key: 'total', label: 'Proyectos', color: '#22d3ee' },
    { key: 'completed', label: 'Completados', color: '#8b5cf6' },
    { key: 'featured', label: 'Destacados', color: '#fbbf24' },
  ];
  const maximum = Math.max(1, ...points.flatMap((point) => series.map((item) => point[item.key])));
  const coords = (key) => points.map((point, index) => {
    const x = left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth);
    const y = top + chartHeight - (point[key] / maximum) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  const grids = [0, .25, .5, .75, 1].map((ratio) => {
    const y = top + chartHeight - ratio * chartHeight;
    return `<g><line x1="${left}" x2="${width - right}" y1="${y}" y2="${y}" class="chart-grid-line"/><text x="${left - 9}" y="${y + 3}" text-anchor="end" class="chart-axis-text">${Math.round(maximum * ratio)}</text></g>`;
  }).join('');
  const labels = points.map((point, index) => {
    const x = left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth);
    return `<text x="${x}" y="${height - 9}" text-anchor="middle" class="chart-axis-text">${point.label}</text>`;
  }).join('');
  return `<div class="chart-legend">${series.map((item) => `<span><i style="background:${item.color}"></i>${item.label}</span>`).join('')}</div><svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolución anual de proyectos">${grids}${series.map((item) => `<polyline points="${coords(item.key)}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${points.map((point, index) => { const xy = coords(item.key).split(' ')[index].split(','); return `<circle cx="${xy[0]}" cy="${xy[1]}" r="3.5" fill="${item.color}" stroke="#0f192a" stroke-width="2"><title>${point.label}: ${point[item.key]} ${item.label.toLowerCase()}</title></circle>`; }).join('')}`).join('')}${labels}</svg>`;
}

function donutChart(items) {
  if (!items.length) return '<div class="chart-empty">Sin datos</div>';
  const total = items.reduce((sum, [, value]) => sum + value, 0);
  let cursor = 0;
  const segments = items.map(([, value], index) => {
    const start = cursor; cursor += (value / total) * 100;
    return `${chartColors[index % chartColors.length]} ${start}% ${cursor}%`;
  }).join(',');
  return `<div class="donut-layout"><div class="donut" style="background:conic-gradient(${segments})"><div><strong>${total}</strong><span>Total</span></div></div><div class="donut-legend">${items.map(([label, value], index) => `<div><i style="background:${chartColors[index % chartColors.length]}"></i><span title="${escapeHtml(label)}">${escapeHtml(label)}</span><b>${value}</b></div>`).join('')}</div></div>`;
}

function verticalBarChart(items) {
  if (!items.length) return '<div class="chart-empty">Sin datos</div>';
  const maximum = Math.max(...items.map(([, value]) => value), 1);
  return `<div class="vertical-chart">${items.map(([label, value], index) => `<div class="vertical-column"><div class="vertical-value">${value}</div><div class="vertical-track"><div class="vertical-fill" style="height:${Math.max((value / maximum) * 100, 4)}%;background:${chartColors[index % chartColors.length]}"></div></div><span title="${escapeHtml(label)}">${escapeHtml(label)}</span></div>`).join('')}</div>`;
}

function horizontalBarChart(items) {
  if (!items.length) return '<div class="chart-empty">Sin datos</div>';
  const maximum = Math.max(...items.map(([, value]) => value), 1);
  return `<div class="horizontal-chart">${items.map(([label, value], index) => `<div class="horizontal-row"><span title="${escapeHtml(label)}">${escapeHtml(label)}</span><div class="horizontal-track"><i style="width:${(value / maximum) * 100}%;background:${chartColors[index % chartColors.length]}"></i></div><b>${value}</b></div>`).join('')}</div>`;
}

function renderOverview() {
  const metrics = projectAnalytics(state.projects);
  const tabs = [
    ['overview', 'fa-chart-column', 'Visión General & Sectores'],
    ['quantities', 'fa-scale-balanced', 'Magnitud & Cubicaciones'],
    ['clients', 'fa-earth-americas', 'Clientes & Territorio'],
  ];
  const tabPanels = {
    overview: [
      chartPanel('type-chart', 'fa-layer-group', 'Distribución por Sector & Tipología', 'Participación por especialidad en el portafolio', 'Horizontal Bar'),
      chartPanel('material-chart', 'fa-cubes', 'Materialidad Estructural Predominante', 'Hormigón armado, sistemas mixtos y acero', 'Doughnut'),
      chartPanel('timeline-chart', 'fa-timeline', 'Trayectoria y Cronología de Proyectos', 'Hitos y picos de actividad técnica', `${Object.keys(metrics.yearCounts).length} años activos`),
      chartPanel('software-chart', 'fa-laptop-code', 'Ecosistema de Software BIM', 'Frecuencia de herramientas aplicadas en entregables', 'Revit / Tekla / Navis'),
    ],
    quantities: [
      chartPanel('magnitude-chart', 'fa-scale-balanced', 'Magnitud Física por Sector', 'Hormigón (m³) frente a acero estructural (Ton)', 'Doble escala'),
      chartPanel('phase-chart', 'fa-compass-drafting', 'Fases de Ingeniería & Ciclo Constructivo', 'Madurez técnica y nivel de desarrollo', 'LOD 300–400'),
    ],
    clients: [
      chartPanel('clients-chart', 'fa-building', 'Top Clientes Corporativos & Minería', 'Volumen de proyectos por mandante', 'Key Accounts'),
      chartPanel('geography-chart', 'fa-earth-americas', 'Huella Territorial & Códigos Normativos', 'Experiencia técnica por país', 'NCh / AISC / ACI'),
    ],
  };
  $('#content').innerHTML = `
    <div class="page-intro"><div><p class="eyebrow">// PROJECT ANALYTICS</p><h2>Dashboard de Proyectos BIM</h2><p>Métricas técnicas, magnitudes estructurales y trayectoria profesional.</p></div><button class="button primary" data-create="projects"><i class="fa-solid fa-plus"></i> Nuevo proyecto</button></div>
    <div class="personal-kpi-grid">
      ${statCard('Total Proyectos', metrics.totalProjects, `${metrics.completed} completados`, '<i class="fa-solid fa-diagram-project"></i>', '#38bdf8')}
      ${statCard('Infraestructura', metrics.infraCount, 'Transporte y obras críticas', '<i class="fa-solid fa-bridge"></i>', '#818cf8')}
      ${statCard('Empresas', metrics.distinctCompanies, 'Consultoras y constructoras', '<i class="fa-solid fa-building"></i>', '#34d399')}
      ${statCard('Hormigón Armado', formatQuantity(metrics.totalConcrete), 'm³ cubicados', '<i class="fa-solid fa-cubes-stacked"></i>', '#fb923c')}
      ${statCard('Acero Estructural', formatQuantity(metrics.totalSteel), 'Ton modeladas', '<i class="fa-solid fa-industry"></i>', '#f87171')}
      ${statCard('Software principal', metrics.dominantSoftware, 'Ecosistema BIM', '<i class="fa-solid fa-laptop-code"></i>', '#ec4899')}
    </div>
    <div class="analytics-tabs">${tabs.map(([id, icon, label]) => `<button class="analytics-tab ${state.analyticsTab === id ? 'active' : ''}" data-analytics-tab="${id}"><i class="fa-solid ${icon}"></i><span>${label}</span></button>`).join('')}</div>
    <div class="personal-chart-grid">${tabPanels[state.analyticsTab].join('')}</div>`;
  bindCommonActions();
  $$('[data-analytics-tab]').forEach((button) => button.onclick = () => { state.analyticsTab = button.dataset.analyticsTab; render(); });
  requestAnimationFrame(() => renderProjectCharts(metrics));
}

function formatQuantity(value) {
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value || 0);
}

function chartPanel(id, icon, title, description, tag) {
  return `<section class="personal-chart-card"><header><div><h3><i class="fa-solid ${icon}"></i>${title}</h3><p>${description}</p></div><span>${tag}</span></header><div class="canvas-wrap"><canvas id="${id}"></canvas></div></section>`;
}

function projectAnalytics(projects) {
  const typeCounts = {}; const materialCounts = { 'Hormigón Armado': 0, 'Acero + Hormigón': 0, 'Acero Estructural': 0, Otros: 0 };
  const softwareCounts = { 'Revit Structure': 0, 'Tekla Structures': 0, Navisworks: 0, 'AutoCAD / LISP': 0 };
  const yearCounts = {}; const sectorMagnitudes = {}; const clientCounts = {}; const countryCounts = {};
  const phaseCounts = { 'Ingeniería de Detalle': 0, 'Ingeniería Básica': 0, 'Maniobras & Montaje': 0, 'Factibilidad & Perfil': 0 };
  let totalConcrete = 0; let totalSteel = 0;
  for (const project of projects) {
    const type = project.project_type || 'Otros'; typeCounts[type] = (typeCounts[type] || 0) + 1;
    const material = project.material || '';
    if (/hormigón/i.test(material) && /acero/i.test(material)) materialCounts['Acero + Hormigón'] += 1;
    else if (/hormigón/i.test(material)) materialCounts['Hormigón Armado'] += 1;
    else if (/acero/i.test(material)) materialCounts['Acero Estructural'] += 1;
    else materialCounts.Otros += 1;
    const software = (project.software || '').toLowerCase();
    if (software.includes('revit')) softwareCounts['Revit Structure'] += 1;
    if (software.includes('tekla')) softwareCounts['Tekla Structures'] += 1;
    if (software.includes('navisworks')) softwareCounts.Navisworks += 1;
    if (software.includes('autocad') || software.includes('lisp')) softwareCounts['AutoCAD / LISP'] += 1;
    const year = Number(project.year_start || project.year_end); if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
    const concrete = Number(project.concrete_volume) || 0; const steel = Number(project.steel_weight) || 0;
    totalConcrete += concrete; totalSteel += steel;
    sectorMagnitudes[type] ||= { concrete: 0, steel: 0 }; sectorMagnitudes[type].concrete += concrete; sectorMagnitudes[type].steel += steel;
    const phase = (project.phase || '').toLowerCase(); const description = (project.description || '').toLowerCase();
    if (/básica|basica/.test(phase)) phaseCounts['Ingeniería Básica'] += 1;
    else if (/factibilidad|perfil/.test(phase)) phaseCounts['Factibilidad & Perfil'] += 1;
    else if (/maniobra|izaje|montaje/.test(`${phase} ${description}`)) phaseCounts['Maniobras & Montaje'] += 1;
    else phaseCounts['Ingeniería de Detalle'] += 1;
    const client = project.client || 'Otros'; clientCounts[client] = (clientCounts[client] || 0) + 1;
    const country = project.country || 'Sin país'; countryCounts[country] = (countryCounts[country] || 0) + 1;
  }
  const dominantSoftware = Object.entries(softwareCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  return {
    totalProjects: projects.length,
    completed: projects.filter((project) => /complet/i.test(project.status || '')).length,
    infraCount: projects.filter((project) => /infraestructura|metro|aeropuerto|pasarela|puente/i.test(`${project.project_type} ${project.name}`)).length,
    distinctCompanies: new Set(projects.map((project) => project.company).filter(Boolean)).size,
    totalConcrete, totalSteel, dominantSoftware, typeCounts, materialCounts, softwareCounts, yearCounts,
    sectorMagnitudes, phaseCounts, clientCounts, countryCounts,
  };
}

function renderProjectCharts(metrics) {
  if (!window.Chart) return;
  const tooltip = { backgroundColor: 'rgba(15,23,42,.96)', titleColor: '#f8fafc', bodyColor: '#cbd5e1', borderColor: 'rgba(51,65,85,.8)', borderWidth: 1, padding: 12, cornerRadius: 10 };
  const grid = 'rgba(51,65,85,.3)'; const ticks = '#94a3b8';
  const create = (id, config) => { const canvas = document.getElementById(id); if (canvas) chartInstances.push(new window.Chart(canvas, config)); };
  if (state.analyticsTab === 'overview') {
    const types = Object.entries(metrics.typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
    create('type-chart', { type: 'bar', data: { labels: types.map(([label]) => label), datasets: [{ data: types.map(([, value]) => value), backgroundColor: 'rgba(56,189,248,.58)', borderColor: '#38bdf8', borderWidth: 1.5, borderRadius: 7 }] }, options: personalChartOptions({ indexAxis: 'y', tooltip, grid, ticks }) });
    create('material-chart', { type: 'doughnut', data: { labels: Object.keys(metrics.materialCounts), datasets: [{ data: Object.values(metrics.materialCounts), backgroundColor: ['rgba(56,189,248,.8)', 'rgba(139,92,246,.8)', 'rgba(245,158,11,.8)', 'rgba(100,116,139,.55)'], borderColor: '#0f172a', borderWidth: 3, hoverOffset: 8 }] }, options: doughnutOptions(tooltip) });
    const years = Object.keys(metrics.yearCounts).sort((a, b) => Number(a) - Number(b));
    create('timeline-chart', { type: 'bar', data: { labels: years, datasets: [{ data: years.map((year) => metrics.yearCounts[year]), backgroundColor: 'rgba(99,102,241,.68)', borderColor: '#818cf8', borderWidth: 1.5, borderRadius: 5 }] }, options: personalChartOptions({ tooltip, grid, ticks }) });
    create('software-chart', { type: 'bar', data: { labels: Object.keys(metrics.softwareCounts), datasets: [{ data: Object.values(metrics.softwareCounts), backgroundColor: ['rgba(56,189,248,.62)', 'rgba(139,92,246,.62)', 'rgba(236,72,153,.62)', 'rgba(245,158,11,.62)'], borderColor: ['#38bdf8', '#8b5cf6', '#ec4899', '#f59e0b'], borderWidth: 1.5, borderRadius: 7 }] }, options: personalChartOptions({ tooltip, grid, ticks }) });
  } else if (state.analyticsTab === 'quantities') {
    const sectors = Object.entries(metrics.sectorMagnitudes).sort((a, b) => (b[1].concrete + b[1].steel) - (a[1].concrete + a[1].steel)).slice(0, 7);
    create('magnitude-chart', { type: 'bar', data: { labels: sectors.map(([label]) => label), datasets: [{ label: 'Hormigón (m³)', data: sectors.map(([, item]) => item.concrete), backgroundColor: 'rgba(56,189,248,.6)', borderColor: '#38bdf8', borderWidth: 1.5, borderRadius: 6, yAxisID: 'y' }, { label: 'Acero (Ton)', data: sectors.map(([, item]) => item.steel), backgroundColor: 'rgba(245,158,11,.6)', borderColor: '#f59e0b', borderWidth: 1.5, borderRadius: 6, yAxisID: 'y1' }] }, options: dualAxisOptions(tooltip, grid, ticks) });
    create('phase-chart', { type: 'doughnut', data: { labels: Object.keys(metrics.phaseCounts), datasets: [{ data: Object.values(metrics.phaseCounts), backgroundColor: ['#22d3eecc', '#8b5cf6cc', '#f59e0bcc', '#34d399cc'], borderColor: '#0f172a', borderWidth: 3, hoverOffset: 8 }] }, options: doughnutOptions(tooltip) });
  } else {
    const clients = Object.entries(metrics.clientCounts).sort((a, b) => b[1] - a[1]).slice(0, 9);
    create('clients-chart', { type: 'bar', data: { labels: clients.map(([label]) => label), datasets: [{ data: clients.map(([, value]) => value), backgroundColor: 'rgba(52,211,153,.58)', borderColor: '#34d399', borderWidth: 1.5, borderRadius: 7 }] }, options: personalChartOptions({ indexAxis: 'y', tooltip, grid, ticks }) });
    create('geography-chart', { type: 'doughnut', data: { labels: Object.keys(metrics.countryCounts), datasets: [{ data: Object.values(metrics.countryCounts), backgroundColor: ['#38bdf8cc', '#818cf8cc', '#34d399cc', '#fb923ccc', '#ec4899cc'], borderColor: '#0f172a', borderWidth: 3, hoverOffset: 8 }] }, options: doughnutOptions(tooltip) });
  }
}

function personalChartOptions({ indexAxis = 'x', tooltip, grid, ticks }) {
  return { indexAxis, responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, plugins: { legend: { display: false }, tooltip }, scales: { x: { beginAtZero: true, grid: { color: indexAxis === 'y' ? grid : 'transparent' }, ticks: { color: ticks, font: { family: 'Inter', size: 10 } } }, y: { beginAtZero: true, grid: { color: indexAxis === 'x' ? grid : 'transparent' }, ticks: { color: ticks, font: { family: 'Inter', size: 10 } } } } };
}

function doughnutOptions(tooltip) {
  return { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', padding: 14, boxWidth: 10, font: { family: 'Inter', size: 10 } } }, tooltip } };
}

function dualAxisOptions(tooltip, grid, ticks) {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1', boxWidth: 10, font: { family: 'Inter', size: 10 } } }, tooltip }, scales: { x: { grid: { display: false }, ticks: { color: ticks, font: { size: 9 } } }, y: { beginAtZero: true, position: 'left', grid: { color: grid }, ticks: { color: '#38bdf8' } }, y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#f59e0b' } } } };
}

function filteredProjects() {
  const query = state.search.toLowerCase();
  return state.projects.filter((project) => {
    const haystack = [project.project_id, project.name, project.company, project.client, project.project_type].join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && (!state.filter || project.status === state.filter);
  });
}

function projectRow(project) {
  const image = project.image_url ? `<img class="cell-thumb" src="/${escapeHtml(String(project.image_url).replace(/^\//, ''))}" alt="" onerror="this.style.display='none'">` : `<span class="cell-avatar">${escapeHtml((project.name || '?')[0])}</span>`;
  return `<tr>
    <td><div class="cell-primary">${image}<div><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.project_id)}</small></div></div></td>
    <td><span class="truncate">${escapeHtml(project.company || '—')}</span></td><td>${escapeHtml(project.project_type || '—')}</td>
    <td>${escapeHtml(project.year_end || project.year_start || '—')}</td><td><span class="status ${statusClass(project.status)}">${escapeHtml(project.status || 'Sin estado')}</span></td>
    <td>${project.featured ? '<span class="status cyan">Destacado</span>' : '<span class="status">Normal</span>'}</td>
    <td><div class="row-actions"><button class="row-button" data-edit="projects" data-id="${escapeHtml(project.id)}" title="Editar"><i class="fa-solid fa-pen"></i></button><button class="row-button" data-duplicate="${escapeHtml(project.id)}" title="Duplicar"><i class="fa-solid fa-copy"></i></button><button class="row-button delete" data-delete="projects" data-id="${escapeHtml(project.id)}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button></div></td>
  </tr>`;
}

function renderProjects() {
  const rows = filteredProjects();
  const pageRows = paginate(rows);
  const statuses = [...new Set(state.projects.map((item) => item.status).filter(Boolean))].sort();
  $('#content').innerHTML = `
    <div class="page-intro"><div><h2>Gestión de proyectos</h2><p>Crea, edita, duplica y organiza el portafolio técnico.</p></div><button class="button primary" data-create="projects"><i class="fa-solid fa-plus"></i> Nuevo proyecto</button></div>
    <section class="data-panel"><div class="data-toolbar"><div class="search-box"><input class="input" id="search" value="${escapeHtml(state.search)}" placeholder="Buscar por proyecto, empresa o cliente…"></div><select class="select" id="filter"><option value="">Todos los estados</option>${statuses.map((status) => `<option ${state.filter === status ? 'selected' : ''}>${escapeHtml(status)}</option>`).join('')}</select></div>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>Proyecto</th><th>Empresa</th><th>Tipo</th><th>Año</th><th>Estado</th><th>Visibilidad</th><th></th></tr></thead><tbody>${pageRows.map(projectRow).join('')}</tbody></table>${rows.length ? '' : emptyRow('No hay proyectos que coincidan')}</div>
      ${tableFooter(rows.length)}
    </section>`;
  bindTableActions();
}

function filteredRows(rows, fields) {
  const query = state.search.toLowerCase();
  return rows.filter((row) => !query || fields.map((field) => row[field]).join(' ').toLowerCase().includes(query));
}

function renderLeads() {
  const rows = filteredRows(state.leads, ['name', 'email', 'company', 'project_type', 'status']);
  const pageRows = paginate(rows);
  $('#content').innerHTML = `
    <div class="page-intro"><div><h2>Gestión de leads</h2><p>Administra contactos y oportunidades recibidas.</p></div><button class="button primary" data-create="leads"><i class="fa-solid fa-user-plus"></i> Nuevo lead</button></div>
    <section class="data-panel"><div class="data-toolbar"><div class="search-box"><input class="input" id="search" value="${escapeHtml(state.search)}" placeholder="Buscar contacto, correo o empresa…"></div></div>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>Contacto</th><th>Empresa</th><th>Proyecto</th><th>Origen</th><th>Estado</th><th>Fecha</th><th></th></tr></thead><tbody>${pageRows.map((lead) => `<tr><td><div class="cell-primary"><span class="cell-avatar">${escapeHtml((lead.name || '?')[0])}</span><div><strong>${escapeHtml(lead.name)}</strong><small>${escapeHtml(lead.email)}</small></div></div></td><td>${escapeHtml(lead.company || '—')}</td><td>${escapeHtml(lead.project_type || '—')}</td><td>${escapeHtml(lead.source || '—')}</td><td><span class="status ${lead.status === 'new' ? 'cyan' : statusClass(lead.status)}">${escapeHtml(lead.status || 'new')}</span></td><td>${formatDate(lead.created_at)}</td><td><div class="row-actions"><button class="row-button" data-edit="leads" data-id="${lead.id}" title="Editar"><i class="fa-solid fa-pen"></i></button><button class="row-button delete" data-delete="leads" data-id="${lead.id}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button></div></td></tr>`).join('')}</tbody></table>${rows.length ? '' : emptyRow('Todavía no hay leads')}</div>${tableFooter(rows.length)}</section>`;
  bindTableActions();
}

function renderCalculations() {
  const rows = filteredRows(state.calculations, ['tool_name', 'inputs', 'results']);
  const pageRows = paginate(rows);
  $('#content').innerHTML = `
    <div class="page-intro"><div><h2>Registros de cálculo</h2><p>Historial persistente de entradas y resultados técnicos.</p></div><button class="button primary" data-create="calculations"><i class="fa-solid fa-plus"></i> Nuevo registro</button></div>
    <section class="data-panel"><div class="data-toolbar"><div class="search-box"><input class="input" id="search" value="${escapeHtml(state.search)}" placeholder="Buscar herramienta o contenido…"></div></div>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>Herramienta</th><th>Entradas</th><th>Resultados</th><th>Fecha</th><th></th></tr></thead><tbody>${pageRows.map((record) => `<tr><td><div class="cell-primary"><span class="cell-avatar"><i class="fa-solid fa-calculator"></i></span><div><strong>${escapeHtml(record.tool_name)}</strong><small>${escapeHtml(record.id.slice(0, 8))}</small></div></div></td><td><span class="truncate">${escapeHtml(record.inputs)}</span></td><td><span class="truncate">${escapeHtml(record.results)}</span></td><td>${formatDate(record.created_at)}</td><td><div class="row-actions"><button class="row-button" data-edit="calculations" data-id="${record.id}" title="Editar"><i class="fa-solid fa-pen"></i></button><button class="row-button delete" data-delete="calculations" data-id="${record.id}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button></div></td></tr>`).join('')}</tbody></table>${rows.length ? '' : emptyRow('Todavía no hay registros')}</div>${tableFooter(rows.length)}</section>`;
  bindTableActions();
}

function renderSystem() {
  const summary = state.summary;
  $('#content').innerHTML = `
    <div class="page-intro"><div><h2>Estado del sistema</h2><p>Información técnica de la persistencia local independiente.</p></div></div>
    <div class="system-grid"><section class="panel"><header class="panel-header"><div><h3>Motor de datos</h3><p>Configuración activa</p></div><span class="status green">Operativo</span></header><div class="panel-body detail-list">
      <div class="detail-row"><span>Motor</span><strong>${escapeHtml(summary.engine)}</strong></div><div class="detail-row"><span>Integridad</span><strong>${escapeHtml(summary.integrity)}</strong></div><div class="detail-row"><span>Archivo</span><code>${escapeHtml(summary.path)}</code></div><div class="detail-row"><span>Acceso</span><strong>Local · 127.0.0.1</strong></div>
    </div></section><section class="panel"><header class="panel-header"><div><h3>Tablas</h3><p>Conteo de registros</p></div></header><div class="panel-body table-cards">${summary.tables.map((table) => `<div class="table-card"><strong>${escapeHtml(table.rows)}</strong><span>${escapeHtml(table.name)}</span></div>`).join('')}</div></section></div>`;
}

function paginate(rows) {
  const pages = Math.max(Math.ceil(rows.length / state.pageSize), 1);
  state.page = Math.min(state.page, pages);
  return rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
}

function tableFooter(total) {
  const pages = Math.max(Math.ceil(total / state.pageSize), 1);
  const start = total ? (state.page - 1) * state.pageSize + 1 : 0;
  const end = Math.min(state.page * state.pageSize, total);
  const buttons = Array.from({ length: Math.min(pages, 7) }, (_, index) => index + 1)
    .map((page) => `<button class="page-button ${page === state.page ? 'active' : ''}" data-page="${page}">${page}</button>`).join('');
  return `<footer class="table-footer"><span>Mostrando ${start}–${end} de ${total}</span><div class="pagination">${buttons}</div></footer>`;
}

function emptyRow(message) { return `<div class="empty-state"><strong>${escapeHtml(message)}</strong><span>Prueba ajustando la búsqueda o crea un registro.</span></div>`; }
function formatDate(value) { if (!value) return '—'; const date = new Date(value); return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(date); }
function statusClass(status = '') { const value = status.toLowerCase(); if (/complet|closed|qualified/.test(value)) return 'green'; if (/curso|contact|progress/.test(value)) return 'amber'; if (/new|nuevo/.test(value)) return 'cyan'; if (/discard|cancel|error/.test(value)) return 'red'; return ''; }

function bindCommonActions() {
  $$('[data-create]').forEach((button) => button.onclick = () => openModal(button.dataset.create));
}

function bindTableActions() {
  bindCommonActions();
  const search = $('#search');
  if (search) search.oninput = (event) => { state.search = event.target.value; state.page = 1; render(); setTimeout(() => $('#search')?.focus(), 0); };
  const filter = $('#filter');
  if (filter) filter.onchange = (event) => { state.filter = event.target.value; state.page = 1; render(); };
  $$('[data-page]').forEach((button) => button.onclick = () => { state.page = Number(button.dataset.page); render(); });
  $$('[data-edit]').forEach((button) => button.onclick = () => openModal(button.dataset.edit, findRecord(button.dataset.edit, button.dataset.id)));
  $$('[data-duplicate]').forEach((button) => button.onclick = () => {
    const source = findRecord('projects', button.dataset.duplicate);
    openModal('projects', { ...source, id: undefined, project_id: '', name: `${source.name} (Copia)`, slug: '' }, true);
  });
  $$('[data-delete]').forEach((button) => button.onclick = () => requestDelete(button.dataset.delete, findRecord(button.dataset.delete, button.dataset.id)));
}

function findRecord(entity, id) {
  const rows = entity === 'projects' ? state.projects : entity === 'leads' ? state.leads : state.calculations;
  return rows.find((row) => row.id === id);
}

function fieldHtml(field, record) {
  let value = record?.[field.name] ?? '';
  if (['gallery_images', 'description_paragraphs', 'description_paragraphs_en', 'technologies'].includes(field.name) && Array.isArray(value)) value = value.join('\n');
  if (['specs', 'specs_en'].includes(field.name) && value && typeof value !== 'string') value = JSON.stringify(value, null, 2);
  const attributes = `name="${field.name}" ${field.required ? 'required' : ''}`;
  let control;
  if (field.type === 'textarea') control = `<textarea class="textarea" ${attributes}>${escapeHtml(value)}</textarea>`;
  else if (field.type === 'select') control = `<select class="select" ${attributes}>${field.options.map((option) => `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`).join('')}</select>`;
  else if (field.type === 'checkbox') return `<div class="field ${field.span || ''}"><label class="checkbox-field"><input type="checkbox" name="${field.name}" ${value ? 'checked' : ''}><span>${field.label}</span></label></div>`;
  else control = `<input class="input" type="${field.type || 'text'}" ${attributes} value="${escapeHtml(value)}" ${field.placeholder ? `placeholder="${field.placeholder}"` : ''} ${field.step ? `step="${field.step}"` : ''}>`;
  return `<div class="field ${field.span || ''}"><label>${field.label}${field.required ? ' *' : ''}</label>${control}${field.hint ? `<p class="hint">${field.hint}</p>` : ''}</div>`;
}

function openModal(entity, record = null, duplicate = false) {
  state.editing = { entity, record: duplicate ? null : record };
  const sections = entity === 'projects' ? projectSections : entity === 'leads' ? leadSections : calculationSections;
  const labels = { projects: 'Proyecto', leads: 'Lead', calculations: 'Registro de cálculo' };
  $('#modal-kicker').textContent = record && !duplicate ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO';
  $('#modal-title').textContent = labels[entity];
  $('#modal-fields').innerHTML = sections.map((section) => `<section class="form-section"><h3 class="form-section-title">${section.title}</h3><div class="form-grid ${section.columns === 3 ? 'cols-3' : ''}">${section.fields.map((field) => fieldHtml(field, record)).join('')}</div></section>`).join('');
  $('#record-modal').hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#record-form input:not([type=checkbox])')?.focus(), 0);
}

function closeModals() {
  $$('.modal-backdrop').forEach((modal) => { modal.hidden = true; });
  document.body.style.overflow = '';
  state.editing = null;
}

async function saveRecord(event) {
  event.preventDefault();
  const button = $('#save-record');
  button.disabled = true;
  button.textContent = 'Guardando…';
  try {
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    if (state.editing.entity === 'projects') {
      ['year_start', 'year_end', 'concrete_volume', 'steel_weight', 'rebar_weight'].forEach((key) => { payload[key] = payload[key] === '' ? null : Number(payload[key]); });
      payload.featured = form.has('featured');
      payload.gallery_images = String(payload.gallery_images || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
      ['description_paragraphs', 'description_paragraphs_en'].forEach((key) => {
        payload[key] = String(payload[key] || '').split(/\n+/).map((item) => item.trim()).filter(Boolean);
      });
      payload.technologies = String(payload.technologies || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
      ['specs', 'specs_en'].forEach((key) => {
        const raw = String(payload[key] || '').trim();
        payload[key] = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(payload[key])) throw new Error(`${key} debe ser un arreglo JSON.`);
      });
      const current = state.editing.record;
      if (current) await api(`/api/projects/${encodeURIComponent(current.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
      else await api('/api/projects', { method: 'POST', body: JSON.stringify(payload) });
    } else {
      const table = state.editing.entity === 'leads' ? 'leads' : 'calculation_logs';
      const current = state.editing.record;
      const url = `/api/database/tables/${table}${current ? `/${encodeURIComponent(current.id)}` : ''}`;
      await api(url, { method: current ? 'PATCH' : 'POST', body: JSON.stringify(payload) });
    }
    closeModals();
    await loadData();
    toast('Registro guardado correctamente', 'success');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Guardar cambios';
  }
}

function requestDelete(entity, record) {
  state.pendingDelete = { entity, record };
  const name = record.name || record.tool_name || record.project_id || record.id;
  $('#confirm-message').textContent = `Se eliminará “${name}”. Esta acción no se puede deshacer.`;
  $('#confirm-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

async function confirmDelete() {
  const { entity, record } = state.pendingDelete || {};
  if (!record) return;
  const button = $('#confirm-delete');
  button.disabled = true;
  try {
    const url = entity === 'projects'
      ? `/api/projects/${encodeURIComponent(record.id)}`
      : `/api/database/tables/${entity === 'leads' ? 'leads' : 'calculation_logs'}/${encodeURIComponent(record.id)}`;
    await api(url, { method: 'DELETE' });
    closeModals();
    state.pendingDelete = null;
    await loadData();
    toast('Registro eliminado', 'success');
  } catch (error) {
    toast(error.message, 'error');
  } finally { button.disabled = false; }
}

function toast(message, type = 'success') {
  const element = document.createElement('div');
  element.className = `toast ${type}`;
  element.textContent = message;
  $('#toasts').append(element);
  setTimeout(() => element.remove(), 3500);
}

$$('.nav-item').forEach((button) => button.onclick = () => {
  state.section = button.dataset.section;
  state.search = ''; state.filter = ''; state.page = 1;
  $('#sidebar').classList.remove('open');
  render();
});
$('#mobile-menu').onclick = () => $('#sidebar').classList.toggle('open');
$('#refresh-all').onclick = () => loadData(true);
$$('.modal-close').forEach((button) => button.onclick = closeModals);
$('.confirm-cancel').onclick = closeModals;
$('#confirm-delete').onclick = confirmDelete;
$('#record-form').onsubmit = saveRecord;
$$('.modal-backdrop').forEach((backdrop) => backdrop.addEventListener('mousedown', (event) => { if (event.target === backdrop) closeModals(); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModals(); });

loadData();
