import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../../context/LanguageContext";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import BlogBackButton from "../../components/BlogBackButton";
import { BlogScrollSpyTOC } from "../../components/ui/BlogScrollSpyTOC";

const TOC_SECTIONS = [
  { id: "perfil", title: "01. Perfil & Pitch (90s)", level: 2 },
  { id: "proyectos", title: "02. Proyectos Emblemáticos", level: 2 },
  { id: "automatizaciones", title: "03. Automatizaciones (pyRevit & C#)", level: 2 },
  { id: "herramientas", title: "04. Herramientas Web Creadas", level: 2 },
  { id: "blog", title: "05. Publicaciones & Blog", level: 2 },
  { id: "bba", title: "06. Fit Cultural BBA", level: 2 },
  { id: "preguntas", title: "07. Preguntas para BBA", level: 2 },
  { id: "star", title: "08. Simulador STAR", level: 2 },
];

export const PresentacionAndresGallo = () => {
  const { language } = useTranslation();
  const isEn = language === "en";

  // Estados interactivos
  const [activeTab, setActiveTab] = useState("perfil");
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState("todos");
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState(null);

  // Navegación por teclado en modo diapositivas (Flechas izquierda / derecha / Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSlideMode) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setIsSlideMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSlideMode]);

  // Texto del Pitch de 90 segundos ajustado
  const pitchText = `Soy Andrés Gallo Parra, Diseñador Estructural Senior con más de 14 años de experiencia especializada en el desarrollo, modelado 3D y detallamiento de ingeniería para proyectos de gran minería, energía, edificación de alta complejidad e infraestructura industrial. A lo largo de mi carrera he participado en obras icónicas como el Paso Fronterizo Los Libertadores, el Aeropuerto AMB Terminal 2, el Hospital Marga Marga con aisladores sísmicos, el Proyecto Minero Arqueros, la Máquina Papelera MP5 y la Planta de SO2 & Bisulfito de Quimetal. Domino a nivel avanzado Tekla Structures, Autodesk Revit y AutoCAD, con estricto apego a la norma sísmica NCh2369, publicaciones del ICHA y códigos AISC y ACI, utilizando Navisworks a nivel básico para inspección y toma de medidas en modelos federados. Como valor agregado único, desarrollo herramientas de automatización en Python (pyRevit), Dynamo y C# (.NET), habiendo creado pestañas completas como Gallo_Document, Gallo_SSteel y Gallo_Concrete, además de una suite de herramientas web interactivas que ya han sido presentadas a diversos equipos de ingeniería con excelente acogida. Me motiva integrarme a BBA Consultants para aportar rigor de diseño inmediato, compartir mis herramientas y colaborar con los equipos de Chile y Canadá.`;

  // Reproductor de Pitch con Web Speech API
  const handleToggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("La síntesis de voz no está disponible en este navegador.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pitchText);
    utterance.lang = "es-ES";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Copiar Pitch al portapapeles
  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // 8 Diapositivas para el Modo Presentación
  const slides = [
    {
      id: "slide-1",
      badge: "SLIDE 01 // PORTADA EJECUTIVA",
      title: "Andrés Gallo Parra",
      subtitle: "Diseñador Estructural Senior & Desarrollador de Automatizaciones BIM",
      tagline: "Ingeniería de Detalle, Modelado 3D de Precisión y Desarrollo de Software en Python, Dynamo y C#",
      highlights: [
        { label: "Experiencia", val: "+14 Años en Gran Minería, Industria e Infraestructura" },
        { label: "Herramientas de Modelado", val: "Tekla Structures, Autodesk Revit, AutoCAD (Navisworks básico)" },
        { label: "Desarrollo & Automatización", val: "Python (pyRevit), Dynamo, C# (.NET) y Web Apps" },
        { label: "Normativas", val: "NCh2369, Manuales ICHA, AISC 360/341, ACI 318" },
      ],
      cta: "Propuesta de Valor para BBA Consultants",
    },
    {
      id: "slide-2",
      badge: "SLIDE 02 // PITCH ELEVATOR",
      title: "Propuesta de Valor & Enfoque Técnico",
      subtitle: "Rigor Estructural, Criterio de Fabricación y Eficiencia con Código",
      points: [
        "Más de 14 años de trayectoria en oficinas de ingeniería, detallando acero estructural pesado y hormigón armado.",
        "Dominio integral de la norma sísmica industrial NCh2369 y criterios de diseño en acero del ICHA y AISC.",
        "Experiencia en obras de alta exigencia: minería subterránea y superficie, plantas químicas, papel, hospitales y terminales aéreos.",
        "Uso de Navisworks a nivel funcional/básico para revisión visual de modelos federados e inspección de medidas.",
        "Creador de herramientas y ribbons propios en Revit (pyRevit + C#) y plataformas web interactivas para cálculo estructural.",
      ],
    },
    {
      id: "slide-3",
      badge: "SLIDE 03 // 6 PROYECTOS EMBLEMÁTICOS",
      title: "Portafolio de Obras Reales Destacadas",
      subtitle: "Infraestructura Crítica, Gran Minería e Industria Pesada",
      points: [
        "Paso Fronterizo Los Libertadores: Estructuras metálicas complejas a 3.200 msnm con condiciones climáticas extremas.",
        "Máquina Papelera MP5: Nave industrial pesada, losas masivas y fundaciones para maquinaria con vibraciones dinámicas.",
        "Proyecto Minero Arqueros: Edificio de chancado primario, muros de contención y tolvas de mineral grueso.",
        "Edificio Quimetal (Planta SO2 & Bisulfito): Ingeniería de detalle y planos de fabricación en Tekla para planta química.",
        "Aeropuerto AMB (Terminal 2): Megaestructura de 320.000 m², espigones T2D/T2F y naves de embarque.",
        "Hospital Marga Marga: 75.000 m² de hormigón armado con sistema de protección sísmica elastomérica.",
      ],
    },
    {
      id: "slide-4",
      badge: "SLIDE 04 // AUTOMATIZACIÓN EN REVIT",
      title: "Mis Pestañas y Ribbons Propios en Revit",
      subtitle: "Gallo_Document, Gallo_SSteel y Gallo_Concrete (C# .NET)",
      points: [
        "Pestaña Gallo_Document: Suite de planimetría, estandarización de documentos, gestión de perfiles ICHA y filtros de vista.",
        "Pestaña Gallo_SSteel: Macros y herramientas paramétricas para modelado de conexiones de acero y verificación dimensional.",
        "Pestaña Gallo_Concrete (C# .NET): Add-in compilado para generación y cubicación paramétrica de armaduras de hormigón.",
        "Herramientas activas en ribbon: Perfiles ICHA, DocuFlow BIM, Color Elements, Planimetría Suite, Renombrar Vistas y Type Search.",
        "Ahorro de hasta un 40% en tiempos de generación y revisión de documentación de planos.",
      ],
    },
    {
      id: "slide-5",
      badge: "SLIDE 05 // HERRAMIENTAS WEB PROPIAS",
      title: "Suite Web de Ingeniería (http://localhost:5174/herramientas)",
      subtitle: "Herramientas Presentadas a Diversos Equipos de Trabajo con Gran Acogida",
      points: [
        "Visor IFC Estructural 3D: Inspección WebGL en navegador sin necesidad de licencias pesadas.",
        "Catálogo & Motor de Cálculo ICHA: Consulta y cálculo instantáneo de propiedades para 2.130 perfiles chilenos.",
        "Catálogo AISC v15.0: Base interactiva de perfiles americanos en unidades métricas e imperiales.",
        "Calculadora de Escaleras Metálicas: Diseño bajo ley de Blondel (2h+b=630), perfiles canal C250 y gálibos de 2.2m.",
        "SmartPlant 3D (SP3D) MasterLab: Academia y simulador con PinPoint [F9] interactivo.",
        "Presentadas a múltiples equipos de proyecto con excelente valoración por su agilidad y practicidad.",
      ],
    },
    {
      id: "slide-6",
      badge: "SLIDE 06 // DIVULGACIÓN TÉCNICA & BLOG",
      title: "Publicaciones Técnicas y Artículos de Autoridad",
      subtitle: "Investigación, Normativas y Desarrollo de Aplicaciones para Revit",
      points: [
        "pyRevit Accelerator: El Camino Rápido para Crear Apps en Revit (Anatomía de una app y comparativa con C#).",
        "Roadmap: De Profesional de Obra a BIM Software Developer en 12 Meses (Enfoque híbrido Python + C#).",
        "Plan BIM Chile: Estándar para proyectos públicos e interoperabilidad abierta (OpenBIM / IFC).",
        "Revit 2027 Enfierraduras 3D: Modelado paramétrico de armaduras longitudinales y transversales.",
        "Tekla Structures 2026 Model Sharing: Servidores de caché y trabajo colaborativo distribuido.",
      ],
    },
    {
      id: "slide-7",
      badge: "SLIDE 07 // VALORES & FIT CON BBA",
      title: "Alineación con la Cultura de BBA Consultants",
      subtitle: "Espíritu Emprendedor, Fun & Collaboration, Mentoría y Retos Complejos",
      points: [
        "Espíritu Emprendedor: Iniciativa para crear herramientas propias en Python, Dynamo y C# que resuelven cuellos de botella.",
        "Fun & Collaboration: Actitud cercana, positiva y colaborativa en la interacción con especialidades de piping y mecánica.",
        "Compartir Conocimientos: Generosidad técnica para formar a modeladores junior y estandarizar plantillas.",
        "Desafíos Complejos: Pasión por la ingeniería de detalle en proyectos con alta sismicidad (NCh2369) e industria pesada.",
      ],
    },
    {
      id: "slide-8",
      badge: "SLIDE 08 // DUE DILIGENCE & METAS A 90 DÍAS",
      title: "Preguntas Estratégicas para BBA & Plan de Acción",
      subtitle: "Colaboración Bilingüe y Entrega de Valor Inmediata",
      points: [
        "Pregunta al Líder Estructural: Fases de proyectos activos en Santiago y entorno en Autodesk Construction Cloud (ACC).",
        "Pregunta al Project Manager: Dinámica de trabajo y coordinación con los equipos de BBA en Canadá.",
        "Pregunta a People & Culture: Hitos de éxito para los primeros 90 días en la disciplina de Estructuras.",
        "Meta personal a 90 días: Calidad técnica inmediata, apoyo a juniors y disposición para compartir mis herramientas.",
      ],
    },
  ];

  // 6 Proyectos Reales Solicitados Específicamente por el Usuario
  const proyectosSeleccionados = [
    {
      id: "libertadores",
      tag: "INFRAESTRUCTURA DE ALTA MONTAÑA",
      titulo: "Paso Fronterizo Los Libertadores",
      cliente: "MOP Chile",
      subtitulo: "Estructuras Metálicas Principales a 3.200 msnm",
      descripcion:
        "Modelado y detallamiento de estructuras metálicas pesadas en Tekla Structures para el complejo fronterizo internacional más importante de Chile, ubicado a 3.200 metros de altitud bajo severas cargas de nieve, viento y sismo.",
      herramientas: ["Tekla Structures", "AutoCAD", "NCh2369"],
      metricas: [
        { label: "Superficie", val: "35.000 m²" },
        { label: "Altitud", val: "3.200 msnm" },
        { label: "Software", val: "Tekla Structures" },
      ],
      desafio: "Condiciones de clima extremo de cordillera, grandes luces estructurales para naves de control y tolerancias estrictas de montaje.",
      solucion: "Detallamiento milimétrico de uniones apernadas de momento y cartelas reforzadas, asegurando montaje seguro sin soldaduras complejas en faena.",
      color: "from-blue-600/30 via-slate-900 to-slate-950",
      accent: "border-blue-500/40 text-blue-400",
    },
    {
      id: "mp5",
      tag: "INDUSTRIA PESADA / CELULOSA & PAPEL",
      titulo: "Máquina Papelera MP5",
      cliente: "Industria Papelera / CMPC",
      subtitulo: "Nave Industrial de Proceso Continuo & Cargas Dinámicas",
      descripcion:
        "Ingeniería de detalle estructural para la nave y cimentaciones de la Máquina Papelera MP5. Comprende pórticos de acero de gran tonelaje, vigas carrileras de puentes grúa y losas masivas con aislación de vibraciones mecánicas.",
      herramientas: ["Autodesk Revit", "Tekla Structures", "AutoCAD"],
      metricas: [
        { label: "Tipo", val: "Nave de Proceso" },
        { label: "Cargas", val: "Vibración Dinámica" },
        { label: "Equipamiento", val: "Puentes Grúa" },
      ],
      desafio: "Absorber las vibraciones operativas continuas de los rodillos de la máquina papelera sin transmitir fisuración a los pedestales de hormigón.",
      solucion: "Coordinación precisa de anclajes de alta resistencia, cajas de pernos y refuerzos estructurales bajo criterios de rigidez y serviciabilidad.",
      color: "from-amber-600/30 via-slate-900 to-slate-950",
      accent: "border-amber-500/40 text-amber-400",
    },
    {
      id: "arqueros",
      tag: "GRAN MINERÍA DEL COBRE",
      titulo: "Proyecto Minero Arqueros",
      cliente: "Minera Arqueros / Besalco Montajes",
      subtitulo: "Edificio de Chancado Primario & Muros de Sostenimiento Masivos",
      descripcion:
        "Diseño estructural y planos de fabricación para el edificio de chancado primario, tolva de recepción de mineral grueso, muros de sostenimiento masivo y estructuras de transferencia minera bajo normativa sísmica NCh2369.",
      herramientas: ["Tekla Structures", "Revit", "NCh2369"],
      metricas: [
        { label: "Área", val: "Chancado Primario" },
        { label: "Normativa", val: "NCh2369 Sísmica" },
        { label: "Detallamiento", val: "Acero Pesado + Tolvas" },
      ],
      desafio: "Soportar impactos cíclicos de vaciado de camiones tolva de 240 toneladas y empujes laterales dinámicos de mineral.",
      solucion: "Modelado 3D exhaustivo de blindajes, cartelas de arriostramiento concéntrico y losas de fundación macizas con densa enfierradura.",
      color: "from-emerald-600/30 via-slate-900 to-slate-950",
      accent: "border-emerald-500/40 text-emerald-400",
    },
    {
      id: "quimetal",
      tag: "INDUSTRIA QUÍMICA & PROCESOS",
      titulo: "Ingeniería de Detalles Estructurales Edificio Quimetal (Planta SO2 & Bisulfito)",
      cliente: "QUIMETAL Industrial S.A.",
      subtitulo: "Naves Metálicas de Proceso Químico & Soportes de Reactores",
      descripcion:
        "Ingeniería de detalles y planos de fabricación/montaje en Tekla Structures para la Planta SO2 & Bisulfito de Sodio de Quimetal Industrial. Comprende naves de proceso, plataformas operacionales, torres de absorción y racks de cañerías.",
      herramientas: ["Tekla Structures", "AutoCAD", "ICHA"],
      metricas: [
        { label: "Planta", val: "SO2 & Bisulfito" },
        { label: "Software", val: "Tekla Structures" },
        { label: "Entregables", val: "Planos Taller & Montaje" },
      ],
      desafio: "Ambiente corrosivo severo y necesidad de asegurar holguras milimétricas para reactores y cañerías de gases de azufre.",
      solucion: "Detallamiento de perfiles de acero con especificaciones de galvanizado e imprimación anticorrosiva especial, con planos de despiece listos para taller.",
      color: "from-cyan-600/30 via-slate-900 to-slate-950",
      accent: "border-cyan-500/40 text-cyan-400",
    },
    {
      id: "amb",
      tag: "INFRAESTRUCTURA AEROPORTUARIA",
      titulo: "Aeropuerto AMB – Nuevo Pudahuel (Terminal 2)",
      cliente: "SCL Terminal / DGAC",
      subtitulo: "Terminal Internacional T2M, Espigones T2D/T2F y Estacionamientos",
      descripcion:
        "Participación en la ingeniería de detalle y coordinación de estructuras de acero y hormigón armado para la ampliación del principal aeropuerto de Chile (320.000 m²), cubriendo naves de espigones y puentes de embarque.",
      herramientas: ["Autodesk Revit", "AutoCAD", "Navisworks (Revisión)"],
      metricas: [
        { label: "Superficie", val: "320.000 m²" },
        { label: "Edificios", val: "T2M + Espigones" },
        { label: "Tipo", val: "Aeroportuario" },
      ],
      desafio: "Geometrías curvas complejas en cubiertas metálicas, exigencias de arquitectura de clase mundial y estricto cumplimiento normativo.",
      solucion: "Modelado BIM 3D de alta definición en Revit, asegurando que las conexiones metálicas respetaran la estética arquitectónica y las tolerancias de montaje.",
      color: "from-indigo-600/30 via-slate-900 to-slate-950",
      accent: "border-indigo-500/40 text-indigo-400",
    },
    {
      id: "marga-marga",
      tag: "SALUD & PROTECCIÓN SÍSMICA",
      titulo: "Hospital Marga Marga",
      cliente: "Ministerio de Salud (MINSAL)",
      subtitulo: "75.000 m² de Hormigón Armado con Aisladores Sísmicos Elastoméricos",
      descripcion:
        "Desarrollo de planos de enfierraduras 3D y detalle estructural para edificio hospitalario de alta complejidad médica dotado de aisladores y deslizadores sísmicos en su subsuelo.",
      herramientas: ["Autodesk Revit", "AutoCAD", "ACI 318"],
      metricas: [
        { label: "Superficie", val: "75.000 m²" },
        { label: "Tecnología", val: "Aisladores Sísmicos" },
        { label: "Disciplina", val: "Hormigón Armado" },
      ],
      desafio: "Detallar la densa armadura de refuerzo en los capiteles y pedestales sobre los aisladores sísmicos para evitar congestión de enfierradura.",
      solucion: "Modelado 3D de las barras y estribos de confinamiento en Revit, verificando la colocación del hormigón sin generar nidos de piedra ni interferencias entre barras.",
      color: "from-purple-600/30 via-slate-900 to-slate-950",
      accent: "border-purple-500/40 text-purple-400",
    },
  ];

  // Herramientas Web Creadas en la Plataforma
  const herramientasWeb = [
    {
      nombre: "Visor IFC Estructural 3D",
      ruta: "/herramientas/visor-ifc",
      icono: "fa-cube",
      tag: "WebGL & Three.js",
      desc: "Visor BIM interactivo en navegador para abrir, inspeccionar propiedades, medir y aislar componentes estructurales de modelos IFC abiertos.",
      color: "border-cyan-500/40 text-cyan-400",
    },
    {
      nombre: "Catálogo & Calculador ICHA",
      ruta: "/herramientas/icha",
      icono: "fa-table-cells",
      tag: "2.130 Perfiles",
      desc: "Base de datos técnica exhaustiva de perfiles de acero chilenos (W, C, L, Tubulares) con cálculo automático de peso, inercia y módulos elásticos.",
      color: "border-emerald-500/40 text-emerald-400",
    },
    {
      nombre: "Catálogo AISC v15.0 Online",
      ruta: "/herramientas/aisc",
      icono: "fa-database",
      tag: "Norma Americana",
      desc: "Buscador y conversor dinámico de perfiles estructurales de la especificación AISC en unidades Métricas e Imperiales.",
      color: "border-blue-500/40 text-blue-400",
    },
    {
      nombre: "Calculadora de Escaleras Metálicas",
      ruta: "/herramientas/escaleras",
      icono: "fa-stairs",
      tag: "Canal C250 & Blondel",
      desc: "Módulo de cálculo normativo para escaleras industriales: validación de pendiente (2h+b=630), gálibos de 2.2m y perfiles portantes.",
      color: "border-amber-500/40 text-amber-400",
    },
    {
      nombre: "SmartPlant 3D (SP3D) MasterLab",
      ruta: "/herramientas/sp3d",
      icono: "fa-industry",
      tag: "Simulador Web PinPoint",
      desc: "Academia técnica y simulador web en tiempo real con 4 vistas de planta para entrenamiento en precisión de coordenadas PinPoint [F9].",
      color: "border-red-500/40 text-red-400",
    },
    {
      nombre: "Constructor de CV ATS para Ingenieros",
      ruta: "/herramientas/cv-ats",
      icono: "fa-file-lines",
      tag: "Optimización ATS",
      desc: "Generador de currículum técnico optimizado para pasar filtros automáticos de grandes consultoras y empresas mineras.",
      color: "border-purple-500/40 text-purple-400",
    },
  ];

  // Artículos Técnicos Publicados en el Blog (Incluyendo los 2 solicitados)
  const blogArticles = [
    {
      titulo: "pyRevit Accelerator: El Camino Rápido para Crear Apps en Revit",
      ruta: "/blog/pyrevit-accelerator",
      categoria: "pyRevit / Python",
      tiempo: "8 min",
      resumen: "Descubre por qué pyRevit es la forma más rápida de crear herramientas para Revit. Anatomía de una app, proceso de 7 pasos y comparativa con C#.",
      badge: "Destacado",
    },
    {
      titulo: "De Profesional de Obra a BIM Software Developer en 12 Meses",
      ruta: "/blog/bim-dev-roadmap",
      categoria: "Roadmap pyRevit + C#",
      tiempo: "15 min",
      resumen: "Guía completa para transicionar de la construcción tradicional al desarrollo de software BIM. Enfoque híbrido Python/pyRevit y C# (.NET).",
      badge: "Roadmap",
    },
    {
      titulo: "Plan BIM Chile: Estándar para Proyectos Públicos",
      ruta: "/blog/plan-bim-chile-estandar-proyectos-publicos",
      categoria: "Normativas",
      tiempo: "8 min",
      resumen: "Análisis profundo de la matriz de tipos de información, entregables IFC y requerimientos de interoperabilidad en Chile.",
      badge: "Normativa",
    },
    {
      titulo: "Revit 2027: Enfierraduras 3D Paramétricas",
      ruta: "/blog/revit-2027-1-enfierraduras-3d",
      categoria: "Modelado BIM",
      tiempo: "7 min",
      resumen: "Nuevas herramientas para armaduras longitudinales, ganchos sísmicos y cálculo automático de cubicaciones.",
      badge: "Modelado",
    },
    {
      titulo: "Tekla Structures 2026: Model Sharing en la Nube",
      ruta: "/blog/tekla-structures-2026-sp3-model-sharing",
      categoria: "Estructuras de Acero",
      tiempo: "9 min",
      resumen: "Estrategias de sincronización distribuida entre oficinas internacionales mediante servidores de caché locales.",
      badge: "Tekla",
    },
    {
      titulo: "Gemelos Digitales y Prefabricación Modular en Minería",
      ruta: "/blog/gemelos-digitales-prefabricacion-modular-mineria",
      categoria: "Minería 4.0",
      tiempo: "9 min",
      resumen: "Cómo la convergencia de nubes de puntos LiDAR y modelos federados asegura montajes con tolerancia milimétrica en faena.",
      badge: "Minería",
    },
  ];

  // Preguntas Estratégicas para BBA Consultants (12 preguntas en 4 categorías)
  const questionsForBBA = [
    // 1. EMPRESA & PROYECCIÓN LABORAL
    {
      id: "q-proy-1",
      categoria: "proyecciones",
      area: "People & Culture / Jefatura",
      icono: "fa-chart-line",
      color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
      badge: "Ruta de Carrera",
      destinatario: "People & Culture / Líder Estructural",
      pregunta: "¿Cómo está estructurada la progresión para un Diseñador Senior en BBA? ¿Existe una ruta formal de especialización técnica como Subject Matter Expert (SME) en modelado avanzado y automatización, o el desarrollo se canaliza hacia la coordinación y Lead Designer de disciplina?",
      motivo: "Comunica visión de permanencia a largo plazo, ambición técnica profesional y alineación con los planes de desarrollo de talento de BBA.",
    },
    {
      id: "q-proy-2",
      categoria: "proyecciones",
      area: "Dirección Regional / HR",
      icono: "fa-plane-departure",
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
      badge: "Colaboración Canadá",
      destinatario: "People & Culture / Project Manager",
      pregunta: "Dado el estrecho vínculo de la oficina de Santiago con Montreal y Toronto, ¿qué oportunidades existen de asignaciones temporales o comisiones de servicio técnico en proyectos en Canadá para quienes consolidan su desempeño bilingüe?",
      motivo: "Valida tu interés por el entorno global y multicultural de BBA, así como tu compromiso con el Plan de Segundo Idioma corporativo.",
    },
    {
      id: "q-proy-3",
      categoria: "proyecciones",
      area: "Gerencia de Operaciones Santiago",
      icono: "fa-building-shield",
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
      badge: "Estrategia Regional",
      destinatario: "Gerencia / Líder de Disciplina",
      pregunta: "BBA abrió su oficina en Santiago en 2021 con miras a convertirla en su hub para Sudamérica. ¿En qué etapa de consolidación se encuentra hoy la oficina respecto a autonomía para liderar ingenierías de detalle completas versus soporte de diseño para oficinas canadienses?",
      motivo: "Demuestra que investigaste a fondo la trayectoria de la firma en Chile y entiendes el rol estratégico de la sede local.",
    },

    // 2. PROYECTOS & OPERACIÓN MINERA
    {
      id: "q-proy-4",
      categoria: "proyectos",
      area: "Líder de Disciplina Estructural",
      icono: "fa-hard-hat",
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      badge: "Cartera Activa",
      destinatario: "Líder de Disciplina Estructural",
      pregunta: "Considerando los contratos activos de BBA con clientes como Codelco, Teck, Glencore o AMSA: ¿a qué proyecto o faena específica se integraría esta posición inicialmente, y predomina el modelado de acero pesado o fundaciones masivas de equipos?",
      motivo: "Demuestra conocimiento del mercado minero chileno y permite identificar de inmediato el software prioritario (Tekla vs. Revit).",
    },
    {
      id: "q-proy-5",
      categoria: "proyectos",
      area: "Project Manager / Coordinación",
      icono: "fa-layer-group",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      badge: "Etapa de Ingeniería",
      destinatario: "Project Manager",
      pregunta: "En los proyectos estructurales vigentes de la oficina, ¿predominan los estudios de prefactibilidad y factibilidad (PFS/FS) o los servicios de ingeniería de detalle con emisión de planos para fabricación y montaje (IFC)?",
      motivo: "Confirma el nivel de rigor constructivo y la densidad de planimetría que requerirá la gestión diaria del puesto.",
    },
    {
      id: "q-proy-6",
      categoria: "proyectos",
      area: "Constructibilidad & Terreno",
      icono: "fa-industry",
      color: "from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-400",
      badge: "Fabricación & Maestranza",
      destinatario: "Líder Estructural / PM",
      pregunta: "Cuando los planos se emiten para construcción, ¿el equipo de proyectistas de BBA participa en la revisión técnica de planos de taller de maestranza (Shop Drawings en Tekla) y resolución de consultas (RFI), o esa fase la asume el contratista EPC?",
      motivo: "Evidencia tu bagaje de maestranza y tu compromiso con que los detalles estructurales sean 100% montables en faena sin retrabajos.",
    },

    // 3. DÍA A DÍA & TRABAJO COLABORATIVO
    {
      id: "q-proy-7",
      categoria: "diario",
      area: "Dinámica Diseñador - Calculista",
      icono: "fa-handshake",
      color: "from-cyan-500/20 to-emerald-500/10 border-cyan-500/30 text-cyan-400",
      badge: "Día a Día",
      destinatario: "Líder de Disciplina Estructural",
      pregunta: "¿Cómo es la interacción cotidiana entre el Proyectista Senior y el Ingeniero Civil Estructural? ¿El diseñador cuenta con autonomía para proponer soluciones geométricas y tipologías de conexiones a partir de los esfuerzos, o se trabaja bajo esquemas cerrados?",
      motivo: "Permite saber si en BBA valoran tu criterio de 14+ años en diseño o si esperan un modelador pasivo dependiente de instrucciones.",
    },
    {
      id: "q-proy-8",
      categoria: "diario",
      area: "Coordinación Interdisciplinaria & BIM",
      icono: "fa-network-wired",
      color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
      badge: "Entorno Colaborativo",
      destinatario: "BIM Manager / Project Manager",
      pregunta: "En proyectos con piping pesado y tolvas de chancado, ¿cómo gestionan las interferencias interdisciplinarias en el día a día? ¿Operan sesiones periódicas de congelamiento de modelo (Model Freeze) y mesas de Clash Detection en Navisworks o ACC?",
      motivo: "Demuestra solvencia en metodologías de trabajo colaborativo multidisciplinario en grandes proyectos industriales.",
    },
    {
      id: "q-proy-9",
      categoria: "diario",
      area: "Trabajo Híbrido & Coordinación Bilingüe",
      icono: "fa-laptop-house",
      color: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400",
      badge: "Rutina & Horarios",
      destinatario: "Project Manager / Jefatura",
      pregunta: "Dado que Santiago y Montreal comparten prácticamente la misma zona horaria gran parte del año, ¿cómo se distribuye la interacción con Canadá? ¿Hay reuniones breves de alineamiento (Daily Standups) en inglés o se opera por gestores de tareas y modelos federados en la nube?",
      motivo: "Permite dimensionar la rutina semanal de trabajo híbrido y la frecuencia real de comunicación oral técnica en inglés.",
    },

    // 4. INNOVACIÓN & RETOS CRÍTICOS
    {
      id: "q-proy-10",
      categoria: "innovacion",
      area: "Innovación & Célula Digital",
      icono: "fa-lightbulb",
      color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400",
      badge: "Automatización & ROI",
      destinatario: "Líder de Disciplina / Digital Lead",
      pregunta: "BBA promueve el espíritu emprendedor y la resolución de desafíos complejos. ¿Qué apertura y canal formal existe para que un diseñador senior proponga e implemente rutinas de automatización en Python (pyRevit) o C# para beneficio de todo el equipo?",
      motivo: "Conecta directamente con tus pestañas Gallo_Document, Gallo_SSteel y Gallo_Concrete, demostrando retorno de inversión (ROI) colectivo.",
    },
    {
      id: "q-proy-11",
      categoria: "innovacion",
      area: "El Cuello de Botella Operativo",
      icono: "fa-bullseye",
      color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
      badge: "La Pregunta Clave",
      destinatario: "Project Manager / Jefatura de Ingeniería",
      pregunta: "Si pudieran señalar un solo desafío recurrente o cuello de botella en las entregas de modelos y planos estructurales del equipo actual (tiempos de cubicación, control de cambios o estandarización), ¿cuál sería y cómo esperan que este rol ayude a solucionarlo?",
      motivo: "Te posiciona instantáneamente como un solucionador estratégico de problemas antes que un simple dibujante de planos.",
    },
    {
      id: "q-proy-12",
      categoria: "innovacion",
      area: "Expectativa de Éxito a 90 Días",
      icono: "fa-trophy",
      color: "from-emerald-500/20 to-cyan-500/10 border-emerald-500/30 text-emerald-400",
      badge: "Hitos de Éxito",
      destinatario: "People & Culture / Jefatura Directa",
      pregunta: "Si en 6 meses revisamos mi desempeño en BBA, ¿qué hitos concretos tendrían que haberse cumplido para que ustedes consideren que mi incorporación fue una de las decisiones más acertadas del año?",
      motivo: "Comunica alta orientación al logro, claridad en expectativas y rendición de cuentas desde el primer minuto.",
    },
  ];

  // Preguntas Frecuentes de la Entrevista (Simulador STAR)
  const interviewFaqs = [
    {
      q: "¿Cómo aplicas la normativa sísmica industrial NCh2369 y los manuales ICHA en tus planos?",
      ans: "En estructuras industriales mineras en Chile, la NCh2369 es el pilar que define los factores de modificación de respuesta y ductilidad. Como Diseñador Estructural Senior traduzco las memorias del calculista en detalles constructivos reales: aplico las publicaciones del ICHA para definir espesores mínimos de cartelas, holguras de pernos de alta resistencia ASTM A325/A490, llaves de corte en placas base y biseles de soldadura según AWS D1.1. Mi enfoque garantiza que el plano sea 100% fabricable en taller y montable en terreno sin retrabajos.",
    },
    {
      q: "¿Cuál es tu nivel y uso de Navisworks Manage en proyectos multidisciplinarios?",
      ans: "Utilizo Navisworks Manage a nivel básico/funcional: lo empleo principalmente para la apertura e inspección visual de modelos federados que integran estructuras con cañerías y equipos mecánicos, así como para la toma de medidas, verificación de holguras de montaje y revisión general de constructibilidad, permitiéndome validar que los planos de detalle estructural no presenten conflictos espaciales evidentes.",
    },
    {
      q: "¿Cómo supervisas y apoyas el desarrollo de los modeladores y dibujantes junior?",
      ans: "Combino estandarización previa con mentoría pedagógica. Entrego a los junior plantillas de vista depuradas, familias paramétricas testeadas y checklists de calidad. Al revisar sus planos, no me limito a marcar correcciones: les explico el porqué constructivo de cada detalle (por ejemplo, el espacio necesario para que una llave de torque apriete un perno en faena). Esto eleva la autonomía del equipo y reduce los ciclos de revisión interna.",
    },
    {
      q: "¿Cómo es tu manejo del inglés para coordinar con los equipos de BBA en Canadá?",
      ans: "Tengo soltura en inglés técnico para leer especificaciones de ingeniería, códigos CSA/AISC y redactar reportes de coordinación. En reuniones virtuales me comunico con claridad apoyándome en el modelo 3D. Además, valoro enormemente el Plan de Segundo Idioma de BBA para continuar perfeccionando mi fluidez oral con las oficinas de Montreal y Toronto.",
    },
  ];

  const shareUrl = getShareUrl("/blog/presentacion-andres-gallo-disenador-estructural-senior");
  const shareTitle = encodeURIComponent("Andrés Gallo Parra: Perfil Profesional, Proyectos Clave & Visión Estructural (BBA Consultants)");

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      <SEOHead
        title="Andrés Gallo Parra | Diseñador Estructural Senior & Especialista en Automatización BIM"
        description="Presentación ejecutiva y técnica de Andrés Gallo Parra: más de 14 años en diseño estructural de gran minería e infraestructura, desarrollo en Python (pyRevit), Dynamo y C#, obras reales (Libertadores, AMB, Marga Marga, Quimetal) y herramientas interactivas."
        path="/blog/presentacion-andres-gallo-disenador-estructural-senior"
        keywords="Andrés Gallo Parra, Diseñador Estructural Senior, BBA Consultants, Modelado BIM, Tekla Structures, Revit, pyRevit, C#, Dynamo, NCh2369, ICHA, Los Libertadores, Aeropuerto AMB, Hospital Marga Marga, Quimetal"
        noindex={true}
      />

      {/* HEADER DE CONTROL SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              to="/blog"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-left text-[11px]" />
              <span>Blog Técnico</span>
            </Link>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-mono text-slate-400 truncate max-w-[200px] sm:max-w-none">
              Andrés Gallo // BBA Especial
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <i className="fa-solid fa-lock text-[9px]" /> Privado
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Modo Zen */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                isZenMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
              }`}
              title="Alternar Modo Zen de lectura técnica sin distracciones"
            >
              <i className={`fa-solid ${isZenMode ? "fa-eye-slash" : "fa-feather"}`} />
              <span>{isZenMode ? "Salir Zen" : "Modo Zen"}</span>
            </button>

            {/* Toggle Modo Presentación */}
            <button
              onClick={() => setIsSlideMode(!isSlideMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                isSlideMode
                  ? "bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30"
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/20"
              }`}
              title="Alternar entre modo artículo completo y diapositivas de presentación"
            >
              <i className={`fa-solid ${isSlideMode ? "fa-xmark" : "fa-display"}`} />
              <span>{isSlideMode ? "Salir de Diapositivas (Esc)" : "Iniciar Modo Presentación"}</span>
            </button>

            {/* Botón Imprimir / PDF */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors hidden sm:flex items-center gap-1.5"
              title="Guardar o imprimir como PDF"
            >
              <i className="fa-solid fa-print" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODO PRESENTACIÓN INTERACTIVO (SLIDESHOW) */}
      {isSlideMode ? (
        <section className="min-h-[85vh] flex flex-col justify-between max-w-5xl mx-auto px-4 py-8">
          {/* Barra superior de Diapositivas con botón destacado de Salir */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
              <span className="text-cyan-400 font-bold">
                {slides[currentSlide].badge}
              </span>

              <div className="flex items-center gap-3">
                <span>Diapositiva {currentSlide + 1} de {slides.length} (← / →)</span>
                {/* BOTÓN PROMINENTE PARA SALIR DEL MODO PRESENTACIÓN */}
                <button
                  onClick={() => setIsSlideMode(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 transition-colors flex items-center gap-1.5 shadow-sm font-bold"
                  title="Salir del modo presentación y volver al artículo completo"
                >
                  <i className="fa-solid fa-xmark text-sm" />
                  <span>Salir del Modo Presentación (Esc)</span>
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 h-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Tarjeta de la Diapositiva Actual */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="relative z-10 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  {slides[currentSlide].subtitle}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2 font-sans">
                  {slides[currentSlide].title}
                </h2>
                {slides[currentSlide].tagline && (
                  <p className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                    {slides[currentSlide].tagline}
                  </p>
                )}
              </div>

              {/* Contenido variable por diapositiva */}
              {slides[currentSlide].highlights && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {slides[currentSlide].highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                        {h.label}
                      </span>
                      <strong className="text-sm sm:text-base text-cyan-300 font-sans block">
                        {h.val}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              {slides[currentSlide].points && (
                <ul className="space-y-3.5 mt-6">
                  {slides[currentSlide].points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                      <span className="text-cyan-400 mt-1">
                        <i className="fa-solid fa-check-circle" />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Controles de Navegación de Diapositivas */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8 relative z-10 flex-wrap gap-4">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-chevron-left" />
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentSlide === idx
                        ? "bg-cyan-400 w-8"
                        : "bg-slate-700 hover:bg-slate-500"
                    }`}
                    title={`Ir a diapositiva ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSlideMode(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-xmark" />
                  <span>Salir del Modo Presentación</span>
                </button>

                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-30"
                >
                  <span>Siguiente</span>
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* MODO ARTÍCULO COMPLETO / BENTO GRID ULTRAMODERNO */
        <main className={`${isZenMode ? "max-w-4xl" : "max-w-6xl"} mx-auto px-4 sm:px-6 py-10 space-y-16 transition-all duration-300`}>
          {/* BANNER AVISO MODO ZEN */}
          {isZenMode && (
            <div className="sticky top-20 z-30 p-3.5 rounded-2xl bg-amber-950/90 border border-amber-500/40 backdrop-blur-md flex items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-2.5 text-xs font-mono text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold">MODO ZEN DE LECTURA TÉCNICA ACTIVO</span>
                <span className="hidden sm:inline text-amber-400/70">· Dossier enfocado sin distracciones</span>
              </div>
              <button
                onClick={() => setIsZenMode(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <i className="fa-solid fa-xmark text-xs" />
                <span>Salir del Modo Zen</span>
              </button>
            </div>
          )}

          {/* HERO BANNER PRINCIPAL */}
          <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-slate-800 bg-gradient-to-br from-slate-900 via-[#050b17] to-slate-950 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                  <i className="fa-solid fa-building-shield" />
                  <span>BBA Consultants // Diseñador Estructural</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <i className="fa-solid fa-code-branch" />
                  <span>Python, Dynamo & C# (.NET)</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <i className="fa-solid fa-clock-rotate-left" />
                  <span>+14 Años de Trayectoria</span>
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-sans leading-tight">
                  Andrés Gallo Parra
                  <span className="block text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-indigo-300 font-extrabold mt-1">
                    Diseñador Estructural Senior & Desarrollador de Automatizaciones BIM
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Más de 14 años desarrollando ingeniería de detalle, modelado 3D de alta precisión y planos de
                  fabricación y montaje para grandes obras mineras, industriales y de infraestructura crítica. Especialista en
                  estructuras de acero pesado bajo <strong>NCh2369</strong>, estándares <strong>ICHA</strong> y normativas
                  internacionales (AISC, ACI, CSA), complementado con programación de algoritmos y ribbons propios en
                  <strong> Python (pyRevit), Dynamo y C# (.NET)</strong>, y el desarrollo de un ecosistema web interactivo de herramientas de ingeniería.
                </p>
              </div>

              {/* Botonera Rápida de Interacción */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleToggleAudio}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
                    isPlayingAudio
                      ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20"
                  }`}
                  title="Escuchar audio resumen del pitch"
                >
                  <i className={`fa-solid ${isPlayingAudio ? "fa-pause" : "fa-volume-high"}`} />
                  <span>{isPlayingAudio ? "Pausar Pitch Audio" : "Escuchar Pitch (90s)"}</span>
                </button>

                <button
                  onClick={handleCopyPitch}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors flex items-center gap-2"
                  title="Copiar texto del pitch al portapapeles"
                >
                  <i className={`fa-solid ${copySuccess ? "fa-check text-emerald-400" : "fa-copy"}`} />
                  <span>{copySuccess ? "¡Copiado al Portapapeles!" : "Copiar Guión de Pitch"}</span>
                </button>

                <button
                  onClick={() => setIsSlideMode(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-play" />
                  <span>Iniciar Modo Diapositivas</span>
                </button>

                <a
                  href="https://www.linkedin.com/in/andresgallop/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-mono bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 transition-colors flex items-center gap-2 ml-auto"
                >
                  <i className="fa-brands fa-linkedin" />
                  <span>LinkedIn Oficial</span>
                </a>
              </div>
            </div>
          </section>

          {/* PESTAÑAS DE NAVEGACIÓN TEMÁTICA EN DOS LÍNEAS HORIZONTALES (SIN SCROLLBAR) */}
          <div className="space-y-2 pb-4 border-b border-slate-800 font-mono text-xs">
            {/* Primera Línea Horizontal: 01 a 04 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: "perfil", label: "01. Perfil & Pitch", icon: "fa-user-tie" },
                { id: "proyectos", label: "02. Proyectos Emblemáticos", icon: "fa-cubes-stacked" },
                { id: "automatizaciones", label: "03. Automatizaciones (pyRevit & C#)", icon: "fa-terminal" },
                { id: "herramientas", label: "04. Herramientas Web Creadas", icon: "fa-screwdriver-wrench" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 border text-center select-none ${
                      isActive
                        ? "text-cyan-300 font-bold border-cyan-500/40"
                        : "text-slate-400 hover:text-slate-200 border-slate-800/80 bg-slate-900/50 hover:bg-slate-800"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeBbaTabPill"
                        className="absolute inset-0 bg-slate-800/90 rounded-xl border border-cyan-400/50 shadow-md shadow-cyan-500/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    <i className={`fa-solid ${tab.icon} shrink-0 text-cyan-400/80 relative z-10`} />
                    <span className="truncate relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Segunda Línea Horizontal: 05 a 08 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: "blog", label: "05. Publicaciones & Blog", icon: "fa-newspaper" },
                { id: "bba", label: "06. Fit Cultural BBA", icon: "fa-building" },
                { id: "preguntas", label: "07. Preguntas para BBA", icon: "fa-comments" },
                { id: "star", label: "08. Simulador STAR", icon: "fa-circle-question" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 border text-center select-none ${
                      isActive
                        ? "text-cyan-300 font-bold border-cyan-500/40"
                        : "text-slate-400 hover:text-slate-200 border-slate-800/80 bg-slate-900/50 hover:bg-slate-800"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeBbaTabPill"
                        className="absolute inset-0 bg-slate-800/90 rounded-xl border border-cyan-400/50 shadow-md shadow-cyan-500/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    <i className={`fa-solid ${tab.icon} shrink-0 text-cyan-400/80 relative z-10`} />
                    <span className="truncate relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: PERFIL & PITCH ELEVATOR */}
          {activeTab === "perfil" && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 bg-slate-900/60 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 shadow-xl space-y-4">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                    // GUION EJECUTIVO DE APERTURA (90 SEGUNDOS)
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">
                    "Háblame de ti": Estructura Presente ➔ Pasado ➔ Futuro
                  </h3>
                  <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-3 font-sans">
                    <p>
                      <strong className="text-cyan-400 font-mono text-xs block uppercase">1. Presente:</strong>
                      "Soy Andrés Gallo Parra, Diseñador Estructural Senior con más de 14 años de experiencia especializada en el desarrollo, modelado 3D y detallamiento de ingeniería para proyectos de gran minería, energía, industria pesada e infraestructura..."
                    </p>
                    <p>
                      <strong className="text-emerald-400 font-mono text-xs block uppercase">2. Pasado Relevante & Proyectos Emblemáticos:</strong>
                      "He participado en obras icónicas como el Paso Fronterizo Los Libertadores, el Aeropuerto AMB Terminal 2, el Hospital Marga Marga con aisladores sísmicos, el Proyecto Minero Arqueros, la Máquina Papelera MP5 y la Planta de SO2 & Bisulfito de Quimetal. Domino Tekla Structures, Revit y AutoCAD con estricto cumplimiento de la NCh2369 y manuales ICHA, ocupando Navisworks a nivel básico para revisión visual e inspección..."
                    </p>
                    <p>
                      <strong className="text-amber-400 font-mono text-xs block uppercase">3. Futuro & Automatización:</strong>
                      "Desarrollo mis propios scripts y ribbons en Python (pyRevit), Dynamo y C# (.NET), habiendo creado pestañas completas como Gallo_Document, Gallo_SSteel y Gallo_Concrete, además de herramientas web de ingeniería presentadas con gran éxito a diversos equipos. Mi meta en BBA es aportar calidad de diseño inmediata, compartir mis herramientas y colaborar con los equipos de Chile y Canadá."
                    </p>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                      // INDICADORES CLAVE
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">Impacto Cuantitativo</h4>
                  </div>

                  <div className="space-y-4 font-mono">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-2xl font-black text-cyan-400">+14 Años</div>
                      <div className="text-xs text-slate-400">En Minería, Industria & Edificación</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-2xl font-black text-emerald-400">3 Pestañas Revit</div>
                      <div className="text-xs text-slate-400">Gallo_Document, SSteel & Concrete (C#)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-2xl font-black text-amber-400">6 Mega Obras</div>
                      <div className="text-xs text-slate-400">Libertadores, AMB, Marga Marga, etc.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stack Tecnológico & Normativo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/50 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <i className="fa-solid fa-laptop-code" />
                    <span>Software & Ecosistema de Modelado</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { name: "Tekla Structures", desc: "Acero pesado, spools, conexiones", badge: "Avanzado" },
                      { name: "Autodesk Revit", desc: "Hormigón, enfierraduras 3D, BIM", badge: "Avanzado" },
                      { name: "Python / pyRevit", desc: "Gallo_Document & Gallo_SSteel", badge: "Creador" },
                      { name: "C# (.NET)", desc: "Gallo_Concrete (Add-in compilado)", badge: "Creador" },
                      { name: "Dynamo Core", desc: "Modelado paramétrico algorítmico", badge: "Avanzado" },
                      { name: "AutoCAD 2D", desc: "Planimetría y estándares de detalle", badge: "Senior" },
                      { name: "Navisworks Manage", desc: "Revisión visual de modelos y medidas", badge: "Básico" },
                      { name: "Web Engineering Apps", desc: "React, WebGL, motores de cálculo", badge: "Desarrollador" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-white text-xs">{item.name}</strong>
                          <span className="text-[10px] text-cyan-400">{item.badge}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/50 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <i className="fa-solid fa-book-bookmark" />
                    <span>Normativas & Estándares de Diseño</span>
                  </div>
                  <div className="space-y-2.5 text-xs font-mono">
                    {[
                      { code: "NCh2369", title: "Diseño Sísmico de Estructuras e Instalaciones Industriales", area: "Chile (Minería)" },
                      { code: "Manuales ICHA", title: "Diseño en Acero y Proyectar en Acero Práctica Chilena", area: "Instituto Chileno del Acero" },
                      { code: "AISC 360 / 341", title: "Specification for Structural Steel Buildings & Seismic", area: "Internacional" },
                      { code: "ACI 318", title: "Building Code Requirements for Structural Concrete", area: "Fundaciones Pesadas" },
                      { code: "NCh433 / NCh427", title: "Diseño Sísmico de Edificios y Estructuras de Acero", area: "Chile (Edificación)" },
                    ].map((norma, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <strong className="text-emerald-400 font-bold block">{norma.code}</strong>
                          <span className="text-slate-300 text-[11px]">{norma.title}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 whitespace-nowrap">
                          {norma.area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROYECTOS EMBLEMÁTICOS (LOS 6 SOLICITADOS) */}
          {activeTab === "proyectos" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                    // PORTAFOLIO DE PROYECTOS REALES
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Obras Emblemáticas Desarrolladas a lo Largo de mi Trayectoria
                  </h3>
                  <p className="text-slate-400 text-sm max-w-2xl mt-1">
                    Proyectos destacados de mi catálogo y portafolio profesional en minería, infraestructura aeroportuaria, salud e industria pesada:
                  </p>
                </div>

                <Link
                  to="/proyectos"
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <span>Ver Catálogo Completo</span>
                </Link>
              </div>

              {/* Bento Grid de los 6 Proyectos Específicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proyectosSeleccionados.map((proj) => (
                  <div
                    key={proj.id}
                    className={`glass-card rounded-2xl p-6 border border-slate-800/90 bg-gradient-to-br ${proj.color} backdrop-blur-md hover:border-slate-600 transition-all duration-300 flex flex-col justify-between space-y-4`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-slate-950/80 text-cyan-400 border-cyan-500/30 font-bold uppercase">
                          {proj.tag}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {proj.cliente}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white leading-snug">
                        {proj.titulo}
                      </h4>
                      <p className="text-xs font-mono text-cyan-300/80">{proj.subtitulo}</p>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{proj.descripcion}</p>

                      <div className="space-y-1 pt-2 font-mono text-[11px] text-slate-300">
                        {proj.metricas.map((m, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/50">
                            <span className="text-slate-400">{m.label}:</span>
                            <span className="text-white font-bold">{m.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <div className="flex gap-1">
                        {proj.herramientas.map((h, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] border border-slate-800">
                            {h}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveProjectModal(proj)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1"
                      >
                        <span>Detalle</span>
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATIZACIONES (PESTAÑAS GALLO & SCRIPTS) */}
          {activeTab === "automatizaciones" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                  // DESARROLLO DE SOFTWARE & RIBBONS EN REVIT
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Mis Pestañas y Ribbons Personalizados en Revit
                </h3>
                <p className="text-slate-400 text-sm max-w-3xl mt-1 leading-relaxed">
                  Herramientas y macros reales desarrolladas en <strong>Python (pyRevit), Dynamo y C# (.NET)</strong> integradas
                  en tres pestañas de producción cotidiana: <strong>Gallo_Document</strong>, <strong>Gallo_SSteel</strong> y <strong>Gallo_Concrete</strong>.
                </p>
              </div>

              {/* Pestañas Principales en Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gallo_Document */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                      pyRevit / Python
                    </span>
                    <i className="fa-solid fa-folder-tree text-cyan-400 text-lg" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-sans">Gallo_Document</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Pestaña orientada a la estandarización documental, consulta de perfiles y gestión integral de planimetría.
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                    <div className="text-[11px] text-slate-400 font-bold">Herramientas en Ribbon:</div>
                    <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                      <li>• Perfiles ICHA</li>
                      <li>• Info Perfiles</li>
                      <li>• Estándar Hormigón</li>
                      <li>• Estándar Acero</li>
                      <li>• Steel Ref 2</li>
                      <li>• Time Sheet</li>
                    </ul>
                  </div>
                </div>

                {/* Gallo_SSteel */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      Python / Revit API
                    </span>
                    <i className="fa-solid fa-shapes text-amber-400 text-lg" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-sans">Gallo_SSteel</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Automatizaciones paramétricas especializadas en estructuras metálicas de acero pesado y conexiones apernadas.
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                    <div className="text-[11px] text-slate-400 font-bold">Herramientas en Ribbon:</div>
                    <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                      <li>• EP Steel 1 & 2</li>
                      <li>• Detalle Cartelas</li>
                      <li>• Spool Verifier</li>
                      <li>• Estandarización CAD</li>
                      <li>• Holguras Montaje</li>
                      <li>• Verificador NCh2369</li>
                    </ul>
                  </div>
                </div>

                {/* Gallo_Concrete */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      C# (.NET Add-in)
                    </span>
                    <i className="fa-solid fa-code text-emerald-400 text-lg" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-sans">Gallo_Concrete</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Add-in compilado de alto rendimiento en C# (.NET) para modelado y cubicación automática de armaduras y hormigón masivo.
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                    <div className="text-[11px] text-slate-400 font-bold">Herramientas en Ribbon:</div>
                    <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                      <li>• EP Conc 1 & 2</li>
                      <li>• Enfierraduras 3D</li>
                      <li>• Generador Estribos</li>
                      <li>• Peso Barras Auto</li>
                      <li>• Ganchos Sísmicos</li>
                      <li>• Cubicación Losas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Desglose de Scripts y Herramientas del Ribbon */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/40 space-y-5">
                <h4 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-cyan-400" />
                  <span>Catálogo de Funciones en los Paneles de Producción:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <strong className="text-cyan-400 block border-b border-slate-800 pb-1">Panel Planimetría</strong>
                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                      <strong>Planimetría Suite:</strong> Generación y armado automático de láminas con membretes, escalas y títulos estandarizados.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <strong className="text-emerald-400 block border-b border-slate-800 pb-1">Panel View & Filtros</strong>
                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                      <strong>Suite de Vistas, Plantillas & Filtros:</strong> Aplicación masiva de plantillas de vista estructurales y filtros de disciplina.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <strong className="text-amber-400 block border-b border-slate-800 pb-1">Panel DocuFlow</strong>
                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                      <strong>DocuFlow BIM & Renombrar Vistas:</strong> Automatización de nomenclatura de vistas y ordenamiento de planos según estándares de entrega.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <strong className="text-purple-400 block border-b border-slate-800 pb-1">Panel Utilitarios</strong>
                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                      <strong>Color Elements, Type Search & Recargar Links:</strong> Diagnóstico rápido de elementos no clasificados y recarga de enlaces BIM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HERRAMIENTAS WEB CREADAS (DESTACADAS POR PRESENTACIONES A EQUIPOS) */}
          {activeTab === "herramientas" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                    // SUITE WEB DE INGENIERÍA DESARROLLADA
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Herramientas Presentadas a Equipos de Trabajo con Excelente Acogida
                  </h3>
                  <p className="text-slate-400 text-sm max-w-3xl mt-1 leading-relaxed">
                    Aplicaciones y calculadoras interactivas desarrolladas en mi plataforma web. <strong>Han sido presentadas formalmente a diversos equipos de ingeniería y proyectos, destacando por su agilidad, exactitud técnica y facilidad de uso</strong>:
                  </p>
                </div>

                <Link
                  to="/herramientas"
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <i className="fa-solid fa-layer-group" />
                  <span>http://localhost:5174/herramientas</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {herramientasWeb.map((tool, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <i className={`fa-solid ${tool.icono} text-xl text-cyan-400`} />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {tool.tag}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white font-sans">{tool.nombre}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{tool.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400">
                        <i className="fa-solid fa-check-circle mr-1" /> Validada en Equipos
                      </span>
                      <Link
                        to={tool.ruta}
                        className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Abrir en Vivo</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PUBLICACIONES & BLOG TÉCNICO (INCLUYENDO LOS 2 POSTS SOLICITADOS) */}
          {activeTab === "blog" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block">
                    // DIVULGACIÓN TÉCNICA & ARTÍCULOS PUBLICADOS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Artículos Técnicos Destacados en mi Blog
                  </h3>
                  <p className="text-slate-400 text-sm max-w-2xl mt-1">
                    Publicaciones de autoridad sobre desarrollo de apps en Revit, transición a desarrollo BIM, normativas y estructuras:
                  </p>
                </div>

                <Link
                  to="/blog"
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <i className="fa-solid fa-newspaper" />
                  <span>Explorar Todo el Blog</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogArticles.map((art, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">{art.categoria}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{art.badge}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white font-sans leading-snug">{art.titulo}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{art.resumen}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">{art.tiempo} lectura</span>
                      <Link
                        to={art.ruta}
                        className="font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Leer Artículo</span>
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FIT CULTURAL BBA CONSULTANTS */}
          {activeTab === "bba" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                  // ALINEACIÓN CON LA CULTURA CORPORATIVA BBA
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Los 4 Valores de BBA Consultants y Mi Experiencia
                </h3>
                <p className="text-slate-400 text-sm max-w-2xl mt-1">
                  En la requisición req3126, BBA destaca cuatro pilares clave. Así se traducen en mi trayectoria:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    valor: "1. Espíritu Emprendedor",
                    lema: "Iniciativa y Proactividad",
                    desc: "No espero a que me señalen qué hacer. Cuando veo que un proceso de dibujo es repetitivo o genera retrasos, tomo la iniciativa de investigar, diseñar una rutina en Python o estandarizar una familia paramétrica para resolverlo definitivamente.",
                    ejemplo: "Creación autónoma de las pestañas Gallo_Document, Gallo_SSteel y Gallo_Concrete, además de calculadoras web interactivas.",
                    border: "hover:border-cyan-500/40",
                    badge: "text-cyan-400",
                    icono: "fa-rocket",
                  },
                  {
                    valor: "2. Fun & Collaboration",
                    lema: "Trabajo en Equipo y Disfrute",
                    desc: "La ingeniería de detalle de alta exigencia requiere un ambiente armónico y positivo. Disfruto trabajar con las especialidades de piping y mecánica, buscando soluciones constructivas con buena energía y camaradería.",
                    ejemplo: "Interacción fluida con diseñadores mecánicos para adaptar anclajes de equipos pesados de forma constructiva.",
                    border: "hover:border-emerald-500/40",
                    badge: "text-emerald-400",
                    icono: "fa-users",
                  },
                  {
                    valor: "3. Transmitir Conocimientos",
                    lema: "Mentoría Generosa a Juniors",
                    desc: "Un Diseñador Senior no acumula saber; lo multiplica. Me apasiona capacitar a dibujantes y modeladores junior, explicarles el criterio estructural y las razones normativas detrás de cada corrección para acelerar su crecimiento.",
                    ejemplo: "Compartir mis herramientas de pyRevit y plantillas estandarizadas para que los modeladores jóvenes reduzcan errores desde el día uno.",
                    border: "hover:border-amber-500/40",
                    badge: "text-amber-400",
                    icono: "fa-chalkboard-user",
                  },
                  {
                    valor: "4. Desafíos Más Complejos",
                    lema: "Ingeniería de Punta y Rigor",
                    desc: "Me apasionan los proyectos desafiantes: estructuras pesadas en zonas de alta sismicidad bajo NCh2369, puentes mayores, plantas químicas con corrosión severa y naves industriales con tolerancias milimétricas.",
                    ejemplo: "Obras icónicas resueltas como Los Libertadores a 3.200 msnm, AMB Terminal 2 y Hospital Marga Marga con aisladores.",
                    border: "hover:border-indigo-500/40",
                    badge: "text-indigo-400",
                    icono: "fa-brain",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`glass-card rounded-2xl p-6 sm:p-7 border border-slate-800 bg-slate-900/60 backdrop-blur-md ${item.border} transition-all duration-300 space-y-4`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${item.badge}`}>
                        {item.valor}
                      </span>
                      <i className={`fa-solid ${item.icono} text-slate-500 text-lg`} />
                    </div>

                    <h4 className="text-xl font-bold text-white font-sans">{item.lema}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.desc}</p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <strong className="text-slate-200 block mb-0.5">Evidencia Práctica:</strong>
                      {item.ejemplo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PREGUNTAS INTELIGENTES PARA BBA */}
          {activeTab === "preguntas" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                    // DUE DILIGENCE DEL CANDIDATO SENIOR
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Preguntas Estratégicas para los Entrevistadores de BBA
                  </h3>
                  <p className="text-slate-400 text-sm max-w-2xl mt-1">
                    Un Diseñador Senior no solo responde: investiga activamente la cultura, los proyectos mineros, el día a día y las proyecciones laborales para validar el encaje mutuo.
                  </p>
                </div>

                {/* Banner de Consejo */}
                <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 self-start md:self-auto shrink-0">
                  <i className="fa-solid fa-lightbulb text-amber-400" />
                  <span>12 Preguntas de Alto Impacto</span>
                </div>
              </div>

              {/* Filtros por Categoría */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                {[
                  { id: "todos", label: "Todas", count: questionsForBBA.length, icon: "fa-layer-group" },
                  { id: "proyecciones", label: "🏢 Proyecciones & Empresa", count: questionsForBBA.filter(q => q.categoria === "proyecciones").length, icon: "fa-chart-line" },
                  { id: "proyectos", label: "🏗️ Proyectos & Minería", count: questionsForBBA.filter(q => q.categoria === "proyectos").length, icon: "fa-hard-hat" },
                  { id: "diario", label: "⏱️ Día a Día & Trabajo", count: questionsForBBA.filter(q => q.categoria === "diario").length, icon: "fa-handshake" },
                  { id: "innovacion", label: "💡 Innovación & Retos", count: questionsForBBA.filter(q => q.categoria === "innovacion").length, icon: "fa-lightbulb" },
                ].map((filtro) => {
                  const isActive = selectedQuestionFilter === filtro.id;
                  return (
                    <button
                      key={filtro.id}
                      onClick={() => setSelectedQuestionFilter(filtro.id)}
                      className={`relative px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-colors duration-200 flex items-center gap-2 select-none ${
                        isActive
                          ? "text-slate-950"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeBbaQuestionFilterPill"
                          className="absolute inset-0 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/25 -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}
                      <i className={`fa-solid ${filtro.icon} relative z-10`} />
                      <span className="relative z-10">{filtro.label}</span>
                      <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? "bg-slate-950/25 text-slate-950 font-black" : "bg-slate-800 text-slate-400"}`}>
                        {filtro.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Grid de Preguntas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {questionsForBBA
                  .filter((q) => selectedQuestionFilter === "todos" || q.categoria === selectedQuestionFilter)
                  .map((q, idx) => {
                    const isCopied = copiedQuestionIndex === q.id;
                    return (
                      <div
                        key={q.id || idx}
                        className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 relative group"
                      >
                        <div className="space-y-3">
                          {/* Encabezado de Tarjeta */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400">
                              <i className={`fa-solid ${q.icono}`} />
                              <span>{q.area}</span>
                            </div>

                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {q.badge}
                            </span>
                          </div>

                          {/* Destinatario Sugerido */}
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800/80">
                            <i className="fa-solid fa-user-tag text-emerald-400 text-[10px]" />
                            <span>Formular a: <strong className="text-slate-200">{q.destinatario}</strong></span>
                          </div>

                          {/* Pregunta */}
                          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed font-sans pt-1">
                            "{q.pregunta}"
                          </p>
                        </div>

                        {/* Footer con Motivo y Acción */}
                        <div className="space-y-3 pt-3 border-t border-slate-800/80">
                          <div className="text-[11px] font-mono text-slate-400 leading-normal">
                            <span className="text-emerald-400 font-bold block mb-0.5">// Por qué hacerla y qué revela:</span>
                            {q.motivo}
                          </div>

                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(q.pregunta);
                                setCopiedQuestionIndex(q.id);
                                setTimeout(() => setCopiedQuestionIndex(null), 2000);
                              }}
                              className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-all duration-200 flex items-center gap-1.5"
                              title="Copiar texto de la pregunta"
                            >
                              <i className={`fa-solid ${isCopied ? "fa-check text-emerald-400" : "fa-copy"}`} />
                              <span>{isCopied ? "¡Copiada!" : "Copiar"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 8: SIMULADOR STAR DE PREGUNTAS FRECUENTES */}
          {activeTab === "star" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block">
                  // SIMULADOR DE ENTREVISTA TÉCNICA
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Preguntas Clave del Reclutador con Respuestas Estructuradas
                </h3>
                <p className="text-slate-400 text-sm max-w-2xl mt-1">
                  Haz clic en cada pregunta para desplegar la respuesta recomendada bajo el método STAR (Situación, Tarea, Acción, Resultado):
                </p>
              </div>

              <div className="space-y-4">
                {interviewFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3 font-sans">
                        <span className="text-cyan-400 font-mono text-xs">0{idx + 1}.</span>
                        {faq.q}
                      </span>
                      <i
                        className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${
                          expandedFaq === idx ? "rotate-180 text-cyan-400" : ""
                        }`}
                      />
                    </button>

                    {expandedFaq === idx && (
                      <div className="p-5 pt-0 border-t border-slate-800/80 bg-slate-950/60 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <strong className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                            Respuesta Recomendada:
                          </strong>
                          <p>{faq.ans}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODAL DE DETALLE DE PROYECTO */}
          {activeProjectModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-700 bg-slate-900 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {activeProjectModal.tag}
                  </span>
                  <button
                    onClick={() => setActiveProjectModal(null)}
                    className="text-slate-400 hover:text-white text-sm p-1"
                  >
                    <i className="fa-solid fa-xmark text-lg" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                    {activeProjectModal.titulo}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300 mt-1">
                    Cliente: {activeProjectModal.cliente}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {activeProjectModal.subtitulo}
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <p className="text-xs leading-relaxed font-sans">{activeProjectModal.descripcion}</p>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <strong className="text-amber-400 font-mono text-xs uppercase block">
                      El Desafío Crítico:
                    </strong>
                    <p>{activeProjectModal.desafio}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 font-mono text-xs uppercase block">
                      La Solución & Detallamiento de Andrés:
                    </strong>
                    <p>{activeProjectModal.solucion}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Herramientas: {activeProjectModal.herramientas.join(", ")}</span>
                  <button
                    onClick={() => setActiveProjectModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* COMPARTIR Y PIE DE PÁGINA */}
          <section className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-500 text-center sm:text-left">
              <span>Andrés Gallo Parra // Diseñador Estructural Senior</span>
              <span className="block text-[11px] text-slate-600">Preparación especial para BBA Consultants req3126</span>
            </div>

            <ShareArticle url={shareUrl} title={shareTitle} />
          </section>

          <div className="flex justify-center pt-8">
            <BlogBackButton />
          </div>

          {/* TOC FLOTANTE & DRAWER PARA LOS 8 PILARES */}
          <BlogScrollSpyTOC
            items={TOC_SECTIONS}
            title="Pilares BBA"
            estimatedReadTime="12 min"
            isZenMode={isZenMode}
            onZenModeToggle={() => setIsZenMode(!isZenMode)}
            onSelectSection={(id) => setActiveTab(id)}
          />
        </main>
      )}
    </div>
  );
};

export default PresentacionAndresGallo;
