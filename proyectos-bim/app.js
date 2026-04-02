/* =====================================================
   PROYECTOS BIM — Application Logic
   Supabase-powered · Filtering · Rendering · Charts
   ===================================================== */

// ── Supabase Config ──
// ⚠️ REPLACE THESE with your actual Supabase credentials
const SUPABASE_URL = 'https://lhorekdbwnrrjtgzipgs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kfHl7UUtWD4REHOuiWdpqA_wdHWdl62';

let supabaseClient = null;
let PROJECTS = [];

// ── Timeline Data (static, from dashboard) ──
const TIMELINE = [
  { company:"BIOSMI", period:"2026", country:"Chile", projects:2, role:"Proyectista Estructural" },
  { company:"GHD", period:"2024–2025", country:"Chile", projects:0, role:"Proyectista Estructural" },
  { company:"Black & Veatch", period:"2025", country:"Chile", projects:1, role:"Proyectista Estructural" },
  { company:"Arcadis", period:"2024", country:"Chile", projects:1, role:"Proyectista Estructural" },
  { company:"AFRY", period:"2022–2024", country:"Chile / AR / MX", projects:6, role:"Proyectista Estructural" },
  { company:"Sincal", period:"2021–2022", country:"Chile", projects:9, role:"Proyectista Estructural" },
  { company:"CJV Construction", period:"2018–2019", country:"Chile", projects:7, role:"Proyectista Estructural" },
  { company:"Sirve", period:"2015–2017", country:"Chile", projects:4, role:"Proyectista Estructural" },
  { company:"TYPSA", period:"2014–2015", country:"Chile", projects:10, role:"Proyectista Estructural" },
  { company:"JQ Proyectos", period:"2012–2013", country:"Chile", projects:3, role:"Proyectista Estructural" },
  { company:"FUSI", period:"2010–2011", country:"Chile", projects:1, role:"Proyectista Estructural" },
  { company:"I. Municipalidad de Lampa", period:"Ene–May 2006", country:"Chile", projects:1, role:"Dibujante Técnico (Práctica)" }
];

// ── Active Filters State ──
const state = {
  search: '',
  companies: [],
  types: [],
  materials: [],
  software: [],
  countries: [],
  statuses: [],
  view: 'grid'
};

// ── Initialize Supabase & Load Data ──
async function initApp() {
  // Initialize Supabase client
  const supabaseReady = SUPABASE_URL.startsWith('https://') && (SUPABASE_ANON_KEY.startsWith('ey') || SUPABASE_ANON_KEY.startsWith('sb_')) && typeof window.supabase !== 'undefined';

  if (supabaseReady) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await loadFromSupabase();
  } else {
    // Fallback: use hardcoded data if Supabase not configured
    console.info('Supabase not configured. Using local fallback data.');
    loadFallbackData();
  }

  // Initialize UI
  setupEventListeners();
  renderTimeline();
  renderFilters();
  applyFilters();
  renderCharts();
  initKPIs();
  setView('grid');
}

async function loadFromSupabase() {
  try {
    showLoading(true);
    const { data, error } = await supabaseClient
      .from('proyectos')
      .select('*')
      .order('project_id', { ascending: false });

    if (error) throw error;

    PROJECTS = data.map(row => ({
      id: row.project_id,
      name: row.name,
      client: row.client,
      company: row.company,
      country: row.country,
      city: row.city,
      period: row.period,
      yearStart: row.year_start,
      yearEnd: row.year_end,
      type: row.project_type,
      phase: row.phase,
      material: row.material,
      concrete_volume: row.concrete_volume,
      steel_weight: row.steel_weight,
      role: row.role,
      software: row.software,
      status: row.status,
      desc: row.description,
      activities: row.activities
    }));

    showLoading(false);
  } catch (err) {
    console.error('Error loading from Supabase:', err);
    showLoading(false);
    showError('Error al cargar los datos. Intenta recargar la página.');
    loadFallbackData();
  }
}

