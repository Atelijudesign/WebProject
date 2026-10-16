// ==============================================================================
// SCRIPT MAESTRO DE ORGANIZACIÓN DE PORTAFOLIO PROFESIONAL
// ANDRÉS GALLO P. - SENIOR STRUCTURAL BIM DESIGNER
// ==============================================================================
import fs from "fs";
import path from "path";

const TARGET_ROOT = "G:/Mi unidad/Atelijudesign/01_Profesional/PORTAFOLIO_MASTER_PROYECTOS";
const F_OFFICE    = "F:/06-A.G.P_INFO_TECNICA/02-OFFICE";
const G_BASE      = "G:/Mi unidad/Atelijudesign/01_Profesional";
const G_HIST      = path.join(G_BASE, "01.2_Trabajo_Privado/00_HISTORIAL_LABORAL");
const G_OBRAS     = path.join(G_HIST, "Portafolio_y_CV/Portafolio_Obras_Historicas");
const G_FOTOS     = path.join(G_OBRAS, "Fotos_y_Renders_Proyectos");
const WEB_IMG     = "c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/public/assets/img";
const GHD_ACT     = path.join(G_BASE, "01.2_Trabajo_Privado/GHD/02_Proyectos_Activos");

console.log("==================================================================");
console.log(" INICIANDO ENSAMBLAJE DE PORTAFOLIO MASTER DE PROYECTOS");
console.log(" Destino:", TARGET_ROOT);
console.log("==================================================================");

if (!fs.existsSync(TARGET_ROOT)) {
  fs.mkdirSync(TARGET_ROOT, { recursive: true });
}

// Helper para búsqueda recursiva de archivos con extensiones específicas
function findFilesRecursively(dir, filterRegex, maxFiles = 30) {
  const results = [];
  if (!dir || !fs.existsSync(dir)) return results;

  function traverse(currentDir) {
    if (results.length >= maxFiles) return;
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (results.length >= maxFiles) return;
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          // Evitar subcarpetas pesadas irrelevantes
          if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
            traverse(fullPath);
          }
        } else if (entry.isFile()) {
          if (filterRegex.test(entry.name)) {
            results.push(fullPath);
          }
        }
      }
    } catch (_) {}
  }

  traverse(dir);
  return results;
}

// Helper para copiar archivos de forma segura
function safeCopyFiles(sourceDirs, destDir, filterRegex, maxFiles = 30) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  let copied = 0;
  for (const src of sourceDirs) {
    if (copied >= maxFiles) break;
    if (!src || !fs.existsSync(src)) continue;

    // Si es un directorio directo
    const foundFiles = findFilesRecursively(src, filterRegex, maxFiles - copied);
    for (const file of foundFiles) {
      if (copied >= maxFiles) break;
      const fileName = path.basename(file);
      const destFile = path.join(destDir, fileName);
      if (!fs.existsSync(destFile)) {
        try {
          fs.copyFileSync(file, destFile);
          copied++;
        } catch (_) {}
      }
    }
  }
  return copied;
}

