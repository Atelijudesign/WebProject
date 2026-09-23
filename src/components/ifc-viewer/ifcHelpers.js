/**
 * Utilidades para el Visor IFC Estructural 3D
 * Manejo de propiedades, exportación CSV/JSON, geometría y mediciones
 */

// Categorías IFC Estructurales comunes y sus etiquetas amigables
export const STRUCTURAL_CATEGORIES = {
  IFCBEAM: { name: "Vigas", icon: "fa-bars", color: "#38bdf8" },
  IFCCOLUMN: { name: "Columnas", icon: "fa-grip-lines-vertical", color: "#818cf8" },
  IFCMEMBER: { name: "Arriostramientos / Diagonales", icon: "fa-slash", color: "#34d399" },
  IFCPLATE: { name: "Placas y Cartelas", icon: "fa-square", color: "#fbbf24" },
  IFCFOOTING: { name: "Fundaciones / Zapatas", icon: "fa-layer-group", color: "#f87171" },
  IFCSLAB: { name: "Losas / Radieres", icon: "fa-border-all", color: "#a78bfa" },
  IFCWALL: { name: "Muros", icon: "fa-square-full", color: "#fb923c" },
  IFCWALLSTANDARDCASE: { name: "Muros Estándar", icon: "fa-square-full", color: "#fb923c" },
  IFCROOF: { name: "Cubiertas", icon: "fa-mountain", color: "#e879f9" },
  IFCSTAIR: { name: "Escaleras", icon: "fa-stairs", color: "#f472b6" },
  IFCRAILING: { name: "Barandas", icon: "fa-grip-lines", color: "#94a3b8" },
  IFCBUILDINGELEMENTPROXY: { name: "Elementos Genéricos", icon: "fa-cube", color: "#cbd5e1" },
};

export const IFC_SEARCH_INDEX_LIMIT = 50000;
export const IFC_LOAD_TIMEOUT_MS = 120000;

export const resolvePerformanceProfile = (profile, deviceMemory, devicePixelRatio = 1) => {
  if (profile && profile !== "auto") return profile;
  const memory = Number(deviceMemory);
  if ((Number.isFinite(memory) && memory <= 4) || devicePixelRatio > 2) return "economy";
  if (Number.isFinite(memory) && memory >= 8) return "quality";
  return "balanced";
};

export const getRendererPixelRatio = (profile, devicePixelRatio = 1) => {
  const ratio = Math.max(1, Number(devicePixelRatio) || 1);
  if (profile === "economy") return Math.min(ratio, 1);
  if (profile === "quality") return Math.min(ratio, 2);
  return Math.min(ratio, 1.5);
};

export const buildQuantitySummary = (elementsList = []) => {
  const groups = new Map();
  elementsList.forEach((element) => {
    const rawType = element?.ifcType || element?.type || "IFCUNKNOWN";
    const type = String(rawType).toUpperCase();
    const current = groups.get(type) || { type, label: getCategoryMetadata(type).name, count: 0 };
    current.count += 1;
    groups.set(type, current);
  });
  return [...groups.values()].sort((left, right) => right.count - left.count);
};

export const compareQuantitySummaries = (previous = [], current = []) => {
  const before = new Map(buildQuantitySummary(previous).map((group) => [group.type, group.count]));
  const after = new Map(buildQuantitySummary(current).map((group) => [group.type, group.count]));
  return [...new Set([...before.keys(), ...after.keys()])].map((type) => {
    const previousCount = before.get(type) || 0;
    const currentCount = after.get(type) || 0;
    return { type, label: getCategoryMetadata(type).name, previousCount, currentCount, difference: currentCount - previousCount };
  }).filter((item) => item.difference !== 0).sort((left, right) => Math.abs(right.difference) - Math.abs(left.difference));
};

export const createLoadTimings = (startedAt, milestones = {}) => {
  const elapsed = (value) => Math.max(0, Math.round((value || performance.now()) - startedAt));
  return {
    engineMs: milestones.engineReady ? elapsed(milestones.engineReady) : null,
    dataReadyMs: milestones.dataReady ? elapsed(milestones.dataReady) : null,
    geometryReadyMs: milestones.geometryReady ? elapsed(milestones.geometryReady) : null,
    indexReadyMs: milestones.indexReady ? elapsed(milestones.indexReady) : null,
    totalMs: elapsed(milestones.finishedAt),
  };
};

