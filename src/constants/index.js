// ===================== NAV LINKS =====================
export const navLinks = [
  { id: "home", title: "Inicio", i18nKey: "nav_home", href: "#home" },
  { id: "about", title: "Sobre Mí", i18nKey: "nav_about", href: "#about" },
  { id: "automation", title: "Automatización", i18nKey: "nav_automation", href: "#automation" },
  { id: "services", title: "Servicios", i18nKey: "nav_services", href: "#services" },
  { id: "portfolio", title: "Portafolio", i18nKey: "nav_portfolio", href: "#portfolio" },
  { id: "proyectos", title: "Proyectos", i18nKey: "nav_projects", href: "/proyectos-bim", external: false },
  { id: "blog", title: "Blog", i18nKey: "nav_blog", href: "/blog", external: false },
  { id: "tools", title: "Herramientas", i18nKey: "nav_tools", href: "/herramientas", external: false },
  { id: "contact", title: "Contacto →", i18nKey: "nav_contact", href: "#contact", cta: true },
];

// ===================== HERO STATS =====================
export const heroStats = [
  { id: "years", value: 15, suffix: "+", label: "Años de experiencia", label_en: "Years of experience" },
  { id: "m2", value: 500, suffix: "k", label: "m² modelados", label_en: "Modeled m²" },
  { id: "bim", value: 100, suffix: "%", label: "Compromiso BIM", label_en: "BIM commitment" },
  { id: "intl", display: "CL·INT", label: "Proyectos internacionales", label_en: "International projects" },
];

// ===================== SKILLS =====================
export const skills = [
  { name: "Revit", highlight: true },
  { name: "Tekla", highlight: true },
  { name: "Python", highlight: true },
  { name: "Dynamo", highlight: true },
  { name: "Navisworks", highlight: false },
  { name: "ACC", highlight: false },
  { name: "AutoCAD", highlight: false },
  { name: "AutoLISP", highlight: false },
  { name: "SQL", highlight: false },
  { name: "HTML / CSS / JS", highlight: false },
  { name: "Civil 3D", highlight: false },
];

// ===================== PROJECTS (ABOUT) =====================
export const featuredProjects = [
  { name: "Aeropuerto AMB — Terminal 2", name_en: "AMB Airport — Terminal 2", detail: "320,000 m² · Revit · Coordinación BIM", detail_en: "320,000 m² · Revit · BIM Coordination", flag: "cl" },
  { name: "Hospital Marga Marga", name_en: "Marga Marga Hospital Complex", detail: "75,000 m² · Hormigón · Alta complejidad", detail_en: "75,000 m² · Concrete · High Complexity", flag: "cl" },
  { name: "Máquina Papelera MP05 — ABSORMEX", name_en: "MP05 Tissue Paper Machine — ABSORMEX", detail: "8,000 m² · Revit · BIM 360", detail_en: "8,000 m² · Revit · BIM 360", flag: "mx" },
  { name: "Paso Fronterizo Los Libertadores", name_en: "Los Libertadores Border Complex", detail: "35,000 m² · Tekla · Alta montaña 3,200m", detail_en: "35,000 m² · Tekla · High Mountain 3,200m", flag: "cl" },
  { name: "Proyecto Arqueros — Chancador Primario", name_en: "Arqueros Mining — Primary Crusher", detail: "Minería · Revit · ACC · GHD / Arcadis", detail_en: "Mining · Revit · ACC · GHD / Arcadis", flag: "cl" },
];

// ===================== AUTOMATION =====================
export const automations = [
  {
    tech: "Python · pyRevit",
    title: "Extracción automática de cubicaciones",
    title_en: "Automated Quantity Takeoff Extraction",
    description: "Script que genera reportes de acero y hormigón directamente desde el modelo Revit, eliminando el trabajo manual de tablas y cálculos repetitivos.",
    description_en: "Custom script generating steel and concrete schedules directly from the Revit model, eliminating manual table and repetitive calculation workflows.",
    result: "⏱ Ahorro estimado: ~3 horas por entrega",
    result_en: "⏱ Estimated savings: ~3 hours per delivery",
  },
  {
    tech: "Dynamo · BIM 360",
    title: "Numeración inteligente de elementos",
    title_en: "Smart Element Tagging & Numbering",
    description: "Automatización de marcas y numeración de perfiles estructurales siguiendo estándares de proyecto sin intervención manual.",
    description_en: "Automated tagging and numbering of structural members complying with project standards without manual intervention.",
    result: "⏱ Ahorro estimado: ~2 horas por modelo",
    result_en: "⏱ Estimated savings: ~2 hours per model",
  },
  {
    tech: "SQL · HTML · JS",
    title: "Catálogo ICHA Digital",
    title_en: "Digital ICHA Steel Catalog",
    description: "Base de datos de perfiles estructurales chilenos transformada en herramienta web interactiva con cubicador, filtros y exportación.",
    description_en: "Chilean structural steel database turned into an interactive web tool with quantity takeoff, filters, and export.",
    link: { text: "Ver herramienta →", text_en: "View tool →", url: "/herramientas/icha" },
  },
];