// ==============================================================================
// DEFINICIÓN DE PROYECTOS
// ==============================================================================
const PROJECTS = [
  // --- 1. GHD & MINERÍA 2026 ---
  {
    id: "P-044",
    shortName: "Puentes_Gruas_DSAL_Codelco",
    name: "Normalización Puentes Grúas Fundición Potrerillos (DSAL)",
    nameEn: "Overhead Cranes Normalization Potrerillos Smelter (DSAL)",
    client: "CODELCO Chile (División Salvador)",
    company: "GHD",
    country: "Chile",
    city: "Potrerillos, Atacama",
    year: 2026,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural",
    role: "Proyectista / Diseñador Estructural",
    roleEn: "Structural Project Designer",
    software: "AutoCAD, Detallamiento Estructural CMAA-70",
    lod: "LOD 350",
    metrics: "Nave de Fundición y Taller de Moldes, CMAA-70, ECF-7",
    description: "Ingeniería estructural para la evaluación de integridad, mapeo de hallazgos y normalización operacional de los Puentes Grúas N° 1 y N° 2 de la Nave de Fundición Potrerillos y Taller de Moldes en Codelco División Salvador. Elaboración de planos estructurales de disposición general, mapeo de grietas, refuerzos de vigas principales, testeras y consolas bajo norma CMAA-70 y estándar corporativo ECF-7.",
    descriptionEn: "Structural engineering for structural integrity assessment, defect mapping, and operational normalization of Overhead Cranes No. 1 and No. 2 at Potrerillos Smelter Aisle and Mold Shop in Codelco Salvador Division. Structural general arrangement drawings, crack mapping, box girder reinforcements, end trucks, and bracket details under CMAA-70 and Codelco ECF-7 standards.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(GHD_ACT, "12684444 - Normalización Puentes Grúas DSAL")],
    docSources: [path.join(GHD_ACT, "12684444 - Normalización Puentes Grúas DSAL")],
    imgPrefix: "codelco_dsal"
  },
  {
    id: "P-043",
    shortName: "EFE_Santiago_Batuco_OT181",
    name: "Segundo Acceso Estaciones Tramo Santiago - Batuco (OT181)",
    nameEn: "Second Access Stations Santiago - Batuco Railway (OT181)",
    client: "EFE Trenes de Chile",
    company: "GHD",
    country: "Chile",
    city: "Santiago / Batuco",
    year: 2026,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Acero",
    role: "Proyectista Estructural BIM",
    roleEn: "Structural BIM Designer",
    software: "Autodesk Revit, Navisworks, AutoCAD",
    lod: "LOD 350",
    metrics: "5 Modelos RVT Estructurales Federados, Túneles Peatonales",
    description: "Modelado y coordinación BIM multidisciplinaria para los segundos accesos peatonales de las estaciones del tramo ferroviario Santiago - Batuco de EFE Trenes de Chile. Modelado paramétrico en Revit de estructuras de hormigón armado, escaleras pedestres, rampas accesibles, marquesinas de acero y muros de contención con estricto control de interferencias.",
    descriptionEn: "Multidisciplinary BIM modeling and coordination for the secondary passenger station accesses along the Santiago - Batuco commuter rail line for EFE Trenes de Chile. Parametric Revit modeling of reinforced concrete structures, pedestrian stairs, accessible ramps, steel canopies, and retaining walls.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(GHD_ACT, "12673272-OT-181")],
    docSources: [path.join(GHD_ACT, "12673272-OT-181")],
    imgPrefix: "efe_ot181"
  },
  {
    id: "P-042",
    shortName: "Reemplazo_Centrifuga_Lodos_OT25029",
    name: "Reemplazo Centrífuga Desaguado Lodos (OT-25029)",
    nameEn: "Sludge Dewatering Centrifuge Replacement (OT-25029)",
    client: "Aguas Andinas / Minería",
    company: "GHD",
    country: "Chile",
    city: "Santiago",
    year: 2026,
    type: "Industrial",
    typeEn: "Industrial",
    material: "Acero Estructural + Hormigón",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "AutoCAD, Detallamiento Industrial",
    lod: "LOD 300",
    metrics: "Plataformas metálicas, pernos de anclaje, soporte vibratorio",
    description: "Ingeniería de detalle para el reemplazo y montaje electromecánico de la centrífuga de desaguado de lodos en planta de tratamiento. Diseño de pedestales de hormigón armado con aislamiento vibratorio y plataformas metálicas de mantenimiento.",
    descriptionEn: "Detail engineering for the replacement and electromechanical mounting of the sludge dewatering centrifuge at treatment plant. Concrete pedestal vibration isolation design and steel maintenance platforms.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(GHD_ACT, "12688063 - OT-25029")],
    docSources: [path.join(GHD_ACT, "12688063 - OT-25029")]
  },
  {
    id: "P-041",
    shortName: "Proteccion_Contra_Socavacion_12640527",
    name: "Servicio de Asesoría para Protección contra la Socavación",
    nameEn: "Scour Protection Advisory Engineering Services",
    client: "Dirección de Vialidad MOP",
    company: "GHD",
    country: "Chile",
    city: "Región Metropolitana",
    year: 2026,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Enrocados + Gaviones + Hormigón",
    role: "Proyectista / Modelador Civil Estructural",
    roleEn: "Civil Structural Modeler",
    software: "AutoCAD, Civil 3D",
    lod: "LOD 300",
    metrics: "Defensas fluviales, gaviones, espigones de protección",
    description: "Servicio de ingeniería y planimetría civil-estructural para obras de protección hidráulica contra socavación en estribos de puentes y terraplenes de acceso vial.",
    descriptionEn: "Civil-structural engineering drafting and design for hydraulic scour protection around bridge abutments and approach embankments.",
    imageSources: [WEB_IMG],
    modelSources: [
      path.join(GHD_ACT, "12640527-Servicio de asesoría para la protección contra la socavación"),
      path.join(F_OFFICE, "00-GHD/01-Proyectos/12640527 - SERVICIO DE ASESORÍA PARA LA PROTECCIÓN CONTRA SOCAVACIÓN")
    ],
    docSources: [
      path.join(GHD_ACT, "12640527-Servicio de asesoría para la protección contra la socavación"),
      path.join(F_OFFICE, "00-GHD/01-Proyectos/12640527 - SERVICIO DE ASESORÍA PARA LA PROTECCIÓN CONTRA SOCAVACIÓN")
    ]
  },
  {
    id: "P-040",
    shortName: "Garden_City_Skyway_Ontario",
    name: "Garden City Skyway Substructure & Bridge Rehabilitation",
    nameEn: "Garden City Skyway Substructure & Bridge Rehabilitation",
    client: "Ministry of Transportation of Ontario (MTO)",
    company: "GHD",
    country: "Canadá",
    city: "St. Catharines, Ontario",
    year: 2026,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Acero Estructural + Hormigón Armado",
    role: "Senior Bridge Modeler / BIM Specialist",
    roleEn: "Senior Bridge Modeler / BIM Specialist",
    software: "Revit, AutoCAD, Bridge Detailing CISC",
    lod: "LOD 350",
    metrics: "Puente Mayor 2.2 km, Vigas cajón de acero, Pilares masivos",
    description: "Ingeniería de rehabilitación y refuerzo estructural del emblemático viaducto Garden City Skyway sobre el Canal Welland en Ontario. Modelado y cubicación de placas de refuerzo de acero estructural, diafragmas, vigas cajón y cepas de hormigón armado bajo estándar canadiense MTO y CISC.",
    descriptionEn: "Structural rehabilitation and reinforcement engineering for the iconic Garden City Skyway over the Welland Canal in Ontario. Structural steel retrofit plates, diaphragms, box girders, and piers under Canadian MTO/CISC standards.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(GHD_ACT, "12593017 - Garden City Skyway")],
    docSources: [path.join(GHD_ACT, "12593017 - Garden City Skyway")]
  },

  // --- 2. BIOSMI & MINERÍA 2026 ---
  {
    id: "P-039",
    shortName: "Lavado_SX_Planta_Franke_Cenizas",
    name: "Integración Segunda Etapa Lavado SX Planta Raimundo Langlois",
    nameEn: "Second Stage SX Washing Integration Raimundo Langlois Plant",
    client: "Grupo Minero Las Cenizas",
    company: "BIOSmi",
    country: "Chile",
    city: "Taltal, Antofagasta",
    year: 2026,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural + FRP",
    role: "Lead Structural BIM Modeler",
    roleEn: "Lead Structural BIM Modeler",
    software: "Autodesk Revit, Navisworks, Advance Steel",
    lod: "LOD 350",
    metrics: "Planta SX-EW, Cañerías de lavado, Estructuras soporte",
    description: "Modelado BIM LOD 350 para la incorporación de una etapa adicional de lavado en la planta de Extracción por Solventes (SX) y Electro-Obtención (EW) en Minera Franke. Diseño de estructuras metálicas soporte, piping racks, pasarelas de operación y canaletas resistentes a corrosión ácida.",
    descriptionEn: "LOD 350 BIM modeling for additional wash stage integration at SX-EW plant (Franke Mine). Structural steel supports, pipe racks, operation walkways, and acid-resistant launders.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(G_HIST, "2026_BIOSmi/01-Proyectos/1820 - MLC - Integración Segunda Etapa Lavado SX-")],
    docSources: [path.join(G_HIST, "2026_BIOSmi/01-Proyectos/1820 - MLC - Integración Segunda Etapa Lavado SX-")]
  },
  {
    id: "P-038",
    shortName: "Planta_Lavado_Sales_SQM",
    name: "Ingeniería Básica Planta Lavado de Sales SQM",
    nameEn: "Basic Engineering Salt Washing Plant SQM",
    client: "SQM Salar",
    company: "BIOSmi",
    country: "Chile",
    city: "Salar de Atacama",
    year: 2026,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural Anticorrosivo",
    role: "Proyectista Estructural BIM",
    roleEn: "Structural BIM Designer",
    software: "Revit, AutoCAD",
    lod: "LOD 300",
    metrics: "Naves de procesos químicos, tolvas de alimentación",
    description: "Diseño y modelado civil-estructural para la nueva planta de lavado de sales de litio y potasio en faena salar. Galpones industriales, silos, tolvas y fundaciones especiales sobre terreno salino.",
    descriptionEn: "Civil-structural design and modeling for the new lithium and potassium salt wash plant at Atacama Salar. Industrial sheds, silos, hoppers, and special foundations on salt terrain.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(G_HIST, "2026_BIOSmi/01-Proyectos/1822 - SQM - Ingeniería Básica Planta Lavado de Sales")],
    docSources: [path.join(G_HIST, "2026_BIOSmi/01-Proyectos/1822 - SQM - Ingeniería Básica Planta Lavado de Sales")]
  },
  {
    id: "P-037",
    shortName: "Obras_Mayores_PSIQ",
    name: "Ingeniería de Detalles Obras Mayores Proyecto PSIQ",
    nameEn: "Detail Engineering Major Works PSIQ Project",
    client: "Compañía Minera del Pacífico (CMP)",
    company: "BIOSmi",
    country: "Chile",
    city: "Huasco / Caldera",
    year: 2026,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero + Hormigón Masivo",
    role: "Modelador Estructural Senior",
    roleEn: "Senior Structural Modeler",
    software: "Revit, Navisworks",
    lod: "LOD 350",
    metrics: "Obras portuarias, cargadores de barco, correas transportadoras",
    description: "Ingeniería de detalles civil y estructural para obras mayores e infraestructura portuaria minera de CMP. Modelado de fundaciones masivas, estructuras de transferencia de mineral y correas transportadoras.",
    descriptionEn: "Civil and structural detail engineering for port terminal and bulk material handling works at CMP. Mass concrete foundations, transfer towers, and overland conveyors.",
    imageSources: [WEB_IMG],
    modelSources: [path.join(G_HIST, "2026_BIOSmi/01-Proyectos/1750-0 - PSIQ - Ingeniería de Detalles Obras Mayores Proyecto PSIQ")],
    docSources: [path.join(G_HIST, "2026_BIOSmi/01-Proyectos/1750-0 - PSIQ - Ingeniería de Detalles Obras Mayores Proyecto PSIQ")]
  },

  // --- 3. BLACK & VEATCH 2025 ---
  {
    id: "P-035",
    shortName: "Proyecto_Santo_Domingo_BV",
    name: "Proyecto Minero Santo Domingo (Concentradora & Desaladora)",
    nameEn: "Santo Domingo Copper-Iron Mining Project (Concentrator & Desalination)",
    client: "Capstone Copper",
    company: "Black & Veatch",
    country: "Chile",
    city: "Diego de Almagro, Atacama",
    year: 2025,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural Pesado + Hormigón",
    role: "Lead Structural BIM Designer",
    roleEn: "Lead Structural BIM Designer",
    software: "Autodesk Revit, Navisworks, Tekla",
    lod: "LOD 350 / 400",
    metrics: "Planta Concentradora 60 ktpd, Molienda SAG, Espesadores",
    description: "Proyecto minero greenfield de cobre y hierro de US$ 2.300M. Liderazgo en el modelado BIM estructural de los edificios de molienda SAG y bolas, flotación, espesadores de relaves y acueducto de impulsión de agua de mar desalinizada. Generación de planos de disposición general y planos de armaduras de fundaciones masivas.",
    descriptionEn: "US$ 2.3B Greenfield copper-iron mining project. Leadership in structural BIM modeling for SAG and ball mill buildings, flotation circuits, tailings thickeners, and desalinated seawater pump stations.",
    imageSources: [G_FOTOS, WEB_IMG],
    modelSources: [path.join(G_HIST, "2025_Black & Veatch/01-Proyectos/423129 - PROYECTO SANTO DOMINGO")],
    docSources: [path.join(G_HIST, "2025_Black & Veatch/01-Proyectos/423129 - PROYECTO SANTO DOMINGO")]
  },

  // --- 4. DRA GLOBAL & ARCADIS 2024 ---
  {
    id: "P-033",
    shortName: "Chancador_Primario_Arqueros",
    name: "Chancador Primario Besalco (Proyecto Arqueros)",
    nameEn: "Besalco Primary Crusher (Arqueros Mining Project)",
    client: "Besalco Minería / Minera Arqueros",
    company: "DRA Global / Arcadis",
    country: "Chile",
    city: "Condoriaco, Coquimbo",
    year: 2024,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural Grado A572 Gr.50",
    role: "Lead 3D Structural Modeler",
    roleEn: "Lead 3D Structural Modeler",
    software: "Autodesk Revit, Tekla Structures, Navisworks",
    lod: "LOD 400",
    metrics: "Estructura soporte chancador giratorio, tolva recepción 250t",
    description: "Modelado 3D de alta precisión (LOD 400) de la estructura de acero del chancador primario, tolva de vaciado para camiones CAEX de 150t, plataformas operativas, escaleras industriales con canal C250 y conexiones soldadas y empernadas para fabricación directa en taller.",
    descriptionEn: "High-precision LOD 400 3D structural steel modeling for primary gyratory crusher, 250-ton dump hopper for 150t haul trucks, operating platforms, C250 industrial staircases, and full shop fabrication drawings.",
    imageSources: [
      path.join(G_OBRAS, "08-Chancador Primario"),
      G_FOTOS,
      WEB_IMG
    ],
    modelSources: [
      path.join(F_OFFICE, "00-Arcadis/ACL-00005507-Ing Detalles EPC Besalco"),
      path.join(F_OFFICE, "01-DRA Global/Project Files/06_3DM")
    ],
    docSources: [
      path.join(G_OBRAS, "08-Chancador Primario"),
      path.join(F_OFFICE, "00-Arcadis/ACL-00005507-Ing Detalles EPC Besalco")
    ]
  },
  {
    id: "P-032",
    shortName: "Asesoria_Minera_Caserones",
    name: "Asesoría de Ingeniería y Refuerzos Mina Caserones",
    nameEn: "Caserones Copper Mine Structural Advisory & Retrofit",
    client: "SCM Minera Lumina Copper Chile",
    company: "Arcadis",
    country: "Chile",
    city: "Copiapó, Atacama (4.300 msnm)",
    year: 2024,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural Pesado",
    role: "Proyectista Estructural Senior",
    roleEn: "Senior Structural Designer",
    software: "AutoCAD, Detallamiento de Refuerzos",
    lod: "LOD 300",
    metrics: "Refuerzos tolvas, galpones de acopio, perfiles armados",
    description: "Servicios de consultoría y diseño estructural para refuerzos de naves industriales, racks de cañerías y tolvas de mineral en alta montaña (4.300 msnm) bajo extremas cargas sísmicas y de nieve.",
    descriptionEn: "Structural engineering consultancy and retrofit design for industrial sheds, heavy pipe racks, and ore chutes at extreme high altitude (4,300 masl) under high seismic and snow loads.",
    imageSources: [path.join(F_OFFICE, "09-Arcadis/4896 - Asesoria Caserones"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "09-Arcadis/4896 - Asesoria Caserones")],
    docSources: [path.join(F_OFFICE, "09-Arcadis/4896 - Asesoria Caserones")]
  },
  {
    id: "P-031",
    shortName: "BHP_Spence_Remediacion",
    name: "Remediación y Obras Civiles Mina Spence",
    nameEn: "Spence Copper Mine Remediation & Civil Works",
    client: "BHP Minerals",
    company: "Arcadis",
    country: "Chile",
    city: "Sierra Gorda, Antofagasta",
    year: 2024,
    type: "Minería",
    typeEn: "Mining",
    material: "Hormigón Armado + Acero",
    role: "Proyectista Civil Estructural",
    roleEn: "Civil Structural Designer",
    software: "AutoCAD, Civil 3D",
    lod: "LOD 300",
    metrics: "Canaletas de relave, diques de contención, losas de bombeo",
    description: "Desarrollo de planos de construcción para obras de remediación ambiental, canaletas de conducción de relaves ODS 007 e infraestructura de captación superficial en faena minera Spence.",
    descriptionEn: "Construction drawing package for environmental remediation works, tailings launders ODS 007, and surface drainage infrastructure at BHP Spence.",
    imageSources: [path.join(F_OFFICE, "09-Arcadis/5510 Spence"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "09-Arcadis/5510 Spence")],
    docSources: [path.join(F_OFFICE, "09-Arcadis/5510 Spence")]
  },
  {
    id: "P-030",
    shortName: "BHP_Antamina_Obras_Civiles",
    name: "Compañía Minera Antamina - Obras Civiles",
    nameEn: "Compañía Minera Antamina - Civil Infrastructure",
    client: "Antamina / BHP / Glencore",
    company: "Arcadis",
    country: "Perú",
    city: "Huari, Ancash",
    year: 2024,
    type: "Minería",
    typeEn: "Mining",
    material: "Hormigón Armado",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "AutoCAD, Civil 3D",
    lod: "LOD 300",
    metrics: "Cajas de traspaso, drenajes industriales, losas masivas",
    description: "Ingeniería de detalle para obras civiles e hidráulicas en el complejo minero Antamina en Perú. Planimetría de fundaciones, muros de contención y sumideros de alta resistencia a la abrasión.",
    descriptionEn: "Detail civil and hydraulic engineering drawings for Antamina copper-zinc mine in Peru. Abrasion-resistant sumps, massive foundations, and retaining walls.",
    imageSources: [path.join(F_OFFICE, "00-Arcadis/01-Proyectos/5469 BHP Antamina"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "00-Arcadis/01-Proyectos/5469 BHP Antamina")],
    docSources: [path.join(F_OFFICE, "00-Arcadis/01-Proyectos/5469 BHP Antamina")]
  },
  {
    id: "P-029",
    shortName: "Anglo_American_Quellaveco",
    name: "Anglo American Quellaveco (Descarga Norte, Estribo Norte, Canal Sur)",
    nameEn: "Anglo American Quellaveco (North Discharge, North Abutment, South Canal)",
    client: "Anglo American / Fluor",
    company: "Arcadis",
    country: "Perú",
    city: "Moquegua",
    year: 2024,
    type: "Minería",
    typeEn: "Mining",
    material: "Hormigón Masivo + Acero Estructural",
    role: "Proyectista Estructural BIM",
    roleEn: "Structural BIM Designer",
    software: "AutoCAD, Revit, Modelado 3D de Estribos",
    lod: "LOD 350",
    metrics: "Estructuras hidráulicas masivas, túneles, canales de desvío",
    description: "Mega proyecto minero Quellaveco. Planimetría y modelado estructural de las obras de descarga norte, estribos de apoyo del canal de desvío del Río Asana y canal sur. Obras críticas de protección hidráulica para permitir la explotación del tajo abierto.",
    descriptionEn: "Mega copper project Quellaveco. Structural modeling and civil detailing for North Discharge, Asana River diversion canal North Abutment, and South Canal. Critical river diversion infrastructure.",
    imageSources: [
      path.join(F_OFFICE, "09-Arcadis/5123 - Quellaveco - Descarga Norte"),
      path.join(F_OFFICE, "09-Arcadis/5123 - Quellaveco - Estribo Norte"),
      G_FOTOS
    ],
    modelSources: [
      path.join(F_OFFICE, "09-Arcadis/5123 - Quellaveco - Descarga Norte"),
      path.join(F_OFFICE, "09-Arcadis/5123 - Quellaveco - Estribo Norte")
    ],
    docSources: [
      path.join(F_OFFICE, "09-Arcadis/5123 - Quellaveco - Descarga Norte"),
      path.join(F_OFFICE, "09-Arcadis/5123 - Quellaveco - Estribo Norte")
    ]
  },
  {
    id: "P-028",
    shortName: "Aeropuerto_El_Tepual_Puerto_Montt",
    name: "Ampliación Aeropuerto El Tepual de Puerto Montt",
    nameEn: "El Tepual International Airport Expansion Puerto Montt",
    client: "Dirección de Aeropuertos MOP",
    company: "Arcadis",
    country: "Chile",
    city: "Puerto Montt, Los Lagos",
    year: 2024,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Acero Estructural + Hormigón",
    role: "Proyectista Estructural BIM",
    roleEn: "Structural BIM Designer",
    software: "Revit, AutoCAD, Navisworks",
    lod: "LOD 350",
    metrics: "Nuevo terminal de pasajeros, puentes de embarque, 30 modelos 3D",
    description: "Proyecto de ampliación y modernización del terminal de pasajeros del Aeropuerto El Tepual. Modelado BIM de estructuras de acero para salas de embarque, puentes de conexión aeronáutica y fundaciones aisladas sobre suelo blando.",
    descriptionEn: "Passenger terminal expansion and modernization for El Tepual Airport. Structural steel BIM modeling for boarding lounges, jet bridge connectors, and foundation engineering.",
    imageSources: [path.join(F_OFFICE, "09-Arcadis/5291 - Aeropuerto El Tepual"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "09-Arcadis/5291 - Aeropuerto El Tepual")],
    docSources: [path.join(F_OFFICE, "09-Arcadis/5291 - Aeropuerto El Tepual")]
  },

  // --- 5. AFRY & INDUSTRIA CELULOSA 2022-2024 ---
  {
    id: "P-025",
    shortName: "Maquina_Papelera_MP05_Absormex",
    name: "Máquina Papelera MP05 ABSORMEX",
    nameEn: "MP05 Tissue Paper Machine ABSORMEX",
    client: "ABSORMEX / High Life Tissue",
    company: "AFRY",
    country: "México",
    city: "Altamira, Tamaulipas",
    year: 2023,
    type: "Industrial",
    typeEn: "Industrial",
    material: "Acero Estructural Grado A36 / A572",
    role: "Lead Structural BIM Modeler",
    roleEn: "Lead Structural BIM Modeler",
    software: "Autodesk Revit, Navisworks, BIM 360",
    lod: "LOD 350 / 400",
    metrics: "Nave de 10 hectáreas, 8.000 m² de plataformas, 26 modelos RVT",
    description: "Ingeniería de detalle y modelado BIM estructural completo para la nueva planta de fabricación de papel tissue MP05 en el Puerto Industrial de Altamira. Modelado paramétrico de estructuras de acero en áreas de Conversión, Jumbos, Producto Terminado y Descarga. Coordinación interdisciplinaria con equipos mecánicos y piping para cero interferencias.",
    descriptionEn: "Detail engineering and full structural BIM modeling for the new MP05 tissue paper manufacturing plant at Altamira Industrial Port. Parametric Revit steel modeling across Conversion, Jumbo roll storage, Finished product, and Unloading areas.",
    imageSources: [
      path.join(G_OBRAS, "07-Maquina Papelera MP5"),
      path.join(F_OFFICE, "00-Afry/00-2022/Abosrmex Projects"),
      G_FOTOS,
      WEB_IMG
    ],
    modelSources: [path.join(F_OFFICE, "00-Afry/00-2022/Abosrmex Projects")],
    docSources: [path.join(F_OFFICE, "00-Afry/00-2022/Abosrmex Projects")]
  },
  {
    id: "P-024",
    shortName: "CMPC_Santa_Fe_y_Laja",
    name: "Modernización Plantas CMPC Santa Fe & Laja",
    nameEn: "CMPC Santa Fe & Laja Pulp Mills Modernization",
    client: "CMPC Pulp",
    company: "AFRY",
    country: "Chile",
    city: "Nacimiento / Laja, Biobío",
    year: 2023,
    type: "Industrial",
    typeEn: "Industrial",
    material: "Acero Estructural + Hormigón",
    role: "Proyectista Estructural Senior",
    roleEn: "Senior Structural Designer",
    software: "Revit, AutoCAD, Navisworks",
    lod: "LOD 350",
    metrics: "Pipe racks de proceso, calderas de biomasa, torres de blanqueo",
    description: "Modelado y planimetría estructural para modernización de líneas de producción de celulosa en plantas Santa Fe y Laja. Racks de cañerías pesadas, plataformas para intercambiadores de calor y refuerzos de fundaciones.",
    descriptionEn: "Structural modeling and drawings for pulp production modernization at Santa Fe and Laja mills. Heavy pipe racks, heat exchanger support platforms, and foundation retrofits.",
    imageSources: [path.join(F_OFFICE, "00-Afry/00-2022/CMPC Projects"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "00-Afry/00-2022/CMPC Projects")],
    docSources: [path.join(F_OFFICE, "00-Afry/00-2022/CMPC Projects")]
  },
  {
    id: "P-023",
    shortName: "Montes_del_Plata_Depurador",
    name: "Depurador Secundario Planta Montes del Plata",
    nameEn: "Secondary Scrubber Montes del Plata Pulp Mill",
    client: "Montes del Plata (Stora Enso / Arauco)",
    company: "AFRY",
    country: "Uruguay",
    city: "Punta Pereira, Colonia",
    year: 2023,
    type: "Industrial",
    typeEn: "Industrial",
    material: "Acero Inoxidable / Estructural",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "Revit, AutoCAD",
    lod: "LOD 350",
    metrics: "Torre de lavado de gases, conductos de evacuación",
    description: "Diseño y modelado estructural de la torre soporte del nuevo depurador secundario a primario en la planta de celulosa Montes del Plata en Uruguay. Cumplimiento de normas de resistencia ambiental marina y eólica extrema.",
    descriptionEn: "Structural design and modeling for gas scrubber support tower at Montes del Plata pulp mill in Uruguay. Engineered for harsh marine corrosive and wind environments.",
    imageSources: [path.join(F_OFFICE, "00-Afry/00-2022/MDP Projects"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "00-Afry/00-2022/MDP Projects")],
    docSources: [path.join(F_OFFICE, "00-Afry/00-2022/MDP Projects")]
  },

  // --- 6. SINCAL & PUENTES 2020-2021 ---
  {
    id: "P-021",
    shortName: "Puente_Rapel_G102",
    name: "Ingeniería de Puentes: Puente Rapel (G-102)",
    nameEn: "Bridge Engineering: Rapel Bridge (G-102)",
    client: "Dirección de Vialidad MOP",
    company: "SINCAL",
    country: "Chile",
    city: "Navidad / Litueche, O'Higgins",
    year: 2021,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Postensado + Vigas Metálicas",
    role: "Proyectista Estructural de Puentes",
    roleEn: "Bridge Structural Designer",
    software: "AutoCAD, Detallamiento de Puentes MOP",
    lod: "LOD 300",
    metrics: "149 imágenes, 41 planos DWG, vigas cajón, cepas en lecho fluvial",
    description: "Ingeniería de detalle estructural para el puente mayor sobre el Río Rapel. Planimetría completa de armaduras de cepas, estribos, pilotes de fundación profunda y tablero mixto con vigas de acero postensadas.",
    descriptionEn: "Detail bridge engineering for the Rapel River bridge. Complete reinforcement detailing for piers, abutments, deep drilled shaft piles, and composite steel girder deck.",
    imageSources: [path.join(F_OFFICE, "00-SINCAL/G-102 Puente Rapel"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "00-SINCAL/G-102 Puente Rapel")],
    docSources: [path.join(F_OFFICE, "00-SINCAL/G-102 Puente Rapel")]
  },
  {
    id: "P-020",
    shortName: "Ruta5_Temuco_Rio_Bueno_G88",
    name: "Ruta 5 Tramo Temuco - Río Bueno (G-88)",
    nameEn: "Route 5 Highway Temuco - Río Bueno Section (G-88)",
    client: "Sociedad Concesionaria Ruta de los Ríos",
    company: "SINCAL",
    country: "Chile",
    city: "Región de Los Ríos",
    year: 2021,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Prefabricado",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "AutoCAD, Civil 3D, Revit",
    lod: "LOD 300",
    metrics: "Pasos superiores, alcantarillas tipo cajón, defensas camineras",
    description: "Planimetría estructural y cubicaciones para enlaces, pasos sobre nivel y estructuras de drenaje mayor a lo largo de la concesión vial Ruta 5 Sur.",
    descriptionEn: "Structural drawing sets and quantity takeoffs for grade separations, overpasses, and box culverts along Route 5 South highway.",
    imageSources: [G_FOTOS],
    modelSources: [path.join(F_OFFICE, "00-SINCAL/G-88 Ruta 5 Temuco Rio Bueno")],
    docSources: [path.join(F_OFFICE, "00-SINCAL/G-88 Ruta 5 Temuco Rio Bueno")]
  },
  {
    id: "P-019",
    shortName: "Pasarelas_Peatonales_Maule_G97",
    name: "Pasarelas Peatonales Ruta 5 Maule (Longaví, Copihue, Gaona)",
    nameEn: "Pedestrian Overpasses Route 5 Maule (Longaví, Copihue, Gaona)",
    client: "Ruta del Maule / MOP",
    company: "SINCAL",
    country: "Chile",
    city: "Maule (Longaví, Retiro, Linares)",
    year: 2021,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Pasarelas Metálicas",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "AutoCAD, Detallamiento Normativo",
    lod: "LOD 300",
    metrics: "3 Pasarelas peatonales accesibles, rampas helicoidales",
    description: "Diseño estructural y desarrollo de planos para pasarelas peatonales con rampas de acceso universal sobre la Autopista Ruta 5 Sur en las localidades de Longaví, Copihue y Gaona.",
    descriptionEn: "Structural design and plan drafting for universal accessibility pedestrian bridges with switchback ramps over Route 5 South at Longaví, Copihue, and Gaona.",
    imageSources: [path.join(F_OFFICE, "00-SINCAL/G-97 Puentes Maule"), G_FOTOS],
    modelSources: [path.join(F_OFFICE, "00-SINCAL/G-97 Puentes Maule")],
    docSources: [path.join(F_OFFICE, "00-SINCAL/G-97 Puentes Maule")]
  },

  // --- 7. CJV & AEROPUERTO AMB 2018-2019 ---
  {
    id: "P-018",
    shortName: "Aeropuerto_AMB_Terminal_2_CJV",
    name: "Nuevo Aeropuerto Internacional Pudahuel AMB (Terminal 2 & Espigones)",
    nameEn: "Arturo Merino Benítez International Airport Expansion (Terminal 2 & Piers)",
    client: "Nuevo Pudahuel / MOP",
    company: "VCGP - ASTALDI (CJV Construction)",
    country: "Chile",
    city: "Santiago, Pudahuel",
    year: 2018,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Acero Estructural + Postensado",
    role: "Coordinador & Modelador BIM Estructural Senior",
    roleEn: "Senior Structural BIM Modeler & Coordinator",
    software: "Autodesk Revit, Navisworks Manage, Tekla, AutoCAD",
    lod: "LOD 350 / 400",
    metrics: "320.000 m², US$ 900M, 4 Espigones, 217 fotos de obra, 42 modelos 3D",
    description: "Mega proyecto de infraestructura de transporte aéreo más grande de Chile. Coordinación espacial BIM y modelado estructural de los edificios Terminal 2 (T2M), Espigones C, D, E y F, pasarelas de conexión y edificios de estacionamientos. Detección y resolución de miles de interferencias con redes MEP y equipamiento aeroportuario (BHS, Puentes de Embarque).",
    descriptionEn: "Chile's largest airport infrastructure expansion project (320,000 m²). Spatial BIM coordination and structural modeling for Terminal 2 Processor (T2M), Piers C, D, E, F, connectors, and multi-level parking garages. Clash mitigation with MEP and airport Baggage Handling Systems.",
    imageSources: [
      path.join(G_OBRAS, "01-Proyecto Aeropuerto arturo merino benites"),
      path.join(F_OFFICE, "06-SCL-CJV/2018/01-TRABAJOS"),
      G_FOTOS,
      WEB_IMG
    ],
    modelSources: [
      path.join(F_OFFICE, "06-SCL-CJV/2018/01-TRABAJOS"),
      path.join(G_OBRAS, "O0015 Aeropuerto AMB")
    ],
    docSources: [
      path.join(F_OFFICE, "06-SCL-CJV/2018/01-TRABAJOS"),
      path.join(G_OBRAS, "01-Proyecto Aeropuerto arturo merino benites")
    ]
  },
  {
    id: "P-016",
    shortName: "Viaducto_El_Salto_OHL",
    name: "Viaducto El Salto & Pasos Superiores OHL",
    nameEn: "El Salto Viaduct & Highway Overpasses OHL",
    client: "Sacyr / OHL Concesiones",
    company: "OHL",
    country: "Chile",
    city: "Santiago, Huechuraba",
    year: 2018,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado Postensado + Vigas Prefabricadas",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "AutoCAD, Modelado 3D de Estructuras Viales",
    lod: "LOD 300",
    metrics: "Viaducto de gran gálibo, vigas postensadas de 40m",
    description: "Desarrollo de planos estructurales de construcción para el viaducto El Salto en la autopista Américo Vespucio Oriente (AVO) y pasos superiores. Planimetría de encepados, cepas de gran altura y losas de tablero.",
    descriptionEn: "Construction drawings for El Salto highway viaduct on AVO urban tollway and grade separations. Detailing of deep pier caps, tall columns, and post-tensioned bridge decks.",
    imageSources: [
      path.join(G_OBRAS, "Viaducto el Salto (Sacyr)"),
      G_FOTOS
    ],
    modelSources: [path.join(F_OFFICE, "05-OHL/OHL-TRABAJOS/MODELO 3D")],
    docSources: [path.join(F_OFFICE, "05-OHL")]
  },

  // --- 8. SIRVE & EDIFICACIÓN EN SALUD 2015-2017 ---
  {
    id: "P-015",
    shortName: "Hospital_Felix_Bulnes",
    name: "Hospital Clínico Félix Bulnes (Aislación Sísmica)",
    nameEn: "Félix Bulnes Clinical Hospital (Seismic Isolation)",
    client: "Ministerio de Salud / Astaldi Concesiones",
    company: "SIRVE",
    country: "Chile",
    city: "Cerro Navia, Santiago",
    year: 2016,
    type: "Salud",
    typeEn: "Healthcare",
    material: "Hormigón Armado + Disipadores Sísmicos Elastoméricos",
    role: "Proyectista Estructural Senior Especialista en Aislación",
    roleEn: "Senior Structural Seismic Isolation Designer",
    software: "AutoCAD, Revit, Detallamiento Sísmico",
    lod: "LOD 350",
    metrics: "125.000 m², 500+ fotos de obra, 250+ aisladores elastoméricos",
    description: "Complejo hospitalario de alta complejidad de 125.000 m² dotado de tecnología de aislación sísmica basal con aisladores elastoméricos y deslizadores friccionales. Planimetría de detalle de capiteles de aislación, juntas de dilatación sísmica de 60 cm, muros cortantes y losas postensadas.",
    descriptionEn: "High-complexity 125,000 m² hospital facility equipped with base seismic isolation technology (elastomeric bearings and flat sliders). Structural shop drawings for isolation pedestals, 60 cm seismic expansion joints, and post-tensioned slabs.",
    imageSources: [
      path.join(G_OBRAS, "03-Hospital Felix Bulnes"),
      path.join(F_OFFICE, "02-SIRVE/2015-2017/01-15-120-NYN_EM_HOSP_FELIX_BULNES"),
      G_FOTOS,
      WEB_IMG
    ],
    modelSources: [path.join(F_OFFICE, "02-SIRVE/2015-2017/01-15-120-NYN_EM_HOSP_FELIX_BULNES")],
    docSources: [
      path.join(G_OBRAS, "03-Hospital Felix Bulnes"),
      path.join(F_OFFICE, "02-SIRVE/2015-2017/01-15-120-NYN_EM_HOSP_FELIX_BULNES")
    ]
  },
  {
    id: "P-014",
    shortName: "Paso_Fronterizo_Los_Libertadores",
    name: "Nuevo Complejo Fronterizo Los Libertadores (3.200 msnm)",
    nameEn: "Los Libertadores Border Control Complex (3,200 masl)",
    client: "Ministerio del Interior / MOP",
    company: "SIRVE",
    country: "Chile",
    city: "Paso Los Libertadores, Los Andes",
    year: 2016,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Acero Estructural + Aislación Sísmica",
    role: "Proyectista Estructural Senior",
    roleEn: "Senior Structural Designer",
    software: "Revit, Tekla Structures, AutoCAD",
    lod: "LOD 350 / 400",
    metrics: "35.000 m², 14.000+ archivos, 462 fotos, 86 modelos 3D",
    description: "Edificio de control fronterizo internacional en plena Cordillera de los Andes a 3.200 metros sobre el nivel del mar. Estructuras preparadas para sobrecargas extremas de avalanchas de nieve (hasta 2.000 kg/m²), sismos severos y vientos cordilleranos. Aislación sísmica basal y cubierta metálica de grandes luces.",
    descriptionEn: "International border control complex in the Andes Mountains at 3,200 meters above sea level. Designed for extreme snow avalanche loads (up to 2,000 kg/m²), severe earthquakes, and mountain winds. Base isolated with large-span steel roof structure.",
    imageSources: [
      path.join(G_OBRAS, "02- Proyecto Paso fronterizo los libertadores"),
      path.join(F_OFFICE, "02-SIRVE/2015-2017/02-15-009-IIM_CEE_PASO_LIBERTADORES"),
      G_FOTOS,
      WEB_IMG
    ],
    modelSources: [path.join(F_OFFICE, "02-SIRVE/2015-2017/02-15-009-IIM_CEE_PASO_LIBERTADORES")],
    docSources: [
      path.join(G_OBRAS, "02- Proyecto Paso fronterizo los libertadores"),
      path.join(F_OFFICE, "02-SIRVE/2015-2017/02-15-009-IIM_CEE_PASO_LIBERTADORES")
    ]
  },
  {
    id: "P-013",
    shortName: "Hospital_Provincial_Marga_Marga",
    name: "Hospital Provincial Marga Marga",
    nameEn: "Marga Marga Provincial Hospital",
    client: "Servicio de Salud Viña del Mar - Quillota",
    company: "SIRVE",
    country: "Chile",
    city: "Villa Alemana, Valparaíso",
    year: 2017,
    type: "Salud",
    typeEn: "Healthcare",
    material: "Hormigón Armado + Sistema Aislación Sísmica",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "Revit, AutoCAD",
    lod: "LOD 350",
    metrics: "75.000 m², 282 aisladores sísmicos, 392 planos y documentos",
    description: "Recinto hospitalario de 75.000 m² con 9 niveles. Modelado estructural de muros de corte, columnas reforzadas, pedestales de aislación elastomérica y losas de entrepiso bajo estricta normativa de diseño sísmico hospitalario NCh433 y NCh2745.",
    descriptionEn: "75,000 m² hospital facility across 9 levels. Structural modeling of shear walls, reinforced columns, elastomeric isolation pedestals, and floor slabs under Chilean seismic hospital codes NCh433 and NCh2745.",
    imageSources: [
      path.join(G_OBRAS, "04-Hospital Marga Marga"),
      path.join(F_OFFICE, "02-SIRVE/2019/18003--HOSPITAL PROVINCIAL MARGA MARGA"),
      G_FOTOS,
      WEB_IMG
    ],
    modelSources: [path.join(F_OFFICE, "02-SIRVE/2019/18003--HOSPITAL PROVINCIAL MARGA MARGA")],
    docSources: [
      path.join(G_OBRAS, "04-Hospital Marga Marga"),
      path.join(F_OFFICE, "02-SIRVE/2019/18003--HOSPITAL PROVINCIAL MARGA MARGA")
    ]
  },

  // --- 9. TYPSA & METRO DE SANTIAGO 2014 ---
  {
    id: "P-009",
    shortName: "Metro_L3_Talleres_y_Cocheras",
    name: "Metro de Santiago Línea 3 (Talleres y Cocheras Los Libertadores)",
    nameEn: "Santiago Metro Line 3 (Los Libertadores Maintenance Depot & Yards)",
    client: "Metro de Santiago S.A.",
    company: "TYPSA",
    country: "Chile",
    city: "Quilicura, Santiago",
    year: 2014,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Estructuras Metálicas",
    role: "Proyectista Estructural Civil",
    roleEn: "Civil Structural Designer",
    software: "AutoCAD, Detallamiento de Estructuras Metro",
    lod: "LOD 300",
    metrics: "Máquina Lavado L3-359, Casetas L3-362, Tracción L3-363, Compresores L3-368",
    description: "Ingeniería de detalle civil y estructural para los recintos del taller de mantenimiento de trenes de la Línea 3 del Metro de Santiago. Planimetría de fosas de lavado, subestaciones eléctricas de tracción, casetas de seguridad y galpones de compresores.",
    descriptionEn: "Civil and structural detail engineering for train maintenance yard facilities on Santiago Metro Line 3. Train wash pits, traction electrical substations, security booths, and compressor sheds.",
    imageSources: [G_FOTOS, WEB_IMG],
    modelSources: [path.join(G_HIST, "2014_Typsa/L3-359_MAQUINA_LAVADO")],
    docSources: [path.join(G_HIST, "2014_Typsa/L3-359_MAQUINA_LAVADO")]
  },
  {
    id: "P-008",
    shortName: "Metro_L6_Bodegas_y_Compresores",
    name: "Metro de Santiago Línea 6 (Talleres y Edificios Técnicos Cerrillos)",
    nameEn: "Santiago Metro Line 6 (Cerrillos Yards & Technical Buildings)",
    client: "Metro de Santiago S.A.",
    company: "TYPSA",
    country: "Chile",
    city: "Cerrillos, Santiago",
    year: 2014,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Hormigón Armado + Albañilería Armada",
    role: "Proyectista Estructural",
    roleEn: "Structural Designer",
    software: "AutoCAD",
    lod: "LOD 300",
    metrics: "Bodega Residuos L6-860, Sala Compresores L6-868, Lubricantes L6-869",
    description: "Desarrollo de planos para los edificios auxiliares y salas técnicas de la estación terminal y talleres Cerrillos de la Línea 6 del Metro de Santiago.",
    descriptionEn: "Structural plan drafting for auxiliary service buildings and technical equipment rooms at Cerrillos terminus depot for Santiago Metro Line 6.",
    imageSources: [G_FOTOS, WEB_IMG],
    modelSources: [path.join(G_HIST, "2014_Typsa/L6-860-Bodega_Residuos_Peligrosos")],
    docSources: [path.join(G_HIST, "2014_Typsa/L6-860-Bodega_Residuos_Peligrosos")]
  },
  {
    id: "P-007",
    shortName: "Hidroelectrico_Los_Condores",
    name: "Proyecto Hidroeléctrico Los Cóndores (OH1737)",
    nameEn: "Los Cóndores Hydroelectric Power Plant Project (OH1737)",
    client: "ENEL Generación Chile",
    company: "TYPSA",
    country: "Chile",
    city: "San Clemente, Maule",
    year: 2014,
    type: "Energía",
    typeEn: "Energy",
    material: "Hormigón Masivo Hidráulico + Blindaje Acero",
    role: "Proyectista Estructural Hidráulico",
    roleEn: "Hydraulic Structural Designer",
    software: "AutoCAD, Civil 3D",
    lod: "LOD 300",
    metrics: "150 MW de potencia, caverna de máquinas subterránea, túneles",
    description: "Central hidroeléctrica de pasada subterránea de 150 MW. Planimetría de obras civiles de toma de agua, blindaje de pique vertical de presión, caverna de máquinas y canal de descarga en roca profunda.",
    descriptionEn: "150 MW underground run-of-river hydroelectric project. Structural drafting for water intake works, steel-lined vertical pressure shaft, cavern powerhouse, and tailrace tunnel.",
    imageSources: [G_FOTOS, WEB_IMG],
    modelSources: [path.join(G_HIST, "2014_Typsa/OH1737-PROYECTO HIDROELECTRICO LOS CONDORES")],
    docSources: [path.join(G_HIST, "2014_Typsa/OH1737-PROYECTO HIDROELECTRICO LOS CONDORES")]
  },

  // --- 10. ARRIGONI & ACERO ESTRUCTURAL 2012-2014 ---
  {
    id: "P-004",
    shortName: "Minera_Sierra_Gorda_Arrigoni",
    name: "Estructuras de Acero Minera Sierra Gorda (C0028)",
    nameEn: "Structural Steel Fabrication Sierra Gorda Copper Mine (C0028)",
    client: "Sierra Gorda SCM / KGHM",
    company: "Arrigoni Metalúrgica",
    country: "Chile",
    city: "Sierra Gorda, Antofagasta",
    year: 2013,
    type: "Minería",
    typeEn: "Mining",
    material: "Acero Estructural Pesado ASTM A572 / A36",
    role: "Detallador Estructural Tekla Structures",
    roleEn: "Tekla Structures Steel Detailer",
    software: "Tekla Structures, FabTrol, AutoCAD",
    lod: "LOD 400",
    metrics: "497 fotos de fabricación y montaje, +15.000 ton de acero",
    description: "Modelado y detallamiento de fabricación (LOD 400) para las estructuras de acero de la concentradora Sierra Gorda. Planos de taller de vigas armadas, celosías, columnas cajón, placas de conexión de momento y listas de despacho CNC para maestranza.",
    descriptionEn: "Shop detailing and fabrication modeling (LOD 400) for structural steel at Sierra Gorda copper concentrator. Fabrication shop drawings for built-up plate girders, box columns, moment connections, and CNC files.",
    imageSources: [path.join(G_OBRAS, "C0028 Sierra Gorda"), G_FOTOS],
    modelSources: [
      path.join(F_OFFICE, "04-ARRIGONI/C0125-05"),
      path.join(F_OFFICE, "04-ARRIGONI/C0125-09")
    ],
    docSources: [path.join(F_OFFICE, "04-ARRIGONI/Fabtrol")]
  },
  {
    id: "P-003",
    shortName: "Planta_Industrial_Quimetal",
    name: "Ingeniería de Detalles Galpones Industriales Quimetal",
    nameEn: "Detail Engineering Quimetal Chemical Industrial Plants",
    client: "Quimetal Industrial S.A.",
    company: "FUSI",
    country: "Chile",
    city: "Maipú, Santiago",
    year: 2010,
    type: "Industrial",
    typeEn: "Industrial",
    material: "Acero Estructural",
    role: "Modelador y Detallador de Acero",
    roleEn: "Steel Detailer and Modeler",
    software: "Revit, Tekla Structures, AutoCAD",
    lod: "LOD 400",
    metrics: "24 archivos de planos, galpones de almacenamiento químico",
    description: "Modelado y detallamiento completo de galpones industriales de acero estructural para Quimetal. Generación de planos de montaje, detalles de nudos viga-columna y anclajes resistentes a vapores químicos.",
    descriptionEn: "Full structural steel warehouse modeling and fabrication detailing for Quimetal chemical plant. Erection drawings, beam-column connection details, and chemical-resistant base plates.",
    imageSources: [path.join(G_OBRAS, "06-QUIMETAL"), G_FOTOS],
    modelSources: [path.join(G_OBRAS, "06-QUIMETAL")],
    docSources: [path.join(G_OBRAS, "06-QUIMETAL")]
  },
  {
    id: "P-002",
    shortName: "Puentes_Viales_Historicos_Arrigoni",
    name: "Colección de Puentes Viales (Laja, Río Bueno, Santa Elvira, Llacolén)",
    nameEn: "Highway Bridges Collection (Laja, Río Bueno, Santa Elvira, Llacolén)",
    client: "Dirección de Vialidad MOP",
    company: "Arrigoni / JQ Proyectos",
    country: "Chile",
    city: "Biobío / Los Ríos",
    year: 2012,
    type: "Infraestructura",
    typeEn: "Infrastructure",
    material: "Vigas Cajón de Acero + Losa Mixta",
    role: "Detallador de Puentes Metálicos",
    roleEn: "Steel Bridge Detailer",
    software: "Tekla Structures, AutoCAD",
    lod: "LOD 400",
    metrics: "Puente Laja (65 fotos), Río Bueno (29 fotos), Santa Elvira (65 fotos), Chamiza (39 fotos)",
    description: "Modelado y detallamiento de vigas metálicas cajón continuas para los principales puentes carreteros construidos en el sur de Chile. Empalmes de terreno con pernos de alta resistencia ASTM A325/A490, diafragmas de rigidización y aparatos de apoyo elastoméricos.",
    descriptionEn: "Shop modeling and detailing of continuous steel tub and box girders for major highway bridges in Southern Chile. High-strength bolted field splices, internal bracing diaphragms, and elastomeric bearings.",
    imageSources: [
      path.join(G_OBRAS, "C0033 Puente Laja"),
      path.join(G_OBRAS, "C0059 Puente Río Bueno"),
      path.join(G_OBRAS, "C0062 Puente Santa Elvira"),
      path.join(G_OBRAS, "C0050 Viaducto Chamiza"),
      G_FOTOS
    ],
    modelSources: [
      path.join(G_OBRAS, "C0033 Puente Laja"),
      path.join(G_OBRAS, "C0062 Puente Santa Elvira")
    ],
    docSources: [
      path.join(G_OBRAS, "C0033 Puente Laja")
    ]
  },
  {
    id: "P-001",
    shortName: "Planimetria_Municipal_Lampa",
    name: "Planimetría y Arquitectura Municipal - Práctica Profesional",
    nameEn: "Municipal Architecture Drafting - Professional Internship",
    client: "Ilustre Municipalidad de Lampa",
    company: "I. Municipalidad de Lampa",
    country: "Chile",
    city: "Lampa, Región Metropolitana",
    year: 2006,
    type: "Edificación",
    typeEn: "Building",
    material: "Albañilería + Madera + Hormigón",
    role: "Dibujante Proyectista en Práctica",
    roleEn: "Intern Architectural Draftsman",
    software: "AutoCAD",
    lod: "LOD 200",
    metrics: "Planimetrías de regularización municipal, sedes comunitarias",
    description: "Inicio de la trayectoria profesional. Elaboración de planimetría oficial de loteos, equipamientos comunitarios y regularización de viviendas para la Dirección de Obras Municipales de Lampa.",
    descriptionEn: "Early career milestone. Official drafting for municipal zoning plans, civic centers, and building permits for the Lampa Municipal Works Department.",
    imageSources: [G_FOTOS, WEB_IMG],
    modelSources: [],
    docSources: []
  }
];

