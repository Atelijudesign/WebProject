// ===================== NAV LINKS =====================
export const navLinks = [
  { id: "home", title: "Inicio", href: "#home" },
  { id: "about", title: "Sobre Mí", href: "#about" },
  { id: "automation", title: "Automatización", href: "#automation" },
  { id: "services", title: "Servicios", href: "#services" },
  { id: "portfolio", title: "Portafolio", href: "#portfolio" },
  { id: "proyectos", title: "Proyectos", href: "/proyectos-bim", external: false },
  { id: "blog", title: "Blog", href: "/blog", external: false },
  { id: "tools", title: "Herramientas", href: "/herramientas", external: false },
  { id: "contact", title: "Contacto →", href: "#contact", cta: true },
];

// ===================== HERO STATS =====================
export const heroStats = [
  { id: "years", value: 15, suffix: "+", label: "Años de experiencia" },
  { id: "m2", value: 500, suffix: "k", label: "m² modelados" },
  { id: "bim", value: 100, suffix: "%", label: "Compromiso BIM" },
  { id: "intl", display: "CL·INT", label: "Proyectos internacionales" },
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
  { name: "Aeropuerto AMB — Terminal 2", detail: "320,000 m² · Revit · Coordinación BIM", flag: "cl" },
  { name: "Hospital Marga Marga", detail: "75,000 m² · Hormigón · Alta complejidad", flag: "cl" },
  { name: "Máquina Papelera MP05 — ABSORMEX", detail: "8,000 m² · Revit · BIM 360", flag: "mx" },
  { name: "Paso Fronterizo Los Libertadores", detail: "35,000 m² · Tekla · Alta montaña 3,200m", flag: "cl" },
  { name: "Proyecto Arqueros — Chancador Primario", detail: "Minería · Revit · ACC · GHD / Arcadis", flag: "cl" },
];

// ===================== AUTOMATION =====================
export const automations = [
  {
    tech: "Python · pyRevit",
    title: "Extracción automática de cubicaciones",
    description: "Script que genera reportes de acero y hormigón directamente desde el modelo Revit, eliminando el trabajo manual de tablas y cálculos repetitivos.",
    result: "⏱ Ahorro estimado: ~3 horas por entrega",
  },
  {
    tech: "Dynamo · BIM 360",
    title: "Numeración inteligente de elementos",
    description: "Automatización de marcas y numeración de perfiles estructurales siguiendo estándares de proyecto sin intervención manual.",
    result: "⏱ Ahorro estimado: ~2 horas por modelo",
  },
  {
    tech: "SQL · HTML · JS",
    title: "Catálogo ICHA Digital",
    description: "Base de datos de perfiles estructurales chilenos transformada en herramienta web interactiva con cubicador, filtros y exportación.",
    link: { text: "Ver herramienta →", url: "/herramientas/icha" },
  },
];

// ===================== SERVICES =====================
export const services = [
  {
    icon: "fa-solid fa-industry",
    title: "Minería e Industrial",
    description: "Modelado BIM de chancadores, plantas de proceso y estructuras industriales complejas. Experiencia directa en proyectos con Arcadis, GHD y AFRY.",
  },
  {
    icon: "fa-solid fa-robot",
    title: "Automatización BIM",
    description: "Scripts en Python (pyRevit), Dynamo y AutoLISP que eliminan tareas repetitivas y reducen errores. Desarrollo a medida para tu flujo de trabajo específico.",
  },
  {
    icon: "fa-solid fa-hospital-user",
    title: "Infraestructura y Salud",
    description: "Coordinación BIM interdisciplinaria para hospitales, aeropuertos y edificios públicos de alta complejidad. Experiencia comprobada en proyectos de 75.000 a 320.000 m².",
  },
  {
    icon: "fa-solid fa-ruler-combined",
    title: "Detallamiento y Cubicaciones",
    description: "Planos de fabricación, cubicaciones precisas y reportes de perfiles de acero y hormigón. Norma chilena NCh y catálogo ICHA. Exportación directa a Excel y PDF.",
  },
];

// ===================== TOOLS PREVIEW =====================
export const toolsPreview = [
  {
    icon: "fa-solid fa-box-archive",
    title: "Catálogo ICHA Digital",
    description: "Buscador interactivo de perfiles de acero estructural con propiedades mecánicas completas, cubicador por proyecto, comparador de perfiles y exportación a Excel y PDF. Norma chilena.",
    link: "/herramientas/icha",
    featured: true,
  },
  {
    icon: "fa-solid fa-file-lines",
    title: "Blog Técnico BIM",
    description: "Artículos sobre automatización, flujos de trabajo BIM y herramientas para proyectistas estructurales en Chile.",
    link: "/blog",
    featured: false,
  },
];

