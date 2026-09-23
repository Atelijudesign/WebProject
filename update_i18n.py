import re
from pathlib import Path

TS_PATH = Path("src/data/i18n.ts")
JS_PATH = Path("src/data/i18n.js")

NEW_KEYS_ES = """
    // ─── GENERAL NAV & BACK ─────────────────────────────────
    nav_all_projects: "Ver todos los proyectos",
    back_to_home: "Volver al Inicio",
    back_to_portfolio: "Volver a Proyectos Destacados",

    // ─── PIPELINE & MARQUEE ─────────────────────────────────
    pipe_tag: "// PIPELINE DE INTEGRACIÓN Y AUTOMATIZACIÓN EN TIEMPO REAL",
    pipe_title: "Flujo de Datos Unificado: Del Modelo BIM a la Web",
    pipe_latency: "⚡ Latencia: 0.08s",
    pipe_sync: "● Sync Activo",
    pipe_revit_sub: "Modelos IFC / Geometría",
    pipe_cad_sub: "Detalles & Conexiones",
    pipe_dynamo_sub: "Lógica Paramétrica",
    pipe_engine_role: "Motor de Automatización",
    pipe_engine_desc: "Scripts Python & pyRevit",
    pipe_engine_badge: "Extracción & Validación",
    pipe_webapp_title: "Aplicación Web React",
    pipe_webapp_sub: "Visor 3D & Cubicador",
    pipe_db_title: "Base de Datos Estructural",
    pipe_db_sub: "Perfiles AISC & ICHA",
    pipe_excel_title: "Listados de Materiales",
    pipe_excel_sub: "Exportación Excel & PDF",
    marquee_tag: "// ECOSISTEMA TECNOLÓGICO INTEGRADO",
    marquee_title: "Dominio Integral: Ingeniería BIM Estructural & Desarrollo de Software",

    // ─── TOOLS CATALOG PAGE ─────────────────────────────────
    tc_badge: "Productividad y Eficiencia",
    tc_title_prefix: "Herramientas",
    tc_title_suffix: "BIM",
    tc_desc: "Calculadoras de ingeniería y utilidades de automatización diseñadas para optimizar el flujo de trabajo de diseñadores y proyectistas estructurales.",
    tc_open: "Abrir",
    tc_online: "Online",
    tc_tool_icha_title: "Catálogo ICHA Digital",
    tc_tool_icha_desc: "Buscador interactivo de perfiles de acero estructural chileno (NCh) con propiedades mecánicas completas, cubicador por proyecto y exportación.",
    tc_tool_aisc_title: "Catálogo AISC v15.0",
    tc_tool_aisc_desc: "Base de datos normada con 2,100+ perfiles (W, M, S, HP, C, MC, L, WT, HSS, Pipe). Toggle de unidades Imperial / Métrico, diagrama 2D y cubicación.",
    tc_tool_stairs_title: "Calculador de Escaleras Metálicas",
    tc_tool_stairs_desc: "Cálculo normativo según Ley de Blondel (b + 2h = 63cm), perfiles Canal C250 para limones, peldaños de rejilla electroforjada y barandas industriales.",
    tc_tool_profiles_title: "Calculador de Propiedades Geométricas",
    tc_tool_profiles_desc: "Calcula centroides, inercias (Ix, Iy), radios de giro (rx, ry) y módulos elásticos (Wx, Wy) de secciones compuestas de acero.",
    tc_tool_buckling_title: "Acortadores de Pandeo Estructural",
    tc_tool_buckling_desc: "Determinación de longitudes de pandeo efectivo kL/r y factores de longitud efectiva para columnas y arriostramientos según AISC 360-16.",
    tc_tool_export_title: "Visor & Exportador WebBIM / IFC",
    tc_tool_export_desc: "Visualización en tiempo real de modelos IFC en el navegador, inspección de propiedades BIM y conversión de formatos abiertos para obra.",

    // ─── PROJECTS CATALOG & DASHBOARD ───────────────────────
    proj_cat_title: "Base de Datos de Proyectos BIM",
    proj_cat_desc: "Explora el portafolio estructural detallado con más de 40 proyectos ejecutados a nivel internacional.",
    proj_search_ph: "Buscar por nombre de proyecto, cliente, ID o palabra clave...",
    proj_filter_type: "Tipo de Proyecto:",
    proj_filter_company: "Empresa / Especialista",
    proj_filter_software: "Software / Herramienta",
    proj_filter_material: "Material Principal",
    proj_all_types: "Todos",
    proj_all_companies: "Todas las empresas",
    proj_all_softwares: "Todos los software",
    proj_all_materials: "Todos los materiales",
    proj_lbl_client: "Cliente:",
    proj_lbl_role: "Rol:",
    proj_lbl_phase: "Fase:",
    proj_lbl_material: "Material:",
    proj_view_detail: "Ver Ficha Completa →",
    proj_reset_filters: "Limpiar Filtros",
    proj_active_filters: "Filtros Activos",
    proj_no_results: "No se encontraron proyectos con los filtros seleccionados.",
    dash_total: "Total Proyectos",
    dash_infra: "Infraestructura & Transporte",
    dash_companies: "Empresas Consultoras",
    dash_m2: "m² Totales Ejecutados",
    dash_type_chart: "Distribución por Tipo de Proyecto",
    dash_mat_chart: "Materialidad Estructural",
    dash_soft_chart: "Frecuencia de Software BIM",
    dash_time_chart: "Línea de Tiempo de Proyectos",
    dash_toggle_open: "Ocultar Métricas",
    dash_toggle_closed: "Ver Métricas & Analítica",

    // ─── PROJECT DETAIL PAGE ────────────────────────────────
    pdet_desc_title: "Descripción del Proyecto",
    pdet_details_title: "Detalles de Ingeniería",
    pdet_activities_title: "Actividades ejecutadas:",
    pdet_gallery_title: "Galería de Imágenes",
    pdet_back_portfolio: "Volver a Proyectos Destacados",
    pdet_specs_title: "Ficha Técnica",
    pdet_lbl_client: "Cliente / Empresa",
    pdet_lbl_period: "Periodo",
    pdet_lbl_type: "Tipo de Proyecto",
    pdet_lbl_material: "Material Principal",
    pdet_lbl_software: "Software Utilizado",
    pdet_lbl_role: "Rol en el Proyecto",
    pdet_lbl_status: "Estado",
    pdet_lbl_phase: "Fase",
    pdet_lbl_concrete: "Volumen Hormigón",
    pdet_lbl_steel: "Peso de Acero",
    pdet_share_title: "Compartir este proyecto",

    // ─── BLOG CATALOG ───────────────────────────────────────
    blog_hero_badge: "Blog BIM Developer",
    blog_hero_title_prefix: "Ideas, Código y",
    blog_hero_title_accent: "Automatización",
    blog_hero_desc: "Artículos sobre desarrollo BIM, Revit API, pyRevit, Python, C# y todo lo que un Proyectista Estructural necesita para automatizar su trabajo.",
    blog_search_ph: "Buscar artículos por título, tema o software...",
    blog_all_cats: "Todos los Artículos",
    blog_read_more: "Leer artículo completo →",
    blog_min_read: "min de lectura",
"""