console.log(`Total de proyectos configurados: ${PROJECTS.length}`);

const summaryResults = [];

// ==============================================================================
// PROCESAMIENTO SECUENCIAL DE CADA PROYECTO
// ==============================================================================
for (const proj of PROJECTS) {
  const folderName = `${proj.id}_${proj.shortName}`;
  const projDir = path.join(TARGET_ROOT, folderName);
  const imgDir  = path.join(projDir, "imagenes");
  const modDir  = path.join(projDir, "modelos");
  const docDir  = path.join(projDir, "informes");

  console.log(`\n[+] Procesando: ${proj.id} - ${proj.name}`);

  // Asegurar que existan todos los directorios del proyecto
  if (!fs.existsSync(projDir)) fs.mkdirSync(projDir, { recursive: true });
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
  if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });
  if (!fs.existsSync(docDir)) fs.mkdirSync(docDir, { recursive: true });

  // Copiar activos
  const imgCopied = safeCopyFiles(proj.imageSources || [], imgDir, /\.(jpg|jpeg|png|webp|bmp)$/i, 35);
  const modCopied = safeCopyFiles(proj.modelSources || [], modDir, /\.(rvt|nwd|ifc|skp|dwg|dxf|tekla)$/i, 15);
  const docCopied = safeCopyFiles(proj.docSources || [], docDir, /\.(pdf|docx|xlsx|pptx)$/i, 20);

  const finalImgs = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : [];
  const finalMods = fs.existsSync(modDir) ? fs.readdirSync(modDir) : [];
  const finalDocs = fs.existsSync(docDir) ? fs.readdirSync(docDir) : [];

  // Crear metadata.json
  const meta = {
    id: proj.id,
    name: proj.name,
    name_en: proj.nameEn,
    client: proj.client,
    company: proj.company,
    country: proj.country,
    city: proj.city,
    year: proj.year,
    project_type: proj.type,
    project_type_en: proj.typeEn,
    material: proj.material,
    role: proj.role,
    role_en: proj.roleEn,
    software: proj.software,
    lod: proj.lod,
    metrics: proj.metrics,
    description: proj.description,
    description_en: proj.descriptionEn,
    assets: {
      total_imagenes: finalImgs.length,
      total_modelos: finalMods.length,
      total_informes: finalDocs.length,
      imagenes: finalImgs,
      modelos: finalMods,
      informes: finalDocs
    }
  };

  const jsonPath = path.join(projDir, "metadata.json");
  fs.writeFileSync(jsonPath, JSON.stringify(meta, null, 2), "utf8");

  console.log(`    -> Imágenes: ${finalImgs.length} | Modelos: ${finalMods.length} | Informes: ${finalDocs.length} | metadata.json OK`);

  summaryResults.push({
    id: proj.id,
    name: proj.name,
    nameEn: proj.nameEn,
    company: proj.company,
    client: proj.client,
    year: proj.year,
    type: proj.type,
    folder: folderName,
    imagenes: finalImgs.length,
    modelos: finalMods.length,
    informes: finalDocs.length
  });
}

