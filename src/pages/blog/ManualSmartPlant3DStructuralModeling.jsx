import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import BlogBackButton from "../../components/BlogBackButton";
import { BlogScrollSpyTOC } from "../../components/ui/BlogScrollSpyTOC";
import sp3dManualLabsData from "../../data/sp3d_manual_labs.json";

export default function ManualSmartPlant3DStructuralModeling() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopiedCommand, setIsCopiedCommand] = useState(false);

  // Estado del Explorador Interactivo de Laboratorios
  const [selectedLabId, setSelectedLabId] = useState("LAB-1");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
  const [completedSteps, setCompletedSteps] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const shareUrl = getShareUrl("/blog/manual-smartplant-3d-structural-modeling");
  const shareTitle = encodeURIComponent(
    isEn
      ? "Intergraph Smart 3D (SmartPlant 3D) Structural Modeling Master Manual: 201-Page & 18-Lab Interactive Guide"
      : "Manual Maestro de Modelado Estructural en Intergraph Smart 3D (SmartPlant 3D): Guía Interactiva Completa de 201 Páginas y 18 Labs"
  );

  // Laboratorio activo
  const currentLab = useMemo(() => {
    return sp3dManualLabsData.find((l) => l.id === selectedLabId) || sp3dManualLabsData[0];
  }, [selectedLabId]);

  // Al cambiar de lab, resetear el visor de imagenes al inicio
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedLabId]);

  // Toggle de paso completado
  const toggleStep = (labId, stepIdx) => {
    const key = `${labId}_${stepIdx}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtrado de labs por categoria o busqueda
  const filteredLabs = useMemo(() => {
    return sp3dManualLabsData.filter((lab) => {
      const matchesCategory =
        activeCategoryFilter === "all" || lab.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
      const matchesQuery =
        !searchQuery ||
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategoryFilter, searchQuery]);

  const tocItems = [
    { id: "explorador-laboratorios", title: isEn ? "⭐ Interactive 18-Lab Manual" : "⭐ Manual Interactivo (18 Labs Oficiales)", level: 2 },
    { id: "introduccion", title: isEn ? "1. Scope & System Architecture" : "1. Alcance y Arquitectura del Sistema", level: 2 },
    { id: "lab-01-entorno", title: isEn ? "2. LAB-1: Workspace & Permissions" : "2. LAB-1: Entorno, Roles y Permisos", level: 2 },
    { id: "lab-02-grillas", title: isEn ? "3. LAB-2 to LAB-8: Grids & Coordinates" : "3. LAB-2 a LAB-8: Grillas y Coordenadas", level: 2 },
    { id: "evaluacion-grillas", title: isEn ? "4. Grid Evaluation Benchmark" : "4. Evaluación Práctica de Grillas", level: 2 },
    { id: "structure-task", title: isEn ? "5. The Structure Task Workflow" : "5. Filosofía de la Tarea Estructural", level: 2 },
    { id: "lab-09-miembros", title: isEn ? "6. LAB-9: Linear Members & Cardinal Points" : "6. LAB-9: Miembros Lineales y Puntos Cardinales", level: 2 },
    { id: "lab-10-productividad", title: isEn ? "7. LAB-10 & 11: Productivity Commands" : "7. LAB-10 y 11: Comandos de Productividad", level: 2 },
    { id: "lab-12-propiedades", title: isEn ? "8. LAB-12: Dynamic Property Edits" : "8. LAB-12: Edición Dinámica de Propiedades", level: 2 },
    { id: "lab-13-modelo-u02", title: isEn ? "9. LAB-13: Full Structure U02/U03" : "9. LAB-13: Modelo Completo en 6 Fases", level: 2 },
    { id: "lab-14-curvos-ejes", title: isEn ? "10. LAB-14 to 16: Curved & Bracing" : "10. LAB-14 a 16: Curvos y Arriostramientos", level: 2 },
    { id: "lab-17-conexiones", title: isEn ? "11. LAB-17: Frame Connections & Workpoint" : "11. LAB-17: Conexiones de Marco y Workpoint", level: 2 },
    { id: "lab-18-losas", title: isEn ? "12. LAB-18: Slabs, Ambiguous Bounds & Roofs" : "12. LAB-18: Losas, Contornos y Techos", level: 2 },
    { id: "cheatsheet-atajos", title: isEn ? "13. Senior Modeler CheatSheet" : "13. CheatSheet y Atajos de Producción", level: 2 },
    { id: "simulador-interactivo", title: isEn ? "14. Interactive Web Simulator Link" : "14. Práctica en Simulador Web", level: 2 },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopiedCommand(true);
    setTimeout(() => setIsCopiedCommand(false), 2000);
  };

  const sqlHierarchySnippet = [
    "/* Consulta SQL para auditar miembros y puntos cardinales en ModelDB */",
    "SELECT ",
    "    m.Oid AS MemberID,",
    "    m.ItemName AS NombreMiembro,",
    "    s.SectionName AS Perfil,",
    "    m.CardinalPoint AS PuntoCardinal,",
    "    m.Length * 1000.0 AS Longitud_mm,",
    "    sys.SystemName AS SistemaPertinente",
    "FROM ",
    "    JMember m",
    "JOIN ",
    "    JSection s ON m.SectionOid = s.Oid",
    "JOIN ",
    "    JSystem sys ON m.SystemOid = sys.Oid",
    "WHERE ",
    "    m.CardinalPoint != 8 AND s.SectionType LIKE 'W%'",
    "ORDER BY ",
    "    sys.SystemName, m.ItemName;",
  ].join("\n");

  const cardinalMatrix = [
    { num: 7, name: "Top-Left (7)", role: "Ala superior izq. / Vigas de borde" },
    { num: 8, name: "Top-Center (8) ⭐", role: "Vigas de piso (TOS) Enrase nivel superior" },
    { num: 9, name: "Top-Right (9)", role: "Ala superior der. / Vigas perimetrales" },
    { num: 4, name: "Center-Left (4)", role: "Eje neutro izq. / Canales y costaneras" },
    { num: 5, name: "Centroid (5) 🔷", role: "Centro de gravedad geométrico / Columnas y Diagonales" },
    { num: 6, name: "Center-Right (6)", role: "Eje neutro der. / Largueros de fachada" },
    { num: 1, name: "Bottom-Left (1)", role: "Ala inferior izq. / Vigas de zócalo" },
    { num: 2, name: "Bottom-Center (2)", role: "Fondo de viga (BOS) / Enrase inferior" },
    { num: 3, name: "Bottom-Right (3)", role: "Ala inferior der. / Zócalos" },
  ];

  return (
    <>
      <SEOHead
        title={
          isEn
            ? "Intergraph Smart 3D (SmartPlant 3D) Structural Modeling Master Manual | 18 Labs & 201 Pages | Andrés Gallo P."
            : "Manual Maestro de Modelado Estructural en Intergraph Smart 3D (SmartPlant 3D) | 18 Labs y 201 Páginas | Andrés Gallo P."
        }
        description={
          isEn
            ? "Complete interactive master manual for Intergraph Smart 3D Structural Modeling based on the official 201-page guide: 18 practical labs, 9 cardinal points, PinPoint, multi-level building modeling, frame connections and concrete slabs."
            : "Manual interactivo completo de modelado estructural en Intergraph Smart 3D (SmartPlant 3D) basado en el documento oficial de 201 páginas: 18 laboratorios prácticos paso a paso, 9 puntos cardinales, PinPoint, edificio U02/U03, conexiones de marco y losas."
        }
        keywords={[
          "SmartPlant 3D",
          "Smart 3D",
          "SP3D",
          "S3D",
          "Intergraph",
          "Hexagon PPM",
          "Modelado Estructural",
          "Ingeniería de Plantas",
          "Puntos Cardinales CP 8",
          "Frame Connections",
          "PinPoint F9",
          "Andrés Gallo Parra",
        ]}
      />

      {/* Barra de progreso de lectura superior */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-900/50 z-50 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb de navegación */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8 border-b border-slate-800/80 pb-4">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              {isEn ? "Home" : "Inicio"}
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-emerald-400 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-mono font-medium truncate">
              {isEn ? "SmartPlant 3D Structural Master Manual (18 Labs)" : "Manual Maestro SmartPlant 3D (18 Labs)"}
            </span>
          </nav>

          <BlogBackButton />

          {/* Encabezado Principal */}
          <header className="mb-12 border-b border-slate-800/80 pb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-semibold tracking-wider uppercase">
                {isEn ? "Master Technical Training Manual" : "Manual de Entrenamiento Oficial"}
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-mono">
                Intergraph Smart 3D (S3D / SP3D)
              </span>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full text-xs font-mono">
                18 Labs • 201 Páginas • 191 Láminas
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              {isEn
                ? "Intergraph Smart 3D (SmartPlant 3D) Structural Modeling Master Manual"
                : "Manual Maestro de Modelado Estructural en Intergraph Smart 3D (SmartPlant 3D)"}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-4xl leading-relaxed font-light mb-8">
              {isEn
                ? "The definitive 201-page technical guide transformed into an interactive digital learning system: all 18 practical field labs, high-resolution original document plates, 9 cardinal points matrix, PinPoint precision workflows, 6-phase U02 building modeling, frame connections, and concrete slabs."
                : "La guía técnica oficial de 201 páginas condensada e implementada en un sistema digital interactivo de aprendizaje: los 18 laboratorios prácticos paso a paso, 191 láminas en alta resolución del documento original, matriz de 9 puntos cardinales, flujos de precisión PinPoint [F9], modelado multinivel del edificio U02/U03 en 6 fases, conexiones de marco y losas de hormigón."}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <i className="fa-solid fa-user-pen text-emerald-400"></i>
                  Andrés Gallo Parra (BIM Developer & Structural Designer)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-calendar text-slate-400"></i>
                  Octubre 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <i className="fa-solid fa-clock"></i>
                  {isEn ? "35 min comprehensive study" : "35 min estudio exhaustivo"}
                </span>
              </div>
            </div>
          </header>

          {/* Bento Grid: Metadatos y Alcance de las 201 Páginas */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mb-1">201</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Páginas Oficiales</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manual técnico de modelado estructural para plantas industriales en Intergraph Smart 3D.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-all">
              <div className="text-3xl font-extrabold text-blue-400 font-mono mb-1">18</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Laboratorios Prácticos</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Desde la configuración de sesión y grillas hasta nudos complejos y losas de cubierta.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 transition-all">
              <div className="text-3xl font-extrabold text-purple-400 font-mono mb-1">191</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Láminas WebP HD</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Capturas de pantalla originales del software renderizadas a 1200px con zoom modal.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all">
              <div className="text-3xl font-extrabold text-amber-400 font-mono mb-1">9</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Puntos Cardinales</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Regla de oro: CP 8 (Top-Center) para enrase TOS y CP 5 (Centroide) para columnas.
              </p>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECCIÓN ESTRELLA: EXPLORADOR INTERACTIVO DE LOS 18 LABORATORIOS */}
          {/* ========================================================================= */}
          <section id="explorador-laboratorios" className="mb-20 scroll-mt-20">
            <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-slate-800/80 pb-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold uppercase mb-3">
                    <i className="fa-solid fa-layer-group"></i> Visor Interactivo Oficial
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Explorador de los 18 Laboratorios de SmartPlant 3D
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
                    Navega por cada laboratorio del manual oficial, revisa los objetivos de ingeniería, sigue el paso a paso detallado y examina las láminas originales del documento con zoom de alta definición.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/herramientas/smartplant-3d"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
                  >
                    <i className="fa-solid fa-vr-cardboard"></i>
                    Abrir en Simulador 3D
                  </Link>
                </div>
              </div>

              {/* Filtros de Categoría y Búsqueda */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveCategoryFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCategoryFilter === "all"
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Todos (18)
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter("grillas")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCategoryFilter === "grillas"
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    📐 Grillas & CS (LAB 1-8)
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter("estructural")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCategoryFilter === "estructural"
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    🔩 Miembros Lineales (LAB 9-12)
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter("proyecto")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCategoryFilter === "proyecto"
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    🏗️ Edificio U02 & Nudos (LAB 13-17)
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter("hormigón")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCategoryFilter === "hormigón"
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    🧱 Losas & Cubiertas (LAB 18)
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar lab, comando, perfil..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Botones de Selección Rápida de Laboratorios (Grid Scrollable) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8 relative z-10 max-h-56 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800">
                {filteredLabs.map((lab) => {
                  const isSelected = lab.id === currentLab.id;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => setSelectedLabId(lab.id)}
                      className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 scale-[1.02]"
                          : "bg-slate-900/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-emerald-400">{lab.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          P.{lab.startPage}
                        </span>
                      </div>
                      <div className="text-xs font-medium line-clamp-1 text-slate-200">{lab.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">{lab.badge}</div>
                    </button>
                  );
                })}
              </div>

              {/* Panel de Detalle del Laboratorio Seleccionado */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Columna Izquierda: Información, Objetivos y Pasos (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Encabezado del Lab */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md font-mono text-sm font-bold">
                          {currentLab.id}
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          {currentLab.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                        Páginas oficiales: {currentLab.startPage} a {currentLab.endPage} ({currentLab.totalPages} págs)
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                      {currentLab.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                      {currentLab.summary}
                    </p>

                    {/* Objetivos Detallados */}
                    <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-4">
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-bullseye"></i> Objetivos Oficiales del Laboratorio
                      </h4>
                      <ul className="space-y-1.5">
                        {currentLab.detailedObjectives.map((obj, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 font-mono mt-0.5">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Procedimiento Paso a Paso con Checklist */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <i className="fa-solid fa-list-check text-emerald-400"></i>
                        Procedimiento Operativo Paso a Paso ({currentLab.steps.length} pasos)
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        Haz clic para marcar avance
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-2">
                      {currentLab.steps.map((st, sIdx) => {
                        const isDone = !!completedSteps[`${currentLab.id}_${sIdx}`];
                        return (
                          <div
                            key={sIdx}
                            onClick={() => toggleStep(currentLab.id, sIdx)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 select-none ${
                              isDone
                                ? "bg-emerald-950/20 border-emerald-500/40 text-slate-300"
                                : "bg-slate-900/60 border-slate-800/80 text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            <button
                              type="button"
                              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center font-mono text-xs flex-shrink-0 transition-colors ${
                                isDone
                                  ? "bg-emerald-500 text-slate-950 font-bold"
                                  : "border border-slate-600 bg-slate-950 text-slate-400 hover:border-emerald-400"
                              }`}
                            >
                              {isDone ? "✓" : st.stepNumber}
                            </button>
                            <div className="flex-1">
                              <div className={`text-xs font-semibold ${isDone ? "text-emerald-300 line-through" : "text-white"}`}>
                                {st.title}
                              </div>
                              {st.details !== st.title && (
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                  {st.details}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Visor de Láminas Originales WebP del Manual (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                          <i className="fa-solid fa-file-pdf text-red-400"></i> Lámina Oficial del Manual
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Página {currentLab.startPage + currentImageIndex} de 201 (Lámina {currentImageIndex + 1} de {currentLab.pageImages.length})
                        </span>
                      </div>

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 transition-colors border border-slate-700"
                        title="Ver en pantalla completa con zoom"
                      >
                        <i className="fa-solid fa-expand"></i> Zoom HD
                      </button>
                    </div>

                    {/* Contenedor de la Imagen WebP */}
                    <div
                      onClick={() => setIsModalOpen(true)}
                      className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800 group cursor-zoom-in flex items-center justify-center min-h-[400px] flex-1"
                    >
                      <img
                        src={currentLab.pageImages[currentImageIndex]}
                        alt={`Lámina Página ${currentLab.startPage + currentImageIndex} - ${currentLab.title}`}
                        className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-slate-900/90 text-emerald-400 text-xs font-mono rounded-lg border border-emerald-500/40 shadow-xl">
                          <i className="fa-solid fa-magnifying-glass-plus mr-1"></i> Clic para ampliar a 1200px
                        </span>
                      </div>
                    </div>

                    {/* Controles de Navegación de Páginas */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
                      <button
                        disabled={currentImageIndex === 0}
                        onClick={() => setCurrentImageIndex((prev) => Math.max(0, prev - 1))}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-chevron-left"></i> Anterior
                      </button>

                      {/* Miniaturas de Páginas del Laboratorio */}
                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[180px] py-1">
                        {currentLab.pageImages.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-6 h-8 rounded border flex-shrink-0 text-[10px] font-mono transition-all ${
                              currentImageIndex === idx
                                ? "border-emerald-400 bg-emerald-500/30 text-white font-bold scale-110"
                                : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={currentImageIndex === currentLab.pageImages.length - 1}
                        onClick={() => setCurrentImageIndex((prev) => Math.min(currentLab.pageImages.length - 1, prev + 1))}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        Siguiente <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modal Lightbox de Alta Definición para Páginas */}
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="relative max-w-5xl w-full max-h-[95vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-mono font-bold">
                      {currentLab.id}
                    </span>
                    <span className="text-sm font-semibold text-white truncate">
                      Página {currentLab.startPage + currentImageIndex} de 201 — {currentLab.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={currentLab.pageImages[currentImageIndex]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i> Pestaña Nueva
                    </a>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="overflow-auto p-4 flex-1 flex items-center justify-center bg-slate-950/60">
                  <img
                    src={currentLab.pageImages[currentImageIndex]}
                    alt={`Página ${currentLab.startPage + currentImageIndex}`}
                    className="max-w-full h-auto max-h-[82vh] rounded shadow-lg object-contain"
                  />
                </div>

                <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Resolución HD: 1200px optimizado WebP</span>
                  <div className="flex gap-2">
                    <button
                      disabled={currentImageIndex === 0}
                      onClick={() => setCurrentImageIndex((prev) => Math.max(0, prev - 1))}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200"
                    >
                      ← Anterior
                    </button>
                    <button
                      disabled={currentImageIndex === currentLab.pageImages.length - 1}
                      onClick={() => setCurrentImageIndex((prev) => Math.min(currentLab.pageImages.length - 1, prev + 1))}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CUERPO DEL COMPENDIO TÉCNICO DE INGENIERÍA */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar con Tabla de Contenidos Dinámica */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md">
                <BlogScrollSpyTOC items={tocItems} activeColor="text-emerald-400" />
                
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Herramienta Asociada
                  </div>
                  <Link
                    to="/herramientas/smartplant-3d"
                    className="group flex flex-col gap-2 p-3 bg-slate-950/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
                      <span>SP3D MasterLab 3D</span>
                      <i className="fa-solid fa-arrow-right text-emerald-400 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Simulador en tiempo real con 4 vistas y entrenamiento en PinPoint [F9].
                    </p>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Contenido Editorial Técnico */}
            <div className="lg:col-span-9 space-y-16">
              {/* Sección 1: Alcance y Arquitectura */}
              <section id="introduccion" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    1
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Alcance del Entrenamiento y Arquitectura del Sistema
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    A diferencia de las plataformas CAD convencionales basadas en archivos gráficos independientes (como AutoCAD o MicroStation), <strong>Intergraph Smart 3D (SmartPlant 3D / S3D)</strong> opera sobre una arquitectura de <strong>Base de Datos Relacional Distribuida</strong> (Microsoft SQL Server u Oracle). Cada elemento estructural (columna, viga, cartela, losa o perno) existe como un registro topológico con coordenadas globales y relaciones asociativas continuas.
                  </p>
                  <p>
                    El documento original consta de <strong>201 páginas</strong> elaboradas para capacitar a ingenieros y diseñadores civiles/estructurales en proyectos de gran envergadura (minería de cobre/litio, refinerías, petroquímica y generación eléctrica).
                  </p>
                </div>

                {/* Arquitectura de 4 Bases de Datos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <h3 className="text-sm font-mono font-bold text-emerald-400 mb-1">
                      1. Site Database & Schema
                    </h3>
                    <p className="text-xs text-slate-400">
                      Gobierna la seguridad corporativa, roles globales, servidores de licencias y el catálogo de proyectos activos.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <h3 className="text-sm font-mono font-bold text-blue-400 mb-1">
                      2. Catalog Database & Schema
                    </h3>
                    <p className="text-xs text-slate-400">
                      Almacena la librería de perfiles (AISC 15th, ICHA, DIN), especificaciones de materiales (A36, A992, A572 Gr. 50) y reglas de conexión.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <h3 className="text-sm font-mono font-bold text-amber-400 mb-1">
                      3. Model Database & Schema
                    </h3>
                    <p className="text-xs text-slate-400">
                      Contiene la geometría 3D viva, los nudos analíticos, los sistemas jerárquicos (WBS/PBS) y la topología coordinada.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <h3 className="text-sm font-mono font-bold text-purple-400 mb-1">
                      4. Reports Database
                    </h3>
                    <p className="text-xs text-slate-400">
                      Gestiona las vistas de extracción SQL para cubicaciones de acero (MTO/BOM), pesos, centros de gravedad y listas de corte.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección 2: LAB-1 */}
              <section id="lab-01-entorno" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    2
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    LAB-1: Entorno, Roles y Permisos (Active Permission Group)
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    El primer laboratorio enseña la regla de oro de ingreso al modelo: <strong>ningún diseñador modela en el vacío</strong>. Antes de trazar una línea, es obligatorio seleccionar el <code>Active Permission Group</code> asignado a la disciplina estructural (por ejemplo, <code>Misc/Structural</code>) y definir el <code>Active System</code> en la jerarquía del proyecto:
                  </p>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
                    Plant &gt; Area (Unit U02) &gt; Civil &amp; Structural &gt; Structural System &gt; Member Systems
                  </div>
                  <p>
                    <strong>Filtro de Consulta (Define Workspace):</strong> Para evitar colapsar la memoria RAM de la estación de trabajo, el operador define un volumen de consulta (Workspace) que carga exclusivamente el área de interés mediante filtros espaciales o por sistema.
                  </p>
                </div>
              </section>

              {/* Sección 3: LAB-2 a LAB-8 Grillas */}
              <section id="lab-02-grillas" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    3
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    LAB-2 a LAB-8: Grillas Paramétricas y Sistemas de Coordenadas
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    La creación y manipulación de grillas constituye la base de referencia geométrica. La suite de laboratorios del 2 al 8 abarca:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-300">
                    <li>
                      <strong>LAB-2 (Grid Wizard):</strong> Asistente para generar cuadrículas ortogonales definiendo coordenadas Este, Norte y Elevación de origen, espaciamientos entre ejes 1-4 y A-D, y niveles EL (+) 0'-0", EL (+) 18'-0" y EL (+) 31'-0".
                    </li>
                    <li>
                      <strong>LAB-3 &amp; 4 (Edición y Coordenadas Normales):</strong> Desplazamiento paramétrico de planos, renombrado de ejes y creación de sistemas de coordenadas locales para áreas de proceso secundarias.
                    </li>
                    <li>
                      <strong>LAB-5 &amp; 6 (Rotación y Pendiente):</strong> Métodos de inclinación de planos mediante ángulo directo o pendiente (Slope Rise/Run, ej. 1:12) para cubiertas industriales a dos aguas.
                    </li>
                    <li>
                      <strong>LAB-7 &amp; 8 (Extensiones y XML):</strong> Ajuste tridimensional de límites de ejes para que corten todos los pisos y exportación a esquema XML multidisciplinar.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Sección 6: LAB-9 Miembros Lineales y Puntos Cardinales */}
              <section id="lab-09-miembros" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    6
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    LAB-9: Miembros Lineales y Matriz de los 9 Puntos Cardinales
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    El comando <strong>Place Member</strong> de Smart 3D despliega la barra <strong>SmartStep Ribbon</strong>:
                  </p>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
                    [System] → [Type: Column/Beam/Brace] → [Section Name: W18x50] → [Cardinal Point] → [Angle] → [Priority]
                  </div>
                  <p>
                    El <strong>Punto Cardinal (Cardinal Point - CP)</strong> define la ubicación del eje de inserción tridimensional respecto a la sección transversal del perfil. Dominar esta matriz es la diferencia entre un modelo coherente y un desastre de interferencias:
                  </p>
                </div>

                {/* Cuadrícula Visual 3x3 de Puntos Cardinales */}
                <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                      Matriz de 9 Puntos Cardinales en Perfil I / W
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      Eje Neutro &amp; Enrases
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {cardinalMatrix.map((cp) => (
                      <div
                        key={cp.num}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                          cp.num === 8
                            ? "bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                            : cp.num === 5
                            ? "bg-blue-500/15 border-blue-500/50 shadow-lg shadow-blue-500/10"
                            : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-extrabold text-white">
                            CP {cp.num}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              cp.num === 8
                                ? "bg-emerald-500 text-slate-950 font-bold"
                                : cp.num === 5
                                ? "bg-blue-500 text-white font-bold"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {cp.num === 8 ? "TOS OBLIGATORIO" : cp.num === 5 ? "CENTROIDE" : "PERIFÉRICO"}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-200 mb-1">{cp.name}</div>
                        <p className="text-[11px] text-slate-400 leading-snug">{cp.role}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 leading-relaxed">
                    <strong>💡 Regla de Oro de Ingeniería:</strong> Al colocar vigas con <strong>CP 8 (Top-Center)</strong>, perfiles de distinta altura (W18x50, W14x30, W12x26) comparten el mismo nivel superior (Top of Steel), permitiendo colocar planchas colaborantes o grating sin generar desniveles.
                  </div>
                </div>
              </section>

              {/* Sección 9: LAB-13 Edificio U02/U03 en 6 Fases */}
              <section id="lab-13-modelo-u02" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    9
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    LAB-13: Modelo Completo en 6 Fases (Edificio U02/U03)
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    El proyecto de entrenamiento culmina con la construcción integral del edificio de proceso U02/U03 a través de 6 fases constructivas perfectamente ordenadas:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="font-mono text-xs text-emerald-400 font-bold mb-1">FASE I</div>
                    <div className="text-sm font-bold text-white mb-2">Columnas Base</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      W14x90 en intersecciones de cuadrícula desde placa base EL (-) 1'-0" hasta EL (+) 31'-0".
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="font-mono text-xs text-emerald-400 font-bold mb-1">FASE II</div>
                    <div className="text-sm font-bold text-white mb-2">Piso 1 (EL +18'-0")</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Vigas principales W18x50 y secundarias W14x30 con CP 8 para recibir piso de proceso.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="font-mono text-xs text-emerald-400 font-bold mb-1">FASE III</div>
                    <div className="text-sm font-bold text-white mb-2">Piso 2 (EL +31'-0")</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Plataforma superior y vigas inclinadas de techumbre con recorte en planos con pendiente.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="font-mono text-xs text-emerald-400 font-bold mb-1">FASE IV</div>
                    <div className="text-sm font-bold text-white mb-2">Tirantes Verticales</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Arriostramientos en V invertida (Chevron) y en X con ángulos dobles 2L 4x4x3/8 y CP 5.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="font-mono text-xs text-emerald-400 font-bold mb-1">FASE V</div>
                    <div className="text-sm font-bold text-white mb-2">Tirantes Horizontales</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Perfiles WT5x15 en planos de piso para constituir diafragmas rígidos indeformables.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="font-mono text-xs text-emerald-400 font-bold mb-1">FASE VI</div>
                    <div className="text-sm font-bold text-white mb-2">Bahía Far East</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ampliación modular en ejes E y F con conexiones de continuidad entre módulos.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección 11: LAB-17 Conexiones y Workpoint Offset */}
              <section id="lab-17-conexiones" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    11
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    LAB-17: Frame Connections y la Regla de Workpoint Offset
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    Las <strong>Frame Connections</strong> gobiernan la física del nudo entre el elemento soportante y el soportado. El manual enseña un criterio crítico de diseño sísmico e industrial:
                  </p>
                  <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-5 text-amber-200">
                    <h4 className="font-mono font-bold text-amber-300 text-sm mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation"></i> Criterio de Ingeniería: Workpoint Offset (6 pulgadas / 150 mm)
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Cuando un arriostramiento diagonal concurre a la intersección columna-viga, fijar el punto de trabajo en el eje puro genera colisión directa entre la plancha cartela (gusset plate) y los pernos de momento de la viga principal.
                      <br /><br />
                      <strong>Solución en S3D:</strong> En las propiedades de la conexión de marco, se aplica un <code>Workpoint Offset</code> de <strong>6 pulgadas (150 mm)</strong> descendiendo por el eje de la columna. El nudo se separa limpiamente y permite fabricar la cartela sin interferencias de montaje.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección 12: LAB-18 Losas de Hormigón */}
              <section id="lab-18-losas" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    12
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    LAB-18: Losas de Hormigón (Slabs) y Resolución de Contornos Ambiguos
                  </h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-4 font-light leading-relaxed">
                  <p>
                    El comando <strong>Place Slab</strong> opera en dos etapas: primero se define la elevación del plano superior (coincidente con el plano de vigas o con un desfase como <code>+4"</code>), y luego se seleccionan los miembros de contorno.
                  </p>
                  <p>
                    <strong>Resolución de Contornos Ambiguos:</strong> Cuando una viga perimetral se extiende más allá del vano, SmartPlant 3D resalta el segmento conflictivo en <strong>color rojo</strong>. El usuario debe hacer clic sucesivamente sobre los tramos correctos hasta que la polilínea completa se ilumine en <strong>verde/azul</strong>, confirmando el lazo cerrado que permite generar el sólido de hormigón.
                  </p>
                </div>
              </section>

              {/* Sección 13: CheatSheet y Atajos */}
              <section id="cheatsheet-atajos" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                    13
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    CheatSheet de Productividad y Atajos PinPoint [F9]
                  </h2>
                </div>

                <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-xl mb-6">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/80 text-emerald-400">
                        <th className="p-3">Tecla / Atajo</th>
                        <th className="p-3">Comando</th>
                        <th className="p-3">Función en el Modelado 3D</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="p-3 font-bold text-white">[F9]</td>
                        <td className="p-3 text-emerald-400">Toggle PinPoint</td>
                        <td className="p-3">Activa/desactiva la brújula flotante de coordenadas relativas</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">[F12]</td>
                        <td className="p-3 text-emerald-400">Set Target to Point</td>
                        <td className="p-3">Mueve el origen (0,0,0) relativo al punto bajo el cursor</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">[E] / [N] / [EL]</td>
                        <td className="p-3 text-emerald-400">Coordinate Lock</td>
                        <td className="p-3">Bloquea el eje Este (X), Norte (Y) o Elevación (Z)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">[Alt + Enter]</td>
                        <td className="p-3 text-emerald-400">Properties</td>
                        <td className="p-3">Abre la ventana de propiedades y catálogo de secciones</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">[Ctrl + M]</td>
                        <td className="p-3 text-emerald-400">Measure Distance</td>
                        <td className="p-3">Mide la distancia mínima tridimensional entre dos elementos</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Consulta SQL Snippet */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Auditoría SQL en ModelDB: Detectar Vigas W sin Punto Cardinal CP 8
                    </span>
                    <button
                      onClick={() => copyToClipboard(sqlHierarchySnippet)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded text-slate-200 transition-colors"
                    >
                      {isCopiedCommand ? "¡Copiado!" : "Copiar SQL"}
                    </button>
                  </div>
                  <CodeBlock code={sqlHierarchySnippet} language="sql" />
                </div>
              </section>

              {/* Sección 14: Enlace al Simulador Interactivo */}
              <section id="simulador-interactivo" className="scroll-mt-20">
                <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border-2 border-emerald-500/40 rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold uppercase">
                      Práctica en Vivo
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Practica los 18 Laboratorios en el Simulador 3D Web
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      Experimenta con la brújula PinPoint [F9], bloqueos ortogonales en E/N/EL, visualizador de 4 vistas (Planta, Elevación Norte, Elevación Este e Isométrica) y consulta de perfiles AISC/ICHA en tiempo real.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/herramientas/smartplant-3d"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-xl shadow-emerald-500/20 hover:scale-105"
                      >
                        <i className="fa-solid fa-cube"></i>
                        Ir al Simulador SmartPlant 3D MasterLab
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-20 border-t border-slate-800/80 pt-4">
            <ShareArticle url={shareUrl} title={shareTitle} />
            <div className="flex justify-center pt-8 pb-4">
              <BlogBackButton />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