// ===================== SERVICES =====================
export const services = [
  {
    icon: "fa-solid fa-industry",
    title: "Minería e Industrial",
    title_en: "Mining & Industrial",
    description: "Modelado BIM de chancadores, plantas de proceso y estructuras industriales complejas. Experiencia directa en proyectos con Arcadis, GHD y AFRY.",
    description_en: "BIM modeling of primary crushers, process plants, and complex heavy industrial structures. Direct project experience with Arcadis, GHD, and AFRY.",
  },
  {
    icon: "fa-solid fa-robot",
    title: "Automatización BIM",
    title_en: "BIM Automation",
    description: "Scripts en Python (pyRevit), Dynamo y AutoLISP que eliminan tareas repetitivas y reducen errores. Desarrollo a medida para tu flujo de trabajo específico.",
    description_en: "Scripts in Python (pyRevit), Dynamo, and AutoLISP eliminating repetitive tasks and minimizing human error. Custom plugins tailored to your specific workflow.",
  },
  {
    icon: "fa-solid fa-hospital-user",
    title: "Infraestructura y Salud",
    title_en: "Infrastructure & Healthcare",
    description: "Coordinación BIM interdisciplinaria para hospitales, aeropuertos y edificios públicos de alta complejidad. Experiencia comprobada en proyectos de 75.000 a 320.000 m².",
    description_en: "Interdisciplinary BIM coordination for hospitals, international airports, and complex civic buildings. Proven track record in facilities from 75,000 to 320,000 m².",
  },
  {
    icon: "fa-solid fa-ruler-combined",
    title: "Detallamiento y Cubicaciones",
    title_en: "Detailing & Material Takeoffs",
    description: "Planos de fabricación, cubicaciones precisas y reportes de perfiles de acero y hormigón. Norma chilena NCh y catálogo ICHA. Exportación directa a Excel y PDF.",
    description_en: "Fabrication shop drawings, high-precision quantity takeoffs, and schedules for structural steel and concrete. Chilean NCh codes, AISC, and ICHA. Direct export to Excel and PDF.",
  },
];

// ===================== TOOLS PREVIEW =====================
export const toolsPreview = [
  {
    icon: "fa-solid fa-box-archive",
    title: "Catálogo ICHA Digital",
    title_en: "Digital ICHA Catalog",
    description: "Buscador interactivo de perfiles de acero estructural con propiedades mecánicas completas, cubicador por proyecto, comparador de perfiles y exportación a Excel y PDF. Norma chilena.",
    description_en: "Interactive search engine for structural steel profiles with complete mechanical properties, project takeoff, profile comparator, and Excel/PDF export. Chilean Standard.",
    link: "/herramientas/icha",
    featured: true,
  },
  {
    icon: "fa-solid fa-layer-group",
    title: "Catálogo AISC v15.0",
    title_en: "AISC v15.0 Catalog",
    description: "Base de datos normada de la AISC con 2,100+ perfiles de acero, cotas 2D, conversor de unidades (Imperial / Métrico) y cubicador.",
    description_en: "AISC standard database with 2,100+ steel profiles, 2D dimensions, unit converter (Imperial / Metric), and steel takeoff.",
    link: "/herramientas/aisc",
    featured: true,
  },
  {
    icon: "fa-solid fa-file-lines",
    title: "Blog Técnico BIM",
    title_en: "BIM Technical Blog",
    description: "Artículos sobre automatización, flujos de trabajo BIM y herramientas para proyectistas estructurales en Chile.",
    description_en: "Articles on automation, BIM workflows, and practical tools for structural designers and engineers.",
    link: "/blog",
    featured: false,
  },
];