NEW_KEYS_EN = """
    // ─── GENERAL NAV & BACK ─────────────────────────────────
    nav_all_projects: "View all projects",
    back_to_home: "Back to Home",
    back_to_portfolio: "Back to Featured Projects",

    // ─── PIPELINE & MARQUEE ─────────────────────────────────
    pipe_tag: "// REAL-TIME INTEGRATION & AUTOMATION PIPELINE",
    pipe_title: "Unified Data Flow: From BIM Model to Web Application",
    pipe_latency: "⚡ Latency: 0.08s",
    pipe_sync: "● Active Sync",
    pipe_revit_sub: "IFC Models / Geometry",
    pipe_cad_sub: "Details & Connections",
    pipe_dynamo_sub: "Parametric Logic",
    pipe_engine_role: "Automation Engine",
    pipe_engine_desc: "Python & pyRevit Scripts",
    pipe_engine_badge: "Extraction & Validation",
    pipe_webapp_title: "React Web Application",
    pipe_webapp_sub: "3D Viewer & Takeoff",
    pipe_db_title: "Structural Database",
    pipe_db_sub: "AISC & ICHA Profiles",
    pipe_excel_title: "Material Schedules",
    pipe_excel_sub: "Excel & PDF Export",
    marquee_tag: "// INTEGRATED TECH ECOSYSTEM",
    marquee_title: "Full-Stack Mastery: Structural BIM Engineering & Software Development",

    // ─── TOOLS CATALOG PAGE ─────────────────────────────────
    tc_badge: "Productivity & Efficiency",
    tc_title_prefix: "BIM",
    tc_title_suffix: "Tools",
    tc_desc: "Engineering calculators and automation utilities designed to streamline workflows for structural designers and modelers.",
    tc_open: "Open",
    tc_online: "Online",
    tc_tool_icha_title: "Digital ICHA Catalog",
    tc_tool_icha_desc: "Interactive search engine for Chilean structural steel profiles (NCh) with complete mechanical properties, project takeoff, and export.",
    tc_tool_aisc_title: "AISC v15.0 Catalog",
    tc_tool_aisc_desc: "Standardized database with 2,100+ steel profiles (W, M, S, HP, C, MC, L, WT, HSS, Pipe). Imperial / Metric unit toggle, 2D diagram, and takeoff.",
    tc_tool_stairs_title: "Steel Staircase Calculator",
    tc_tool_stairs_desc: "Code-compliant calculation per Blondel's rule (t + 2r = 63cm), C250 channel stringers, grating treads, and industrial handrails.",
    tc_tool_profiles_title: "Geometric Properties Calculator",
    tc_tool_profiles_desc: "Calculates centroids, moments of inertia (Ix, Iy), radii of gyration (rx, ry), and section moduli (Wx, Wy) for custom built-up steel sections.",
    tc_tool_buckling_title: "Structural Buckling Length Calculator",
    tc_tool_buckling_desc: "Determine effective buckling lengths kL/r and effective length factors for columns and bracings per AISC 360-16.",
    tc_tool_export_title: "WebBIM / IFC Viewer & Exporter",
    tc_tool_export_desc: "Real-time browser-based IFC viewer, BIM property inspection, and open data format conversion for construction sites.",

    // ─── PROJECTS CATALOG & DASHBOARD ───────────────────────
    proj_cat_title: "BIM Projects Database",
    proj_cat_desc: "Explore the comprehensive structural portfolio featuring 40+ internationally delivered projects.",
    proj_search_ph: "Search by project name, client, ID or keyword...",
    proj_filter_type: "Project Type:",
    proj_filter_company: "Company / Specialist",
    proj_filter_software: "Software / Tool",
    proj_filter_material: "Primary Material",
    proj_all_types: "All",
    proj_all_companies: "All companies",
    proj_all_softwares: "All software",
    proj_all_materials: "All materials",
    proj_lbl_client: "Client:",
    proj_lbl_role: "Role:",
    proj_lbl_phase: "Phase:",
    proj_lbl_material: "Material:",
    proj_view_detail: "View Project Details →",
    proj_reset_filters: "Reset Filters",
    proj_active_filters: "Active Filters",
    proj_no_results: "No projects match the selected filter criteria.",
    dash_total: "Total Projects",
    dash_infra: "Infrastructure & Transit",
    dash_companies: "Consulting Firms",
    dash_m2: "Total Modeled m²",
    dash_type_chart: "Distribution by Project Type",
    dash_mat_chart: "Structural Materiality",
    dash_soft_chart: "BIM Software Frequency",
    dash_time_chart: "Project Timeline",
    dash_toggle_open: "Hide Metrics",
    dash_toggle_closed: "View Metrics & Analytics",

    // ─── PROJECT DETAIL PAGE ────────────────────────────────
    pdet_desc_title: "Project Description",
    pdet_details_title: "Engineering Details",
    pdet_activities_title: "Executed activities:",
    pdet_gallery_title: "Image Gallery",
    pdet_back_portfolio: "Back to Featured Projects",
    pdet_specs_title: "Technical Sheet",
    pdet_lbl_client: "Client / Company",
    pdet_lbl_period: "Period",
    pdet_lbl_type: "Project Type",
    pdet_lbl_material: "Primary Material",
    pdet_lbl_software: "Software Used",
    pdet_lbl_role: "Role in Project",
    pdet_lbl_status: "Status",
    pdet_lbl_phase: "Phase",
    pdet_lbl_concrete: "Concrete Volume",
    pdet_lbl_steel: "Steel Weight",
    pdet_share_title: "Share this project",

    // ─── BLOG CATALOG ───────────────────────────────────────
    blog_hero_badge: "BIM Developer Blog",
    blog_hero_title_prefix: "Ideas, Code &",
    blog_hero_title_accent: "Automation",
    blog_hero_desc: "Technical articles on BIM development, Revit API, pyRevit, Python, C#, and practical automation for structural designers.",
    blog_search_ph: "Search articles by title, topic, or software...",
    blog_all_cats: "All Articles",
    blog_read_more: "Read full article →",
    blog_min_read: "min read",
"""

def update_file(filepath, is_ts=True):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the end of 'es' dictionary: before "  en: {"
    # We insert NEW_KEYS_ES right before "  }," that closes es
    pattern_es = r'(properties_placeholder:\s*[\s\S]*?)(  \},?\s*en:\s*\{)'
    match_es = re.search(pattern_es, content)
    if match_es:
        content = content[:match_es.start(2)] + NEW_KEYS_ES + "\n" + content[match_es.start(2):]
    else:
        print(f"Could not find insert point for ES in {filepath}")

    # Find the end of 'en' dictionary: before the last "  }," or "};"
    pattern_en = r'(properties_placeholder:\s*[\s\S]*?)(  \}\s*,?\s*\}\s*;?\s*$)'
    match_en = re.search(pattern_en, content)
    if match_en:
        content = content[:match_en.start(2)] + NEW_KEYS_EN + "\n" + content[match_en.start(2):]
    else:
        print(f"Could not find insert point for EN in {filepath}")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully updated {filepath}!")

if __name__ == "__main__":
    update_file(TS_PATH, is_ts=True)
    update_file(JS_PATH, is_ts=False)