function loadFallbackData() {
  // Hardcoded fallback — same data as original
  PROJECTS = [
    { id:"P-046", name:"Proyecto Atrio Sur (OT-1301)", client:"–", company:"BIOS MI", country:"Chile", city:"Santiago", period:"Ene 2012–Dic 2014", yearStart:2012, yearEnd:2013, type:"Edificación / Comercial", material:"Acero Estructural", role:"Proyectista Estructural", software:"Tekla Structures", status:"Completado", desc:"Fabricación de estructuras metálicas para Atrio Sur. Planos de taller (singles, conjuntos, montaje).", activities:"Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno" },
    { id:"P-045", name:"Proyecto Desaladora Santo Domingo – Estanques GRP", client:"Acciona", company:"BIOS MI", country:"Chile", city:"Santo Domingo", period:"Feb 2025–Presente", yearStart:2025, yearEnd:2025, type:"Industrial / Desalinización", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"En Curso", desc:"Ingeniería de detalles para estanques GRP de la planta desaladora de Santo Domingo.", activities:"Modelado BIM, planos estructurales, cubicaciones, coordinación especialidades" },
    { id:"P-044", name:"Proyecto Minero Arqueros (Fase Factibilidad)", client:"Teck Resources", company:"Black & Veatch", country:"Chile", city:"Coquimbo", period:"Dic 2024–May 2025", yearStart:2024, yearEnd:2025, type:"Minería / Cobre-Oro", material:"Acero Estructural", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Factibilidad de infraestructura estructural para proyecto minero Arqueros de Teck.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-043", name:"Ampliación Planta Desaladora Antofagasta – BHP", client:"BHP", company:"Arcadis", country:"Chile", city:"Antofagasta", period:"Jun 2024–Nov 2024", yearStart:2024, yearEnd:2024, type:"Industrial / Desalinización", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ampliación de planta desaladora para operaciones BHP en Antofagasta.", activities:"Modelado BIM, planos estructurales, cubicaciones, coordinación especialidades" },
    { id:"P-042", name:"CMPC – Máquina Papelera MP21", client:"CMPC", company:"AFRY", country:"Chile", city:"Nacimiento, Bío Bío", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Industrial / Manufactura", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para nueva máquina papelera MP21 en planta CMPC Nacimiento.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-041", name:"Celulosa Arauco – Línea de Fibra MAPA", client:"Arauco", company:"AFRY", country:"Chile", city:"Arauco, Bío Bío", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Industrial / Celulosa", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para línea de fibra del proyecto MAPA, Celulosa Arauco.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-040", name:"Minera Alumbrera (YMAD) – Infraestructura Planta", client:"YMAD", company:"AFRY", country:"Argentina", city:"Catamarca", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Minería / Cobre-Oro", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Infraestructura estructural para planta de procesamiento minero Alumbrera.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-039", name:"Cervecería Heineken – Planta Meoqui", client:"Heineken", company:"AFRY", country:"México", city:"Meoqui, Chihuahua", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Industrial / Alimentos y Bebidas", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para ampliación de planta cervecera Heineken en Meoqui.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-038", name:"CMPC – Continuidad Operaciones Bio Bio", client:"CMPC", company:"AFRY", country:"Chile", city:"Nacimiento, Bío Bío", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Industrial / Manufactura", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Continuidad de operaciones en planta papelera CMPC Bío Bío. Ingeniería estructural.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-037", name:"CMPC – Máquina Papelera MP23", client:"CMPC", company:"AFRY", country:"Chile", city:"Puente Alto, Santiago", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Industrial / Manufactura", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para nueva línea de producción MP23 en planta CMPC Puente Alto.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-036", name:"CMPC – Continuidad Operaciones Planta de Laja", client:"CMPC", company:"AFRY", country:"Chile", city:"Laja, Bío Bío", period:"Dic 2022–May 2024", yearStart:2022, yearEnd:2024, type:"Industrial / Manufactura", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Continuidad de operaciones e integridad de activos para planta papelera CMPC en Laja.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle" },
    { id:"P-035", name:"Pasarela La Finca", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Región Metropolitana", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado estructural detallado de pasarela peatonal en hormigón y acero.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-034", name:"Pasarela Paine", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Paine, R.M.", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal para la comuna de Paine.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-033", name:"Pasarela El Retiro", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Región Metropolitana", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal El Retiro.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-032", name:"Pasarela Campamento 4", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Región Metropolitana", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal Campamento 4.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-031", name:"Pasarela Cerrillos", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Cerrillos, R.M.", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal Cerrillos.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-030", name:"Pasarela Las Miras Norte", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Región Metropolitana", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal Las Miras Norte.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-029", name:"Pasarela Copihue", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Región Metropolitana", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal Copihue.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-028", name:"Pasarela Longaví", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Longaví, Maule", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal Longaví.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-027", name:"Pasarela Gaona", client:"MOP / SERVIU", company:"Sincal", country:"Chile", city:"Región Metropolitana", period:"Ene 2021–Dic 2022", yearStart:2021, yearEnd:2022, type:"Infraestructura / Pasarela Peatonal", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Tekla Structures, Navisworks", status:"Completado", desc:"Modelado y detallado de pasarela peatonal Gaona.", activities:"Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales" },
    { id:"P-026", name:"Aeropuerto AMB – Terminal 2 T2M", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Acero Estructural", role:"Proyectista Estructural", software:"Revit Structure, Navisworks", status:"Completado", desc:"Modelado BIM de estructuras metálicas del Terminal 2 del Aeropuerto Internacional Arturo Merino Benítez (320.000 m²).", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas Revit, planos ingeniería detalle, visitas terreno" },
    { id:"P-025", name:"Aeropuerto AMB – Espigón T2D (1)", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Acero Estructural", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Modelado de espigón T2D del nuevo Terminal 2, Aeropuerto AMB.", activities:"Modelado BIM estructuras metálicas, conexiones en Revit, planos de detalle" },
    { id:"P-024", name:"Aeropuerto AMB – Espigón T2F", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Acero Estructural", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Modelado de espigón T2F del nuevo Terminal 2, Aeropuerto AMB.", activities:"Modelado BIM estructuras metálicas, conexiones en Revit, planos de detalle" },
    { id:"P-023", name:"Aeropuerto AMB – Espigón T2D (2)", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Acero Estructural", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Modelado de segundo espigón T2D, Aeropuerto AMB.", activities:"Modelado BIM estructuras metálicas, conexiones en Revit, planos de detalle" },
    { id:"P-022", name:"Aeropuerto AMB – Desmontaje Torre Grúa 11", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Acero Estructural", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería y documentación para desmontaje de torre grúa N°11 en obra AMB.", activities:"Modelado BIM, planos desmontaje, documentación detalle" },
    { id:"P-021", name:"Aeropuerto AMB – Estacionamiento Poniente", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Modelado BIM del estacionamiento poniente del nuevo Terminal 2.", activities:"Modelado BIM, planos de ingeniería de detalle" },
    { id:"P-020", name:"Aeropuerto AMB – Estacionamiento Sur", client:"SCL Terminal / DGAC", company:"CJV Construction", country:"Chile", city:"Santiago", period:"Ene 2018–Mar 2019", yearStart:2018, yearEnd:2019, type:"Infraestructura / Aviación", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Modelado BIM del estacionamiento sur del nuevo Terminal 2.", activities:"Modelado BIM, planos de ingeniería de detalle" },
    { id:"P-019", name:"Nuevo Complejo Fronterizo Los Libertadores", client:"MOP Chile", company:"Sirve", country:"Chile", city:"Los Andes", period:"May 2015–Sep 2017", yearStart:2015, yearEnd:2017, type:"Infraestructura / Fronterizo", material:"Acero + Hormigón", role:"Proyectista Estructural", software:"Revit Structure, Tekla Structures, Navisworks", status:"Completado", desc:"Modelado BIM de estructuras para el nuevo complejo fronterizo Los Libertadores (~35.000 m²).", activities:"Modelado BIM estructura y arquitectura, conexiones Tekla, planos detalle, coordinación especialidades" },
    { id:"P-018", name:"Hospital Marga Marga", client:"Ministerio de Salud", company:"Sirve", country:"Chile", city:"Quilpué", period:"May 2015–Sep 2017", yearStart:2015, yearEnd:2017, type:"Edificación / Salud", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure, Tekla Structures", status:"Completado", desc:"Modelado BIM estructural de hospital público de alta complejidad.", activities:"Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle, coordinación interdisciplinaria" },
    { id:"P-017", name:"Hospital Dr. Gustavo Fricke", client:"Ministerio de Salud", company:"Sirve", country:"Chile", city:"Viña del Mar", period:"May 2015–Sep 2017", yearStart:2015, yearEnd:2017, type:"Edificación / Salud", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure, Tekla Structures", status:"Completado", desc:"Modelado BIM estructural de hospital, coordinación interdisciplinaria.", activities:"Modelado BIM, conexiones metálicas, planos detalle, coordinación especialidades" },
    { id:"P-016", name:"Hospital Felix Bulnes", client:"Ministerio de Salud", company:"Sirve", country:"Chile", city:"Santiago", period:"May 2015–Sep 2017", yearStart:2015, yearEnd:2017, type:"Edificación / Salud", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure, Tekla Structures", status:"Completado", desc:"Modelado BIM estructural de hospital Felix Bulnes, coordinación multidisciplina.", activities:"Modelado BIM, conexiones metálicas, planos detalle, coordinación especialidades" },
    { id:"P-015", name:"Metro L3 – Máquina de Lavado (L3-359)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para caseta de máquina de lavado, Línea 3 Metro de Santiago.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-014", name:"Metro L3 – Casetas Seguridad Norte 1 (L3-362)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para casetas de seguridad norte, Línea 3.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-013", name:"Metro L3 – Caseta de Tracción (L3-363)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles caseta de tracción Línea 3.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-012", name:"Metro L3 – Estanque Agua Regenerada (L3-363)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles estanque agua regenerada Línea 3.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-011", name:"Metro L3 – Edificio Compresores (L3-368)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles edificio de compresores Línea 3.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-010", name:"Metro L3 – Edificio Lubricantes (L3-369)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles edificio de lubricantes Línea 3.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-009", name:"Metro L6 – Bodega Residuos Peligrosos (L6-860)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles bodega de residuos peligrosos Línea 6.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-008", name:"Metro L6 – Sala de Compresores (L6-868)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles sala de compresores Línea 6.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-007", name:"Metro L6 – Bodega de Lubricantes (L6-869)", client:"Metro de Santiago", company:"TYPSA", country:"Chile", city:"Santiago", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Infraestructura / Metro", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles bodega de lubricantes Línea 6.", activities:"Modelado BIM, planos estructurales, cubicaciones" },
    { id:"P-006", name:"Proyecto Hidroeléctrico Los Cóndores (OH1737)", client:"EMB / Enel", company:"TYPSA", country:"Chile", city:"Talca, Maule", period:"Mar 2014–Mar 2015", yearStart:2014, yearEnd:2015, type:"Energía / Hidroeléctrica", material:"Hormigón Armado", role:"Proyectista Estructural", software:"Revit Structure", status:"Completado", desc:"Ingeniería de detalles para proyecto hidroeléctrico Los Cóndores en el Maule.", activities:"Modelado BIM, planos estructurales, cubicaciones, coordinación especialidades" },
    { id:"P-005", name:"Proyecto Atrio Sur (OT-1301)", client:"–", company:"JQ Proyectos", country:"Chile", city:"Santiago", period:"Ene 2012–Dic 2013", yearStart:2012, yearEnd:2013, type:"Edificación / Comercial", material:"Acero Estructural", role:"Proyectista Estructural", software:"Tekla Structures", status:"Completado", desc:"Fabricación de estructuras metálicas para Atrio Sur.", activities:"Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno" },
    { id:"P-004", name:"Casino Costanera Norte (OT-1302)", client:"–", company:"JQ Proyectos", country:"Chile", city:"Santiago", period:"Ene 2012–Dic 2013", yearStart:2012, yearEnd:2013, type:"Edificación / Entretenimiento", material:"Acero Estructural", role:"Proyectista Estructural", software:"Tekla Structures", status:"Completado", desc:"Fabricación de estructuras metálicas para Casino Costanera Norte.", activities:"Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno" },
    { id:"P-003", name:"Viga Puente (OT-1303)", client:"–", company:"JQ Proyectos", country:"Chile", city:"Santiago", period:"Ene 2012–Dic 2013", yearStart:2012, yearEnd:2013, type:"Infraestructura / Vial", material:"Acero Estructural", role:"Proyectista Estructural", software:"Tekla Structures", status:"Completado", desc:"Fabricación de vigas de puente metálico; planos de taller con Tekla Structures.", activities:"Planos singles, conjuntos y montaje; listado de materiales" },
    { id:"P-002", name:"Ingeniería Detalles Edificio Quitmetal", client:"Quitmetal", company:"FUSI", country:"Chile", city:"Santiago", period:"Ene 2010–Dic 2011", yearStart:2010, yearEnd:2011, type:"Edificación / Industrial", material:"Acero Estructural", role:"Proyectista Estructural", software:"Tekla Structures", status:"Completado", desc:"Planos de fabricación de estructura metálica para edificio industrial Quitmetal.", activities:"Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno" },
    { id:"P-001", name:"Planimetría Arquitectura Municipal – Práctica Profesional", client:"I. Municipalidad de Lampa", company:"I. Municipalidad de Lampa", country:"Chile", city:"Lampa", period:"Ene–May 2006", yearStart:2006, yearEnd:2006, type:"Edificación / Municipal", material:"–", role:"Dibujante Técnico (Práctica)", software:"AutoCAD", status:"Completado", desc:"Práctica profesional para titulación como Dibujante Técnico. Apoyo al área de arquitectura.", activities:"Desarrollo de planimetría arquitectónica" }
  ];
}

// ── Loading & Error UI ──
function showLoading(show) {
  const grid = document.getElementById('projects-grid');
  if (show && grid) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1;">
        <div class="no-results-icon" style="animation: pulse-glow 1.5s ease-in-out infinite;">⏳</div>
        <div class="no-results-text">Cargando proyectos...</div>
      </div>`;
  }
}

function showError(message) {
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1;">
        <div class="no-results-icon">⚠️</div>
        <div class="no-results-text">${message}</div>
        <div class="no-results-sub">Mostrando datos de respaldo</div>
      </div>`;
  }
}

// ── Setup Event Listeners ──
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      applyFilters();
    });
  }

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  const clearBtn = document.getElementById('btn-clear');
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);

  // Modal
  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ── All previous functions remain the same ──

function getSectorCategories() {
  const map = {};
  PROJECTS.forEach(p => {
    if (p.type) {
      const category = p.type.split('/')[0].trim();
      if (!map[category]) map[category] = 0;
      map[category]++;
    }
  });
  return Object.entries(map).sort((a,b) => b[1] - a[1]);
}

function countBy(field) {
  const map = {};
  PROJECTS.forEach(p => {
    const val = p[field] || 'N/A';
    if (!map[val]) map[val] = 0;
    map[val]++;
  });
  return Object.entries(map).sort((a,b) => b[1] - a[1]);
}

function filterProjects() {
  return PROJECTS.filter(p => {
    const pCompany = (p.company || '').trim().toLowerCase();
    const pClient = (p.client || '').trim().toLowerCase();
    const pType = (p.type || '').trim().split('/')[0].toLowerCase();
    const pMaterial = (p.material || '').trim().toLowerCase();
    const pSoftware = (p.software || '').trim().toLowerCase();
    const pStatus = (p.status || '').trim().toLowerCase();
    const pCountry = (p.country || '').trim().toLowerCase();

    if (state.search) {
      const q = state.search.toLowerCase();
      const searchable = [p.id, p.name, pClient, pCompany, p.city, p.type, pMaterial, pSoftware, p.desc, p.activities].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    if (state.companies.length && !state.companies.some(c => c.trim().toLowerCase() === pCompany)) return false;

    if (state.types.length && !state.types.some(t => t.trim().toLowerCase() === pType)) return false;

    if (state.materials.length && !state.materials.some(m => m.trim().toLowerCase() === pMaterial)) return false;

    if (state.software.length && !state.software.some(s => pSoftware.includes(s.trim().toLowerCase()))) return false;

    if (state.countries.length && !state.countries.some(c => c.trim().toLowerCase() === pCountry)) return false;

    if (state.statuses.length && !state.statuses.some(s => s.trim().toLowerCase() === pStatus)) return false;

    return true;
  });
}

function animateCounter(el, target, suffix = '') {
  const isPlus = suffix.includes('+');
  const numTarget = parseInt(target);
  if (isNaN(numTarget)) { el.textContent = target; return; }
  let current = 0;
  const duration = 1500;
  const increment = numTarget / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= numTarget) { current = numTarget; clearInterval(timer); }
    el.textContent = Math.floor(current) + (isPlus ? '+' : '');
  }, 16);
}