// ==============================================================================
// GENERACIÓN DE ARCHIVOS MAESTROS DE RESUMEN
// ==============================================================================
console.log("\n==================================================================");
console.log(" GENERANDO INVENTARIO MAESTRO Y DOCUMENTO EJECUTIVO");
console.log("==================================================================");

// 1. 00_INVENTARIO_MAESTRO.json
const invJsonPath = path.join(TARGET_ROOT, "00_INVENTARIO_MAESTRO.json");
fs.writeFileSync(invJsonPath, JSON.stringify(summaryResults, null, 2), "utf8");
console.log(`[✓] Creado: ${invJsonPath}`);

// 2. 00_PORTAFOLIO_RESUMEN_EJECUTIVO.md
const totImg = summaryResults.reduce((acc, p) => acc + p.imagenes, 0);
const totMod = summaryResults.reduce((acc, p) => acc + p.modelos, 0);
const totDoc = summaryResults.reduce((acc, p) => acc + p.informes, 0);
const nowStr = new Date().toLocaleString("es-CL", { dateStyle: "long", timeStyle: "short" });

let md = `# 🏛️ Catálogo Maestro de Proyectos de Ingeniería Estructural & BIM
**Andrés Gallo Parra** · Senior Structural BIM Designer & Developer  
**Ruta Maestra**: \`${TARGET_ROOT}\`  
**Total Proyectos Catalogados**: ${summaryResults.length}  
**Fecha de Generación**: ${nowStr}  

---

## 📊 1. Resumen Estadístico de Activos Consolidados

| Métrica | Total Consolidado |
| :--- | :---: |
| **Proyectos Principales Documentados** | **${summaryResults.length}** |
| **Total de Imágenes / Renders / Fotos de Obra** | **${totImg}** |
| **Total de Modelos 3D BIM & Planos CAD** | **${totMod}** |
| **Total de Informes, Memorias & Documentos PDF** | **${totDoc}** |

---

## 🗂️ 2. Índice General de Proyectos por Carpeta

| ID | Proyecto | Empresa | Año | Disciplina | Fotos | 3D/CAD | Docs | Carpeta |
| :- | :--- | :--- | :-: | :--- | :-: | :-: | :-: | :--- |
`;

