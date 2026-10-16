import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import BlogBackButton from "../../components/BlogBackButton";
import BlogSeriesNav from "../../components/BlogSeriesNav";
import { BlogScrollSpyTOC } from "../../components/ui/BlogScrollSpyTOC";

export default function SmartPlant3DFundamentosGrillas() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = getShareUrl("/blog/smartplant-3d-fundamentos-grillas");
  const shareTitle = encodeURIComponent(
    isEn
      ? "SmartPlant 3D Fundamentals: Common Task, Workspace & Grid Wizard (EFV Labs)"
      : "Fundamentos de SmartPlant 3D: Common, Workspace y Grillas (Laboratorios EFV)"
  );

  const tocItems = [
    { id: "introduccion", title: isEn ? "1. Why Common Task Comes First" : "1. Por que Common es la Base", level: 2 },
    { id: "sesion-workspace", title: isEn ? "2. LAB-1: Session & 4-View Workspace" : "2. LAB-1: Sesion y Workspace 4 Vistas", level: 2 },
    { id: "define-workspace-filtros", title: isEn ? "3. LAB-2: Define Workspace & Filters" : "3. LAB-2: Define Workspace y Filtros", level: 2 },
    { id: "puntos-control", title: isEn ? "4. LAB-3: Control Points" : "4. LAB-3: Puntos de Control", level: 2 },
    { id: "grid-wizard", title: isEn ? "5. LAB-1A: Grid Wizard Step by Step" : "5. LAB-1A: Grid Wizard Paso a Paso", level: 2 },
    { id: "grillas-avanzadas", title: isEn ? "6. Advanced Grids: U04, U05 & U06" : "6. Grillas Avanzadas: U04, U05 y U06", level: 2 },
    { id: "cheatsheet", title: isEn ? "7. Commands CheatSheet" : "7. CheatSheet de Comandos", level: 2 },
    { id: "practica-simulador", title: isEn ? "8. Practice in the Web Simulator" : "8. Practica en el Simulador Web", level: 2 },
  ];

  const gridWizardParams = [
    { param: "Name", value: "U02 CS", note: isEn ? "Coordinate system name per unit" : "Nombre del sistema de coordenadas por unidad" },
    { param: "Axis for bearing", value: "North (Y)", note: isEn ? "Reference axis for plant north" : "Eje de referencia para el norte de planta" },
    { param: "Bearing", value: "N 0.00 deg E", note: isEn ? "0 deg = aligned with global north" : "0 deg = alineado al norte global" },
    { param: "Origin East (X)", value: "9144 mm", note: isEn ? "30 ft offset from global origin" : "Desplazamiento de 30 ft desde el origen global" },
    { param: "Origin North (Y)", value: "3048 mm", note: isEn ? "10 ft offset" : "Desplazamiento de 10 ft" },
    { param: "Origin Up (Z)", value: "0 mm", note: isEn ? "Base elevation" : "Elevacion base" },
    { param: "Name Rule (X/Y)", value: "Alphanumeric and Percent", note: isEn ? "Automatic grid line naming" : "Nomenclatura automatica de grillas" },
    { param: "Radial Cylinder / Plane", value: "Skip (Next)", note: isEn ? "Only for circular racks" : "Solo para racks circulares" },
  ];

  const cheatsheet = [
    { cmd: "Define Workspace", key: "Ctrl + W", use: isEn ? "Load objects from SQL Server into the session" : "Cargar objetos desde SQL Server a la sesion" },
    { cmd: "PinPoint", key: "F9", use: isEn ? "Precision placement bar (E, N, EL locks)" : "Barra de precision con bloqueos E, N, EL" },
    { cmd: "Named Views", key: isEn ? "Common ribbon" : "Cinta Common", use: isEn ? "Front / Top / Right / Isometric orientations" : "Orientaciones Front / Top / Right / Isometric" },
    { cmd: "Fit", key: isEn ? "View toolbar" : "Barra View", use: isEn ? "Fit all loaded objects to the active view" : "Encajar todos los objetos en la vista activa" },
    { cmd: "Select By Filter", key: "Tools", use: isEn ? "Select objects via Object Type filters" : "Seleccionar objetos via filtros Object Type" },
    { cmd: "Hide / Show All", key: "Tools", use: isEn ? "Isolate or restore model visibility" : "Aislar o restaurar la visibilidad del modelo" },
    { cmd: "Format > Styles", key: isEn ? "Top bar" : "Barra superior", use: isEn ? "Override colors (Green) or Style by Rule" : "Cambio de color (Green) o Style by Rule" },
    { cmd: "Grid Wizard", key: isEn ? "Grids task" : "Task Grids", use: isEn ? "6-step coordinate system generator" : "Generador de sistemas de coordenadas en 6 pasos" },
  ];

  return (
    <>
      <SEOHead
        title={
          isEn
            ? "SmartPlant 3D Fundamentals: Common Task, Workspace & Grid Wizard | Andres Gallo P."
            : "Fundamentos de SmartPlant 3D: Common, Workspace y Grillas (Grid Wizard) | Andres Gallo P."
        }
        description={
          isEn
            ? "First module of the SmartPlant 3D series based on the EFV training manuals: session files, 4-view workspace, Define Workspace filters, control points and the Grid Wizard with real labs U02, U04, U05 and U06."
            : "Primer modulo de la serie SmartPlant 3D basado en los manuales de entrenamiento EFV: archivos de sesion, workspace de 4 vistas, filtros Define Workspace, puntos de control y el Grid Wizard con los laboratorios reales U02, U04, U05 y U06."
        }
        keywords={[
          "SmartPlant 3D",
          "SP3D",
          "Intergraph Smart 3D",
          "Grid Wizard",
          "Define Workspace",
          "PinPoint F9",
          "Grillas SP3D",
          "Ingenieria de Plantas",
          "Andres Gallo Parra",
        ]}
        path="/blog/smartplant-3d-fundamentos-grillas"
      />

      {/* Barra de progreso de lectura superior */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-900/50 z-50 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30">
        <main className="max-w-7xl mx-auto">
          {/* Breadcrumb de navegacion */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8 border-b border-slate-800/80 pb-4 flex-wrap">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              {isEn ? "Home" : "Inicio"}
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-cyan-400 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <Link to="/blog/smartplant-3d-masterlab-simulador-interactivo" className="hover:text-cyan-400 transition-colors">
              SP3D MasterLab
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-mono font-medium truncate">
              {isEn ? "Fundamentals & Grids" : "Fundamentos y Grillas"}
            </span>
          </nav>

          <BlogBackButton />

          {/* Encabezado Principal */}
          <header className="mb-12 border-b border-slate-800/80 pb-10 mt-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono font-semibold tracking-wider uppercase">
                {isEn ? "SP3D Series - Module 01" : "Serie SP3D - Modulo 01"}
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-mono">
                Intergraph SmartPlant 3D (SP3D)
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono">
                {isEn ? "Level: Beginner" : "Nivel: Inicial"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              {isEn
                ? "SmartPlant 3D Fundamentals: Common Task, Workspace & Grid Wizard"
                : "Fundamentos de SmartPlant 3D: Common, Workspace y Grillas"}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-4xl leading-relaxed font-light mb-8">
              {isEn
                ? "Every SP3D discipline — equipment, piping, structures, electrical — begins in the same place: the Common task and the plant coordinate system. This module converts the official EFV labs into a guided digital workflow: session files, 4-view navigation, Define Workspace filters, control points and the 6-step Grid Wizard with the U02, U04, U05 and U06 training units."
                : "Toda disciplina de SP3D — equipos, piping, estructuras, electricidad — comienza en el mismo lugar: el task Common y el sistema de coordenadas de planta. Este modulo convierte los laboratorios oficiales EFV en un flujo digital guiado: archivos de sesion, navegacion en 4 vistas, filtros Define Workspace, puntos de control y el Grid Wizard de 6 pasos con las unidades de entrenamiento U02, U04, U05 y U06."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <i className="fa-solid fa-user-pen text-cyan-400"></i>
                Andres Gallo Parra (BIM Developer & Structural Designer)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-calendar text-slate-400"></i>
                {isEn ? "October 2026" : "Octubre 2026"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <i className="fa-solid fa-clock"></i>
                {isEn ? "20 min guided study" : "20 min estudio guiado"}
              </span>
            </div>
          </header>

          {/* Bento Grid: Metadatos del Modulo */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all">
              <div className="text-3xl font-extrabold text-cyan-400 font-mono mb-1">2</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {isEn ? "EFV Source Manuals" : "Manuales EFV Base"}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEn ? "Common Applications Labs + Grids/Structures labs." : "Common Applications Labs + Grids/Structures."}
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mb-1">9</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Labs</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEn ? "Sessions, filters, control points and 4 grid labs." : "Sesiones, filtros, puntos de control y 4 labs de grillas."}
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-all">
              <div className="text-3xl font-extrabold text-blue-400 font-mono mb-1">4</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {isEn ? "Simultaneous Views" : "Vistas Simultaneas"}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEn ? "Front, Top, Right and Isometric tiled workspace." : "Front, Top, Right e Isometrica en mosaico."}
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all">
              <div className="text-3xl font-extrabold text-amber-400 font-mono mb-1">6</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {isEn ? "Grid Wizard Steps" : "Pasos del Grid Wizard"}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEn ? "CS, elevations, X-planes, Y-planes and radial options." : "CS, elevaciones, planos X, planos Y y opciones radiales."}
              </p>
            </div>
          </section>

          {/* Cuerpo del articulo con indice lateral */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar con Tabla de Contenidos Dinamica */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md">
                <BlogScrollSpyTOC items={tocItems} activeColor="text-cyan-400" />

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {isEn ? "Series Hub" : "Hub de la Serie"}
                  </div>
                  <Link
                    to="/blog/smartplant-3d-masterlab-simulador-interactivo"
                    className="group flex flex-col gap-2 p-3 bg-slate-950/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-cyan-300">
                      <span>SP3D MasterLab</span>
                      <i className="fa-solid fa-arrow-right text-cyan-400 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {isEn
                        ? "Back to the learning path with all 6 disciplines."
                        : "Vuelve a la ruta de aprendizaje con las 6 disciplinas."}
                    </p>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Contenido Editorial Tecnico */}
            <div className="lg:col-span-9 space-y-16">
              {/* Seccion 1: Por que Common es la base */}
              <section id="introduccion" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    1
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "Why the Common Task Comes First" : "Por que el Task Common es la Base de Todo"}
                  </h2>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    {isEn
                      ? "SmartPlant 3D is not a file-based CAD: the plant lives in a relational database (SQL Server) and the graphic windows are just live queries. The Common task is the neutral environment where you configure that relationship before touching any discipline: session files, window layouts, units of measure, named views and workspace filters."
                      : "SmartPlant 3D no es un CAD basado en archivos: la planta vive en una base de datos relacional (SQL Server) y las ventanas graficas son simplemente consultas en vivo. El task Common es el entorno neutro donde se configura esa relacion antes de tocar cualquier disciplina: archivos de sesion, disposicion de ventanas, unidades de medida, vistas nombradas y filtros de workspace."}
                  </p>
                  <p>
                    {isEn
                      ? "The EFV training methodology proves it: before routing a single pipe or placing a column, the modeler must master session management (LAB-1), the three filter families (LAB-2A/2B/2C), control points (LAB-3) and the grid system (LAB-1A to LAB-4). Skipping this module is the number one cause of rework in real plant projects."
                      : "La metodologia de entrenamiento EFV lo demuestra: antes de rutar una sola tuberia o posicionar una columna, el modelador debe dominar la gestion de sesiones (LAB-1), las tres familias de filtros (LAB-2A/2B/2C), los puntos de control (LAB-3) y el sistema de grillas (LAB-1A a LAB-4). Saltarse este modulo es la causa numero uno de retrabajo en proyectos reales de planta."}
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
                  <i className="fa-solid fa-circle-info text-cyan-400 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn
                      ? "Source material: this article adapts and explains the EFV manuals '01 SmartPlant3D Common' (14 pages) and '02 SmartPlant3D Grids/Structures' (21 pages), complemented by the 143-page Common reference manual. All figures are original captures optimized to WebP, without third-party corporate branding."
                      : "Material fuente: este articulo adapta y explica los manuales EFV '01 SmartPlant3D Common' (14 paginas) y '02 SmartPlant3D Grids/Structures' (21 paginas), complementados con el manual de referencia Common de 143 paginas. Todas las laminas son capturas originales optimizadas a WebP, sin marcas corporativas de terceros."}
                  </p>
                </div>
              </section>

              {/* Seccion 2: LAB-1 Sesion y Workspace */}
              <section id="sesion-workspace" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    2
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "LAB-1: Session Files, Tasks and the 4-View Workspace" : "LAB-1: Archivos de Sesion, Tasks y el Workspace de 4 Vistas"}
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    {isEn
                      ? "A session file (.ses) stores your working context: which tasks are loaded, how many windows are open, their orientation and your units. Creating it correctly on day one avoids the classic mistake of modeling with mixed units or without the required disciplines enabled."
                      : "Un archivo de sesion (.ses) almacena tu contexto de trabajo: que tasks estan cargados, cuantas ventanas hay abiertas, su orientacion y tus unidades. Crearlo correctamente el primer dia evita el error clasico de modelar con unidades mezcladas o sin las disciplinas necesarias habilitadas."}
                  </p>
                </div>

                <ol className="mt-6 space-y-3 text-sm text-slate-300 list-none">
                  {[
                    isEn
                      ? "Launch SP3D from Start > Programs > Intergraph SmartPlant 3D. In the New dialog select the Empty file and click OK."
                      : "Inicia SP3D desde Inicio > Programs > Intergraph SmartPlant 3D. En el cuadro New selecciona el archivo Empty y haz click en OK.",
                    isEn
                      ? "Open Tasks > Configure Tasks List, move every available task with Add and confirm. This enables Common, Grids, Equipment, Piping, Structure, Electrical and Drawings in the same environment."
                      : "Abre Tasks > Configure Tasks List, traslada todos los tasks disponibles con Add y confirma. Esto habilita Common, Grids, Equipment, Piping, Structure, Electrical y Drawings en el mismo entorno.",
                    isEn
                      ? "Switch to the Common task. From the Windows menu choose New Window until you have 4 windows, then apply Tile Horizontally."
                      : "Cambia al task Common. Desde el menu Windows selecciona New Window hasta completar 4 ventanas y aplica Tile Horizontally.",
                    isEn
                      ? "Activate each Graphic View and assign a different Named View: Front, Top, Right and Isometric. You now have a quad viewport equivalent to a 3D CAD viewport cube."
                      : "Activa cada Graphic View y asigna una Named View distinta: Front, Top, Right e Isometric. Ya tienes un viewport cuadruple equivalente al cubo de vistas de un CAD 3D.",
                    isEn
                      ? "Open Tools > Options and, in the Units of Measure tab, set distance readout to ft-in (or your project standard) before modeling anything."
                      : "Abre Tools > Options y, en la pestaña Units of Measure, define el readout de distancia en ft-in (o el estandar de tu proyecto) antes de modelar cualquier cosa.",
                    isEn
                      ? "Save the session with File > Save As on your desktop: that shortcut restores your entire working context in one double click."
                      : "Guarda la sesion con File > Save As en tu escritorio: ese acceso directo restaura todo tu contexto de trabajo con un doble click.",
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/15 text-cyan-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <img
                      src="/assets/blog/sp3d-fundamentos-grillas/common/common-p02-2.webp"
                      alt={isEn ? "SP3D New session dialog with Empty, EnglishUnits and MetricUnits templates" : "Cuadro New de SP3D con plantillas Empty, EnglishUnits y MetricUnits"}
                      loading="lazy"
                      className="w-full rounded-lg border border-slate-700/60"
                    />
                    <figcaption className="text-[11px] text-slate-400 font-mono mt-2">
                      {isEn ? "Fig. 1 - New session: start from the Empty template." : "Fig. 1 - Nueva sesion: partir desde la plantilla Empty."}
                    </figcaption>
                  </figure>
                  <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <img
                      src="/assets/blog/sp3d-fundamentos-grillas/common/common-p04-2.webp"
                      alt={isEn ? "Options dialog, Units of Measure tab with ft-in distance readout" : "Cuadro Options, pestaña Units of Measure con readout ft-in"}
                      loading="lazy"
                      className="w-full rounded-lg border border-slate-700/60"
                    />
                    <figcaption className="text-[11px] text-slate-400 font-mono mt-2">
                      {isEn ? "Fig. 2 - Tools > Options: distance readout in ft-in." : "Fig. 2 - Tools > Options: readout de distancia en ft-in."}
                    </figcaption>
                  </figure>
                </div>
              </section>

              {/* Seccion 3: LAB-2 Define Workspace y Filtros */}
              <section id="define-workspace-filtros" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    3
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "LAB-2A/2B/2C: Define Workspace and the Three Filter Families" : "LAB-2A/2B/2C: Define Workspace y las Tres Familias de Filtros"}
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    {isEn
                      ? "Define Workspace (File menu or Ctrl+W) is the SP3D equivalent of opening a file: you choose the plant, a filter and SP3D streams only those objects from SQL Server into your session. Mastering filters is what separates a fast modeler from someone waiting minutes for the full plant to load."
                      : "Define Workspace (menu File o Ctrl+W) es el equivalente en SP3D a abrir un archivo: eliges la planta, un filtro, y SP3D transfiere solo esos objetos desde SQL Server a tu sesion. Dominar los filtros es lo que separa a un modelador rapido de alguien que espera minutos a que cargue la planta completa."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-sm font-mono font-bold text-cyan-400 mb-2">LAB-2A: System Filters</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isEn
                        ? "In Define Workspace > More, create a My Filters > Simple Filter named U01, selecting the U01 system and its U01 CS coordinate system with CTRL. Load only the unit you will actually edit."
                        : "En Define Workspace > More, crea un My Filters > Simple Filter llamado U01, seleccionando el sistema U01 y su sistema de coordenadas U01 CS con CTRL. Carga solo la unidad que realmente editaras."}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-sm font-mono font-bold text-emerald-400 mb-2">LAB-2B: Object Type</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isEn
                        ? "Tools > Select By Filter > SP3D Object Filters > Object Type (e.g. Structure or Cableway). Combine with Hide / Show All and Format > Styles > Green to audit a single discipline. Restore with Style by Rule."
                        : "Tools > Select By Filter > SP3D Object Filters > Object Type (ej. Structure o Cableway). Combina con Hide / Show All y Format > Styles > Green para auditar una sola disciplina. Restaura con Style by Rule."}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-sm font-mono font-bold text-amber-400 mb-2">LAB-2C: Volume Filters</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isEn
                        ? "Create a Simple Filter (e.g. Volume U01) choosing the volume in both the Names Space and Volume tabs with CTRL. Hide the volume itself to inspect its contents, then Show All to restore."
                        : "Crea un Simple Filter (ej. Volume U01) eligiendo el volumen tanto en la pestaña Names Space como en Volume con CTRL. Oculta el volumen con Hide para inspeccionar su contenido y restauralo con Show All."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <img
                      src="/assets/blog/sp3d-fundamentos-grillas/common/common-p11-2.webp"
                      alt={isEn ? "All structural objects selected via Object Type filter" : "Todos los objetos estructurales seleccionados via filtro Object Type"}
                      loading="lazy"
                      className="w-full rounded-lg border border-slate-700/60"
                    />
                    <figcaption className="text-[11px] text-slate-400 font-mono mt-2">
                      {isEn ? "Fig. 3 - Object Type filter: full structure selected." : "Fig. 3 - Filtro Object Type: estructura completa seleccionada."}
                    </figcaption>
                  </figure>
                  <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <img
                      src="/assets/blog/sp3d-fundamentos-grillas/common/common-p13-2.webp"
                      alt={isEn ? "Volume filter isolating objects inside volume U01" : "Filtro de volumen aislando los objetos dentro del volumen U01"}
                      loading="lazy"
                      className="w-full rounded-lg border border-slate-700/60"
                    />
                    <figcaption className="text-[11px] text-slate-400 font-mono mt-2">
                      {isEn ? "Fig. 4 - Volume filter: only objects inside U01." : "Fig. 4 - Filtro de volumen: solo objetos dentro de U01."}
                    </figcaption>
                  </figure>
                </div>
              </section>

              {/* Seccion 4: LAB-3 Puntos de Control */}
              <section id="puntos-control" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    4
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "LAB-3: Inserting Control Points" : "LAB-3: Insercion de Puntos de Control"}
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    {isEn
                      ? "Control points are engineering markers tied to database objects: they flag tie-ins, instrument connections or survey targets without adding geometry. In the EFV lab you place one on the N1 nozzle of equipment E-102."
                      : "Los puntos de control son marcadores de ingenieria asociados a objetos de la base de datos: señalan tie-ins, conexiones de instrumentos o hitos de terreno sin agregar geometria. En el laboratorio EFV se coloca uno sobre el nozzle N1 del equipo E-102."}
                  </p>
                </div>

                <ol className="mt-6 space-y-3 text-sm text-slate-300 list-none">
                  {[
                    isEn
                      ? "Load the U01 filter in your workspace so equipment E-102 is visible."
                      : "Carga el filtro U01 en tu workspace para que el equipo E-102 sea visible.",
                    isEn
                      ? "Open Format > View and enable the Reference Geometry aspect, otherwise the insertion target stays hidden."
                      : "Abre Format > View y habilita el aspect Reference Geometry; de lo contrario el objetivo de insercion permanece oculto.",
                    isEn
                      ? "Use Insert > Control Point and click equipment E-102 to relate the point to the object."
                      : "Usa Insert > Control Point y haz click en el equipo E-102 para relacionar el punto al objeto.",
                    isEn
                      ? "In the Sub-Type box choose Process Equipment and place the control point on nozzle N1."
                      : "En la casilla Sub-Type selecciona Process Equipment y coloca el punto de control en el nozzle N1.",
                    isEn
                      ? "Select the control point and review its properties palette: rename it and document its purpose for the piping team."
                      : "Selecciona el punto de control y revisa su paleta de propiedades: renombralo y documenta su proposito para el equipo de piping.",
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>



              {/* Seccion 5: LAB-1A Grid Wizard */}
              <section id="grid-wizard" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    5
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "LAB-1A: Grid Wizard Step by Step (Unit U02)" : "LAB-1A: Grid Wizard Paso a Paso (Unidad U02)"}
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    {isEn
                      ? "Grids in SP3D are not drawn lines: they are parametric planes bound to a coordinate system. The Grid Wizard (Grids task, vertical toolbar) generates the complete system in 6 steps: coordinate system, elevations, X-planes, Y-planes, radial cylinder and radial plane. For a rectangular industrial building you only use the first four."
                      : "Las grillas en SP3D no son lineas dibujadas: son planos parametricos asociados a un sistema de coordenadas. El Grid Wizard (task Grids, barra vertical) genera el sistema completo en 6 pasos: sistema de coordenadas, elevaciones, planos X, planos Y, cilindro radial y plano radial. Para un edificio industrial rectangular solo se usan los cuatro primeros."}
                  </p>
                </div>

                {/* Tabla de parametros del Wizard */}
                <div className="overflow-x-auto mt-6 rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-900 text-white font-mono text-xs">
                        <th className="p-3">{isEn ? "Parameter" : "Parametro"}</th>
                        <th className="p-3 text-cyan-400">{isEn ? "Lab Value (U02)" : "Valor Lab (U02)"}</th>
                        <th className="p-3">{isEn ? "Engineering Note" : "Nota de Ingenieria"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-xs">
                      {gridWizardParams.map((row) => (
                        <tr key={row.param}>
                          <td className="p-3 font-bold text-white font-mono">{row.param}</td>
                          <td className="p-3 text-cyan-300 font-mono">{row.value}</td>
                          <td className="p-3 text-slate-400">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <img
                      src="/assets/blog/sp3d-fundamentos-grillas/grillas/grillas-p02-2.webp"
                      alt={isEn ? "Grid Wizard step 1: create coordinate system U02-CS with origin and bearing" : "Grid Wizard paso 1: crear sistema de coordenadas U02-CS con origen y bearing"}
                      loading="lazy"
                      className="w-full rounded-lg border border-slate-700/60"
                    />
                    <figcaption className="text-[11px] text-slate-400 font-mono mt-2">
                      {isEn ? "Fig. 5 - Step 1: coordinate system U02-CS." : "Fig. 5 - Paso 1: sistema de coordenadas U02-CS."}
                    </figcaption>
                  </figure>
                  <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <img
                      src="/assets/blog/sp3d-fundamentos-grillas/grillas/grillas-p04-2.webp"
                      alt={isEn ? "Grid Wizard step 3: X-planes with spacing and name rule" : "Grid Wizard paso 3: planos X con espaciamiento y name rule"}
                      loading="lazy"
                      className="w-full rounded-lg border border-slate-700/60"
                    />
                    <figcaption className="text-[11px] text-slate-400 font-mono mt-2">
                      {isEn ? "Fig. 6 - Step 3: grid X-planes with copies and spacing." : "Fig. 6 - Paso 3: planos X con copias y espaciamiento."}
                    </figcaption>
                  </figure>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn
                      ? "Common mistake: after finishing the wizard the grids look correct but belong to the wrong parent. Always select the new CS in the Workspace Explorer and set its System property to CS (System > More), then verify with View > Ruler before handing the grid to the structural team."
                      : "Error frecuente: al terminar el wizard las grillas se ven correctas pero cuelgan del padre equivocado. Selecciona siempre el nuevo CS en el Workspace Explorer y cambia su propiedad System a CS (System > More), luego verifica con View > Ruler antes de entregar la grilla al equipo estructural."}
                  </p>
                </div>

                <figure className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 mt-6">
                  <img
                    src="/assets/blog/sp3d-fundamentos-grillas/grillas/grillas-p13-2.webp"
                    alt={isEn ? "Isometric view of the finished U02 grid with elevations El 0 to El 44" : "Vista isometrica de la grilla U02 terminada con elevaciones El 0 a El 44"}
                    loading="lazy"
                    className="w-full max-w-xl mx-auto rounded-lg border border-slate-700/60"
                  />
                  <figcaption className="text-[11px] text-slate-400 font-mono mt-2 text-center">
                    {isEn
                      ? "Fig. 7 - Expected result: U02 grid system with stacked elevations (iso view + Fit)."
                      : "Fig. 7 - Resultado esperado: sistema de grillas U02 con elevaciones apiladas (vista Iso + Fit)."}
                  </figcaption>
                </figure>
              </section>

              {/* Seccion 6: Grillas Avanzadas U04, U05 y U06 */}
              <section id="grillas-avanzadas" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    6
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "Advanced Grids: U04, Rotated Planes (U05) and Rotated CS (U06)" : "Grillas Avanzadas: U04, Planos Rotados (U05) y CS Rotado (U06)"}
                  </h2>
                </div>

                <div className="space-y-4 mt-2">
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-border-all text-blue-400" />
                      LAB-1B: {isEn ? "Imperial units & nesting (U04)" : "Unidades imperiales y nesting (U04)"}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {isEn
                        ? "Same wizard, but with Permission Group = Layout, origin at E 36576 / N 24384 / Z 0 mm, Name Rule = Imperial Position and Nesting Level = Primary. The rule change makes grid labels read in feet-inches directly on plans."
                        : "Mismo wizard, pero con Permission Group = Layout, origen en E 36576 / N 24384 / Z 0 mm, Name Rule = Imperial Position y Nesting Level = Primary. El cambio de regla hace que las etiquetas de grilla se lean en pies-pulgadas directamente en los planos."}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-rotate text-purple-400" />
                      LAB-3: {isEn ? "Rotating individual grid planes (U05)" : "Rotacion de planos individuales (U05)"}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {isEn
                        ? "Non-orthogonal geometry does not require a new system: open Grid Plane Properties per line and rotate around an axis. The lab skews the U05 rack: plane A → Y axis 95.0 deg, plane B → Y axis 85.0 deg, plane 1 → X axis 85.0 deg and plane 2 → X axis 95.0 deg."
                        : "La geometria no ortogonal no requiere un sistema nuevo: abre Grid Plane Properties por linea y rota sobre un eje. El laboratorio oblicua el rack U05: plano A → eje Y 95.0 deg, plano B → eje Y 85.0 deg, plano 1 → eje X 85.0 deg y plano 2 → eje X 95.0 deg."}
                    </p>

                    <figure className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 mt-4">
                      <img
                        src="/assets/blog/sp3d-fundamentos-grillas/grillas/grillas-p18-2.webp"
                        alt={isEn ? "Grid Plane Properties with Y rotation axis and 95 degree angle" : "Grid Plane Properties con eje de rotacion Y y angulo de 95 grados"}
                        loading="lazy"
                        className="w-full max-w-md mx-auto rounded-lg border border-slate-700/60"
                      />
                      <figcaption className="text-[11px] text-slate-400 font-mono mt-2 text-center">
                        {isEn ? "Fig. 8 - Grid Plane Properties: Axis of Rotation Y, Angle 95.0 deg." : "Fig. 8 - Grid Plane Properties: Axis of Rotation Y, Angle 95.0 deg."}
                      </figcaption>
                    </figure>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-compass text-amber-400" />
                      LAB-4: {isEn ? "Rotated coordinate system (U06)" : "Sistema de coordenadas rotado (U06)"}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {isEn
                        ? "When a whole unit is skewed against plant north, rotate the CS itself: Bearing = N 20.00 deg E with origin at E 20 ft / N -30 ft / EL 0 ft. Every plane created under U06 CS inherits the rotation, keeping local dimensions orthogonal."
                        : "Cuando una unidad completa esta oblicua respecto al norte de planta, se rota el CS completo: Bearing = N 20.00 deg E con origen en E 20 ft / N -30 ft / EL 0 ft. Cada plano creado bajo U06 CS hereda la rotacion, manteniendo las dimensiones locales ortogonales."}
                    </p>
                  </div>
                </div>
              </section>


              {/* Seccion 7: CheatSheet */}
              <section id="cheatsheet" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm border border-cyan-500/30">
                    7
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "Common Task CheatSheet" : "CheatSheet del Task Common"}
                  </h2>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-900 text-white font-mono text-xs">
                        <th className="p-3">{isEn ? "Command" : "Comando"}</th>
                        <th className="p-3 text-cyan-400">{isEn ? "Access" : "Acceso"}</th>
                        <th className="p-3">{isEn ? "What it does" : "Para que sirve"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-xs">
                      {cheatsheet.map((row) => (
                        <tr key={row.cmd}>
                          <td className="p-3 font-bold text-white font-mono">{row.cmd}</td>
                          <td className="p-3 text-cyan-300 font-mono">{row.key}</td>
                          <td className="p-3 text-slate-400">{row.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Seccion 8: Practica en el Simulador */}
              <section id="practica-simulador" className="scroll-mt-20">
                <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border-2 border-cyan-500/40 rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-mono font-bold uppercase">
                      {isEn ? "Live Practice" : "Practica en Vivo"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {isEn
                        ? "Rehearse This Module in the SP3D MasterLab Simulator"
                        : "Ensaya este Modulo en el Simulador SP3D MasterLab"}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {isEn
                        ? "Train the same concepts without installing SP3D: 4-view viewport (Front, Top, Right, Isometric), PinPoint [F9] coordinate locks and Define Workspace logic with live SQL feedback."
                        : "Entrena los mismos conceptos sin instalar SP3D: viewport de 4 vistas (Front, Top, Right, Isometric), bloqueos de coordenadas PinPoint [F9] y logica Define Workspace con retroalimentacion SQL en vivo."}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        to="/herramientas/smartplant-3d"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-xl shadow-cyan-500/20 hover:scale-105"
                      >
                        <i className="fa-solid fa-vr-cardboard"></i>
                        {isEn ? "Open Web Simulator" : "Abrir Simulador Web"}
                      </Link>
                      <Link
                        to="/blog/manual-smartplant-3d-structural-modeling"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl border border-slate-600 transition-all"
                      >
                        <i className="fa-solid fa-building text-emerald-400"></i>
                        {isEn ? "Continue to Structural Manual" : "Continuar al Manual Estructural"}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Navegacion de la serie + Compartir */}
          <div className="mt-20 border-t border-slate-800/80 pt-4">
            <BlogSeriesNav
              series="SmartPlant 3D"
              prev={{
                href: "/blog/smartplant-3d-masterlab-simulador-interactivo",
                titleEs: "SP3D MasterLab: Hub de la Serie y Simulador Interactivo",
                titleEn: "SP3D MasterLab: Series Hub & Interactive Simulator",
              }}
              next={{
                href: "/blog/manual-smartplant-3d-structural-modeling",
                titleEs: "Manual Maestro de Modelado Estructural en SmartPlant 3D",
                titleEn: "SmartPlant 3D Structural Modeling Master Manual",
              }}
            />
            <div className="mt-10">
              <ShareArticle url={shareUrl} title={shareTitle} />
            </div>
            <div className="flex justify-center pt-8 pb-4">
              <BlogBackButton />
            </div>
          </div>
        </main>
      </article>
    </>
  );
}