function updateKPIs(dataArray = PROJECTS) {
  const target = dataArray || [];
  
  // Total Proyectos
  const kpiProjects = document.querySelector('#kpi-projects .kpi-value');
  if (kpiProjects) {
    animateCounter(kpiProjects, target.length, kpiProjects.dataset.suffix || '');
  }
  
  // Años de Experiencia (Calculamos el rango real de años en la data filtrada)
  const kpiYears = document.querySelector('#kpi-years .kpi-value');
  if (kpiYears) {
    const years = new Set();
    target.forEach(p => {
      const start = parseInt(p.yearStart);
      const end = parseInt(p.yearEnd);
      if (!isNaN(start) && !isNaN(end)) {
        for (let y = start; y <= end; y++) years.add(y);
      }
    });
    animateCounter(kpiYears, years.size, kpiYears.dataset.suffix || '+');
  }

  // Países (Únicos en la data filtrada)
  const kpiCountries = document.querySelector('#kpi-countries .kpi-value');
  if (kpiCountries) {
    const unique = new Set(target.map(p => String(p.country || '').trim().toLowerCase()).filter(v => !!v)).size;
    animateCounter(kpiCountries, unique, kpiCountries.dataset.suffix || '');
  }

  // Sectores (Categoría principal del campo 'type')
  const kpiSectors = document.querySelector('#kpi-sectors .kpi-value');
  if (kpiSectors) {
    const sectors = new Set(target.map(p => String(p.type || '').split('/')[0].trim().toLowerCase()).filter(v => !!v)).size;
    animateCounter(kpiSectors, sectors, kpiSectors.dataset.suffix || '+');
  }

  // En Curso (Estado activo)
  const kpiActive = document.querySelector('#kpi-active .kpi-value');
  if (kpiActive) {
    const count = target.filter(p => {
      const s = String(p.status || '').trim().toLowerCase();
      return s.includes('curso') || s.includes('progreso');
    }).length;
    animateCounter(kpiActive, count, kpiActive.dataset.suffix || '');
  }

  // TOTAL HORMIGÓN (Suma del dataset filtrado)
  const kpiConcrete = document.getElementById('kpi-concrete');
  if (kpiConcrete) {
    const total = target.reduce((sum, p) => sum + (parseFloat(p.concrete_volume) || 0), 0);
    const valueEl = kpiConcrete.querySelector('.kpi-value');
    animateCounter(valueEl, total, ' m³');
  }

  // TOTAL ACERO (Suma del dataset filtrado)
  const kpiSteel = document.getElementById('kpi-steel');
  if (kpiSteel) {
    const total = target.reduce((sum, p) => sum + (parseFloat(p.steel_weight) || 0), 0);
    const valueEl = kpiSteel.querySelector('.kpi-value');
    animateCounter(valueEl, total, ' Ton.');
  }
}