// ===================== EXPERIENCE =====================
export const experiences = [
  {
    company: "GHD",
    role: "Proyectista Estructural",
    role_en: "Structural BIM Designer",
    period: "Abr 2026 — Presente",
    period_en: "Apr 2026 — Present",
    description: "Proyectos: 12673268-Reemplazo Centrifuga, 12673272-OT-181, 12684444 - Normalización Puentes Grúas DSAL, 12688063.",
    description_en: "Projects: 12673268-Centrifuge Replacement, 12673272-OT-181, 12684444 - DSAL Overhead Cranes Normalization, 12688063.",
    icon: "fa-solid fa-hard-hat",
    active: true,
  },
  {
    company: "BIOSMI",
    role: "Proyectista / Diseñador BIM",
    role_en: "Structural BIM Modeler & Designer",
    period: "Ene 2026 — Abr 2026",
    period_en: "Jan 2026 — Apr 2026",
    description: "P1820 – MLC – Integración Segunda Etapa Lavado SX. Diseño BIM de especialidades de estructuras.",
    description_en: "P1820 – MLC – Integration Second Stage SX Washing. Structural BIM design and detailing.",
    icon: "fa-solid fa-building",
    active: false,
    hidden: true,
  },
  {
    company: "GHD",
    role: "Proyectista Estructural",
    role_en: "Structural BIM Designer",
    period: "Dic 2024 — May 2025",
    period_en: "Dec 2024 — May 2025",
    description: "Proyecto Arqueros. Diseño de estructura del chancador primario.",
    description_en: "Arqueros Mining Project. Structural design of the primary crusher facility.",
    icon: "fa-solid fa-hard-hat",
    active: false,
    hidden: true,
  },
  {
    company: "ARCADIS",
    role: "Proyectista Estructural",
    role_en: "Structural BIM Designer",
    period: "Jun 2024 — Nov 2024",
    period_en: "Jun 2024 — Nov 2024",
    description: "Proyecto Arqueros. Diseño de estructura del chancador primario.",
    description_en: "Arqueros Mining Project. Primary crusher structural modeling and retaining walls.",
    icon: "fa-solid fa-mountain",
    active: false,
    hidden: true,
  },
  {
    company: "AFRY Chile",
    role: "Diseñador BIM Senior",
    role_en: "Senior Structural BIM Designer",
    period: "Dic 2022 — May 2024",
    period_en: "Dec 2022 — May 2024",
    description: "Proyectos MP5 (Softys) y CMPC Laja. Diseño BIM de especialidades de estructura y arquitectura.",
    description_en: "MP5 Tissue Machine (Softys Zárate) and CMPC Laja projects. Structural and architectural BIM design.",
    icon: "fa-solid fa-industry",
    active: false,
    hidden: true,
  },
];

// ===================== CERTIFICATIONS =====================
export const certifications = [
  {
    name: "Modelado BIM con Tekla Structures: Concreto Armado",
    name_en: "BIM Modeling with Tekla Structures: Reinforced Concrete",
    org: "KONSTRUEDU",
    year: 2025,
    url: "https://konstruedu.com/certificate/view/7da96496-76c2-11f0-aa26-026f7b22eb81",
    icon: "🏅",
  },
  {
    name: "Advance Steel",
    name_en: "Advance Steel: Structural Modeling & Detailing",
    org: "Udemy",
    year: 2025,
    url: "https://www.udemy.com/certificate/UC-3a15bef1-d846-47df-925d-b8220f02b1eb/",
    icon: "fa-solid fa-medal",
  },
  {
    name: "Modelado BIM con Revit Estructuras 2021",
    name_en: "BIM Modeling with Revit Structures 2021",
    org: "KONSTRUEDU",
    year: 2023,
    url: "https://konstruedu.com/room/revit-estructuras/611530525719f/exam?roomId=1224&partner=12087&productId=14466&type=course",
    icon: "🏅",
  },
  {
    name: "Experto en Revit (Colaboración)",
    name_en: "Revit Expert: Multi-user Collaboration & Worksharing",
    org: "BMlearning",
    year: 2022,
    url: "https://www.bmlearnhub.com/certificates/b0lzlbdyom",
    icon: "fa-solid fa-medal",
  },
];

export const education = [
  {
    name: "Ingeniería en Construcción",
    name_en: "Construction Engineering Degree",
    org: "IPLACEX",
    period: "2026 — Presente",
    period_en: "2026 — Present",
    icon: "fa-solid fa-graduation-cap",
  },
  {
    name: "Dibujante Técnico",
    name_en: "Technical Structural Drafter Degree",
    org: "Liceo Politécnico Galvarino N°2",
    period: "2003–2005",
    period_en: "2003–2005",
    icon: "fa-solid fa-graduation-cap",
  },
];

// ===================== PORTFOLIO =====================
export const portfolioFilters = ["Todos", "Revit", "Tekla", "Navisworks", "Civil 3D", "AutoCAD", "Advance Steel", "ACC"];