for (const p of summaryResults) {
  md += `| **${p.id}** | ${p.name} | ${p.company} | ${p.year} | ${p.type} | ${p.imagenes} | ${p.modelos} | ${p.informes} | \`${p.folder}\` |\n`;
}

md += `
---

## 📂 3. Estructura Estandarizada de Cada Proyecto

Cada carpeta de proyecto dentro del repositorio maestro contiene:

\`\`\`
[ID]_[Nombre_Proyecto]/
├── imagenes/          # Fotografías de obra, renders 3D, capturas de planos en alta resolución (.jpg, .png, .webp)
├── modelos/           # Modelos nativos Revit (.rvt), Navisworks (.nwd), OpenBIM (.ifc) y planos (.dwg)
├── informes/          # Memorias de cálculo, especificaciones técnicas, planos PDF (.pdf, .docx, .xlsx)
└── metadata.json      # Ficha técnica estructurada en JSON (bilingüe Español / Inglés)
\`\`\`

---
*Generado automáticamente por Antigravity IDE para el ecosistema de AtelijuDesign.*
`;

const mdPath = path.join(TARGET_ROOT, "00_PORTAFOLIO_RESUMEN_EJECUTIVO.md");
fs.writeFileSync(mdPath, md, "utf8");
console.log(`[✓] Creado: ${mdPath}`);

console.log("\n==================================================================");
console.log(" PROCESO COMPLETADO EXITOSAMENTE");
console.log("==================================================================");