function initKPIs() {
  console.log("%c[PORTFOLIO LOGIC] v1.8 Final Dashboard Sync Active", "color: #10b981; font-weight: bold;");
  updateKPIs(PROJECTS);
}

function renderTimeline() {
  const container = document.getElementById('timeline-inner');
  if (!container) return;

  // Auto-sort TIMELINE by the newest year found in "period"
  const extractMaxYear = (periodStr) => {
    const years = periodStr.match(/\d{4}/g);
    return years ? Math.max(...years.map(Number)) : 0;
  };
  TIMELINE.sort((a, b) => extractMaxYear(b.period) - extractMaxYear(a.period));

  container.innerHTML = '<div class="timeline-line"></div>' + TIMELINE.map(t => {
    const lowerCompany = t.company.trim().toLowerCase();
    const matchedProjects = PROJECTS.filter(p => p.company.trim().toLowerCase() === lowerCompany);
    const displayCount = matchedProjects.length;
    // Use the actual company name from PROJECTS to ensure filter matching
    const actualCompany = matchedProjects.length > 0 ? matchedProjects[0].company : t.company;

    return `
    <div class="timeline-item" data-company="${actualCompany}">
      <div class="timeline-count">${displayCount} proy.</div>
      <div class="timeline-company">${t.company}</div>
      <div class="timeline-dot"></div>
    </div>
    `;
  }).join('');

  container.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => toggleFilter('companies', item.dataset.company));
  });
}