export const portfolioProjects = [
  {
    image: "assets/img/phelc_portada.webp",
    category: "Energía",
    category_en: "Energy",
    title: "Proyecto Hidroeléctrico Los Cóndores",
    title_en: "Los Cóndores Hydroelectric Plant",
    year: "2014",
    yearDisplay: "2014",
    yearDisplay_en: "2014",
    tags: ["AutoCAD", "Revit"],
    description: "Central hidroeléctrica de pasada. Túneles de aducción y caverna de máquinas en la cordillera.",
    description_en: "Run-of-the-river hydroelectric plant. Headrace tunnels and underground powerhouse in the Andes.",
    link: "/project/los-condores",
  },
  {
    image: "assets/img/amb_00.webp",
    category: "Infraestructura",
    category_en: "Infrastructure",
    title: "Aeropuerto AMB",
    title_en: "AMB International Airport",
    year: "2018",
    yearDisplay: "2018 · 320,000 m²",
    yearDisplay_en: "2018 · 320,000 m²",
    tags: ["Revit"],
    description: "Terminal 2, Espigones y estacionamientos. Coordinación interdisciplinaria completa.",
    description_en: "Terminal 2, Pier concourses, and parking. Comprehensive interdisciplinary BIM coordination.",
    link: "/project/aeropuerto-amb",
  },
  {
    image: "assets/img/mp5_01.webp",
    category: "Industrial",
    category_en: "Industrial",
    title: "Máquina Papelera MP05",
    title_en: "MP05 Tissue Paper Machine",
    year: "2023",
    yearDisplay: "2023 · 8,000 m²",
    yearDisplay_en: "2023 · 8,000 m²",
    tags: ["Revit"],
    description: "Ingeniería de detalles para ABSORMEX en México. Estructuras masivas de conversión.",
    description_en: "Detailed engineering for ABSORMEX in Mexico. Heavy structural conversion framework and foundations.",
    link: "/project/maquina-papelera",
  },
  {
    image: "assets/img/hmm_portada.webp",
    category: "Salud",
    category_en: "Healthcare",
    title: "Hospital Marga Marga",
    title_en: "Marga Marga Hospital Complex",
    year: "2019",
    yearDisplay: "2019 · 75,000 m²",
    yearDisplay_en: "2019 · 75,000 m²",
    tags: ["Revit"],
    description: "Diseño BIM completo de hormigón. Coordinación interdisciplinaria avanzada.",
    description_en: "Full reinforced concrete BIM model with seismic isolation. Advanced interdisciplinary coordination.",
    link: "/project/hospital-marga-marga",
  },
  {
    image: "assets/img/pfll_00.webp",
    category: "Civil",
    category_en: "Civil Infrastructure",
    title: "Paso Fronterizo Los Libertadores",
    title_en: "Los Libertadores Border Crossing",
    year: "2015",
    yearDisplay: "2015 · 35,000 m²",
    yearDisplay_en: "2015 · 35,000 m²",
    tags: ["Tekla"],
    description: "Estructuras principales del complejo fronterizo a 3,200 m de altitud.",
    description_en: "Main high-altitude facilities for the international border crossing at 3,200 m altitude.",
    link: "/project/paso-los-libertadores",
  },
  {
    image: "assets/img/arq_00.webp",
    category: "Minería",
    category_en: "Mining",
    title: "Proyecto Arqueros",
    title_en: "Arqueros Mining Project",
    year: "2024",
    yearDisplay: "2024",
    yearDisplay_en: "2024",
    tags: ["Revit", "ACC"],
    description: "Diseño estructural del chancador primario y estructuras anexas críticas.",
    description_en: "Structural design of primary crusher station and critical auxiliary facilities.",
    link: "/project/proyecto-arqueros",
  },
  {
    image: "assets/img/desal_00.webp",
    category: "Hidráulica",
    category_en: "Hydraulics",
    title: "Planta Desalinizadora Santo Domingo",
    title_en: "Santo Domingo Desalination Plant",
    year: "2025",
    yearDisplay: "2025 · Obras Civiles",
    yearDisplay_en: "2025 · Civil Works",
    tags: ["Revit", "Civil 3D"],
    description: "Sentina de toma de agua de mar, sala eléctrica y planta de ósmosis inversa. Modelado integral de hormigón armado y coordinación interdisciplinaria.",
    description_en: "Seawater intake sump, electrical room, and reverse osmosis plant. Integral reinforced concrete modeling and interdisciplinary coordination.",
    link: "/project/desaladora-sto-domingo",
  },
];