// ===================== EXPERIENCE =====================
export const experiences = [
  {
    company: "BIOSMI",
    role: "Proyectista / Diseñador BIM",
    period: "Ene 2026 — Presente",
    description: "P1820 – MLC – Integración Segunda Etapa Lavado SX. Diseño BIM de especialidades de estructuras.",
    icon: "fa-solid fa-building",
    active: true,
  },
  {
    company: "GHD",
    role: "Proyectista Estructural",
    period: "Dic 2024 — May 2025",
    description: "Proyecto Arqueros. Diseño de estructura del chancador primario.",
    icon: "fa-solid fa-hard-hat",
    active: false,
  },
  {
    company: "ARCADIS",
    role: "Proyectista Estructural",
    period: "Jun 2024 — Nov 2024",
    description: "Proyecto Arqueros. Diseño de estructura del chancador primario.",
    icon: "fa-solid fa-mountain",
    active: false,
  },
  {
    company: "AFRY Chile",
    role: "Diseñador BIM Senior",
    period: "Dic 2022 — May 2024",
    description: "Proyectos MP5 (Softys) y CMPC Laja. Diseño BIM de especialidades de estructura y arquitectura.",
    icon: "fa-solid fa-industry",
    active: false,
  },
];

// ===================== CERTIFICATIONS =====================
export const certifications = [
  {
    name: "Modelado BIM con Tekla Structures: Concreto Armado",
    org: "KONSTRUEDU",
    year: 2025,
    url: "https://konstruedu.com/certificate/view/7da96496-76c2-11f0-aa26-026f7b22eb81",
    icon: "🏅",
  },
  {
    name: "Advance Steel",
    org: "Udemy",
    year: 2025,
    url: "https://www.udemy.com/certificate/UC-3a15bef1-d846-47df-925d-b8220f02b1eb/",
    icon: "fa-solid fa-medal",
  },
  {
    name: "Modelado BIM con Revit Estructuras 2021",
    org: "KONSTRUEDU",
    year: 2023,
    url: "https://konstruedu.com/room/revit-estructuras/611530525719f/exam?roomId=1224&partner=12087&productId=14466&type=course",
    icon: "🏅",
  },
  {
    name: "Experto en Revit (Colaboración)",
    org: "BMlearning",
    year: 2022,
    url: "https://www.bmlearnhub.com/certificates/b0lzlbdyom",
    icon: "fa-solid fa-medal",
  },
];

export const education = [
  {
    name: "Dibujante Técnico",
    org: "Liceo Politécnico Galvarino N°2",
    period: "2003–2005",
    icon: "fa-solid fa-graduation-cap",
  },
];

// ===================== PORTFOLIO =====================
export const portfolioFilters = ["Todos", "Revit", "Tekla", "Navisworks", "Civil 3D", "AutoCAD", "Advance Steel", "ACC"];

export const portfolioProjects = [
  {
    image: "assets/img/phelc_portada.webp",
    category: "Energía",
    title: "Proyecto Hidroeléctrico Los Cóndores",
    year: "2014",
    tags: ["AutoCAD", "Revit"],
    description: "Central hidroeléctrica de pasada. Túneles de aducción y caverna de máquinas en la cordillera.",
    link: "/project/los-condores",
  },
  {
    image: "assets/img/amb_00.webp",
    category: "Infraestructura",
    title: "Aeropuerto AMB",
    year: "2018",
    yearDisplay: "2018 · 320,000 m²",
    tags: ["Revit"],
    description: "Terminal 2, Espigones y estacionamientos. Coordinación interdisciplinaria completa.",
    link: "/project/aeropuerto-amb",
  },
  {
    image: "assets/img/mp5_01.webp",
    category: "Industrial",
    title: "Máquina Papelera MP05",
    year: "2023",
    yearDisplay: "2023 · 8,000 m²",
    tags: ["Revit"],
    description: "Ingeniería de detalles para ABSORMEX en México. Estructuras masivas de conversión.",
    link: "/project/maquina-papelera",
  },
  {
    image: "assets/img/hmm_portada.webp",
    category: "Salud",
    title: "Hospital Marga Marga",
    year: "2019",
    yearDisplay: "2019 · 75,000 m²",
    tags: ["Revit"],
    description: "Diseño BIM completo de hormigón. Coordinación interdisciplinaria avanzada.",
    link: "/project/hospital-marga-marga",
  },
  {
    image: "assets/img/pfll_00.webp",
    category: "Civil",
    title: "Paso Fronterizo Los Libertadores",
    year: "2015",
    yearDisplay: "2015 · 35,000 m²",
    tags: ["Tekla"],
    description: "Estructuras principales del complejo fronterizo a 3,200 m de altitud.",
    link: "/project/paso-los-libertadores",
  },
  {
    image: "assets/img/arq_00.webp",
    category: "Minería",
    title: "Proyecto Arqueros",
    year: "2024",
    tags: ["Revit", "ACC"],
    description: "Diseño estructural del chancador primario y estructuras anexas críticas.",
    link: "/project/proyecto-arqueros",
  },
  {
    category: "Hidráulica",
    title: "Proyecto Confidencial",
    year: "2025",
    tags: ["Revit", "ACC"],
    description: "Diseño estructural y coordinación BIM bajo acuerdo de confidencialidad.",
    confidential: true,
  },
];