function renderFilters() {
  renderChipGroup('filter-company', countBy('company'), state.companies, 'companies');
  renderChipGroup('filter-type', getSectorCategories(), state.types, 'types');
  renderChipGroup('filter-material', countBy('material').filter(([k]) => k !== '–'), state.materials, 'materials');
  const swMap = {};
  PROJECTS.forEach(p => { p.software.split(',').map(s => s.trim()).forEach(s => { if (!swMap[s]) swMap[s] = 0; swMap[s]++; }); });
  renderChipGroup('filter-software', Object.entries(swMap).sort((a,b) => b[1] - a[1]), state.software, 'software');
  renderChipGroup('filter-country', countBy('country'), state.countries, 'countries');
  renderChipGroup('filter-status', countBy('status'), state.statuses, 'statuses');
}

function renderChipGroup(containerId, items, activeArr, stateKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items.map(([label, count]) => `
    <button class="chip ${activeArr.includes(label) ? 'active' : ''}" data-value="${label}" data-key="${stateKey}">
      ${label} <span class="count">${count}</span>
    </button>
  `).join('');
  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => toggleFilter(stateKey, chip.dataset.value));
  });
}

function toggleFilter(key, value) {
  if (key === 'companies') {
    // Exclusive selection: clicking a new company replaces the previous one
    const idx = state[key].indexOf(value);
    state[key] = idx >= 0 ? [] : [value];
  } else {
    const idx = state[key].indexOf(value);
    if (idx >= 0) state[key].splice(idx, 1); else state[key].push(value);
  }
  applyFilters();
}