export const exportQuantitySummaryToCsv = (elementsList, projectName = "Modelo_IFC") => {
  const rows = [["Tipo IFC", "Categoría", "Cantidad"]];
  buildQuantitySummary(elementsList).forEach((group) => rows.push([group.type, group.label, group.count]));
  const content = "\uFEFF" + rows.map((row) => row.join(",")).join("\n");
  downloadFile(content, `${projectName}_Resumen_Cantidades.csv`, "text/csv;charset=utf-8;");
};

export const getSafeIfcFileLimit = (deviceMemory) => {
  const memory = Number(deviceMemory);
  if (Number.isFinite(memory) && memory <= 2) return 45 * 1024 * 1024;
  if (Number.isFinite(memory) && memory <= 4) return 80 * 1024 * 1024;
  if (Number.isFinite(memory) && memory >= 8) return 150 * 1024 * 1024;
  return 100 * 1024 * 1024;
};

export const getFileSizeCategory = (bytes = 0) => {
  const mb = bytes / (1024 * 1024);
  if (mb <= 10) return "small";
  if (mb <= 40) return "medium";
  return "large";
};

export const estimateMemoryImpact = (fileSizeBytes = 0) => {
  const mb = fileSizeBytes / (1024 * 1024);
  const estimatedHeapMB = Math.round(mb * 2.8 + 25);
  const estimatedGpuMB = Math.round(mb * 1.5 + 15);
  return {
    fileMB: mb.toFixed(1),
    estimatedHeapMB,
    estimatedGpuMB,
    category: getFileSizeCategory(fileSizeBytes),
    recommendedProfile: mb > 40 ? "economy" : mb > 15 ? "balanced" : "quality",
  };
};

export const validateIfcHeader = async (file) => {
  if (!file || typeof file.slice !== "function") return true;
  try {
    const slice = file.slice(0, 1024);
    const text = await slice.text();
    const upper = text.toUpperCase();
    const hasIsoSignature = upper.includes("ISO-10303-21") || upper.includes("HEADER;") || upper.includes("FILE_DESCRIPTION");
    return hasIsoSignature;
  } catch {
    return true; // En caso de error al leer el slice, no bloquear
  }
};

export const validateIfcFile = (file, deviceMemory) => {
  if (!file) return { valid: false, message: "Selecciona un archivo IFC válido." };
  if (file.size === 0) {
    return { valid: false, message: "El archivo seleccionado está vacío (0 bytes)." };
  }
  if (!String(file.name || "").toLowerCase().endsWith(".ifc")) {
    return { valid: false, message: "Selecciona un archivo con extensión .ifc." };
  }
  const limit = getSafeIfcFileLimit(deviceMemory);
  if (file.size > limit) {
    const limitMb = Math.round(limit / (1024 * 1024));
    return {
      valid: false,
      limit,
      message: `El archivo supera el límite seguro de ${limitMb} MB para este dispositivo. Optimiza, divide o convierte previamente el modelo para evitar que la pestaña se quede sin memoria.`,
    };
  }
  return { valid: true, limit, category: getFileSizeCategory(file.size) };
};

/**
 * Obtiene el nombre amigable y color de una categoría IFC
 */
export const getCategoryMetadata = (ifcType) => {
  const normalizedType = String(ifcType || "").toUpperCase();
  if (STRUCTURAL_CATEGORIES[normalizedType]) {
    return STRUCTURAL_CATEGORIES[normalizedType];
  }
  return {
    name: normalizedType.replace(/^IFC/, "") || "Elemento",
    icon: "fa-cube",
    color: "#94a3b8",
  };
};

/**
 * Extrae y formatea el valor de una propiedad IFC
 */
export const extractIfcValue = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") {
    if ("value" in val) return extractIfcValue(val.value);
    if ("NominalValue" in val) return extractIfcValue(val.NominalValue);
    if ("Name" in val) return extractIfcValue(val.Name);
    return JSON.stringify(val);
  }
  return String(val);
};

/**
 * Limpia y estructura los Property Sets (Psets) de un elemento
 */
export const cleanPropertySets = (rawPsets) => {
  if (!Array.isArray(rawPsets)) return [];

  return rawPsets
    .map((pset) => {
      const psetName = extractIfcValue(pset?.Name || "Pset_General");
      const props = [];

      if (Array.isArray(pset?.HasProperties)) {
        pset.HasProperties.forEach((prop) => {
          const name = extractIfcValue(prop?.Name || "Propiedad");
          const value = extractIfcValue(prop?.NominalValue ?? prop?.value ?? prop);
          props.push({ name, value });
        });
      }

      return {
        name: psetName,
        properties: props,
      };
    })
    .filter((pset) => pset.properties.length > 0);
};

