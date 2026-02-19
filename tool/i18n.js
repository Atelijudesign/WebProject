const TRANSLATIONS = {
  es: {
    // Navigation
    nav_blog: "BLOG",
    nav_tools: "Tools",
    nav_calculator: "Calculadora de Perfiles",
    nav_catalog: "Catálogo ICHA",
    nav_back_home: "Inicio",

    // Hero - Calculator
    calc_hero_tag: "HERRAMIENTAS PARA PROYECTISTAS ESTRUCTURALES",
    calc_hero_title_prefix: "Calcular el peso",
    calc_hero_title_suffix: "de los Perfiles de Acero",
    calc_hero_desc:
      "Como proyectistas, a veces necesitamos verificar datos rápidos sin abrir el software pesado. Calcula peso, área y superficie en tiempo real de 12 tipos de perfiles estructurales.",

    // Hero - Catalog
    cat_hero_tag: "CATÁLOGO ICHA — NORMA CHILENA",
    cat_hero_title_prefix: "Catálogo de",
    cat_hero_title_suffix: "Perfiles ICHA",
    cat_hero_desc:
      "Selecciona perfiles del catálogo ICHA con todas sus propiedades mecánicas precargadas. Arma tu lista de materiales y exporta a Excel.",

    // Sections
    sect_select_type: "Selecciona el tipo de perfil",
    sect_select_series: "Selecciona la serie",
    sect_cross_section: "Sección Transversal",
    sect_dimensions: "Dimensiones",
    sect_search: "Buscar Perfil",
    sect_results: "Resultados",
    sect_properties: "Propiedades Mecánicas",
    sect_summary: "Resumen de Perfiles Seleccionados",
    sect_classification: "Clasificación por Nominal Weight",
    sect_comparator: "Comparador de Perfiles",

    // Actions & Buttons
    btn_add: "Agregar",
    btn_vs: "VS",
    btn_export: "Exportar Excel",
    btn_copy: "Copiar",
    btn_save: "Guardar",
    btn_load: "Cargar",
    btn_clear: "Limpiar",
    btn_clear_local: "Limpiar Local",

    // Inputs & Labels
    lbl_add_list: "Agregar a la Lista",
    lbl_mark: "Marca",
    lbl_len: "Largo",
    lbl_qty: "Cant.",
    lbl_search_placeholder: "Escribe para buscar... (ej: IN 20)",
    lbl_connections: "Conexiones:",

    // Results
    res_area: "Área de Sección",
    res_weight: "Peso Lineal",
    res_cover: "Área de Cobertura",
    res_total_weight: "Peso Total",

    // Table Headers
    th_mark: "Marca",
    th_qty: "Cant.",
    th_profile: "Perfil",
    th_len: "Largo",
    th_unit_weight: "Peso Unit.",
    th_total_weight: "Peso Total",

    // Classification
    cls_desc: "Descripción",
    cls_unit: "Unidad",
    cls_qty: "Cantidad",
    cls_total_steel: "Total Acero (con conexiones):",

    // Comparator
    cmp_prop: "Propiedad",
    cmp_profile_a: "Perfil A",
    cmp_profile_b: "Perfil B",
    cmp_diff: "Diferencia",

    // Messages
    msg_saved: "Lista guardada correctamente",
    msg_loaded: "Lista cargada correctamente",
    msg_cleared: "Lista borrada",
    msg_copied: "Tabla copiada al portapapeles",
    msg_added: "Perfil agregado a la lista",
    msg_added_comp: "Perfil agregado al comparador",
    msg_comp_full: "El comparador está lleno (máx 2)",
    msg_no_data: "No hay datos para exportar",

    // Reference
    ref_title: "Referencia",
    ref_density: "Densidad del acero:",
    ref_formula: "Peso = Área × 0.00785 × 100",

    // Footer
    footer_text:
      "© 2026 Andrés Gallo P. — Herramientas para Proyectistas Estructurales",

    // Excel & JS specifics
    msg_invalid_qty: "Cantidad y Largo deben ser mayores a 0",
    btn_added_state: "Agregado",
    err_invalid_profile: "Perfil inválido o con errores",
    err_load: "Error al cargar la lista",

    // Excel Headers
    excel_title: "LISTADO DE PERFILES DE ACERO",
    excel_title_catalog: "CATÁLOGO ICHA — RESUMEN DE PERFILES",
    excel_class_title: "CLASIFICACIÓN POR NOMINAL WEIGHT",
    excel_conns: "Conexiones Acero",
    excel_total_final: "TOTAL ACERO (con conexiones)",

    // Categories (Long)
    cat_light: "Estructura metálica liviana ≤ 30 kg/m",
    cat_medium: "Estructura metálica mediana 30-60 kg/m",
    cat_heavy: "Estructura metálica pesada 60-90 kg/m",
    cat_extra: "Estructura metálica extrapesada > 90 kg/m",

    // Categories (Short for Chart)
    chart_light: "Liviana ≤30",
    chart_medium: "Mediana 30-60",
    chart_heavy: "Pesada 60-90",
    chart_extra: "Extrapesada >90",
    chart_conns: "Conexiones",
    // Properties (ICHA)
    prop_weight: "Peso Lineal",
    prop_area: "Área Sección",
    prop_h: "Altura (H)",
    prop_b: "Ancho (B)",
    prop_e: "Espesor ala (e)",
    prop_t: "Espesor alma (t)",
    prop_c: "Labio (C)",
    prop_ix: "Ix",
    prop_wx: "Wx",
    prop_ix_rad: "ix",
    prop_iy: "Iy",
    prop_wy: "Wy",
    prop_iy_rad: "iy",
    prop_xy: "x=y",
    prop_x: "x",
    prop_y: "y",
    prop_X: "X (cg)",
    prop_iu: "i (eje U)",
    prop_iv: "i (eje V)",

    // JS Interaction & Search
    msg_no_results: "No se encontraron perfiles",
    msg_select_series_first:
      "Selecciona una serie y luego un perfil para ver sus propiedades",
    msg_profiles_available: "perfiles disponibles — busca o selecciona uno",
    search_placeholder_prefix: "Buscar en",
    msg_select_profile: "Selecciona un perfil primero",
    msg_confirm_clear: "¿Estás seguro de borrar toda la lista?",

    diagram_placeholder: "Selecciona un perfil",
    properties_placeholder:
      "Selecciona una serie y luego un perfil para ver sus propiedades",
  },
  en: {
    // Navigation
    nav_blog: "BLOG",
    nav_tools: "Tools",
    nav_calculator: "Profile Calculator",
    nav_catalog: "ICHA Catalog",
    nav_back_home: "Home",

    // Hero - Calculator
    calc_hero_tag: "TOOLS FOR STRUCTURAL DESIGNERS",
    calc_hero_title_prefix: "Calculate weight",
    calc_hero_title_suffix: "of Steel Profiles",
    calc_hero_desc:
      "As designers, sometimes we need to verify quick data without opening heavy software. Calculate weight, section area, and surface area in real-time for 12 structural profile types.",

    // Hero - Catalog
    cat_hero_tag: "ICHA CATALOG — CHILEAN STANDARD",
    cat_hero_title_prefix: "Catalog of",
    cat_hero_title_suffix: "ICHA Profiles",
    cat_hero_desc:
      "Select profiles from the ICHA catalog with all mechanical properties pre-loaded. Build your bill of materials and export to Excel.",

    // Sections
    sect_select_type: "Select Profile Type",
    sect_select_series: "Select Series",
    sect_cross_section: "Cross Section",
    sect_dimensions: "Dimensions",
    sect_search: "Search Profile",
    sect_results: "Results",
    sect_properties: "Mechanical Properties",
    sect_summary: "Selected Profiles Summary",
    sect_classification: "Classification by Nominal Weight",
    sect_comparator: "Profile Comparator",

    // Actions & Buttons
    btn_add: "Add",
    btn_vs: "VS",
    btn_export: "Export Excel",
    btn_copy: "Copy",
    btn_save: "Save",
    btn_load: "Load",
    btn_clear: "Clear",
    btn_clear_local: "Clear Local",

    // Inputs & Labels
    lbl_add_list: "Add to List",
    lbl_mark: "Mark",
    lbl_len: "Length",
    lbl_qty: "Qty.",
    lbl_search_placeholder: "Type to search... (e.g., IN 20)",
    lbl_connections: "Connections:",

    // Results
    res_area: "Section Area",
    res_weight: "Linear Weight",
    res_cover: "Cover Area",
    res_total_weight: "Total Weight",

    // Table Headers
    th_mark: "Mark",
    th_qty: "Qty.",
    th_profile: "Profile",
    th_len: "Length",
    th_unit_weight: "Unit Wt.",
    th_total_weight: "Total Wt.",

    // Classification
    cls_desc: "Description",
    cls_unit: "Unit",
    cls_qty: "Quantity",
    cls_total_steel: "Total Steel (w/ connections):",

    // Comparator
    cmp_prop: "Property",
    cmp_profile_a: "Profile A",
    cmp_profile_b: "Profile B",
    cmp_diff: "Difference",

    // Messages
    msg_saved: "List saved successfully",
    msg_loaded: "List loaded successfully",
    msg_cleared: "List cleared",
    msg_copied: "Table copied to clipboard",
    msg_added: "Profile added to list",
    msg_added_comp: "Profile added to comparator",
    msg_comp_full: "Comparator is full (max 2)",
    msg_no_data: "No data to export",

    // Reference
    ref_title: "Reference",
    ref_density: "Steel Density:",
    ref_formula: "Weight = Area × 0.00785 × 100",

    // Footer
    footer_text: "© 2026 Andrés Gallo P. — Tools for Structural Designers",

    // Excel & JS specifics
    msg_invalid_qty: "Quantity and Length must be greater than 0",
    btn_added_state: "Added",
    err_invalid_profile: "Invalid profile or errors present",
    err_load: "Error loading list",

    // Excel Headers
    excel_title: "STEEL PROFILES LIST",
    excel_title_catalog: "ICHA CATALOG — PROFILES SUMMARY",
    excel_class_title: "CLASSIFICATION BY NOMINAL WEIGHT",
    excel_conns: "Steel Connections",
    excel_total_final: "TOTAL STEEL (w/ connections)",

    // Categories (Long)
    cat_light: "Light Steel Structure ≤ 30 kg/m",
    cat_medium: "Medium Steel Structure 30-60 kg/m",
    cat_heavy: "Heavy Steel Structure 60-90 kg/m",
    cat_extra: "Extra Heavy Steel Structure > 90 kg/m",

    // Categories (Short for Chart)
    chart_light: "Light ≤30",
    chart_medium: "Medium 30-60",
    chart_heavy: "Heavy 60-90",
    chart_extra: "Ex. Heavy >90",
    chart_conns: "Connections",
    // Properties (ICHA)
    prop_weight: "Linear Weight",
    prop_area: "Section Area",
    prop_h: "Height (H)",
    prop_b: "Width (B)",
    prop_e: "Flange Thick. (e)",
    prop_t: "Web Thick. (t)",
    prop_c: "Lip (C)",
    prop_ix: "Ix",
    prop_wx: "Wx",
    prop_ix_rad: "ix",
    prop_iy: "Iy",
    prop_wy: "Wy",
    prop_iy_rad: "iy",
    prop_xy: "x=y",
    prop_x: "x",
    prop_y: "y",
    prop_X: "X (cg)",
    prop_iu: "i (axis U)",
    prop_iv: "i (axis V)",

    // JS Interaction & Search
    msg_no_results: "No profiles found",
    msg_select_series_first:
      "Select a series avoiding a profile to view properties",
    msg_profiles_available: "profiles available — search or select one",
    search_placeholder_prefix: "Search in",
    msg_select_profile: "Select a profile first",
    msg_confirm_clear: "Are you sure you want to clear the entire list?",

    diagram_placeholder: "Select a profile",
    properties_placeholder:
      "Select a series and then a profile to view its properties",
  },
};