function clearFilters() {
  state.search = '';
  state.companies = [];
  state.types = [];
  state.materials = [];
  state.software = [];
  state.countries = [];
  state.statuses = [];
  document.getElementById('search-input').value = '';
  applyFilters();
}

function getSectorIcon(type) {
  if (!type) return '📋';
  const t = type.toLowerCase();
  if (t.includes('minería') || t.includes('cobre')) return '⛏️';
  if (t.includes('salud') || t.includes('hospital')) return '🏥';
  if (t.includes('aviación') || t.includes('aeropuerto')) return '✈️';
  if (t.includes('metro')) return '🚇';
  if (t.includes('energía') || t.includes('hidroeléctrica')) return '⚡';
  if (t.includes('industrial') || t.includes('manufactura') || t.includes('celulosa') || t.includes('alimentos')) return '🏭';
  if (t.includes('pasarela') || t.includes('vial') || t.includes('fronterizo')) return '🌉';
  if (t.includes('desalinización') || t.includes('desaladora')) return '💧';
  if (t.includes('comercial') || t.includes('entretenimiento')) return '🏢';
  if (t.includes('municipal')) return '🏛️';
  return '📋';
}

function renderCards(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  if (projects.length === 0) {
    grid.innerHTML = `<div class="no-results" style="grid-column:1/-1;"><div class="no-results-icon">🔍</div><div class="no-results-text">No se encontraron proyectos</div><div class="no-results-sub">Intenta ajustar los filtros de búsqueda</div></div>`;
    return;
  }
  grid.innerHTML = projects.map((p, i) => {
    const statusClass = p.status === 'Completado' ? 'completado' : 'en-curso';
    return `
    <div class="project-card" data-id="${p.id}" style="animation-delay:${i*0.04}s" onclick="openModal('${p.id}')">
      <div class="card-header"><span class="card-id">${p.id}</span><span class="card-status ${statusClass}">${p.status}</span></div>
      <div class="card-title">${p.name}</div>
      <div class="card-description">${p.desc}</div>
      <div class="card-meta">
        <span class="meta-tag"><span class="icon">${getSectorIcon(p.type)}</span> ${p.type}</span>
        <span class="meta-tag"><span class="icon">🔧</span> ${p.material}</span>
        <span class="meta-tag" title="${p.software}"><span class="icon">💻</span> ${p.software}</span>
        <span class="meta-tag"><span class="icon">📍</span> ${p.city}</span>
        ${p.concrete_volume > 0 ? `<span class="meta-tag scale-tag"><span class="icon">🧱</span> ${p.concrete_volume} m³</span>` : ''}
        ${p.steel_weight > 0 ? `<span class="meta-tag scale-tag"><span class="icon">🏗️</span> ${p.steel_weight} Ton.</span>` : ''}
      </div>
      <div class="card-footer"><span class="card-company">${p.company}</span></div>
    </div>`;
  }).join('');
}

