export const BLOG_POSTS = [
  {
    id: "konstruedu-especialista-bim-revit",
    slug: "konstruedu-especialista-bim-revit",
    title: "Especialista BIM Konstruedu: ¿Vale la pena? Mi análisis honesto",
    description: "127 horas, 14 cursos y certificación internacional. Analizo la especialización en Modelado BIM con Revit de Konstruedu desde mi perspectiva de proyectista con 15 años de experiencia.",
    date: "24 Mar 2026",
    readingTime: "9 min lectura",
    categories: ["Revit", "BIM", "Formación"],
    filterCategory: "formacion",
    isNew: true,
    thumbnail: {
      gradient: "from-emerald-900 via-cyan-900 to-slate-800",
      icon: "🎓",
      title: "Konstruedu",
      subtitle: "127h · 14 cursos",
      badgeColor: "bg-emerald-600/90",
      badgeIcon: "fa-graduation-cap",
      badgeText: "Formación BIM"
    }
  },
  {
    id: "pyrevit-peso-volumen",
    slug: "pyrevit-peso-volumen",
    title: "De 2 Horas a 10 Segundos: Plugin de Pesos y Volúmenes Estructurales",
    description: "Cómo automaticé el cálculo de pesos y volúmenes en modelos de Revit con un plugin pyRevit que detecta materiales, clasifica perfiles de acero y genera reportes al instante.",
    date: "22 Mar 2026",
    readingTime: "7 min lectura",
    categories: ["Python", "Revit API"],
    filterCategory: "pyrevit",
    isNew: true,
    thumbnail: {
      gradient: "from-slate-900 via-orange-900 to-slate-800",
      icon: "⚖️",
      title: "2h → 10s",
      subtitle: "Pesos & Volúmenes",
      badgeColor: "bg-orange-600/90",
      badgeIcon: "fa-weight-hanging",
      badgeText: "Plugin BIM"
    }
  },
  {
    id: "herramientas-bim-acero",
    slug: "herramientas-bim-acero",
    title: "Herramientas Web para Acero Estructural: Calculadora + Catálogo ICHA",
    description: "Calculadora de perfiles personalizados y catálogo digital ICHA con búsqueda interactiva, diagramas SVG y exportación a Excel profesional.",
    date: "19 Feb 2026",
    readingTime: "6 min lectura",
    categories: ["ICHA", "Acero", "Web Tools"],
    filterCategory: "herramientas",
    isNew: true,
    thumbnail: {
      gradient: "from-cyan-900 via-blue-800 to-slate-800",
      icon: "🛠️",
      title: "BIM Tools",
      subtitle: "Acero Estructural",
      badgeColor: "bg-cyan-600/90",
      badgeIcon: "fa-toolbox",
      badgeText: "Herramientas"
    }
  },
  {
    id: "pyrevit-accelerator",
    slug: "pyrevit-accelerator",
    title: "pyRevit Accelerator: El Camino Rápido para Crear Apps en Revit",
    description: "Descubre por qué pyRevit es la forma más rápida de crear herramientas para Revit. Anatomía de una app, el proceso de 7 pasos, y la comparativa definitiva con C#.",
    date: "17 Feb 2026",
    readingTime: "8 min lectura",
    categories: ["Python", "Revit API"],
    filterCategory: "pyrevit",
    isNew: true,
    thumbnail: {
      gradient: "from-slate-900 via-blue-900 to-slate-800",
      icon: "⚡",
      title: "pyRevit",
      subtitle: "Accelerator",
      badgeColor: "bg-green-600/90",
      badgeIcon: "fa-python",
      badgeText: "pyRevit"
    }
  },
  {
    id: "bim-dev-roadmap",
    slug: "bim-dev-roadmap",
    title: "De Profesional de Obra a BIM Software Developer en 12 Meses",
    description: "Guía completa para que cualquier profesional de la construcción pueda transicionar al desarrollo BIM. Enfoque híbrido: Python/pyRevit para victorias rápidas + C#/.NET para potencia industrial.",
    date: "17 Feb 2026",
    readingTime: "15 min lectura",
    categories: ["pyRevit", "C#", "Roadmap"],
    filterCategory: "roadmap",
    isNew: false,
    thumbnail: {
      gradient: "from-orange-900 via-blue-800 to-indigo-900",
      icon: "🏗️",
      title: "Roadmap",
      subtitle: "pyRevit + C#",
      badgeColor: "bg-orange-600/90",
      badgeIcon: "fa-map",
      badgeText: "Roadmap"
    }
  },
  {
    id: "revit-structure-futuro",
    slug: "revit-structure-futuro",
    title: "¿El Fin de la Brecha entre Diseño y Detallado? El Futuro de Revit Structure",
    description: "Análisis del roadmap de Autodesk: conexiones de acero automáticas, modelo analítico autónomo y la convergencia entre Revit, Tekla y Advance Steel.",
    date: "17 Feb 2026",
    readingTime: "8 min lectura",
    categories: ["Revit", "Acero"],
    filterCategory: "revit-structure",
    isNew: true,
    thumbnail: {
      gradient: "from-blue-900 via-indigo-800 to-slate-800",
      icon: "🔗",
      title: "Revit Structure",
      subtitle: "Roadmap 2025+",
      badgeColor: "bg-indigo-600/90",
      badgeIcon: "fa-building",
      badgeText: "Revit Structure"
    }
  },
  {
    id: "revit-support-clinic",
    slug: "revit-support-clinic",
    title: "Secretos de Soporte: Lo que aprendimos en AU 2025 sobre Acero",
    description: "Troubleshooting avanzado de conexiones de acero, por qué fallan las familias y cómo arreglar el modelo analítico desconectado.",
    date: "17 Feb 2026",
    readingTime: "10 min lectura",
    categories: ["Soporte", "Acero"],
    filterCategory: "soporte",
    isNew: true,
    thumbnail: {
      gradient: "from-red-900 via-orange-900 to-slate-900",
      icon: "🚑",
      title: "Revit Support",
      subtitle: "Clinic 2025",
      badgeColor: "bg-red-600/90",
      badgeIcon: "fa-life-ring",
      badgeText: "Soporte"
    }
  }
];

export const BLOG_CATEGORIES = [
  { id: "all", name: "Todos" },
  { id: "pyrevit", name: "pyRevit", icon: "fa-brands fa-python" },
  { id: "csharp", name: "C#", icon: "fa-solid fa-code" },
  { id: "revit-api", name: "Revit API", icon: "fa-solid fa-plug" },
  { id: "automatizacion", name: "Automatización", icon: "fa-solid fa-gears" },
  { id: "roadmap", name: "Roadmap", icon: "fa-solid fa-road" },
  { id: "revit-structure", name: "Revit Structure", icon: "fa-solid fa-building" },
  { id: "soporte", name: "Soporte", icon: "fa-solid fa-life-ring" },
  { id: "herramientas", name: "Herramientas", icon: "fa-solid fa-toolbox" },
  { id: "formacion", name: "Formación", icon: "fa-solid fa-graduation-cap" }
];