let currentLang = localStorage.getItem("bim-lang") || "es";

function initLanguage() {
  updateLanguage(currentLang);
  renderLanguageButton();
}

function toggleLanguage() {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("bim-lang", currentLang);
  updateLanguage(currentLang);
  renderLanguageButton();
}

function updateLanguage(lang) {
  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      // Check if it's an input with placeholder
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.placeholder = TRANSLATIONS[lang][key];
      } else {
        el.innerText = TRANSLATIONS[lang][key];
      }
    }
  });

  // Specific updates for dynamically generated content if needed
  // (e.g. re-rendering charts or tables might be needed if they have hardcoded headers)
}

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key;
}

function renderLanguageButton() {
  // Try to find an existing container in nav
  const navContainer = document.querySelector(
    "nav .flex.items-center.justify-between",
  );
  if (!navContainer) return;

  let langBtn = document.getElementById("lang-toggle-btn");

  if (!langBtn) {
    // Create button if it doesn't exist
    langBtn = document.createElement("button");
    langBtn.id = "lang-toggle-btn";
    langBtn.className =
      "ml-4 text-sm font-bold px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-gray-700";
    langBtn.onclick = toggleLanguage;

    // Insert before the mobile menu button (if exists) or append to the right side flex container
    // We can append it to the desktop menu div
    const desktopMenu = navContainer.querySelector(".hidden.md\\:flex");
    if (desktopMenu) {
      desktopMenu.appendChild(langBtn);
    } else {
      // Fallback
      navContainer.appendChild(langBtn);
    }
  }

  langBtn.innerText = currentLang === "es" ? "🇺🇸 EN" : "🇪🇸 ES";
}

// Auto-init if DOM is ready, otherwise wait
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguage);
} else {
  initLanguage();
}