function renderTable(projects) {
  const tbody = document.getElementById('projects-tbody');
  if (!tbody) return;
  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--text-muted);">No se encontraron proyectos</td></tr>`;
    return;
  }
  tbody.innerHTML = projects.map(p => `
    <tr onclick="openModal('${p.id}')">
      <td class="cell-id">${p.id}</td><td class="cell-name">${p.name}</td><td class="cell-company">${p.company}</td>
      <td>${p.client}</td><td>${p.type}</td><td>${p.material}</td>
      <td><span class="card-status ${p.status==='Completado'?'completado':'en-curso'}" style="display:inline-block">${p.status}</span></td>
    </tr>`).join('');
}

function applyFilters() {
  const filtered = filterProjects();
  renderCards(filtered);
  renderTable(filtered);
  renderFilters();
  updateTimelineActive();
  updateKPIs(filtered); // Dynamic sync for dashboard cards
  const countEl = document.getElementById('results-count');
  if (countEl) countEl.innerHTML = `Mostrando <strong>${filtered.length}</strong> de <strong>${PROJECTS.length}</strong> proyectos`;
}

function updateTimelineActive() {
  document.querySelectorAll('.timeline-item').forEach(item => {
    const itemCo = (item.dataset.company || '').trim().toLowerCase();
    const isActive = state.companies.some(c => (c || '').trim().toLowerCase() === itemCo);
    item.classList.toggle('active', isActive);
  });
}