/**
 * Calcula el área de un polígono 3D usando la fórmula de Newell
 * @param {Array<{x: number, y: number, z: number}>} points
 * @returns {number} Área en m²
 */
export const calculatePolygonArea3D = (points) => {
  if (!points || points.length < 3) return 0;

  let normalX = 0;
  let normalY = 0;
  let normalZ = 0;

  const numPoints = points.length;
  for (let i = 0; i < numPoints; i++) {
    const current = points[i];
    const next = points[(i + 1) % numPoints];

    normalX += (current.y - next.y) * (current.z + next.z);
    normalY += (current.z - next.z) * (current.x + next.x);
    normalZ += (current.x - next.x) * (current.y + next.y);
  }

  const length = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
  return length * 0.5;
};

/**
 * Calcula el perímetro de un polígono 3D
 * @param {Array<{x: number, y: number, z: number}>} points
 * @returns {number} Perímetro en m
 */
export const calculatePolygonPerimeter3D = (points) => {
  if (!points || points.length < 2) return 0;

  let perimeter = 0;
  const numPoints = points.length;
  for (let i = 0; i < numPoints; i++) {
    const current = points[i];
    const next = points[(i + 1) % numPoints];
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    const dz = next.z - current.z;
    perimeter += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return perimeter;
};

/**
 * Descarga datos en el navegador como archivo (JSON o CSV)
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta un elemento individual a JSON estructurado
 */
export const exportElementToJson = (elementData) => {
  const jsonContent = JSON.stringify(elementData, null, 2);
  const filename = `IFC_Element_${elementData.expressID || "selection"}_${elementData.ifcType || "item"}.json`;
  downloadFile(jsonContent, filename, "application/json");
};

/**
 * Exporta un elemento individual a CSV
 */
export const exportElementToCsv = (elementData) => {
  const rows = [
    ["Grupo", "Propiedad", "Valor"],
    ["Identidad", "Tipo IFC", elementData.ifcType || "—"],
    ["Identidad", "Express ID", elementData.expressID || "—"],
    ["Identidad", "GlobalId", elementData.globalId || "—"],
    ["Identidad", "Nombre", elementData.name || "—"],
    ["Identidad", "Descripción", elementData.description || "—"],
    ["Identidad", "Tag", elementData.tag || "—"],
    ["Identidad", "ObjectType", elementData.objectType || "—"],
  ];

  if (Array.isArray(elementData.psets)) {
    elementData.psets.forEach((pset) => {
      pset.properties.forEach((prop) => {
        rows.push([pset.name, prop.name, `"${String(prop.value).replace(/"/g, '""')}"`]);
      });
    });
  }

  const csvContent = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
  const filename = `IFC_Element_${elementData.expressID || "selection"}.csv`;
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
};

/**
 * Exporta el inventario completo o filtrado de elementos a CSV (Cubicación / Takeoff)
 */
export const exportElementsListToCsv = (elementsList, projectName = "Modelo_IFC") => {
  const rows = [
    ["ExpressID", "Tipo IFC", "Categoría", "Nombre", "Descripción", "Tag", "GlobalId"],
  ];

  elementsList.forEach((el) => {
    rows.push([
      el.expressID,
      el.ifcType,
      el.categoryName || el.ifcType,
      `"${String(el.name || "—").replace(/"/g, '""')}"`,
      `"${String(el.description || "—").replace(/"/g, '""')}"`,
      `"${String(el.tag || "—").replace(/"/g, '""')}"`,
      el.globalId || "—",
    ]);
  });

  const csvContent = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
  const filename = `${projectName}_Cubicacion_BIM.csv`;
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
};

/**
 * Exporta el inventario completo o filtrado de elementos a JSON
 */
export const exportElementsListToJson = (elementsList, projectName = "Modelo_IFC") => {
  const data = {
    project: projectName,
    exportedAt: new Date().toISOString(),
    totalElements: elementsList.length,
    elements: elementsList,
  };
  const jsonContent = JSON.stringify(data, null, 2);
  const filename = `${projectName}_Inventario_BIM.json`;
  downloadFile(jsonContent, filename, "application/json");
};
