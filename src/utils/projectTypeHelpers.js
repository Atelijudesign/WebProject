/**
 * Metadatos y utilidades de formato para tipos de proyectos estructurales y BIM.
 * Proporciona nombres limpios, etiquetas legibles en español e inglés, iconos y colores técnicos.
 */

export const PROJECT_TYPE_METADATA = {
  "Infraestructura / Metro": {
    labelEs: "Metro Subterráneo",
    labelEn: "Subway / Underground Metro",
    shortEs: "Metro",
    shortEn: "Metro",
    icon: "fa-train-subway",
    color: "#38bdf8",
  },
  "Infraestructura / Pasarela Peatonal": {
    labelEs: "Pasarelas Peatonales",
    labelEn: "Pedestrian Walkways",
    shortEs: "Pasarelas",
    shortEn: "Walkways",
    icon: "fa-person-walking-arrow-right",
    color: "#06b6d4",
  },
  "Infraestructura / Aviación": {
    labelEs: "Aeropuertos & Aviación",
    labelEn: "Airports & Aviation",
    shortEs: "Aeropuertos",
    shortEn: "Airports",
    icon: "fa-plane-departure",
    color: "#6366f1",
  },
  "Industrial": {
    labelEs: "Plantas Industriales",
    labelEn: "Industrial Plants",
    shortEs: "Industrial",
    shortEn: "Industrial",
    icon: "fa-industry",
    color: "#10b981",
  },
  "Minería": {
    labelEs: "Minería & Procesos",
    labelEn: "Mining & Processing",
    shortEs: "Minería",
    shortEn: "Mining",
    icon: "fa-mountain",
    color: "#f59e0b",
  },
  "Edificación / Salud": {
    labelEs: "Hospitales & Salud",
    labelEn: "Hospitals & Healthcare",
    shortEs: "Salud",
    shortEn: "Healthcare",
    icon: "fa-hospital",
    color: "#ec4899",
  },
  "Edificación / Comercial": {
    labelEs: "Edificación Comercial",
    labelEn: "Commercial Buildings",
    shortEs: "Comercial",
    shortEn: "Commercial",
    icon: "fa-building",
    color: "#8b5cf6",
  },
  "Infraestructura / Ferroviario": {
    labelEs: "Infraestructura Ferroviaria",
    labelEn: "Rail Infrastructure",
    shortEs: "Ferroviario",
    shortEn: "Railway",
    icon: "fa-train",
    color: "#14b8a6",
  },
  "Infraestructura / Vial": {
    labelEs: "Infraestructura Vial",
    labelEn: "Roads & Highways",
    shortEs: "Vial",
    shortEn: "Roads",
    icon: "fa-road",
    color: "#0ea5e9",
  },
  "Infraestructura / Fronterizo": {
    labelEs: "Pasos Fronterizos",
    labelEn: "Border Crossings",
    shortEs: "Fronterizo",
    shortEn: "Border",
    icon: "fa-passport",
    color: "#a855f7",
  },
  "Energía / Hidroeléctrica": {
    labelEs: "Energía & Hidroeléctrica",
    labelEn: "Energy & Hydroelectric",
    shortEs: "Hidroeléctrica",
    shortEn: "Hydro",
    icon: "fa-bolt",
    color: "#eab308",
  },
  "Fabricación/Comercial": {
    labelEs: "Talleres & Fabricación",
    labelEn: "Fabrication & Commercial",
    shortEs: "Fabricación",
    shortEn: "Fabrication",
    icon: "fa-gears",
    color: "#f97316",
  },
  "Edificación / Industrial": {
    labelEs: "Edificación Industrial",
    labelEn: "Industrial Buildings",
    shortEs: "Edif. Industrial",
    shortEn: "Ind. Building",
    icon: "fa-warehouse",
    color: "#84cc16",
  },
  "Edificación / Municipal": {
    labelEs: "Edificación Municipal",
    labelEn: "Municipal Buildings",
    shortEs: "Municipal",
    shortEn: "Municipal",
    icon: "fa-landmark",
    color: "#06b6d4",
  },
};

/**
 * Obtiene la etiqueta amigable para un tipo de proyecto.
 * @param {string} rawType Tipo original del JSON
 * @param {boolean} isEn Si el idioma actual es inglés
 * @param {boolean} isShort Si se prefiere versión corta para badges o ejes gráficos
 * @returns {string} Etiqueta amigable
 */
export function formatProjectType(rawType, isEn = false, isShort = false) {
  if (!rawType || rawType === "Todos" || rawType === "All") {
    return isEn ? "All Sectors" : "Todos los Sectores";
  }

  const meta = PROJECT_TYPE_METADATA[rawType];
  if (meta) {
    if (isShort) {
      return isEn ? meta.shortEn : meta.shortEs;
    }
    return isEn ? meta.labelEn : meta.labelEs;
  }

  // Fallback inteligente para tipos no registrados
  if (rawType.includes("/")) {
    const parts = rawType.split("/").map((p) => p.trim());
    return parts[parts.length - 1];
  }

  return rawType;
}

/**
 * Obtiene el icono FontAwesome para un tipo de proyecto.
 * @param {string} rawType
 * @returns {string} Clase de icono FontAwesome
 */
export function getProjectTypeIcon(rawType) {
  if (!rawType || rawType === "Todos") return "fa-layer-group";
  const meta = PROJECT_TYPE_METADATA[rawType];
  return meta ? meta.icon : "fa-folder";
}

/**
 * Formatea cantidades numéricas de ingeniería (m³ de hormigón, toneladas de acero)
 * con sufijos limpios (k) para miles y preservando precisión sin ceros innecesarios.
 * @param {number|string} value Valor numérico o texto convertible
 * @param {string} unit Unidad opcional (ej: 'm³', 'Ton')
 * @returns {string} Cantidad formateada
 */
export function formatMetricQuantity(value, unit = "") {
  if (value === null || value === undefined || value === "") return unit ? `0 ${unit}` : "0";
  const num = typeof value === "number" ? value : parseFloat(value) || 0;
  if (num === 0) return unit ? `0 ${unit}` : "0";

  let formattedNum = "";
  if (num >= 1000) {
    const kVal = num / 1000;
    formattedNum = `${kVal.toFixed(1).replace(/\.0$/, "")}k`;
  } else if (num % 1 === 0) {
    formattedNum = num.toString();
  } else {
    formattedNum = num.toFixed(1).replace(/\.0$/, "");
  }

  return unit ? `${formattedNum} ${unit}` : formattedNum;
}