function openModal(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modal-id').textContent = p.id;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-detail-grid').innerHTML = `
    <div class="detail-item"><div class="detail-label">Cliente</div><div class="detail-value">${p.client}</div></div>
    <div class="detail-item"><div class="detail-label">Empresa</div><div class="detail-value">${p.company}</div></div>
    <div class="detail-item"><div class="detail-label">País</div><div class="detail-value">${p.country}</div></div>
    <div class="detail-item"><div class="detail-label">Ciudad</div><div class="detail-value">${p.city}</div></div>
    <div class="detail-item"><div class="detail-label">Estado</div><div class="detail-value"><span class="card-status ${p.status==='Completado'?'completado':'en-curso'}" style="display:inline-block">${p.status}</span></div></div>
    <div class="detail-item"><div class="detail-label">Sector / Industria</div><div class="detail-value">${p.type || '–'}</div></div>
    <div class="detail-item"><div class="detail-label">Etapa Ingeniería</div><div class="detail-value">${p.phase || '–'}</div></div>
    <div class="detail-item"><div class="detail-label">Material</div><div class="detail-value">${p.material || '–'}</div></div>
    ${p.concrete_volume ? `<div class="detail-item"><div class="detail-label">Volumen Hormigón</div><div class="detail-value">${p.concrete_volume} m³</div></div>` : ''}
    ${p.steel_weight ? `<div class="detail-item"><div class="detail-label">Acero Estructural</div><div class="detail-value">${p.steel_weight} Ton.</div></div>` : ''}
    <div class="detail-item"><div class="detail-label">Rol</div><div class="detail-value">${p.role}</div></div>
    <div class="detail-item"><div class="detail-label">Software</div><div class="detail-value">${p.software}</div></div>`;
  document.getElementById('modal-description').textContent = p.desc;
  document.getElementById('modal-activities').innerHTML = p.activities.split(/[;,]/).map(a=>a.trim()).filter(Boolean).map(a=>`<span class="activity-tag">${a}</span>`).join('');
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.view-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  const gridEl = document.getElementById('projects-grid');
  const tableEl = document.getElementById('projects-table-wrapper');
  if (view === 'grid') { gridEl.classList.add('active'); tableEl.classList.remove('active'); }
  else { gridEl.classList.remove('active'); tableEl.classList.add('active'); }
}

function renderCharts() {
  const companyData = countBy('company');
  const maxCount = Math.max(...companyData.map(([,v]) => v));
  const barChart = document.getElementById('chart-company');
  if (barChart) {
    barChart.innerHTML = companyData.map(([label, count], i) => `
      <div class="bar-row"><div class="bar-label" title="${label}">${label}</div>
      <div class="bar-track"><div class="bar-fill color-${(i%7)+1}" style="width:${(count/maxCount*100)}%">${count}</div></div></div>`).join('');
  }
  renderDonut('chart-sector', getSectorCategories());
  const yearData = {};
  PROJECTS.forEach(p => { for (let y = p.yearStart; y <= p.yearEnd; y++) { if (!yearData[y]) yearData[y]=0; yearData[y]++; } });
  const yearArr = Object.entries(yearData).sort((a,b)=>parseInt(a[0])-parseInt(b[0]));
  const maxYear = Math.max(...yearArr.map(([,v])=>v));
  const yearChart = document.getElementById('chart-year');
  if (yearChart) {
    yearChart.innerHTML = yearArr.map(([year,count],i) => `
      <div class="bar-row"><div class="bar-label">${year}</div>
      <div class="bar-track"><div class="bar-fill color-${(i%7)+1}" style="width:${(count/maxYear*100)}%">${count}</div></div></div>`).join('');
  }
}

function renderDonut(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const total = data.reduce((s,[,v])=>s+v,0);
  const colors = ['#38bdf8','#818cf8','#34d399','#fb923c','#f472b6','#a78bfa','#fbbf24','#f87171','#2dd4bf','#e879f9'];
  const size=160, cx=size/2, cy=size/2, r=55, strokeWidth=24;
  const circumference = 2*Math.PI*r;
  let cumulative = 0;
  const segments = data.map(([label,count],i) => {
    const frac=count/total, offset=cumulative; cumulative+=frac;
    return {label,count,frac,offset,color:colors[i%colors.length]};
  });
  const svgPaths = segments.map(s => {
    const dashLen=s.frac*circumference, dashGap=circumference-dashLen, dashOffset=-(s.offset*circumference);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${strokeWidth}" stroke-dasharray="${dashLen} ${dashGap}" stroke-dashoffset="${dashOffset}" style="transition:stroke-dasharray 1s ease,stroke-dashoffset 1s ease;"/>`;
  }).join('');
  const legend = segments.map(s=>`<div class="legend-item"><span class="legend-dot" style="background:${s.color}"></span><span>${s.label}</span><span class="legend-count">${s.count}</span></div>`).join('');
  container.innerHTML = `<div class="donut-container"><svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">${svgPaths}</svg><div class="donut-legend">${legend}</div></div>`;
}

// ── Init on DOM ready ──
// ── DOM loaded initialization ──
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close nav when clicking a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') navLinks.classList.remove('open');
    });
  }
});
